import {expect, test} from '@oclif/test'
import {mockFolders, restoreMockFolders, isDirEmpty} from '../utils'
import {CONFIG_SAMPLE, EDITOR_VERSION} from '../utils/fixtures'
import * as fs from 'fs'

describe('start', () => {
  test
  .stdout()
  .command(['start'])
  .it('should throws an error if no learn.json file present', ctx => {
    expect(ctx.stdout).to.contain(
      '⨉ learn.json file not found on current folder, is this a learnpack package?',
    )
  })

  test
  .do(() => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
      exercises: {
        '01.12-hello-world': {},
      },
    })
  })
  .command(['start'])
  .it(
    "Giving learn.json file, it should create the .learn folder if doesn't exits",
    ctx => {
      expect(fs.existsSync('.learn')).to.be.true
      restoreMockFolders()
    },
  )

  test
  .nock(
    `https://github.com/learnpack/coding-ide/blob/${EDITOR_VERSION}`,
    api => (api as any).get('/dist').reply(200),
  )
  .nock(
    `https://github.com/learnpack/coding-ide/blob/${EDITOR_VERSION}/dist`,
    api =>
      (api as any)
      .get('/app.tar.gz?raw=true')
      .replyWithFile(200, `${__dirname}/../utils/dummy.tar.gz`, {
        'content-type': 'application/octet-stream',
      }),
  )
  .do(() => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
      exercises: {
        '01.12-hello-world': {},
      },
    })
  })
  .command(['start'])
  .it(
    'Giving learn.json file, it should download the editor UI and save it as .learn/app.tar.gz',
    ctx => {
      expect(fs.existsSync('.learn/app.tar.gz')).to.be.true
      restoreMockFolders()
    },
  )

  test
  .nock(
    `https://github.com/learnpack/coding-ide/blob/${EDITOR_VERSION}`,
    api => (api as any).get('/dist').reply(200),
  )
  .nock(
    `https://github.com/learnpack/coding-ide/blob/${EDITOR_VERSION}/dist`,
    api =>
      (api as any)
      .get('/app.tar.gz?raw=true')
      .replyWithFile(200, `${__dirname}/../utils/dummy.tar.gz`, {
        'content-type': 'application/octet-stream',
      }),
  )
  .do(() => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
      exercises: {
        '01.12-hello-world': {},
      },
    })
  })
  .command(['start'])
  .it(
    'Giving learn.json file, it should decompress the app.tar.gz file into .learn/_app folder',
    ctx => {
      expect(isDirEmpty('.learn/_app')).to.be.false
      restoreMockFolders()
    },
  )
})
