import {expect, test} from '@oclif/test'
import {mockFolders, restoreMockFolders} from '../utils'
import {CONFIG_SAMPLE} from '../utils/fixtures'
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
  .stdout()
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
})
