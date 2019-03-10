'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_core = require('vscode');
const serverSync = require('../events/onSyncFromServer');

exports.provider = {

	resolveCompletionItem: (ci) => {},
	
	provideCompletionItems: (params) => {
		let result = [];
		let availableCommands = serverSync.commandList.availableCommands;
		let availableVariables = serverSync.getAvailableVariables('abs');

		for (let command in availableCommands) {
			let kind = vsc_core.CompletionItemKind.Keyword;
			if (command.indexOf('_') != -1) { kind = vsc_core.CompletionItemKind.Function; }
			
			let ci = new vsc_core.CompletionItem(command, kind);
			ci.detail = 'Documentation';
			ci.documentation = availableCommands[command]['description'];
			result.push(ci);
		}

		return result;
	},

}
