/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../declares.d.ts" />
'use strict';
define(["require", "exports", './sqfDef', 'monaco'], function (require, exports, sqfDef, monaco) {
    monaco.Modes.registerMonarchDefinition('sqf', sqfDef.language);
});
