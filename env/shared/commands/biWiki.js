'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vsc_core = require('vscode');

exports.browseSelectedCommand = () => {
	const editor = vsc_core.window.activeTextEditor;
	let selection = editor.selection;
	let command = editor.document.getText(selection).trim();

	const panel = vsc_core.window.createWebviewPanel(
		'browseCommandDocs', "BI Wiki: ".concat(command),
		vsc_core.ViewColumn.One, { }
	);
	panel.webview.html = '<iframe style="width:100%; height:99vh;" src="https://community.bistudio.com/wiki?title=' + command + '&printable=yes"></iframe>'
}