'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

exports.commandList = false;
exports.variableList = false;

exports.getAvailableVariables = (file) => {

}

exports.onSyncFromServer = (serverObj) => {
	exports.commandList = serverObj.commandList;
	exports.variableList = serverObj.variableList;
};
