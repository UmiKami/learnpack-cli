import * as mockfs from 'mock-fs'
import * as path from 'path'
import * as fs from 'fs'

export const mockFolders = (folders: any) => {
  const mockfsConf = {
    'package.json': mockfs.load(path.resolve(__dirname, '../../package.json')),
    'tsconfig.json': mockfs.load(
      path.resolve(__dirname, '../../tsconfig.json'),
    ),
    src: mockfs.load(path.resolve(__dirname, '../../src')),
    test: mockfs.load(path.resolve(__dirname, '../../test')),
    /* eslint-disable-next-line */
    node_modules: mockfs.load(path.resolve(__dirname, "../../node_modules")),
    '.nyc_output': mockfs.load(path.resolve(__dirname, '../../.nyc_output')),
    ...(folders ? folders : {}),
  }

  mockfs(mockfsConf, {createCwd: false})
}

export const restoreMockFolders = () => {
  mockfs.restore()
}

export const isDirEmpty = (dirname: string) => {
  return fs.readdirSync(dirname).length === 0
}

export const buildExpectedConfig = (config: any) => {
  const configObj: any = {
    ...config,
  }

  for (const key of [
    'description',
    'difficulty',
    'disabledActions',
    'duration',
    'language',
    'slug',
    'title',
    'publicUrl',
  ])
    delete configObj[key]

  return {
    ...config,
    config: {
      ...configObj,
      configPath: `${configObj.configPath.replace('./', '')}`,
      outputPath: `${configObj.outputPath.replace('./', '')}`,
      actions: ['build', 'test', 'reset'],
      editor: {
        mode: configObj.editor.mode,
        version: configObj.editor.version,
      },
    },
  }
}
