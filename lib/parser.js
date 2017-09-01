"use strict";

const fs = require("fs");
const path = require("path");
const colors = require("colors");

const vueTemplate = `
<template>
<%=template%>
</template>

<script>
export default <%=component%>
</script>

<style lang="stylus">
<%=stylus%>
</style>
`;

function isVueComponent(file) {
  const contents = fs.readFileSync(file, "utf8");

  const isComponent = contents.includes("template: `");
  if (isComponent) _convert(file, contents);
  return isComponent;
}

function _convert(file, contents) {
  const template = contents.split("template: `")[1].split("`")[0];
  const vals = {
    template,
    component: contents
      .split("module.exports =")[1]
      .replace(template, "")
      .replace("template: ``,", ""),
    stylus: _stylus(file),
  };

  let output = vueTemplate;
  Object.keys(vals).forEach(key => {
    output = output.replace(`<%=${key}%>`, vals[key]);
  });

  fs.writeFileSync(path.dirname(file) + "/" + path.basename(file, ".js") + ".vue", output, "utf-8");

  console.log(contents.red);
  console.log("/////////////// OUTPUT ////////////////".magenta);
  console.log(output.green);
  process.exit();
}

function _stylus(file) {
  const stylusFile = path.dirname(file) + "/index.styl";

  if (path.basename(file, ".js") === "index" && fs.existsSync(stylusFile)) {
    return fs.readFileSync(stylusFile, "utf8");
  } else {
    return "// stylus for compponent goes here";
  }
}

module.exports = {
  isVueComponent,
};
