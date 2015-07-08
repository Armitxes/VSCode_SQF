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
            'cadetMode','call','callExtension','camCommand','camCommit','camCommitPrepared','camCommitted','camConstuctionSetParams','camCreate','camDestroy','cameraEffect','cameraEffectEnableHUD','cameraInterest','cameraOn','cameraView','campaignConfigFile','camPreload','camPreloaded','camPrepareBank','camPrepareDir','camPrepareDive','camPrepareFocus','camPrepareFov','camPrepareFovRange','camPreparePos','camPrepareRelPos','camPrepareTarget','camSetBank','camSetDir','camSetDive','camSetFocus','camSetFov','camSetFovRange','camSetPos','camSetRelPos','camSetTarget','camTarget','camUseNVG','canAdd','canAddItemToBackpack','canAddItemToUniform','canAddItemToVest','cancelSimpleTaskDestination','canFire','canMove','canSlingLoad','canStand','canUnloadInCombat','captive','captiveNum','case','catch','cbChecked','cbSetChecked','ceil','cheatsEnabled','checkAIFeature','civilian','className','clearAllItemsFromBackpack','clearBackpackCargo','clearBackpackCargoGlobal','clearGroupIcons','clearItemCargo','clearItemCargoGlobal','clearItemPool','clearMagazineCargo','clearMagazineCargoGlobal','clearMagazinePool','clearOverlay','clearRadio','clearWeaponCargo','clearWeaponCargoGlobal','clearWeaponPool','closeDialog','closeDisplay','closeOverlay','collapseObjectTree','combatMode','commandArtilleryFire','commandChat','commander','commandFire','commandFollow','commandFSM','commandGetOut','commandingMenu','commandMove','commandRadio','commandStop','commandTarget','commandWatch','comment','commitOverlay','compile','compileFinal','completedFSM','composeText','configClasses','configFile','configName','configProperties','configSourceMod','configSourceModList','connectTerminalToUAV','controlNull','controlsGroupCtrl','copyFromClipboard','copyToClipboard','copyWaypoints','cos','count','countEnemy','countFriendly','countSide','countType','countUnknown','createAgent','createCenter','createDialog','createDiaryLink','createDiaryRecord','createDiarySubject','createDisplay','createGearDialog','createGroup','createGuardedPoint','createLocation','createMarker','createMarkerLocal','createMenu','createMine','createMissionDisplay','createSimpleTask','createSite','createSoundSource','createTask','createTeam','createTrigger','createUnit','createUnit','array','createVehicle','createVehicle','array','createVehicleCrew','createVehicleLocal','crew','ctrlActivate','ctrlAddEventHandler','ctrlAutoScrollDelay','ctrlAutoScrollRewind','ctrlAutoScrollSpeed','ctrlChecked','ctrlClassName','ctrlCommit','ctrlCommitted','ctrlCreate','ctrlDelete','ctrlEnable','ctrlEnabled','ctrlFade','ctrlHTMLLoaded','ctrlIDC','ctrlIDD','ctrlMapAnimAdd','ctrlMapAnimClear','ctrlMapAnimCommit','ctrlMapAnimDone','ctrlMapCursor','ctrlMapMouseOver','ctrlMapScale','ctrlMapScreenToWorld','ctrlMapWorldToScreen','ctrlModel','ctrlModelDirAndUp','ctrlModelScale','ctrlParent','ctrlPosition','ctrlRemoveAllEventHandlers','ctrlRemoveEventHandler','ctrlScale','ctrlSetActiveColor','ctrlSetAutoScrollDelay','ctrlSetAutoScrollRewind','ctrlSetAutoScrollSpeed','ctrlSetBackgroundColor','ctrlSetChecked','ctrlSetEventHandler','ctrlSetFade','ctrlSetFocus','ctrlSetFont','ctrlSetFontH1','ctrlSetFontH1B','ctrlSetFontH2','ctrlSetFontH2B','ctrlSetFontH3','ctrlSetFontH3B','ctrlSetFontH4','ctrlSetFontH4B','ctrlSetFontH5','ctrlSetFontH5B','ctrlSetFontH6','ctrlSetFontH6B','ctrlSetFontHeight','ctrlSetFontHeightH1','ctrlSetFontHeightH2','ctrlSetFontHeightH3','ctrlSetFontHeightH4','ctrlSetFontHeightH5','ctrlSetFontHeightH6','ctrlSetFontP','ctrlSetFontPB','ctrlSetForegroundColor','ctrlSetModel','ctrlSetModelDirAndUp','ctrlSetModelScale','ctrlSetPosition','ctrlSetScale','ctrlSetStructuredText','ctrlSetText','ctrlSetTextColor','ctrlSetTooltip','ctrlSetTooltipColorBox','ctrlSetTooltipColorShade','ctrlSetTooltipColorText','ctrlShow','ctrlShown','ctrlText','ctrlTextHeight','ctrlType','ctrlVisible','curatorAddons','curatorCamera','curatorCameraArea','curatorCameraAreaCeiling','curatorCoef','curatorEditableObjects','curatorEditingArea','curatorEditingAreaType','curatorMouseOver','curatorPoints','curatorRegisteredObjects','curatorSelected','curatorWaypointCost','currentCommand','currentMagazine','currentMagazineDetail','currentMagazineDetailTurret','currentMagazineTurret','currentMuzzle','currentTask','currentTasks','currentVisionMode','currentWaypoint','currentWeapon','currentWeaponMode','currentWeaponTurret','currentZeroing','cursorTarget','customChat','customRadio','cutFadeOut','cutObj','cutRsc','cutText',
            'damage','date','dateToNumber','daytime','deActivateKey','debriefingText','debugFSM','debugLog','default','deg','deleteAt','deleteCenter','deleteCollection','deleteEditorObject','deleteGroup','deleteIdentity','deleteLocation','deleteMarker','deleteMarkerLocal','deleteRange','deleteResources','deleteSite','deleteStatus','deleteTeam','deleteVehicle','deleteVehicleCrew','deleteWaypoint','detach','detectedMines','diag','activeSQFScripts','diag','captureFrame','diag','captureSlowFrame','diag','fps','diag','fpsmin','diag','frameno','diag','log','diag','logSlowFrame','diag','tickTime','dialog','diarySubjectExists','difficulty','difficultyEnabled','difficultyEnabledRTD','direction','directSay','disableAI','disableCollisionWith','disableConversation','disableDebriefingStats','disableSerialization','disableTIEquipment','disableUAVConnectability','disableUserInput','displayAddEventHandler','displayCtrl','displayNull','displayRemoveAllEventHandlers','displayRemoveEventHandler','displaySetEventHandler','dissolveTeam','distance','distanceSqr','distributionRegion','do','doArtilleryFire','doFire','doFollow','doFSM','doGetOut','doMove','doorPhase','doStop','doTarget','doWatch','drawArrow','drawEllipse','drawIcon','drawIcon3D','drawLine','drawLine3D','drawLink','drawLocation','drawRectangle','driver','drop',
            'east','echo','editObject','editorSetEventHandler','effectiveCommander','else','emptyPositions','enableAI','enableAIFeature','enableAttack','enableCamShake','enableCaustics','enableCollisionWith','enableCopilot','enableDebriefingStats','enableDiagLegend','enableEndDialog','enableEngineArtillery','enableEnvironment','enableFatigue','enableGunLights','enableIRLasers','enableMimics','enablePersonTurret','enableRadio','enableReload','enableRopeAttach','enableSatNormalOnDetail','enableSaving','enableSentences','enableSimulation','enableSimulationGlobal','enableTeamSwitch','enableUAVConnectability','enableUAVWaypoints','endLoadingScreen','endMission','engineOn','enginesIsOnRTD','enginesRpmRTD','enginesTorqueRTD','entities','estimatedEndServerTime','estimatedTimeLeft','evalObjectArgument','everyBackpack','everyContainer','exec','execEditorScript','execFSM','execVM','exit','exitWith','exp','expectedDestination','eyeDirection','eyePos',
            'face','faction','fadeMusic','fadeRadio','fadeSound','fadeSpeech','failMission','false','fillWeaponsFromPool','find','findCover','findDisplay','findEditorObject','findEmptyPosition','findEmptyPositionReady','findNearestEnemy','finishMissionInit','finite','fire','fireAtTarget','firstBackpack','flag','flagOwner','fleeing','floor','flyInHeight','fog','fogForecast','fogParams','for','forceAddUniform','forceEnd','forceMap','forceRespawn','forceSpeed','forceWalk','forceWeaponFire','forceWeatherChange','forEach','forEachMember','forEachMemberAgent','forEachMemberTeam','format','formation','formationDirection','formationLeader','formationMembers','formationPosition','formationTask','formatText','formLeader','freeLook','from','fromEditor','fuel','fullCrew',
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
                [/[{}()\[\]]/, '@brackets'],
                [/[<>](?!@symbols)/, '@brackets'],
                [/@symbols/, { cases: { '@operators': 'delimiter', '@default': '' } }],
                [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                [/\d+/, 'number'],
                [/[;,.]/, 'delimiter'],

                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                [/'/, { token: 'string.quote', bracket: '@open', next: '@subString' }]
            ],
            comment: [
                [/[^\/*]+/, 'comment'],
                ['\\*/', 'comment', '@pop'],
                [/[\/*]/, 'comment']
            ],
            string: [
                [/[^\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/\"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
            ],
            subString: [
                [/[^\']+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/\'/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
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
