import * as mockfs from 'mock-fs'
import * as path from 'path'
import * as fs from 'fs'
import {IExercise} from '../../src/models/exercise-obj'

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
  console.log(config)

  const configObj: any = {
    ...config,
  }

  const {address, port} = configObj

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

  for (const key of ['address', 'port', 'configObj', 'actions', 'session'])
    delete config[key]

  return {
    config: {
      ...configObj,
      port,
      address,
      configPath: `${configObj.configPath.replace('./', '')}`,
      outputPath: `${configObj.outputPath.replace('./', '')}`,
      actions: ['build', 'test', 'reset'],
      disabledActions: [],
      translations: [],
      editor: {
        mode: configObj.editor.mode,
        version: configObj.editor.version,
      },
    },
  }
}

export const exerciseToPlainJson = (exercise: IExercise) => {
  const exerciseCopy = {...exercise}
  delete exerciseCopy.getFile
  delete exerciseCopy.getReadme
  delete exerciseCopy.getTestReport
  delete exerciseCopy.saveFile

  return exerciseCopy
}
