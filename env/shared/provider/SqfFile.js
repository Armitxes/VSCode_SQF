'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_languageserver = require('vscode-languageserver');

class SqfFile {
	constructor(sqfProject, fUri) {
        this.sqfProject = sqfProject;
        this.fileUri = fUri;
		this.fileObject = null;
		this.fileContent = null;
		this.fileLines = [];
        this.fileWorkspace = null;
        this.lastUpdate = null;

        // Runtime
        this.fileVariables = {};
        this.fileIssues = [];

        this.update();
	}

    update() {
		if (this.fileUri != null) {
            this.fileObject = this.sqfProject.documents.get(this.fileUri);
            if (this.fileObject != null) {
                this.fileContent = this.fileObject.getText();
                this.parseFile();
            }
		}
    }

    parseFile() {
        this.fileIssues = [];
        let lines = this.fileContent.split(/\r?\n/g);

        for (var i = 0; i < lines.length; i++) {
            let line = lines[i];
            let lineIssues = this.validateFileLine(i, line);

            if (lineIssues.length > 0) { this.fileIssues.push(lineIssues); }

            this.fileLines[i] = {
                'content': line
            };
        }

        this.sqfProject.connection.console.log(this.fileIssues.length);
        this.sqfProject.connection.sendDiagnostics({uri: this.fileObject.uri, diagnostics: this.fileIssues});
        // this.sqfProject.globalVariables
        // this.sqfProject.connection.console.log(this.fileLines);
        // for (let cl=0; cl=lines.length; cl++) {
        //     // this.sqfProject.connection.console.log(lineContent.match(/([A-Za-z0-9]+)(\s*)=/g));
        //     let lineContent = lines[cl];
        //     this.fileLines[cl] = {
        //         'content': lineContent
        //     };
        // };
    }

    validateFileLine(line, line_content) {
        let lineDiagnostics = [];

        this.sqfProject.validationRegExPatterns.forEach(function (command) {
            let index = line_content.search(command.regex);

            if (index > -1) {
                lineDiagnostics.push({
                    severity: vsc_languageserver.DiagnosticSeverity.Warning,
                    range: {
                        start: { line: line, character: index },
                        end: { line: line, character: index + command.cmd.length }
                    },
                    message: command.msg,
                    source: 'sqf'
                });
            };
        });

        return lineDiagnostics
    }
}
exports.SqfFile = SqfFile;