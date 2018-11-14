'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_languageserver = require('vscode-languageserver');
const vsc_variables = require('../../server/init/variables');

class SqfFile {
	constructor(fPath) {
		this.fileObject = fPath;
		this.fileContent = null;
		this.fileContentLines = [];
		this.fileWorkspace = null;
		this.lastUpdate = null;

		if (this.fileObject != null) {
			this.fileContent = this.fileObject.getText();
			this.loadFileLines();
		}
	}

	reloadFile() { this.loadFile(this.fileObject); }
	loadFileLines() { this.fileContentLines = this.fileContent.split(/\r?\n/g); }

	getLine(index) {
		if (index < this.fileContentLines.length) {
			return this.fileContentLines[index]
		} else { return ''; }
	}

    validateFile() {
        let diagnostics = [];
        let issues = 0;
        let sqfProject = vsc_variables.sqfProject;

        for (var i = 0; i < this.fileContentLines.length && issues < sqfProject.sqfSettings.maxNumberOfProblems; i++) {
            let line = this.fileContentLines[i];
            sqfProject.consoleIssues.forEach(function (command) {
                let index = line.search(command.regex);
                if (index > -1) {
                    diagnostics.push({
                        severity: vsc_languageserver.DiagnosticSeverity.Warning,
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
        sqfProject.connection.sendDiagnostics({ uri: this.fileObject.uri, diagnostics });
    }
}
exports.SqfFile = SqfFile;