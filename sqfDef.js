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
            'gearSlotAmmoCount','gearSlotData','getAmmoCargo','getArray','getArtilleryAmmo','getArtilleryComputerSettings','getArtilleryETA','getAssignedCuratorLogic','getAssignedCuratorUnit','getBackpackCargo','getBleedingRemaining','getBurningValue','getCargoIndex','getCenterOfMass','getClientState','getConnectedUAV','getDammage','getDescription','getDir','getDirVisual','getDLCs','getEditorCamera','getEditorMode','getEditorObjectScope','getElevationOffset','getFatigue','getFriend','getFSMVariable','getFuelCargo','getGroupIcon','getGroupIconParams','getGroupIcons','getHideFrom','getHit','getHitPointDamage','getItemCargo','getMagazineCargo','getMarkerColor','getMarkerPos','getMarkerSize','getMarkerType','getMass','getNumber','getObjectArgument','getObjectChildren','getObjectDLC','getObjectMaterials','getObjectProxy','getObjectTextures','getOxygenRemaining','getPersonUsedDLCs','getPlayerUID','getPos','getPosASL','getPosASLVisual','getPosASLW','getPosATL','getPosATLVisual','getPosVisual','getPosWorld','getRepairCargo','getResolution','getShadowDistance','getSlingLoad','getSpeed','getSuppression','getTerrainHeightASL','getText','getVariable','getWeaponCargo','getWPPos','glanceAt','globalChat','globalRadio','goggles','goto','group','groupChat','groupFromNetId','groupIconSelectable','groupIconsVisible','groupId','groupOwner','groupRadio','groupSelectedUnits','groupSelectUnit','grpNull','gunner','gusts',
            'halt','handgunItems','handgunMagazine','handgunWeapon','handsHit','hasInterface','hasWeapon','hcAllGroups','hcGroupParams','hcLeader','hcRemoveAllGroups','hcRemoveGroup','hcSelected','hcSelectGroup','hcSetGroup','hcShowBar','hcShownBar','headgear','hideBody','hideObject','hideObjectGlobal','hint','hintC','hintCadet','hintSilent','hmd','hostMission','htmlLoad','HUDMovementLevels','humidity',
            'if','image','importAllGroups','importance','in','incapacitatedState','independent','inflame','inflamed','inGameUISetEventHandler','inheritsFrom','initAmbientLife','inputAction','inRangeOfArtillery','insertEditorObject','intersect','isAbleToBreathe','isAgent','isArray','isAutoHoverOn','isAutonomous','isAutotest','isBleeding','isBurning','isClass','isCollisionLightOn','isCopilotEnabled','isDedicated','isDLCAvailable','isEngineOn','isEqualTo','isFlashlightOn','isFlatEmpty','isForcedWalk','isFormationLeader','isHidden','isInRemainsCollector','isInstructorFigureEnabled','isIRLaserOn','isKeyActive','isKindOf','isLightOn','isLocalized','isManualFire','isMarkedForCollection','isMultiplayer','isNil','isNull','isNumber','isObjectRTD','isOnRoad','isPipEnabled','isPlayer','isRealTime','isServer','isShowing3DIcons','isSteamMission','isStreamFriendlyUIEnabled','isText','isTouchingGround','isTutHintsEnabled','isUAVConnectable','isUAVConnected','isUniformAllowed','isWalking','isWeaponDeployed','isWeaponRested','itemCargo','items','itemsWithMagazines',
            'join','joinAs','joinAsSilent','joinSilent',
            'kbAddDatabase','kbAddDatabaseTargets','kbAddTopic','kbHasTopic','kbReact','kbRemoveTopic','kbTell','kbWasSaid','keyImage','keyName','knowsAbout',
            'land','landAt','landResult','language','laserTarget','lbAdd','lbClear','lbColor','lbCurSel','lbData','lbDelete','lbIsSelected','lbPicture','lbSelection','lbSetColor','lbSetCurSel','lbSetData','lbSetPicture','lbSetPictureColor','lbSetPictureColorDisabled','lbSetPictureColorSelected','lbSetSelected','lbSetTooltip','lbSetValue','lbSize','lbSort','lbSortByValue','lbText','lbValue','leader','leaderboardDeInit','leaderboardGetRows','leaderboardInit','leaveVehicle','libraryCredits','libraryDisclaimers','lifeState','lightAttachObject','lightDetachObject','lightIsOn','lightnings','limitSpeed','linearConversion','lineBreak','lineIntersects','lineIntersectsObjs','lineIntersectsWith','linkItem','list','listObjects','ln','lnbAddArray','lnbAddColumn','lnbAddRow','lnbClear','lnbColor','lnbCurSelRow','lnbData','lnbDeleteColumn','lnbDeleteRow','lnbGetColumnsPosition','lnbPicture','lnbSetColor','lnbSetColumnsPos','lnbSetCurSelRow','lnbSetData','lnbSetPicture','lnbSetText','lnbSetValue','lnbSize','lnbText','lnbValue','load','loadAbs','loadBackpack','loadFile','loadGame','loadIdentity','loadMagazine','loadOverlay','loadStatus','loadUniform','loadVest','local','localize','locationNull','locationPosition','lock','lockCameraTo','lockCargo','lockDriver','locked','lockedCargo','lockedDriver','lockedTurret','lockTurret','lockWP','log','logEntities','lookAt','lookAtPos',
            'magazineCargo','magazines','magazinesAmmo','magazinesAmmoCargo','magazinesAmmoFull','magazinesDetail','magazinesDetailBackpack','magazinesDetailUniform','magazinesDetailVest','magazinesTurret','magazineTurretAmmo','mapAnimAdd','mapAnimClear','mapAnimCommit','mapAnimDone','mapCenterOnCamera','mapGridPosition','markAsFinishedOnSteam','markerAlpha','markerBrush','markerColor','markerDir','markerPos','markerShape','markerSize','markerText','markerType','max','members','min','mineActive','mineDetectedBy','missionConfigFile','missionName','missionNamespace','missionStart','mod','modelToWorld','modelToWorldVisual','moonIntensity','morale','move','moveInAny','moveInCargo','moveInCommander','moveInDriver','moveInGunner','moveInTurret','moveObjectToEnd','moveOut','moveTime','moveTo','moveToCompleted','moveToFailed','musicVolume',
            'name','nameSound','nearEntities','nearestBuilding','nearestLocation','nearestLocations','nearestLocationWithDubbing','nearestObject','nearestObjects','nearObjects','nearObjectsReady','nearRoads','nearSupplies','nearTargets','needReload','netId','netObjNull','newOverlay','nextMenuItemIndex','nextWeatherChange','nil','nMenuItems','not','numberToDate',
            'objectCurators','objectFromNetId','objNull','objStatus','onBriefingGroup','onBriefingNotes','onBriefingPlan','onBriefingTeamSwitch','onCommandModeChanged','onDoubleClick','onEachFrame','onGroupIconClick','onGroupIconOverEnter','onGroupIconOverLeave','onHCGroupSelectionChanged','onMapSingleClick','onPlayerConnected','onPlayerDisconnected','onPreloadFinished','onPreloadStarted','onShowNewObject','onTeamSwitch','openCuratorInterface','openMap','openYoutubeVideo','opfor','or','orderGetIn','overcast','overcastForecast','owner',
            'parseNumber','parseText','parsingNamespace','particlesQuality','pi','pickWeaponPool','pitch','playableSlotsNumber','playableUnits','playAction','playActionNow','player','playerRespawnTime','playerSide','playersNumber','playGesture','playMission','playMove','playMoveNow','playMusic','playScriptedMission','playSound','playSound3D','position','positionCameraToWorld','posScreenToWorld','posWorldToScreen','ppEffectAdjust','ppEffectCommit','ppEffectCommitted','ppEffectCreate','ppEffectDestroy','ppEffectEnable','ppEffectForceInNVG','precision','preloadCamera','preloadObject','preloadSound','preloadTitleObj','preloadTitleRsc','preprocessFile','preprocessFileLineNumbers','primaryWeapon','primaryWeaponItems','primaryWeaponMagazine','priority','private','processDiaryLink','productVersion','profileName','profileNamespace','progressLoadingScreen','progressPosition','progressSetPosition','publicVariable','publicVariableClient','publicVariableServer','pushBack','putWeaponPool',
        ],
        parenFollows: [
            'if','for',
            'while','switch',
            'foreach'
        ],
        operators: [
            '=','||','&&','==','>','<',
            '!=','<=','less','less=','>=',
            'greater','greater=',
            '+','-','*','/','!','%','or','plus',':',
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
