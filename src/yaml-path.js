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

    let nextParent = {
      path: null,
      range: item.key.range,
      line: lineCounter.linePos(item.key.range[0])
    }

    if (!parent) {
      nextParent.path = item.key.value
    } else {
      nextParent.path = `${parent.path}.${item.key.value}`
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
