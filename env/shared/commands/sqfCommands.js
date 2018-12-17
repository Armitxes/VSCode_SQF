'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_variables = require('../../server/init/variables'); 

class SqfCommands {
	constructor() {
		this.availableCommands = {}
		let sqfSettings = vsc_variables.settings.sqf;

		if (sqfSettings.enableOFP) { Object.assign(this.availableCommands, require('./sqfOFPCommands').OFPCommands); }
	}
};

exports.SqfCommands = SqfCommands;