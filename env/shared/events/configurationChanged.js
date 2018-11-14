'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vsc_settings = require("../../server/init/settings");
const vsc_variables = require("../../server/init/variables");
const sqf_file = require('../provider/SqfFile');
const fs = require("fs");

exports.configurationChanged = (change) => {
	vsc_settings.Settings.sqf = change.settings.sqf;
	let settings = vsc_settings.Settings.sqf;
	vsc_settings.Settings.sqf.maxNumberOfProblems = settings.maxNumberOfProblems || 50;

	let sqfProject = vsc_variables.sqfProject;
	sqfProject.sqfSettings = settings;

	sqfProject.consoleIssues = [];
	sqfProject.consoleIssues.push({ 'cmd': 'BIS_fnc_MP', 'regex': /(\b)(BIS_fnc_MP)(\b)/g, 'msg': '[ArmA 3] BIS_fnc_MP is deprecated use the engine based commands "remoteExec" or "remoteExecCall" instead.' });

	let sqfGrammarFile = require('../../../syntaxes/sqf.min.json');
	let patterns = [{ "include": "#vObject-statements" }];
	if (settings.enableOFP) { patterns.push({ "include": "#OFP" }); }
	if (settings.enableTOH) { patterns.push({ "include": "#TOH" }); }
	if (settings.enableARMA) { patterns.push({ "include": "#ARMA" }); }
	if (settings.enableARMA2) { patterns.push({ "include": "#ARMA2" }); }
	if (settings.enableARMA3) { patterns.push({ "include": "#ARMA3" }); }
	if (settings.enableCBA) { patterns.push({ "include": "#CBA" }); }
	if (settings.enableACE3) { patterns.push({ "include": "#ACE3" }); }
	if ((JSON.stringify(sqfGrammarFile.repository.statements.patterns) != JSON.stringify(patterns))) {
		sqfGrammarFile.repository.statements.patterns = patterns;
		fs.truncate(__dirname + "/../../../syntaxes/sqf.min.json", 0, function () {
			fs.writeFile(__dirname + "/../../../syntaxes/sqf.min.json", JSON.stringify(sqfGrammarFile));
		});
		vsc_variables.connection.sendRequest('requestRestart', 'SQF Language configuration updated. Please restart Visual Studio Code to apply the changes');
	}

	sqfProject.consoleIssues.push({ 'cmd': 'BIS_', 'regex': /(\b)(BIS_)([A-z0-9]*)(\s*)=/g, 'msg': 'The "BIS_" function should not be overwritten. "BIS_" is an reserved namespace for functions by Bohemia Interactive' });
	// Deprecated OFP -> ArmA
	if (settings.enableARMA && settings.enableARMA) {
		sqfProject.consoleIssues.push({ 'cmd': 'exec', 'regex': /(\b)(exec)(\b)/g, 'msg': '[ArmA] exec is used for SQS files which are considered deprecated. Consider using execVM and SQF instead.' });
	}
	// ArmA 1 -> ArmA 3
	if (settings.enableARMA && settings.enableARMA3) {
		sqfProject.consoleIssues.push({ 'cmd': 'difficultyEnabled', 'regex': /(\b)(difficultyEnabled)(\b)/g, 'msg': '[ArmA 3] difficultyEnabled is deprecated. Use "difficultyOption" instead.' });
		sqfProject.consoleIssues.push({ 'cmd': 'private', 'regex': /\b(private)\s*(\")/g, 'msg': '[ArmA 3] "private <string>" is deprecated. Consider using the private modifier directly at variable initialization i.e.: private _var = "value";' });
	}
	// Protect CBA namespace
	if (!settings.enableCBA) {
		sqfProject.consoleIssues.push({ 'cmd': 'CBA_', 'regex': /(\b)(CBA_)/g, 'msg': 'The "CBA_" namespace is reserved for the Community Based Addons. Please enable CBA commands in the settings.' });
	}
	// Protect ACE namespace
	if (!settings.enableACE3) {
		sqfProject.consoleIssues.push({ 'cmd': 'ACE_', 'regex': /(\b)(ACE_)/g, 'msg': 'The "ACE_" namespace is reserved. Please enable ACE commands in the settings.' });
	}
	vsc_variables.documents.all().forEach((param) => { new sqf_file.SqfFile(param).validateFile(); });
}