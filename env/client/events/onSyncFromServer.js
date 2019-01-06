'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

exports.commandList = false;
exports.onSyncFromServer = (serverObj) => {
	exports.commandList = serverObj.commandList;
};