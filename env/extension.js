'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_core = require('vscode');
const vsc_lang_client = require('vscode-languageclient');
const sqf_commands = require('./shared/commands/init');

exports.activate = (context) => {
    sqf_commands.registerCommands(context);
    vsc_core.languages.registerCompletionItemProvider('sqf');

    // Server Options
    let serverModule = context.asAbsolutePath('env/server/init.js');
    let debugOptions = { execArgv: ["--nolazy", "--debug=6009"] };

    let serverOptions = {
        run: { module: serverModule, transport: vsc_lang_client.TransportKind.ipc },
        debug: { module: serverModule, transport: vsc_lang_client.TransportKind.ipc, options: debugOptions }
    };


    // Client Options
    let clientOptions = {
        documentSelector: ['sqf'],
        synchronize: {
            configurationSection: 'sqf',
            fileEvents: vsc_core.workspace.createFileSystemWatcher('**/.clientrc')
        }
    };

    // Create the language client and start the client.
    let lc = new vsc_lang_client.LanguageClient('sqfLanguageServer', 'SQF Language Server', serverOptions, clientOptions);
    let disposable = lc.start();
    lc.onReady().then(() => {
        lc.onRequest('requestRestart', (params) => {
            vsc_core.window.showInformationMessage(params, 'Reload').then(selected => {
                if (selected === 'Reload') {
                    vsc_core.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        });
        context.subscriptions.push(disposable);
    });
}
//# sourceMappingURL=extension.js.map
