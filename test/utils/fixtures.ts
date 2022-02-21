export const EDITOR_VERSION = '1.0.72'

export const EXERCISE_SLUG = '01.12-hello-world'

export const CONFIG_SAMPLE = {
  config: {
    port: 3000,
    address: 'http://localhost',
    editor: {
      mode: 'preview',
      agent: 'gitpod',
      version: '1.0.72',
    },
    dirPath: './.learn',
    configPath: 'learn.json',
    outputPath: '.learn/dist',
    publicPath: '/preview',
    publicUrl: 'http://localhost',
    language: 'auto',
    grading: 'isolated',
    exercisesPath: './exercises',
    webpackTemplate: null,
    disableGrading: true,
    actions: ['build', 'test', 'reset'],
    entries: {
      html: 'index.html',
      vanillajs: 'index.js',
      react: 'app.jsx',
      node: 'app.js',
      python3: 'app.py',
      java: 'app.java',
    },
    translations: [],
  },
  currentExercise: '01-welcome',
  language: 'html',
  slug: 'html-tutorial-exercises-course',
  skills: ['html-forms'],
  title: 'Learn the basics of HTML Interactively',
  preview:
    'https://github.com/4GeeksAcademy/html-tutorial-exercises-course/blob/master/preview.png?raw=true',
  repository: 'https://github.com/4GeeksAcademy/html-tutorial-exercises-course',
  description:
    'Learn the most popular HTML Tags and how to used them with real life interactive examples, automatic grading and video solutions',
  intro: 'https://www.youtube.com/watch?v=Vd2dby9ind4',
  duration: 8,
  difficulty: 'easy',
  'video-solutions': true,
  graded: false,
  session: 7_558_564_652_107_081_000,
  exercises: [
    {
      position: 0,
      path: 'exercises/01-welcome',
      slug: '01-welcome',
      translations: {
        es: 'README.es.md',
        us: 'README.md',
      },
      language: null,
      entry: null,
      title: '01-welcome',
      graded: false,
      files: [
        {
          path: 'exercises/01-welcome/README.es.md',
          name: 'README.es.md',
          hidden: true,
        },
        {
          path: 'exercises/01-welcome/README.md',
          name: 'README.md',
          hidden: true,
        },
      ],
      done: false,
    },
  ],
}

export const LEARN_JSON = {
  slug: 'the-dom-exercises',
  grading: 'isolated',
  repository:
    'https://github.com/4GeeksAcademy/javascript-dom-tutorial-exercises',
  title: 'Learn how to manipulate The DOM with JS',
  preview:
    'https://github.com/4GeeksAcademy/javascript-dom-tutorial-exercises/blob/master/preview.png?raw=true',
  description:
    'Step by step, go over all the most important DOM concepts and methods: Use javascript to manipulate styles, html elements.',
  duration: 8,
  difficulty: 'easy',
  config: {
    disableGrading: true,
    editor: {
      version: '1.0.72',
    },
  },
}
