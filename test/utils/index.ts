import * as mockfs from 'mock-fs'
import * as path from 'path'

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
