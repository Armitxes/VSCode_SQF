"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("../init/variables");
const settings_1 = require("../init/settings");
const vscode_languageserver_1 = require("vscode-languageserver");
class File {
    validateSqfFile(textDocument) {
        let diagnostics = [];
        let issues = 0;
        let lines = textDocument.getText().split(/\r?\n/g);
        for (var i = 0; i < lines.length && issues < settings_1.Settings.sqf.maxNumberOfProblems; i++) {
            let line = lines[i];
            variables_1.sqf.issueCommands.forEach(function (command) {
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
        variables_1.connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    }
}
exports.File = File;
//# sourceMappingURL=files.js.map