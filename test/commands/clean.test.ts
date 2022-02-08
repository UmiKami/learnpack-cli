import {expect, test} from '@oclif/test'
import {mockFolders, restoreMockFolders} from '../utils'
import {CONFIG_SAMPLE} from '../utils/fixtures'
import * as fs from 'fs'

describe('clean', () => {
  test
  .stdout()
  .command(['clean'])
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
    })
  })
  .command(['clean'])
  .it(
    "shouldn't throws an error if learn.json file present and show success message",
    ctx => {
      expect(ctx.stdout).to.contain(
        '✓ Package cleaned successfully, ready to publish\n',
      )
      restoreMockFolders()
    },
  )

  test
  .stdout()
  .do(() => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
      '.learn': {
        dist: {
          /** empty directory */
        },
      },
    })
  })
  .command(['clean'])
  .it('should remove .learn/dist folder', () => {
    expect(fs.existsSync('.learn/dist')).to.be.false
    restoreMockFolders()
  })

  test
  .stdout()
  .do(() => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
      '.learn': {
        _app: {
          /** empty directory */
        },
      },
    })
  })
  .command(['clean'])
  .it('should remove .learn/_app folder', () => {
    expect(fs.existsSync('.learn/_app')).to.be.false
    restoreMockFolders()
  })

  test
  .stdout()
  .do(() => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
      '.learn': {
        reports: {
          /** empty directory */
        },
      },
    })
  })
  .command(['clean'])
  .it('should remove .learn/reports folder', () => {
    expect(fs.existsSync('.learn/reports')).to.be.false
    restoreMockFolders()
  })

  test
  .stdout()
  .do(() => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
      '.learn': {
        resets: {
          /** empty directory */
        },
      },
    })
  })
  .command(['clean'])
  .it('should remove .learn/resets folder', () => {
    expect(fs.existsSync('.learn/resets')).to.be.false
    restoreMockFolders()
  })

  test
  .stdout()
  .do(() => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
      '.learn': {
        'app.tar.gz': 'whatever',
      },
    })
  })
  .command(['clean'])
  .it('should remove .learn/app.tar.gz file', () => {
    expect(fs.existsSync('.learn/app.tar.gz')).to.be.false
    restoreMockFolders()
  })

  test
  .stdout()
  .do(() => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
      '.learn': {
        'config.json': 'whatever',
      },
    })
  })
  .command(['clean'])
  .it('should remove .learn/config.json file', () => {
    expect(fs.existsSync('.learn/config.json')).to.be.false
    restoreMockFolders()
  })

  test
  .stdout()
  .do(() => {
    mockFolders({
      'learn.json': JSON.stringify(CONFIG_SAMPLE),
      '.learn': {
        'vscode_queue.json': 'whatever',
      },
    })
  })
  .command(['clean'])
  .it('should remove .learn/vscode_queue.json file', () => {
    expect(fs.existsSync('.learn/vscode_queue.json')).to.be.false
    restoreMockFolders()
  })
})
