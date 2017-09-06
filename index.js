#! /usr/bin/env node

require("colors");
const inquirer = require("inquirer");
const traverse = require("./lib/traverse");
const parser = require("./lib/parser");
const fs = require("fs");

inquirer
  .prompt([
    {
      type: "confirm",
      name: "nuke",
      message: "Delete all js files with template: defined and index.styl files?",
    },
  ])
  .then(answers => {
    traverse.parseDir(process.cwd(), 0, false);
    if (answers.nuke) {
      console.log("deleting original files".yellow);
      setTimeout(() => {
        parser.deleteQue.forEach(fs.unlinkSync);
        console.log("finished deletion".green);
      }, 2000);
    }
  })
  .catch(console.log);
