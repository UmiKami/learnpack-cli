export const EDITOR_VERSION = '1.0.72'

export const EXERCISE_SLUG = '01.12-hello-world'

export const CONFIG_SAMPLE = {
  port: 3000,
  address: 'http://localhost',
  editor: {
    mode: 'standalone',
    version: EDITOR_VERSION,
  },
  dirPath: './.learn',
  configPath: './learn.json',
  outputPath: './.learn/dist',
  publicPath: '/preview',
  grading: 'incremental',
  exercisesPath: './exercises',
  exercises: [
    {
      done: false,
      position: 0,
      slug: EXERCISE_SLUG,
      path: `exercises/${EXERCISE_SLUG}`,
      entry: null,
      title: EXERCISE_SLUG,
      graded: false,
      files: [
        {
          path: `exercises/${EXERCISE_SLUG}/README.md`,
          name: 'README.md',
          hidden: true,
        },
      ],
      language: null,
      translations: {
        us: 'README.md',
      },
    },
  ],
  webpackTemplate: null,
  disableGrading: false,
  disabledActions: [],
  actions: ['build', 'test', 'reset'],
  entries: {
    html: 'index.html',
    vanillajs: 'index.js',
    react: 'app.jsx',
    node: 'app.js',
    python3: 'app.py',
    java: 'app.java',
  },
}
