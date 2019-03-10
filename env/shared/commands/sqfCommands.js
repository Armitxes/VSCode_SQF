'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_variables = require('../../server/init/variables');

class SqfCommands {
	constructor() {
		this.availableCommands = {}
		let sqfSettings = vsc_variables.settings.sqf;
		let sqfWiki = require('./sqfCommands.min.json');

		if (sqfSettings.enableTOH) { Object.assign(this.availableCommands, sqfWiki['TOH']); }
		if (sqfSettings.enableARMA3) {
			Object.assign(this.availableCommands, sqfWiki['ARMA3']);
			Object.assign(this.availableCommands, sqfWiki['ARMA2']);
			Object.assign(this.availableCommands, sqfWiki['ARMA']);
			Object.assign(this.availableCommands, sqfWiki['OFP']);
		} else if (sqfSettings.enableARMA2) {
			Object.assign(this.availableCommands, sqfWiki['ARMA2']);
			Object.assign(this.availableCommands, sqfWiki['ARMA']);
			Object.assign(this.availableCommands, sqfWiki['OFP']);
		} else if (sqfSettings.enableARMA) {
			Object.assign(this.availableCommands, sqfWiki['ARMA']);
			Object.assign(this.availableCommands, sqfWiki['OFP']);
		} else if (sqfSettings.enableOFP) {
			Object.assign(this.availableCommands, sqfWiki['OFP']);
		}
	}
};

exports.SqfCommands = SqfCommands;
