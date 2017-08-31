#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const colors = require("colors");
const cwd = process.cwd();

function parseDir(baseDir) {
  const files = fs.readdirSync(baseDir).map(item => path.join(baseDir, item));

  const jsFiles = files.filter(file => {
    return fs.statSync(file).isFile() && path.extname(file) === ".js";
  });

  const dirs = files.filter(file => {
    return fs.statSync(file).isDirectory();
  });

  dirs.forEach(parseDir);

  if (jsFiles.length) {
    const dirName =
      cwd == baseDir ? path.basename(baseDir) : baseDir.split(cwd + "/").splice(-1).pop();

    console.log("  ", dirName.bold.cyan);

    jsFiles.forEach(file => {
      console.log(
        "     |--",
        path.basename(file).red,
        "->".magenta,
        `${path.basename(file, ".js") + ".vue"}`.green.bold
      );
    });

    console.log("");
  }
}

parseDir(cwd);
