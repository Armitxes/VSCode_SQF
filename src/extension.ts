'use strict';

import { workspace, Disposable, ExtensionContext, window, commands } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

	// The server is implemented in node
	let serverModule = context.asAbsolutePath('server/init.js');
	// The debug options for the server
	let debugOptions = { execArgv: ["--nolazy", "--debug=6009"] };
	
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run : { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	}
	
	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: ['sqf'],
		synchronize: {
			configurationSection: 'sqf',
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	}

	// Create the language client and start the client.
	let lc = new LanguageClient('sqfLanguageServer', 'SQF Language Server', serverOptions, clientOptions);
	let disposable = lc.start();
	lc.onReady().then(() => {
		lc.onRequest('requestRestart', (params : any) : void => {
			window.showInformationMessage(params, 'Reload').then(selected => {
				if (selected === 'Reload') { commands.executeCommand('workbench.action.reloadWindow'); }
			});
		});
		context.subscriptions.push(disposable);
	});
}
