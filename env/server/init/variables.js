'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_languageserver = require('vscode-languageserver');
const sqf_project = require('../../shared/provider/SqfProject');
const sqf_events = require('../../shared/events/init')
const sqf_settings = require('./settings')

exports.connection = vsc_languageserver.createConnection(vsc_languageserver.ProposedFeatures.all);
exports.workspaceFolders = vsc_languageserver.workspaceFolders;
exports.documents = new vsc_languageserver.TextDocuments();
exports.settings = sqf_settings.settings;

// Events
exports.sqfEvents = sqf_events;
exports.connection.onInitialize(exports.sqfEvents.onInitialize);
exports.connection.onDidChangeConfiguration(exports.sqfEvents.onDidChangeConfiguration);
exports.connection.onHover(exports.sqfEvents.onHover);
exports.documents.listen(exports.connection);
exports.connection.listen();

// SQF specific part
exports.sqfProject = new sqf_project.SqfProject(exports);
exports.documents.onDidChangeContent((change) => exports.sqfProject.getSqfFile(change.document.uri, true));
//# sourceMappingURL=variables.js.map
