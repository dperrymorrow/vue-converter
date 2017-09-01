"use strict";

const fs = require("fs");
const path = require("path");
const colors = require("colors");

const vueTemplate = `
<template>
<%=template%>
</template>

<script>
<%=requires%>
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
  const vals = {
    template: _template(contents),
    component: _component(contents),
    stylus: _stylus(file),
    requires: _requires(contents),
  };

  let output = vueTemplate;
  Object.keys(vals).forEach(key => {
    output = output.replace(`<%=${key}%>`, vals[key]);
  });

  // fix the component requires...
  output = _components(file, output);

  fs.writeFileSync(`${path.dirname(file)}/${path.basename(file, ".js")}.vue`, output, "utf-8");

  // if (contents.includes("components: ")) {
  //   // console.log(contents.red);
  //   // console.log("/////////////// OUTPUT ////////////////".magenta);
  //   console.log(output.green);
  //   process.exit();
  // }
}

function _template(contents) {
  return contents.split("template: `")[1].split("`")[0];
}

function _component(contents) {
  return contents
    .split("module.exports =")[1]
    .replace(_template(contents), "")
    .replace("template: ``,", "");
}

function _requires(contents) {
  return contents.split("module.exports")[0].replace('"use strict";', "");
}

function _components(file, contents) {
  if (!contents.includes("components: {")) return contents;

  const components = contents
    .split("components: {")[1]
    .split("}")[0]
    .trim()
    .replace(/"/g, "")
    .replace(/require\(/g, "")
    .replace(/\)/g, "")
    .split(",")
    .map(item => item.trim())
    .filter(item => item !== "");

  components.forEach(comp => {
    const arr = comp.split(":");
    const key = arr[0];
    const orgPath = arr[1].trim();
    let compPath = orgPath;
    compPath = path.resolve(path.dirname(file), compPath.replace('"', ""));
    compPath = fs.existsSync(compPath + ".js") ? `${compPath}.vue` : `${compPath}/index.vue`;
    compPath = path.relative(path.dirname(file), compPath);
    compPath = compPath.includes("./") ? compPath : `./${compPath}`;
    contents = contents.replace(orgPath, compPath);
  });

  return contents;
}

function _stylus(file) {
  const stylusFile = path.dirname(file) + "/index.styl";

  if (path.basename(file, ".js") === "index" && fs.existsSync(stylusFile)) {
    return fs.readFileSync(stylusFile, "utf8");
  } else {
    return "// stylus for component goes here";
  }
}

module.exports = {
  isVueComponent,
};
