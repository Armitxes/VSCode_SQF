# -*- coding: utf-8 -*-
# Written by Armitxes (Jan Brodersen)
# All rights reserved. For more information visit https://armitxes.net

import json
import os 
from pyquery import PyQuery as pq
import requests

versionCommands = {
	'OFP': ['abs', 'accTime', 'acos', 'action', 'addMagazine', 'addMagazineCargo', 'addRating', 'addScore', 'addWeapon', 'addWeaponCargo', 'alive', 'allowDammage', 'allowFleeing', 'allowGetIn', 'ammo', 'and', 'asin', 'assignAsCargo', 'assignAsCommander', 'assignAsDriver', 'assignAsGunner', 'atan', 'atan2', 'atg', 'behaviour', 'benchmark', 'buildingPos', 'cadetMode', 'camCommand', 'camCommit', 'camCommitted', 'camCreate', 'camDestroy', 'cameraEffect', 'camSetBank', 'camSetDir', 'camSetDive', 'camSetFov', 'camSetFovRange', 'camSetPos', 'camSetRelPos', 'camSetTarget', 'canFire', 'canMove', 'canStand', 'captive', 'clearMagazineCargo', 'clearWeaponCargo', 'combatMode', 'commander', 'commandFire', 'commandFollow', 'commandMove', 'commandStop', 'commandTarget', 'commandWatch', 'cos', 'count', 'countEnemy', 'countFriendly', 'countSide', 'countType', 'countUnknown', 'crew', 'cutObj', 'cutRsc', 'cutText', 'daytime', 'debugLog', 'deg', 'direction', 'disableAI', 'disableUserInput', 'distance', 'doFire', 'doFollow', 'doMove', 'doStop', 'doTarget', 'doWatch', 'driver', 'enableEndDialog', 'enableRadio', 'exp', 'fadeMusic', 'fadeSound', 'false', 'fire', 'flag', 'flagOwner', 'fleeing', 'flyInHeight', 'forceEnd', 'format', 'formation', 'formLeader', 'fuel', 'getDammage', 'getDir', 'getMarkerPos', 'getPos', 'globalChat', 'globalRadio', 'goto', 'group', 'groupChat', 'groupRadio', 'gunner', 'handsHit', 'hasWeapon', 'hint', 'hintC', 'hintCadet', 'in', 'inflame', 'isNull', 'knowsAbout', 'land', 'leader', 'list', 'ln', 'local', 'localize', 'lock', 'locked', 'lockWP', 'log', 'mod', 'move', 'moveInCargo', 'moveInCommander', 'moveInDriver', 'moveInGunner', 'musicVolume', 'name', 'nearestBuilding', 'nearestObject', 'objStatus', 'or', 'orderGetIn', 'pi', 'playMove', 'playMusic', 'playSound', 'plus', 'rad', 'random', 'rating', 'removeAllWeapons', 'removeMagazine', 'removeMagazines', 'removeWeapon', 'reveal', 'saveGame', 'saveVar', 'score', 'setAccTime', 'setAmmoCargo', 'setBehaviour', 'setCaptive', 'setCombatMode', 'setDammage', 'setDir', 'setFace', 'setFaceAnimation', 'setFlagOwner', 'setFlagSide', 'setFlagTexture', 'setFog', 'setFormation', 'setFormDir', 'setFuel', 'setFuelCargo', 'setGroupId', 'setIdentity', 'setMarkerPos', 'setMarkerType', 'setMimic', 'setOvercast', 'setPos', 'setRadioMsg', 'setRepairCargo', 'setSpeedMode', 'setUnitPos', 'setViewDistance', 'showCinemaBorder', 'showCompass', 'showGPS', 'showMap', 'shownCompass', 'shownGPS', 'shownMap', 'shownPad', 'shownRadio', 'shownWarrant', 'shownWatch', 'showPad', 'showRadio', 'showWarrant', 'showWatch', 'side', 'sideRadio', 'sin', 'skipTime', 'someAmmo', 'soundVolume', 'speed', 'speedMode', 'sqrt', 'stop', 'stopped', 'switchCamera', 'switchLight', 'switchMove', 'tan', 'textLog', 'tg', 'time', 'titleCut', 'titleObj', 'titleRsc', 'titleText', 'true', 'unassignVehicle', 'unitReady', 'units', 'vehicle', 'vehicleRadio', 'addMagazinePool', 'addWeaponPool', 'animate', 'animationPhase', 'cheatsEnabled', 'clearMagazinePool', 'clearWeaponPool', 'deleteIdentity', 'deleteStatus', 'fillWeaponsFromPool', 'loadIdentity', 'loadStatus', 'magazines', 'object', 'onBriefingGear', 'onBriefingGroup', 'onBriefingNotes', 'onBriefingPlan', 'pickWeaponPool', 'primaryWeapon', 'putWeaponPool', 'queryMagazinePool', 'queryWeaponPool', 'resize', 'saveIdentity', 'saveStatus', 'say', 'secondaryWeapon', 'setObjectTexture', 'setRain', 'setSkill', 'setTerrainGrid', 'skill', 'weapons', 'inflamed', 'lightIsOn', 'addAction', 'removeAction', 'getMarkerColor', 'getMarkerSize', 'getMarkerType', 'getWPPos', 'requiredVersion', 'setMarkerColor', 'setMarkerSize', 'setWPPos', 'forceMap', 'mapAnimAdd', 'mapAnimClear', 'mapAnimCommit', 'mapAnimDone', 'selectWeapon', 'scudState', 'createUnit', 'createVehicle', 'deleteVehicle', 'estimatedTimeLeft', 'join', 'publicVariable', 'sideChat', 'vehicleChat', 'buttonAction', 'buttonSetAction', 'closeDialog', 'createDialog', 'ctrlEnable', 'ctrlEnabled', 'ctrlSetText', 'ctrlShow', 'ctrlText', 'ctrlVisible', 'damage', 'drop', 'lbAdd', 'lbClear', 'lbColor', 'lbCurSel', 'lbData', 'lbDelete', 'lbPicture', 'lbSetColor', 'lbSetCurSel', 'lbSetData', 'lbSetPicture', 'lbSetValue', 'lbSize', 'lbText', 'lbValue', 'markerColor', 'markerPos', 'markerSize', 'markerType', 'position', 'setDamage', 'waypointPosition', 'getWorld', 'dialog', 'enemy', 'friendly', 'sideEnemy', 'sideFriendly', 'missionName', 'missionStart', 'playersNumber', 'setVelocity', 'velocity', 'addEventHandler', 'comment', 'onMapSingleClick', 'preprocessFile', 'removeAllEventHandlers', 'removeEventHandler', 'sliderPosition', 'sliderRange', 'sliderSetPosition', 'sliderSetRange', 'sliderSetSpeed', 'sliderSpeed', 'engineOn', 'isEngineOn', 'loadFile', 'sideLogic', 'typeOf'],
}

json_obj = {}

for versionCommand in versionCommands:
	json_obj[versionCommand] = {}

	for command in versionCommands[versionCommand]:
		uri = 'https://community.bistudio.com/wiki?title={cmd}&printable=yes'.format(
			cmd=command
		)
		sc = requests.get(uri).text
		pq_sc = pq(sc)
		pq_sc_cmd = pq_sc('div._description.cmd')

		json_obj[versionCommand][command] = {
			'description': pq_sc_cmd('dt:contains("Description:")').next().text().strip(),
			'example': pq_sc_cmd('dd.example code').text().strip(),
			'syntax': pq_sc_cmd('dt:contains("Syntax:")').next().text().strip(),
			'local': bool(pq_sc_cmd('a[href="/wiki/Category:Commands_utilizing_local_arguments"]')),
			'broadcasted': bool(pq_sc_cmd('a[href="/wiki/Category:Commands_with_global_effects"]')),
			'server': bool(pq_sc_cmd('a[href="/wiki/Category:Commands_utilizing_global_arguments"]')),
		}

		break
	break

path = os.path.dirname(os.path.realpath(__file__)) + '/output/sqfCmd.json'
with open(path, 'w') as jsonFile:
	json.dump(json_obj, jsonFile)

