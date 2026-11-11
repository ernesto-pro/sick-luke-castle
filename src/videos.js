import VIDEO_DATA from './videos.json'

/* The full channel archive and the diary are only needed by the videos
   chapter and the command palette. Kept out of `data.js` so the JSON never
   reaches the first-paint bundle. */
export const VIDEOS = VIDEO_DATA

export const VIDEO_YEARS = [...new Set(VIDEO_DATA.map((video) => video.year))].sort((a, b) =>
  b.localeCompare(a),
)

/* the diary: every Day In The Life episode, newest first */
export const VLOGS = VIDEO_DATA.filter((video) => video.kind === 'day')

export const VLOG_YEARS = [...new Set(VLOGS.map((video) => video.year))].sort((a, b) =>
  b.localeCompare(a),
)
