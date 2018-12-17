'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

exports.OFPCommands = {
	abs: {
		description: 'Absolute value of a real number',
		syntax: '<variable> = abs <rationalNumber>;',
		example: '_n = abs -3;  // returns 3',
		local: true, broadcasted: false, server: false
	},
	accTime: {
		description: 'Returns the current time acceleration factor',
		syntax: '<variable> = accTime;',
		example: '_acc = accTime;  // i.e. returns 0.1',
		local: false, broadcasted: false, server: false			
	},
	acos: {
		description: 'ArcCosine of a number, result in Degrees. Valid value range: 0-1',
		syntax: 'acos <decimalValue>;',
		example: '_degrees = acos 0.5;  // returns 60',
		local: false, broadcasted: false, server: false			
	},
	action: {
		description: 'Make a unit to perform an action. (List of Actions in Wiki)',
		syntax: '<unitObject> action [<actionName>, <affectedObject>];',
		example: 'player action ["SitDown", player];',
		local: true, broadcasted: true, server: false			
	},
	addMagazine: {
		description: 'Add a magazine to a person. Once all magazine slots are filled, further added magazines are ignored.',
		syntax: '<unitObject> addMagazineCargo <magazineName>;',
		example: 'player addMagazine "30Rnd_556x45_STANAG";',
		local: true, broadcasted: true, server: false
	},
	addMagazineCargo: {
		description: 'Add magazines to the cargo space of vehicles. Once cargo space is full, further added magazines are ignored.',
		syntax: '<vehicleObject> addMagazineCargo [<magazineName>, <amount>];',
		example: '_truck addMagazineCargo ["M16", 5];',
		local: false, broadcasted: false, server: false
	},
	addRating: {
		description: 'Add a number to the rating of a unit - negative values reduce the rating.',
		syntax: '<unitObject> addRating <amount>;',
		example: 'player addRating 2000;',
		local: true, broadcasted: true, server: false			
	},
	addScore: {
		description: 'Add a number to the score of a unit - negative values reduce the score. Score is shown in MP.',
		syntax: '<unitObject> addScore <amount>;',
		example: 'player addScore 10;',
		local: false, broadcasted: true, server: true			
	},
	addWeapon: {
		description: 'Add a weapon to a unit or vehicle.',
		syntax: '<object> addWeapon <weaponName>;',
		example: 'player addWeapon "BAF_L85A2_RIS_SUSAT";',
		local: true, broadcasted: true, server: false			
	},
	addWeaponCargo: {
		description: 'Add weapons to the cargo space of vehicles until it\'s full.',
		syntax: '<vehicleObject> addWeaponCargo [<weaponName>, <amount>];',
		example: '_truck addWeaponCargo ["M16", 5];',
		local: false, broadcasted: false, server: false			
	},
	alive: {
		description: 'Check if given vehicle/person/building is dead or destroyed.',
		syntax: 'alive <object>;',
		example: 'if (!alive player) exitWith {};',
		local: false, broadcasted: false, server: false			
	},
}
