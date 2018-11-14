'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vsc_core = require('vscode');
const bi_wiki = require("./biWiki");

exports.registerCommands = (context) => {
	let cfg_commands = {
		'sqf.browseCommandDocs': bi_wiki.browseSelectedCommand
	}

	_registerCommands(context, cfg_commands);
};

function _registerCommands(context, cfg_commands) {
	for(let command in cfg_commands){
		context.subscriptions.push(
			vsc_core.commands.registerCommand(command, cfg_commands[command])
		);
	};
};