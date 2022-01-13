import {expect, test} from '@oclif/test'

describe.skip('start', () => {
  test
  .stdout()
  .command(['start'])
  .it('should throws an error if no learn.json file present', ctx => {
    expect(ctx.stdout).to.contain(
      '⨉ learn.json file not found on current folder, is this a learnpack package?',
    )
  })
})
