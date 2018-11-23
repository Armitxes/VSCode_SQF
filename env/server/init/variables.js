'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vsc_languageserver = require('vscode-languageserver');
const vsc_settings = require('../../server/init/settings');
const sqf_project = require('../../shared/provider/SqfProject');
const sqf_events = require('../../shared/events/init')

exports.connection = vsc_languageserver.createConnection(vsc_languageserver.ProposedFeatures.all);
exports.workspaceFolders = vsc_languageserver.workspaceFolders;
exports.documents = new vsc_languageserver.TextDocuments();

// Events
exports.sqfEvents = sqf_events;
exports.connection.onInitialize(exports.sqfEvents.onInitialize);
exports.connection.onDidChangeConfiguration(exports.sqfEvents.configurationChanged);
exports.connection.onHover(exports.sqfEvents.onHover);

exports.documents.listen(exports.connection);
exports.connection.listen();


exports.settings = new vsc_settings.Settings(exports);
exports.sqfProject = new sqf_project.SqfProject(exports);
exports.documents.onDidChangeContent((change) => exports.sqfProject.getSqfFile(change.document).validateFile());

//# sourceMappingURL=variables.js.map