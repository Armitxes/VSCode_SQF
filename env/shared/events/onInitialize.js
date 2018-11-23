'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

exports.onInitialize = (vars) => {
	return {
        capabilities: {
            textDocumentSync: vars.documents.syncKind,
            hoverProvider: true
        }
    };
}