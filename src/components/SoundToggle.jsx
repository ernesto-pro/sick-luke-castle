import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { useRitual } from '../ritual'

export default function SoundToggle() {
  const { t } = useI18n()
  const { grant } = useRitual()
  const [on, setOn] = useState(false)
  const audio = useRef(null)

  useEffect(() => {
    return () => {
      const node = audio.current
      if (node) {
        try {
          node.gain.gain.cancelScheduledValues(node.ctx.currentTime)
          node.ctx.close()
        } catch {
          /* noop */
        }
        audio.current = null
      }
    }
  }, [])

  const build = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    const ctx = new AudioCtx()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 340
    filter.Q.value = 4

    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.42

    const oscA = ctx.createOscillator()
    oscA.type = 'sawtooth'
    oscA.frequency.value = 55
    oscA.detune.value = -7

    const oscB = ctx.createOscillator()
    oscB.type = 'sawtooth'
    oscB.frequency.value = 82.5
    oscB.detune.value = 6

    const oscC = ctx.createOscillator()
    oscC.type = 'triangle'
    oscC.frequency.value = 27.5

    const subGain = ctx.createGain()
    subGain.gain.value = 0.3
    oscC.connect(subGain).connect(master)

    // slow filter movement
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.045
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 160
    lfo.connect(lfoGain).connect(filter.frequency)

    // breathing amplitude
    const breath = ctx.createOscillator()
    breath.frequency.value = 0.085
    const breathGain = ctx.createGain()
    breathGain.gain.value = 0.05
    const breathTarget = ctx.createGain()
    breathTarget.gain.value = 0.34
    breath.connect(breathGain).connect(breathTarget.gain)
    breathTarget.connect(droneGain.gain)

    // wind / noise
    const length = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let brown = 0
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1
      brown = (brown + 0.02 * white) / 1.02
      data[i] = brown * 3.2
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 620
    noiseFilter.Q.value = 0.8
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.12
    noise.connect(noiseFilter).connect(noiseGain).connect(master)

    oscA.connect(filter)
    oscB.connect(filter)
    filter.connect(droneGain).connect(master)

    oscA.start()
    oscB.start()
    oscC.start()
    lfo.start()
    breath.start()
    noise.start()

    return { ctx, master, gain: droneGain, nodes: [oscA, oscB, oscC, lfo, breath, noise] }
  }

  const toggle = () => {
    if (!on) {
      if (!audio.current) audio.current = build()
      const node = audio.current
      if (!node) return
      // paint the state first: the UI never waits for the audio context
      const now = node.ctx.currentTime
      node.master.gain.cancelScheduledValues(now)
      node.master.gain.setValueAtTime(0.0001, now)
      node.master.gain.linearRampToValueAtTime(0.085, now + 2.2)
      node.ctx.resume().catch(() => {})
      setOn(true)
      grant('eco')
    } else {
      const node = audio.current
      if (node) {
        const now = node.ctx.currentTime
        node.master.gain.cancelScheduledValues(now)
        node.master.gain.setValueAtTime(node.master.gain.value, now)
        node.master.gain.linearRampToValueAtTime(0.0001, now + 0.8)
      }
      setOn(false)
    }
  }

  const toggleRef = useRef(toggle)
  toggleRef.current = toggle

  useEffect(() => {
    const onToggle = () => toggleRef.current()
    window.addEventListener('sl:toggle-sound', onToggle)
    return () => window.removeEventListener('sl:toggle-sound', onToggle)
  }, [])

  return (
    <button
      type="button"
      className={`sound-toggle ${on ? 'is-on' : ''}`}
      onClick={toggle}
      aria-pressed={on}
      data-cursor="link"
      data-cursor-label={on ? t.labels.mute : t.labels.sound}
    >
      <span className="sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="sound-text">
        <em>{t.sound.label}</em>
        <strong>{on ? 'On' : 'Off'}</strong>
      </span>
      <span className="sr-only">{on ? t.sound.on : t.sound.off}</span>
    </button>
  )
}
