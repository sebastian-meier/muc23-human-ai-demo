const sveltePreprocess = require('svelte-preprocess');

const production = !process.env.ROLLUP_WATCH;

// jest for svelte requires a svelte.config
// this is a copy of the rollup-svelte-config

module.exports = {
  preprocess: sveltePreprocess({
    scss: {
      includePaths: ['src'],
      implementation: require('sass'),
      renderSync: true
    },
    postcss: {
      plugins: [
        require('postcss-normalize'),
        require('autoprefixer'),
        require('cssnano')({
          preset: 'default',
        })
      ]
    }
  }),
  compilerOptions: {
    // enable run-time checks when not in production
    dev: !production
  }
}