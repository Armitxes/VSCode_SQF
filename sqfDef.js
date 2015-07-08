/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/// <reference path="../declares.d.ts" />
'use strict';
define(["require", "exports"], function (require, exports) {
    exports.language = {
        displayName: 'SQF',
        name: 'sqf',
        mimeTypes: [],
        fileExtensions: [],
        defaultToken: '',
        // used in the editor to insert comments (ctrl+/ or shift+alt+A)
        lineComment: '// ',
        blockCommentStart: '/*',
        blockCommentEnd: '*/',
        // the default separators except `@`
        wordDefinition: /(-?\d*\.\d\w*)|([^\`\~\!\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        autoClosingPairs: [
            ['"', '"'],
            ['\'', '\''],
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
        ],
        brackets: [
            { open: '{', close: '}', token: 'delimiter.curly' },
            { open: '[', close: ']', token: 'delimiter.square' },
            { open: '(', close: ')', token: 'delimiter.parenthesis' },
        ],
        editorOptions: { tabSize: 4, insertSpaces: false },
        keywords: [
            'abs','accTime','acos','action','actionKeys','actionKeysImages','actionKeysNames','actionKeysNamesArray','actionName','activateAddons','activatedAddons','activateKey','addAction','addBackpack','addBackpackCargo','addBackpackCargoGlobal','addBackpackGlobal','addCamShake','addCuratorAddons','addCuratorCameraArea','addCuratorEditableObjects','addCuratorEditingArea','addCuratorPoints','addEditorObject','addEventHandler','addGoggles','addGroupIcon','addHandgunItem','addHeadgear','addItem','addItemCargo','addItemCargoGlobal','addItemPool','addItemToBackpack','addItemToUniform','addItemToVest','addLiveStats','addMagazine','addMagazine','addMagazineAmmoCargo','addMagazineCargo','addMagazineCargoGlobal','addMagazineGlobal','addMagazinePool','addMagazines','addMagazineTurret','addMenu','addMenuItem','addMissionEventHandler','addMPEventHandler','addMusicEventHandler','addPrimaryWeaponItem','addPublicVariableEventHandler','addRating','addResources','addScore','addScoreSide','addSecondaryWeaponItem','addSwitchableUnit','addTeamMember','addToRemainsCollector','addUniform','addVehicle','addVest','addWaypoint','addWeapon','addWeaponCargo','addWeaponCargoGlobal','addWeaponGlobal','addWeaponPool','addWeaponTurret','agent','agents','aimedAtTarget','aimPos','airDensityRTD','airportSide','AISFinishHeal','alive','allControls','allCurators','allDead','allDeadMen','allDisplays','allGroups','allMapMarkers','allMines','allMissionObjects','allow3DMode','allowCrewInImmobile','allowCuratorLogicIgnoreAreas','allowDamage','allowDammage','allowFileOperations','allowFleeing','allowGetIn','allSites','allTurrets','allUnits','allUnitsUAV','allVariables','ammo','and','animate','animateDoor','animationPhase','animationState','append','armoryPoints','asin','ASLToATL','assert','assignAsCargo','assignAsCargoIndex','assignAsCommander','assignAsDriver','assignAsGunner','assignAsTurret','assignCurator','assignedCargo','assignedCommander','assignedDriver','assignedGunner','assignedItems','assignedTarget','assignedTeam','assignedVehicle','assignedVehicleRole','assignItem','assignTeam','assignToAirport','atan','atan2','atg','ATLToASL','attachedObject','attachedObjects','attachedTo','attachObject','attachTo','attackEnabled',
            'backpack','backpackCargo','backpackContainer','backpackItems','backpackMagazines','backpackSpaceFor','behaviour','benchmark','binocular','blufor','boundingBox','boundingBoxReal','boundingCenter','breakOut','breakTo','briefingName','buildingExit','buildingPos','buttonAction','buttonSetAction',
        ],
        parenFollows: [
            'if',
            'for',
            'while',
            'switch',
            'foreach'
        ],
        operators: [
            '=',
            '||',
            '&&',
            '==',
            '>',
            '<',
            '!=',
            '<=',
            'less',
            'less=',
            '>=',
            'greater',
            'greater=',
            '+',
            '-',
            '*',
            '/',
            '!',
            '%',
            'or',
            'plus',
            ':',
        ],
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        // escape sequences
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        // The main tokenizer for our languages
        tokenizer: {
            root: [
                [/[a-zA-Z_]\w*/, { cases: { '@keywords': { token: 'keyword.$0' }, '@default': 'identifier' } }],
                { include: '@whitespace' },
                [/}/, { cases: {
                    '$S2==interpolatedstring': { token: 'string.quote', bracket: '@close', next: '@pop' },
                    '@default': '@brackets'
                } }],
                [/[{}()\[\]]/, '@brackets'],
                [/[<>](?!@symbols)/, '@brackets'],
                [/@symbols/, { cases: { '@operators': 'delimiter', '@default': '' } }],
                [/\@"/, { token: 'string.quote', bracket: '@open', next: '@litstring' }],
                [/\$"/, { token: 'string.quote', bracket: '@open', next: '@interpolatedstring' }],
                [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                [/\d+/, 'number'],
                [/[;,.]/, 'delimiter'],
                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                [/'[^\\']'/, 'string'],
                [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                [/'/, 'string.invalid']
            ],
            comment: [
                [/[^\/*]+/, 'comment'],
                ['\\*/', 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ],
            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
            ],
            litstring: [
                [/[^"]+/, 'string'],
                [/""/, 'string.escape'],
                [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
            ],
            interpolatedstring: [
                [/[^\\"{]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/{{/, 'string.escape'],
                [/}}/, 'string.escape'],
                [/{/, { token: 'string.quote', bracket: '@open', next: 'root.interpolatedstring' }],
                [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
            ],
            whitespace: [
                [/^[ \t\v\f]*#\w.*$/, 'namespace.cpp'],
                [/[ \t\v\f\r\n]+/, ''],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
            ],
        },
    };
});
