import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  plugins: isProduction
    ? [
        purgeCSSPlugin({
          content: ['./index.html', './en/index.html', './src/**/*.{js,jsx}'],
          safelist: {
            standard: [
              /^is-/,
              /^has-/,
              /^tour-type--/,
              /^castle-bat--/,
              /^gallery-item-wrap--/,
              /^bat-plane--/,
              /^bat-swarm--/,
            ],
          },
        }),
      ]
    : [],
}
