'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vsc_core = require('vscode');

exports.browseSelectedCommand = () => {
	const editor = vsc_core.window.activeTextEditor;
	let selection = editor.selection;
	let command = editor.document.getText(selection).trim();

	vsc_core.env.openExternal('https://community.bistudio.com/wiki?title=' + command);
}