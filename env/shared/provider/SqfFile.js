'use strict';

Object.defineProperty(exports, "__esModule", { value: true });

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

            if (lineIssues.length > 0) { this.fileIssues = this.fileIssues.concat(lineIssues); }

            this.fileLines[i] = {
                'content': line
            };
        }

        this.sqfProject.connection.sendDiagnostics({uri: this.fileObject.uri, diagnostics: this.fileIssues});
    }

    validateFileLine(line, line_content) {
        let lineDiagnostics = [];

        this.sqfProject.validationRegExPatterns.forEach(function (command) {
            let index = line_content.search(command.regex);

            if (index > -1) {
                lineDiagnostics.push({
                    severity: 2,
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