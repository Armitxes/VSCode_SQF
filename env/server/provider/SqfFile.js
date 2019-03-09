'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const SqfScope = require('./SqfScope');


class SqfFile {
	constructor(sqfProject, fUri) {
        this.sqfProject = sqfProject;
        this.fileUri = fUri;
		this.fileObject = null;
        this.fileContent = null;
        this.fileContentSimple = null;
		this.fileLines = [];
        this.fileWorkspace = null;
        this.lastUpdate = null;

        // Runtime
        this.fileIssues = [];
        this.fileVariables = {};

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
        // this.fileScope = new SqfScope.SqfScope(this);
        this.fileIssues = [];

        // for (let c in this.fileContent) {
        //     let char = this.fileContent[c];
        //     this.fileScope.addChar(char);
        // }

        // for (let key in this.fileScope.sqfWords) {
        //     let word = this.fileScope.sqfWords[key];
        //     this.sqfProject.connection.console.log('word:', word.word);
        // }

        // ToDo: Handle all upcomming in SqfScope
        let lines = this.fileContent.split(/\r?\n/g);
        for (var i = 0; i < lines.length; i++) {
            let line = lines[i];
            this.fileLines[i] = { commands: {}, content: line, variables: {}, words: {} };

            // Console Issues
            let lineIssues = this.validateFileLine(i, line);
            if (lineIssues.length > 0) { this.fileIssues = this.fileIssues.concat(lineIssues); }

            let sqfFileWords = line.match(/([_A-Za-z0-9]+)/g);

            if (sqfFileWords != null) {
                for (var w = 0; w < sqfFileWords.length; w++) {
                    let SqfFileWord = sqfFileWords[w];
                    let c_start = line.indexOf(SqfFileWord);

                    if (!(SqfFileWord in this.fileLines[i].words)) {
                        this.fileLines[i].words[SqfFileWord] = {
                            file: this.fileUri,
                            line: i+1,
                            occurrences: {}
                        };
                    }

                    this.fileLines[i].words[SqfFileWord].occurrences[c_start] = {
                        additional_lines: 0,
                        column_start: c_start,
                        column_end: c_start + SqfFileWord.length
                    }

                    let word_dict = this.fileLines[i].words[SqfFileWord];

                    if (SqfFileWord in this.sqfProject.sqfCommands) {
                        // SQF Command
                        // this.sqfProject.connection.console.log('parseFile addCommand ' + SqfFileWord);
                    } else if (
                        SqfFileWord in this.sqfProject.sqfVariables ||
                        SqfFileWord in this.fileLines[i].variables ||
                        line.match(new RegExp('([' + SqfFileWord + ']+)(\s*)=', 'g'))
                    ) {
                        // Variable
                        // this.sqfProject.connection.console.log('parseFile addVariable ' + SqfFileWord);
                        this.sqfProject.sqfVariable(SqfFileWord).addFileOccurrence(word_dict);
                        this.fileLines[i].variables[SqfFileWord] = word_dict;
                    }
                }
            }

            this.sqfProject.connection.sendDiagnostics({uri: this.fileObject.uri, diagnostics: this.fileIssues});
        }
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
