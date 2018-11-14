'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_languageserver = require("vscode-languageserver");
const vsc_settings = require("../../server/init/settings");

class SqfProject {
	// 1 SqfProject
	//   -> X SqfWorkspaces (Mission, Mods, etc.)
	//      -> X SqfFiles

	constructor(connection) {
		// ToDo: Allow external includes via settings.
		this.connection = connection;
		this.documents = new vsc_languageserver.TextDocuments();
		this.workspaces = vsc_languageserver.workspaceFolders;

		this.consoleIssues = [];
		this.consoleOutput = [];
		this.consoleDebug = [];
	
		this.sqfSettings = vsc_settings.Settings.sqf;
		this.sqfFiles = null;
		this.sqfWorkspaces = null;
		this.connection.console.log('SQF Language: Environment initialized.');
	}
}
exports.SqfProject = SqfProject;