'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_languageserver = require('vscode-languageserver');
const vsc_settings = require('../../server/init/settings');
const sqf_project = require('../../shared/provider/SqfProject');

exports.connection = vsc_languageserver.createConnection(new vsc_languageserver.IPCMessageReader(process), new vsc_languageserver.IPCMessageWriter(process));
exports.documents = new vsc_languageserver.TextDocuments();
exports.settings = vsc_settings;
exports.sqfProject = new sqf_project.SqfProject(exports.connection);

//# sourceMappingURL=variables.js.map