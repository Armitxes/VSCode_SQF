'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vsc_languageserver = require('vscode-languageserver');

exports.onInitialize = (event) => {
    /*
        event:
            - processId
            - rootPath
            - rootUri
            - capabilities
                - workspace
                - textDocument
            - trace
            - workspaceFolders
    */
	return {
        capabilities: {
            textDocumentSync: new vsc_languageserver.TextDocuments().syncKind,
            hoverProvider: true
        }
    };
}
