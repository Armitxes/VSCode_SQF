/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const fs = require("fs");
// Create a connection for the server. The connection uses Node's IPC as a transport
let connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
let documents = new vscode_languageserver_1.TextDocuments();
documents.listen(connection);
// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities. 
let workspaceRoot;
connection.onInitialize((params) => {
    workspaceRoot = params.rootPath;
    return {
        capabilities: {
            // Tell the client that the server works in FULL text document sync mode
            textDocumentSync: documents.syncKind,
            // Tell the client that the server support code complete
            completionProvider: {
                resolveProvider: true
            }
        }
    };
});
var settings = {};
var issueCommands = [
    { 'cmd': 'BIS_fnc_MP', 'regex': /(\b)(BIS_fnc_MP)(\b)/g, 'msg': '[ArmA 3] BIS_fnc_MP is deprecated use the engine based commands "remoteExec" or "remoteExecCall" instead.' }
];
connection.onDidChangeConfiguration((change) => {
    settings = change.settings;
    settings.sqf.maxNumberOfProblems = settings.sqf.maxNumberOfProblems || 50;
    /*
        Check if grammar settings have changed
        ToDo: Find / wait for better alternative.
    */
    let sqfGrammarFile = require('../syntaxes/sqf.min.json');
    let patterns = [];
    if (settings.sqf.enableOFP) {
        patterns.push({ "include": "#OFP" });
    }
    if (settings.sqf.enableTOH) {
        patterns.push({ "include": "#TOH" });
    }
    if (settings.sqf.enableARMA) {
        patterns.push({ "include": "#ARMA" });
    }
    if (settings.sqf.enableARMA2) {
        patterns.push({ "include": "#ARMA2" });
    }
    if (settings.sqf.enableARMA3) {
        patterns.push({ "include": "#ARMA3" });
    }
    if (settings.sqf.enableCBA) {
        patterns.push({ "include": "#CBA" });
    }
    if (settings.sqf.enableACE3) {
        patterns.push({ "include": "#ACE3" });
    }
    if ((JSON.stringify(sqfGrammarFile.repository.statements.patterns) != JSON.stringify(patterns))) {
        connection.window.showInformationMessage('SQF Language configuration updated. Please restart Visual Studio Code to apply the changes.');
        sqfGrammarFile.repository.statements.patterns = patterns;
        fs.truncate(__dirname + "/../syntaxes/sqf.min.json", 0, function () {
            fs.writeFile(__dirname + "/../syntaxes/sqf.min.json", JSON.stringify(sqfGrammarFile));
        });
    }
    // Deprecated OFP -> ArmA
    if (settings.sqf.enableARMA && settings.sqf.enableARMA) {
        issueCommands.push({ 'cmd': 'exec', 'regex': /(\b)(exec)(\b)/g, 'msg': '[ArmA] exec is used for SQS files which are considered deprecated. Consider using execVM and SQF instead.' });
    }
    ;
    // ArmA 1 -> ArmA 3
    if (settings.sqf.enableARMA && settings.sqf.enableARMA3) {
        issueCommands.push({ 'cmd': 'difficultyEnabled', 'regex': /(\b)(difficultyEnabled)(\b)/g, 'msg': '[ArmA 3] difficultyEnabled is deprecated. Use "difficultyOption" instead.' });
    }
    ;
    // Protect CBA namespace
    if (!settings.sqf.enableCBA) {
        issueCommands.push({ 'cmd': 'CBA_', 'regex': /(\b)(CBA_)/g, 'msg': 'The "CBA_" namespace is reserved for the Community Based Addons. Please enable CBA commands in the settings.' });
    }
    ;
    // Protect ACE namespace
    if (!settings.sqf.enableACE3) {
        issueCommands.push({ 'cmd': 'ACE_', 'regex': /(\b)(ACE_)/g, 'msg': 'The "ACE_" namespace is reserved. Please enable ACE commands in the settings.' });
    }
    ;
    documents.all().forEach(validateTextDocument);
});
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
    validateTextDocument(change.document);
});
function validateTextDocument(textDocument) {
    let diagnostics = [];
    let issues = 0;
    let lines = textDocument.getText().split(/\r?\n/g);
    for (var i = 0; i < lines.length && issues < settings.sqf.maxNumberOfProblems; i++) {
        let line = lines[i];
        issueCommands.forEach(function (command) {
            let index = line.search(command.regex);
            if (index > -1) {
                diagnostics.push({
                    severity: vscode_languageserver_1.DiagnosticSeverity.Warning,
                    range: {
                        start: { line: i, character: index },
                        end: { line: i, character: index + command.cmd.length }
                    },
                    message: command.msg,
                    source: 'sqf'
                });
            }
            ;
        });
    }
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
// This handler provides the initial list of the completion items.
connection.onCompletion((textDocumentPosition) => {
    // The pass parameter contains the position of the text document in 
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    return [];
});
// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item) => {
    return item;
});
let t;
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map