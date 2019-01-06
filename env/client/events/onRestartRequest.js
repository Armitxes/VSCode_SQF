'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vsc_core = require('vscode');

exports.onRestartRequest = (params) => {
	vsc_core.window.showInformationMessage(params, 'Reload').then(selected => {
		if (selected === 'Reload') {
			vsc_core.commands.executeCommand('workbench.action.reloadWindow');
		}
	});	
};