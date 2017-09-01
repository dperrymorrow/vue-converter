#! /usr/bin/env node

const traverse = require("./lib/traverse");

traverse.parseDir(process.cwd(), 0, false);
