'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const sqf_commands = require('../commands/sqfCommands');
const sqf_file = require('../provider/SqfFile');
const sqf_vars = require('../provider/SqfVariables');

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

		this.sqfFiles = {};
		this.sqfWorkspaces = {};
		this.sqfCommands = {};

		// Runtime
		this.sqfVariables = {};

		this.connection.sendRequest('serverSync', this.getServerSync());
		this.connection.console.info('SQF Language: Environment initialized.');
	};

	getServerSync() {
		return 'ServerSync Debug';
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

	refreshSqfCommands() { this.sqfCommands = new sqf_commands.SqfCommands(); };
}
exports.SqfProject = SqfProject;
