import * as express from 'express'
import Console from '../../utils/console'
import addRoutes from './routes'
import cli from 'cli-ux'
import * as http from 'http'
import {IConfigObj} from '../../models/config'
import {IConfigManager} from '../../models/config-manager'

export default async function (
  configObj: IConfigObj,
  configManager: IConfigManager,
) {
  const {config} = configObj
  const app = express()
  const server = http.createServer(app)

  app.use(function (
    _: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    )
    res.header('Access-Control-Allow-Methods', 'GET,PUT')
    next()
  })

  // add all needed endpoints
  await addRoutes(app, configObj, configManager)

  const PORT = process.env.NODE_ENV === 'test' ? '3004' : config?.port

  server.listen(PORT, function () {
    Console.success(
      'Exercises are running 😃 Open your browser to start practicing!',
    )
    Console.success('\n            Open the exercise on this link:')
    if (config?.editor.mode === 'gitpod')
      Console.log(`            https://${PORT}-${config.address.slice(8)}`)
    else {
      Console.log(`            ${config?.address}:${PORT}`)

      if (process.env.NODE_ENV !== 'test') {
        cli.open(`${config?.address}:${PORT}`)
      } else {
        server.close()
      }
    }
  })

  return server
}
