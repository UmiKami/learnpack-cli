import {expect, test} from '@oclif/test'

describe.skip('init', () => {
  test
  .stdout()
  .command(['init'])
  .it('should prompt the choices', async (ctx, done) => {
    expect(ctx.stdout).to.contain(
      `? Is the auto-grading going to be isolated or incremental? › - Use arrow-keys. Return to submit.
      ❯   Incremental: Build on top of each other like a tutorial
          Isolated: Small isolated exercises
          No grading: No feedback or testing whatsoever`,
    )
    done()
  })
})
