'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_variables = require('../../server/init/variables');

class SqfCommands {
	constructor() {
		this.availableCommands = {}
		let sqfSettings = vsc_variables.settings.sqf;

		if (sqfSettings.enableTOH) { Object.assign(this.availableCommands, require('./json/toh.min.json')); }
		if (sqfSettings.enableARMA3) {
			Object.assign(this.availableCommands, require('./json/ofp.min.json'));
			Object.assign(this.availableCommands, require('./json/ofpElite.min.json'));
			Object.assign(this.availableCommands, require('./json/arma.min.json'));
			Object.assign(this.availableCommands, require('./json/arma2.min.json'));
			Object.assign(this.availableCommands, require('./json/arma2oa.min.json'));
			Object.assign(this.availableCommands, require('./json/arma3.min.json'));
		} else if (sqfSettings.enableARMA2) {
			Object.assign(this.availableCommands, require('./json/ofp.min.json'));
			Object.assign(this.availableCommands, require('./json/ofpElite.min.json'));
			Object.assign(this.availableCommands, require('./json/arma.min.json'));
			Object.assign(this.availableCommands, require('./json/arma2.min.json'));
			Object.assign(this.availableCommands, require('./json/arma2oa.min.json'));
		} else if (sqfSettings.enableARMA) {
			Object.assign(this.availableCommands, require('./json/ofp.min.json'));
			Object.assign(this.availableCommands, require('./json/ofpElite.min.json'));
			Object.assign(this.availableCommands, require('./json/arma.min.json'));
		} else if (sqfSettings.enableOFP) {
			Object.assign(this.availableCommands, require('./json/ofp.min.json'));
			Object.assign(this.availableCommands, require('./json/ofpElite.min.json'));
		}
	}
};

exports.SqfCommands = SqfCommands;
