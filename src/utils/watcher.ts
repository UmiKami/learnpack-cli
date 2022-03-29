import * as chokidar from "chokidar";
import * as debounce from "debounce";

export default (path: string) =>
  new Promise((resolve /* , reject */) => {
    const watcher = chokidar.watch(path, {
      // TODO: This watcher is not ready yet
      // ignored: (_path: string, _stats: any) => {
      //   return new RegExp(_path)
      // },
      persistent: true,
      depth: 1,
      ignoreInitial: true,
    });

    const onChange = (eventname: string, _filename: string) => {
      resolve(eventname /* , filename */);
    };

    watcher.on("all", debounce(onChange, 500, true));
    // watcher.on('all', onChange)

    process.on("SIGINT", function () {
      watcher.close();
      process.exit();
    });
  });
