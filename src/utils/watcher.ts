import * as chokidar from "chokidar";
import Console from "./console";
import * as debounce from "debounce";
import { IConfigManager } from "../models/config-manager";

export default (
  path: string,
  configManager: IConfigManager,
  reloadSocket: () => void
) =>
  new Promise((resolve /* , reject */) => {
    Console.debug("PATH:", path);
    const watcher = chokidar.watch(path, {
      // TODO: This watcher is not ready yet
      ignoreInitial: true,
    });
    const onChange = (eventname: string, _filename: string) => {
      resolve(eventname /* , filename */);
      Console.log(_filename);
      if (
        /^(?=.*(\\\w+)$).*$/gm.test(_filename) === false ||
        /^(?=.*(\.\w+)$)(?!.*\.md$).*$/gm.test(_filename) === false
      ) {
        configManager.buildIndex();
      } else {
        reloadSocket();
      }
    };

    watcher.on("all", debounce(onChange, 500, true));
    // watcher.on('all', onChange)

    process.on("SIGINT", function () {
      watcher.close();
      process.exit();
    });
  });
