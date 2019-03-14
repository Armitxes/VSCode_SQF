'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_variables = require('../init/variables');

exports.onHover = (params) => {
	/* params
		-> textDocument
			-> (string) uri (path to file)
		-> position
			-> (int) line
			-> (int) character
	*/
	let hoverPosition = params.position;
	let sqfProject = vsc_variables.sqfProject;
	let sqfFile = sqfProject.getSqfFile(params.textDocument.uri);

	// Get current hover word
	let hoverWord = null;
	for (let word in sqfFile.fileLines[hoverPosition.line].words) {
		let word_data = sqfFile.fileLines[hoverPosition.line].words[word];

		if (
			hoverPosition.character >= word_data.column_start
			&& hoverPosition.character <= word_data.column_end
		) { hoverWord = word; break; }
	}

	let cmds = sqfProject.sqfCommands.availableCommands;
	if (!!hoverWord) {

		if (cmds.hasOwnProperty(hoverWord)) {
            let cmd = cmds[hoverWord];
            let hoverVal = '';
            if (cmd.server) { hoverVal += '[SE] ' };
            if (cmd.local) { hoverVal += '[AL] ' } else { hoverVal += '[AG] ' };
            if (cmd.broadcasted) {hoverVal += '[EG] '} else { hoverVal += '[EL] ' };

            hoverVal += '\n'
			if (cmd.description != '') { hoverVal += cmd.description + '\n\r'; }
			if (cmd.docSyntax != '') { hoverVal += cmd.docSyntax + '\n'; }
			if (cmd.example != '') { hoverVal += cmd.example; }

			return {
				contents: {
					language: "sqf",
					value: hoverVal
				}
			};
		}
	}
}
