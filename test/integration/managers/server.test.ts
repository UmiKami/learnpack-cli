import {expect, test} from '@oclif/test'
import createServer from '../../../src/managers/server'
import configManager from '../../../src/managers/config/index'
import * as chai from 'chai'
import {
  mockFolders,
  restoreMockFolders,
  buildExpectedConfig,
  exerciseToPlainJson,
} from '../../utils'
import {CONFIG_SAMPLE, EXERCISE_SLUG, LEARN_JSON} from '../../utils/fixtures'
import {IConfigObj, TGrading} from '../../../src/models/config'
import {IExercise} from '../../../src/models/exercise-obj'
/* eslint-disable @typescript-eslint/no-var-requires */
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

describe('server', () => {
  let server: any = null
  let configObject: IConfigObj
  before(async () => {
    mockFolders({
      'learn.json': JSON.stringify(LEARN_JSON),
      '.learn': {
        '.session': {},
      },
      exercises: {
        [EXERCISE_SLUG]: {
          'README.md': 'This is the content of the README.md file',
        },
      },
    })

    const thisConfigManager = await configManager({
      grading: LEARN_JSON.grading as TGrading,
      disableGrading: LEARN_JSON.config.disableGrading,
      version: LEARN_JSON.config.editor.version,
    })

    // build exerises
    thisConfigManager?.buildIndex()

    configObject = thisConfigManager?.get()
    server = await createServer(configObject, thisConfigManager)
  })

  it.skip('GET /config should return the project configuration', done => {
    (chai as any)
    .request('http://localhost:3004')
    .get('/config')
    .end((_: any, res: any) => {
      const config = res.body
      delete config.session

      console.log('Config obtained', config)

      const expectedConfig = CONFIG_SAMPLE

      // console.log(expectedConfig)

      expect(config).to.deep.equal(CONFIG_SAMPLE)
      done()
    })
  })

  it('GET /exercise should return the exercises', done => {
    (chai as any)
    .request('http://localhost:3004')
    .get('/exercise')
    .end((_: any, res: any) => {
      const exercises = res.body

      expect(exercises).to.deep.equal(
        (configObject.exercises || []).map(exerciseToPlainJson),
      )

      done()
    })
  })

  it('GET /exercise/:slug/readme should return the content of README.md file', done => {
    (chai as any)
    .request('http://localhost:3004')
    .get(`/exercise/${EXERCISE_SLUG}/readme`)
    .end((_: any, res: any) => {
      const {body} = res.body

      expect(body).to.equal('This is the content of the README.md file')
      done()
    })
  })

  it('GET /exercise/:slug should return the content of the exercise', done => {
    (chai as any)
    .request('http://localhost:3004')
    .get(`/exercise/${EXERCISE_SLUG}`)
    .end((_: any, res: any) => {
      const exercise = res.body

      const exerciseFound = configObject?.exercises?.find(
        exercise => exercise.slug === EXERCISE_SLUG,
      )

      const expectedExercise = exerciseToPlainJson(
          exerciseFound as IExercise,
      )

      expect(exercise).to.deep.equal(expectedExercise)
      done()
    })
  })

  after(() => {
    // restoreMockFolders();
    server.close()
  })
})
