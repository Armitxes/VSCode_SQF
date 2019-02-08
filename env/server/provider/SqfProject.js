'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const sqf_commands = require('../../shared/commands/sqfCommands');
const sqf_file = require('../provider/SqfFile');
const sqf_vars = require('../provider/SqfVariables');
const events = require('../events/init');

class SqfProject {
	// 1 SqfProject
	//   -> X SqfWorkspaces (Mission, Mods, etc.)
	//      -> X SqfFiles

	constructor(vars) {
		// ToDo: Allow external includes via settings.
		this.connection = vars.connection;
		this.documents = vars.documents;
		this.workspaceFolders = vars.workspaceFolders;
		this.workspaces = {}

		// Diagnostics
		this.validationRegExPatterns = [];

		this.sqfCommands = {};
		this.sqfFiles = {};
		this.sqfScopes = {};
		this.sqfVariables = {};
		this.sqfWorkspaces = {};

		// Runtime
		this.connection.onNotification('clientReady', (params) => events.onClientReady(params));
	};

	getSqfFile(documentUri, update=false) {
		if (!(documentUri in this.sqfFiles)) {
			this.connection.console.log('Loading ' + documentUri);
			this.sqfFiles[documentUri] = new sqf_file.SqfFile(this, documentUri);
			return this.sqfFiles[documentUri];
		}
		if (update) { this.sqfFiles[documentUri].update(); }
		return this.sqfFiles[documentUri];
	};

	sqfVariable(varName) {
		if (!(varName in this.sqfVariables)) {
			this.sqfVariables[varName] = new sqf_vars.SqfVariable(varName);
		}
		return this.sqfVariables[varName];
	};

	syncToClients() {
		let clientObj = {
			commandList: this.sqfCommands,
			variableList: this.sqfVariables
		}
		this.connection.console.log('syncToClients');
		this.connection.sendNotification('syncFromServer', clientObj);
	}

	refreshSqfCommands() { this.sqfCommands = new sqf_commands.SqfCommands(); };
}
exports.SqfProject = SqfProject;
