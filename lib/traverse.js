"use strict";

const fs = require("fs");
const path = require("path");
const colors = require("colors");

function parseDir(baseDir, level, last) {
  const files = fs.readdirSync(baseDir).map(item => path.join(baseDir, item));

  const jsFiles = files.filter(file => {
    return fs.statSync(file).isFile() && path.extname(file) === ".js";
  });

  const dirs = files.filter(file => fs.statSync(file).isDirectory());

  const spacer = Array(level).join(" | ").gray;
  // list dir
  if (jsFiles.length || dirs.length) {
    const symbol = last ? "└─" : "├─";
    console.log(spacer, symbol, path.basename(baseDir).bold.cyan);
  }

  if (jsFiles.length) {
    jsFiles.forEach((file, index) => {
      const isLastFile = index == jsFiles.length - 1;
      let symbol = isLastFile ? "|  └─" : "|  ├─";

      console.log(
        spacer,
        symbol.gray,
        path.basename(file).red,
        "->".magenta,
        `${path.basename(file, ".js") + ".vue"}`.green.bold
      );
    });
  }

  dirs.forEach((dir, index) => {
    const isLastDir = index == dirs.length - 1;
    parseDir(dir, level + 1, isLastDir);
  });
}

module.exports = {
  parseDir,
};
