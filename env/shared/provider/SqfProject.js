'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const sqf_commands = require('../commands/sqfCommands');
const sqf_file = require('../provider/SqfFile');

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

		this.consoleIssues = [];
		this.consoleOutput = [];
		this.consoleDebug = [];
	
		this.sqfSettings = vars.settings.sqf;
		this.sqfFiles = {};
		this.sqfWorkspaces = {};
		this.sqfCommands = new sqf_commands.SqfCommands();
		this.connection.console.log('SQF Language: Environment initialized.');
	};

	getSqfFile(document) {
		if (!(document in this.sqfFiles)) {
			this.sqfFiles[document] = new sqf_file.SqfFile(document);
		}
		return this.sqfFiles[document];
	};
}
exports.SqfProject = SqfProject;