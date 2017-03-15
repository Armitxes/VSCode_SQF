'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("./init/variables");
const files_1 = require("./actions/files");
const events_1 = require("./events");
// Create a connection for the server. The connection uses Node's IPC as a transport
variables_1.documents.listen(variables_1.connection);
// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities. 
let workspaceRoot;
variables_1.connection.onInitialize((params) => {
    workspaceRoot = params.rootPath;
    return {
        capabilities: {
            // Tell the client that the server works in FULL text document sync mode
            textDocumentSync: variables_1.documents.syncKind,
            // Tell the client that the server support code complete
            completionProvider: {
                resolveProvider: true
            }
        }
    };
});
variables_1.connection.onDidChangeConfiguration((change) => new events_1.EventFunctions().configurationChanged(change));
variables_1.documents.onDidChangeContent((change) => new files_1.File().validateSqfFile(change.document));
// This handler provides the initial list of the completion items.
variables_1.connection.onCompletion((textDocumentPosition) => { return []; });
// This handler resolve additional information for the item selected in the completion list.
variables_1.connection.onCompletionResolve((item) => { return item; });
let t;
// Listen on the connection
variables_1.connection.listen();
//# sourceMappingURL=init.js.map