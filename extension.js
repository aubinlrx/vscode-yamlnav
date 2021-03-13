const vscode = require('vscode');
const cp = require('child_process')
const path = require('path')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let search = vscode.commands.registerTextEditorCommand('yamlnav.search', function (editor) {
    const file = editor.document.fileName

    if (path.extname(file) !== '.yml') {
      vscode.window.showErrorMessage("Only works with .yml file.")
      return
    }

    const command = `yaml-path list ${file} -l`
    console.log(command)
    cp.exec(command, (error, stdout) => {
      const results = stdout.split('\n')
      const values = {}

      results.forEach((value) => {
        let [path, lineNumber] = value.split(' ')
        if (!lineNumber) return

        values[path] = Number(lineNumber.split('#')[1]) - 1
      })

      vscode.window.showQuickPick(Object.keys(values))
        .then(selected => {
          if (!selected) return

          const lineNumber = values[selected]
          const line = editor.document.lineAt(lineNumber)
          const characterIndex = line.firstNonWhitespaceCharacterIndex

          const position = new vscode.Position(lineNumber, characterIndex)
          editor.selections = [new vscode.Selection(position,position)];
          const range = new vscode.Range(position, position);
          editor.revealRange(range);
        })
     })
  });

  let copy = vscode.commands.registerTextEditorCommand('yamlnav.copy', function(editor) {
    const file = editor.document.fileName

    if (path.extname(file) !== '.yml') {
      vscode.window.showErrorMessage("Only works with .yml file.")
      return
    }

    const lineNumber = editor.selection.active.line
    const line = editor.document.lineAt(lineNumber)
    const character = line.firstNonWhitespaceCharacterIndex

    const command = `yaml-path get ${file} -c ${character + 1} -l ${lineNumber + 1}`
    cp.exec(command, (error, stdout) => {
      vscode.env.clipboard.writeText(stdout)
      vscode.window.showInformationMessage(stdout)
    })
  });

  context.subscriptions.push(search, copy);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
}
