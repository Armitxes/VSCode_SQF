'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

const vars = require('../init/variables')

exports.onClientReady = (params) => { onClientReady(); };

function onClientReady() {
	vars.sqfProject.connection.console.log('[SQF Language] Environment successfully loaded.');
	vars.sqfProject.syncToClients();
}