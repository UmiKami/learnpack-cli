import {expect, test} from '@oclif/test'
import createServer from '../../../src/managers/server'
import configManager from '../../../src/managers/config/index'
import * as chai from 'chai'
import {
  mockFolders,
  restoreMockFolders,
  buildExpectedConfig,
} from '../../utils'
import {CONFIG_SAMPLE, EXERCISE_SLUG} from '../../utils/fixtures'
import {IConfigObj, TGrading} from '../../../src/models/config'
/* eslint-disable @typescript-eslint/no-var-requires */
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

describe('server', () => {
  let server: any = null
  let configObject: IConfigObj
  before(async () => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
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
      grading: CONFIG_SAMPLE.grading as TGrading,
      disableGrading: CONFIG_SAMPLE.disableGrading,
      version: CONFIG_SAMPLE.editor.version,
    })
    configObject = thisConfigManager?.get()
    server = await createServer(configObject, thisConfigManager)
  })

  it('GET /config should return the project configuration', done => {
    (chai as any)
    .request('http://localhost:3004')
    .get('/config')
    .end((_: any, res: any) => {
      const config = res.body
      delete config.session

      const expectedConfig = buildExpectedConfig(CONFIG_SAMPLE)

      expect(config).to.deep.equal(expectedConfig)
      done()
    })
  })

  it('GET /exercise should return the exercises', done => {
    (chai as any)
    .request('http://localhost:3004')
    .get('/exercise')
    .end((_: any, res: any) => {
      const exercises = res.body

      expect(exercises).to.deep.equal(configObject.exercises)
      done()
    })
  })

  /* it("GET /exercise/:slug/readme should return the content of README.md file", (done) => {
    (chai as any)
      .request("http://localhost:3004")
      .get(`/exercise/${EXERCISE_SLUG}/readme`)
      .end((_: any, res: any) => {
        const { body } = res.body;

        expect(body).to.equal("This is the content of the README.md file");
        done();
      });
  });

  it("GET /exercise/:slug should return the content of the exercise", (done) => {
    (chai as any)
      .request("http://localhost:3004")
      .get(`/exercise/${EXERCISE_SLUG}`)
      .end((_: any, res: any) => {
        const { body } = res.body;

        expect(body).to.equal({});
        done();
      });
  }); */

  after(() => {
    restoreMockFolders()
    server.close()
  })
})
