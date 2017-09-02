'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
function activate(context) {
    // The server is implemented in node
    let serverModule = context.asAbsolutePath('server/init.js');
    // The debug options for the server
    let debugOptions = { execArgv: ["--nolazy", "--debug=6009"] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: ['sqf'],
        synchronize: {
            configurationSection: 'sqf',
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.clientrc')
        }
    };
    // Create the language client and start the client.
    let lc = new vscode_languageclient_1.LanguageClient('sqfLanguageServer', 'SQF Language Server', serverOptions, clientOptions);
    let disposable = lc.start();
    lc.onReady().then(() => {
        lc.onRequest('requestRestart', (params) => {
            vscode_1.window.showInformationMessage(params, 'Reload').then(selected => {
                if (selected === 'Reload') {
                    vscode_1.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        });
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map