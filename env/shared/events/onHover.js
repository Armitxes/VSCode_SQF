'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_variables = require('../../server/init/variables');

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

		for (let key in word_data.occurrences) {
			if (
				hoverPosition.character >= word_data.occurrences[key].column_start
				&& hoverPosition.character <= word_data.occurrences[key].column_end
			) { hoverWord = word; break; }
		}
	}

	if (!!hoverWord) {
		return {
			contents: {
				language: "sqf",
				value: hoverWord
			}
		};
	}
}