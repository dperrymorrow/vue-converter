"use strict";

const fs = require("fs");
const path = require("path");
const dir = process.cwd();
const colors = require("colors");

fs.readdir(dir, (err, files) => {
  if (err) {
    throw err;
  }

  files
    .map(file => {
      return path.join(p, file);
    })
    .filter(file => {
      return fs.statSync(file).isFile();
    })
    .forEach(file => {
      console.log("%s (%s)", file, path.extname(file));
    });
});
