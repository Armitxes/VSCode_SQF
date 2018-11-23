'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_variables = require('../../server/init/variables'); 

class SqfCommands {
	constructor() {
		this.availableCommands = {}
		//this.sqfSettings = vsc_variables.settings.Settings.sqf;

		//if (this.sqfSettings.enableOFP) { Object.assign(this.availableCommands, this.getOFPCommands()); }
	}
	
	getOFPCommands() { return {
		'abs': {
			'description': 'Absolute value of a real number',
			'example': '_n = abs -3;  // returns 3',
			'local': true, 'broadcasted': false
		}	
	}}
};

exports.SqfCommands = SqfCommands;