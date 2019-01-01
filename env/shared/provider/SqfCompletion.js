'use strict';

const vsc_core = require('vscode');
Object.defineProperty(exports, "__esModule", { value: true });

exports.provider = {

	resolveCompletionItem: (params) => {
		vsc_core.window.showErrorMessage('resolveCompletionItem');
		let result = new vsc_core.completionItem();
		// ...
		return result;
	},
	
	provideCompletionItems: (params) => {
		vsc_core.window.showErrorMessage('provideCompletionItems');
		let result = [];  // vsc_core.completionItem

		return result;
	},

}
