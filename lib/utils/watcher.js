"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chokidar = require("chokidar");
const debounce = require("debounce");
exports.default = (path) =>
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
    const onChange = (eventname, _filename) => {
      resolve(eventname /* , filename */);
    };
    watcher.on("all", debounce(onChange, 500, true));
    // watcher.on('all', onChange)
    process.on("SIGINT", function () {
      watcher.close();
      process.exit();
    });
  });
