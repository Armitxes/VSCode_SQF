'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

let is_client = true;
try { require.resolve('vscode'); }
catch(err) { is_client = false; };

if (is_client) {
	exports.requestRestart = require('./requestRestart').requestRestart;
};

exports.onHover = require('./onHover').onHover;
exports.configurationChanged = require('./configurationChanged').configurationChanged;