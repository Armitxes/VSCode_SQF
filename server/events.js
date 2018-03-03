'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("./init/variables");
const settings_1 = require("./init/settings");
const files_1 = require("./actions/files");
const fs = require("fs");
class EventFunctions {
    configurationChanged(change) {
        settings_1.Settings.sqf = change.settings.sqf;
        settings_1.Settings.sqf.maxNumberOfProblems = settings_1.Settings.sqf.maxNumberOfProblems || 50;
        variables_1.sqf.issueCommands = [];
        variables_1.sqf.issueCommands.push({ 'cmd': 'BIS_fnc_MP', 'regex': /(\b)(BIS_fnc_MP)(\b)/g, 'msg': '[ArmA 3] BIS_fnc_MP is deprecated use the engine based commands "remoteExec" or "remoteExecCall" instead.' });
        let sqfGrammarFile = require('../syntaxes/sqf.min.json');
        let patterns = [{ "include": "#vObject-statements" }];
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
            variables_1.connection.sendRequest('requestRestart', 'SQF Language configuration updated. Please restart Visual Studio Code to apply the changes');
        }

        variables_1.sqf.issueCommands.push({ 'cmd': 'BIS_', 'regex': /(\b)(BIS_)([A-z0-9]*)(\s*)=/g, 'msg': 'The "BIS_" function should not be overwritten. "BIS_" is an reserved namespace for functions by Bohemia Interactive' });
        // Deprecated OFP -> ArmA
        if (settings_1.Settings.sqf.enableARMA && settings_1.Settings.sqf.enableARMA) {
            variables_1.sqf.issueCommands.push({ 'cmd': 'exec', 'regex': /(\b)(exec)(\b)/g, 'msg': '[ArmA] exec is used for SQS files which are considered deprecated. Consider using execVM and SQF instead.' });
        }
        // ArmA 1 -> ArmA 3
        if (settings_1.Settings.sqf.enableARMA && settings_1.Settings.sqf.enableARMA3) {
            variables_1.sqf.issueCommands.push({ 'cmd': 'difficultyEnabled', 'regex': /(\b)(difficultyEnabled)(\b)/g, 'msg': '[ArmA 3] difficultyEnabled is deprecated. Use "difficultyOption" instead.' });
            variables_1.sqf.issueCommands.push({ 'cmd': 'private', 'regex': /\b(private)\s*(\")/g, 'msg': '[ArmA 3] "private <string>" is deprecated. Consider using the private modifier directly at variable initialization i.e.: private _var = "value";' });
        }
        // Protect CBA namespace
        if (!settings_1.Settings.sqf.enableCBA) {
            variables_1.sqf.issueCommands.push({ 'cmd': 'CBA_', 'regex': /(\b)(CBA_)/g, 'msg': 'The "CBA_" namespace is reserved for the Community Based Addons. Please enable CBA commands in the settings.' });
        }
        // Protect ACE namespace
        if (!settings_1.Settings.sqf.enableACE3) {
            variables_1.sqf.issueCommands.push({ 'cmd': 'ACE_', 'regex': /(\b)(ACE_)/g, 'msg': 'The "ACE_" namespace is reserved. Please enable ACE commands in the settings.' });
        }
        variables_1.documents.all().forEach(new files_1.File().validateSqfFile);
    }
}
exports.EventFunctions = EventFunctions;
//# sourceMappingURL=events.js.map