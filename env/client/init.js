'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_core = require('vscode');
const vsc_lang_client = require('vscode-languageclient');
const sqf_commands = require('../shared/commands/init');
const sqf_completion = require('./provider/SqfCompletion');
const events = require('./events/init');

exports.languageClient = false;
exports.activate = (context) => {
    sqf_commands.registerCommands(context);
    vsc_core.languages.registerCompletionItemProvider('sqf', sqf_completion.provider);

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
        lc.onNotification('syncFromServer', (params) => events.onSyncFromServer(params));
        lc.onNotification('requestRestart', (params) => events.onRestartRequest(params));
        lc.sendNotification('clientReady');
        context.subscriptions.push(disposable);
    });

    this.languageClient = lc;
}
//# sourceMappingURL=extension.js.map
