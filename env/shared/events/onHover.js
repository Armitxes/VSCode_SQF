'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

// const vsc_variables = require('../../server/init/variables');
const vsc_variables = require('../../server/init/variables');

exports.onHover = (params) => {
	/* params
		-> textDocument
			-> (string) uri (path to file)
		-> position
			-> (int) line
			-> (int) character
	*/

	return {
		contents: {
			language: "sqf",
			value: "Hover 2"
		}
	};
}