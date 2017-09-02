'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
exports.connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
exports.documents = new vscode_languageserver_1.TextDocuments();
class sqf {
}
sqf.issueCommands = [];
exports.sqf = sqf;
//# sourceMappingURL=variables.js.map