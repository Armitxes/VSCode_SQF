'use strict';
exports.__esModule = true;
var vscode_1 = require("vscode");
var settings_1 = require("./init/settings");
var fs = require("fs");
var EventFunctions = (function () {
    function EventFunctions() {
    }
    EventFunctions.prototype.configurationChanged = function (change) {
        settings_1.Settings.sqf = change.settings.sqf;
        vscode_1.window.showWarningMessage(settings_1.Settings.sqf.enableOFP.toString());
        settings_1.Settings.sqf.maxNumberOfProblems = settings_1.Settings.sqf.maxNumberOfProblems || 50;
        var issueCommands = [
            { 'cmd': 'BIS_fnc_MP', 'regex': /(\b)(BIS_fnc_MP)(\b)/g, 'msg': '[ArmA 3] BIS_fnc_MP is deprecated use the engine based commands "remoteExec" or "remoteExecCall" instead.' }
        ];
        var sqfGrammarFile = require('../syntaxes/sqf.min.json');
        var patterns = [];
        if (settings_1.Settings.sqf.enableOFP) {
            patterns.push({ "include": "#OFP" });
        }
        if (settings_1.Settings.sqf.enableTOH) {
            patterns.push({ "include": "#TOH" });
        }
        if (settings_1.Settings.sqf.enableARMA) {
            patterns.push({ "include": "#ARMA" });
        }
        if (settings_1.Settings.sqf.enableARMA2) {
            patterns.push({ "include": "#ARMA2" });
        }
        if (settings_1.Settings.sqf.enableARMA3) {
            patterns.push({ "include": "#ARMA3" });
        }
        if (settings_1.Settings.sqf.enableCBA) {
            patterns.push({ "include": "#CBA" });
        }
        if (settings_1.Settings.sqf.enableACE3) {
            patterns.push({ "include": "#ACE3" });
        }
        if ((JSON.stringify(sqfGrammarFile.repository.statements.patterns) != JSON.stringify(patterns))) {
            sqfGrammarFile.repository.statements.patterns = patterns;
            fs.truncate(__dirname + "/../syntaxes/sqf.min.json", 0, function () {
                fs.writeFile(__dirname + "/../syntaxes/sqf.min.json", JSON.stringify(sqfGrammarFile));
            });
            vscode_1.window.showInformationMessage('SQF Language configuration updated. Please restart Visual Studio Code to apply the changes', 'Reload').then(function (selected) {
                if (selected === 'Reload') {
                    vscode_1.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        }
        // Deprecated OFP -> ArmA
        if (settings_1.Settings.sqf.enableARMA && settings_1.Settings.sqf.enableARMA) {
            issueCommands.push({ 'cmd': 'exec', 'regex': /(\b)(exec)(\b)/g, 'msg': '[ArmA] exec is used for SQS files which are considered deprecated. Consider using execVM and SQF instead.' });
        }
        ;
        // ArmA 1 -> ArmA 3
        if (settings_1.Settings.sqf.enableARMA && settings_1.Settings.sqf.enableARMA3) {
            issueCommands.push({ 'cmd': 'difficultyEnabled', 'regex': /(\b)(difficultyEnabled)(\b)/g, 'msg': '[ArmA 3] difficultyEnabled is deprecated. Use "difficultyOption" instead.' });
        }
        ;
        // Protect CBA namespace
        if (!settings_1.Settings.sqf.enableCBA) {
            issueCommands.push({ 'cmd': 'CBA_', 'regex': /(\b)(CBA_)/g, 'msg': 'The "CBA_" namespace is reserved for the Community Based Addons. Please enable CBA commands in the settings.' });
        }
        ;
        // Protect ACE namespace
        if (!settings_1.Settings.sqf.enableACE3) {
            issueCommands.push({ 'cmd': 'ACE_', 'regex': /(\b)(ACE_)/g, 'msg': 'The "ACE_" namespace is reserved. Please enable ACE commands in the settings.' });
        }
        ;
    };
    return EventFunctions;
}());
exports.EventFunctions = EventFunctions;
