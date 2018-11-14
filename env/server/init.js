'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vsc_variables = require("./init/variables");
const sqf_file = require('../shared/provider/SqfFile')
const sqf_events = require("../shared/events/init");

// Create a connection for the server. The connection uses Node's IPC as a transport
vsc_variables.documents.listen(vsc_variables.connection);

// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities. 
vsc_variables.connection.onInitialize((params) => {
    return {
        capabilities: {
            textDocumentSync: vsc_variables.documents.syncKind,
            hoverProvider: true
        }
    };
});
vsc_variables.connection.onDidChangeConfiguration(sqf_events.configurationChanged);
vsc_variables.connection.onHover(sqf_events.onHover);
vsc_variables.documents.onDidChangeContent((change) => new sqf_file.SqfFile(change.document).validateFile());
vsc_variables.connection.listen();
//# sourceMappingURL=init.js.map