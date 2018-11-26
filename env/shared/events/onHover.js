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

	return {
		contents: {
			language: "sqf",
			value: "Test Output"
		}
	};
}