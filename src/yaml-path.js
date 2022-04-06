const YAML = require('yaml')

function list(content) {
  return parse(content)
}

function copy(content, line) {
  const nodePaths = parse(content)
  console.log(line, nodePaths)
  return nodePaths.find((item) => Number(item.line.line) === Number(line))
}

function parse(content) {
  const lineCounter = new YAML.LineCounter()
  const document = YAML.parseDocument(content, { lineCounter: lineCounter })

  return displayNodes(document.contents.items, null, [], { lineCounter })
}

function displayNodes(items, parent, results, { lineCounter }) {
  items.forEach((item) => {
    let base = (!item.key) ? item : item.key;

    let nextParent = {
      path: null,
      range: base.range,
      line: lineCounter.linePos(base.range[0])
    }

    if (!parent) {
      nextParent.path = base.value
    } else {
      nextParent.path = `${parent.path}.${base.value}`
    }

    results.push(nextParent)

    if (item.value && item.value.items) {
      displayNodes(item.value.items, nextParent, results, { lineCounter })
    }
  })

  return results
}

module.exports = {
  copy,
  list
}
