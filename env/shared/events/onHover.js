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

	let sqfFile = new vsc_variables.sqfProject(vsc_variables.connection);
	// vsc_variables.connection.console.log(sqfFile.fileContent);

	return {
		contents: {
			language: "sqf",
			value: ""
		}
	};
}