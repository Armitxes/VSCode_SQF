'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

/*
any:
    object:
        objUnit
        objVehicle
        objGroup
        objMarker
        objWeapon
        objMagazine
    string
    bool
    scalar
    array
    function
    code
*/

class SqfVariableType {
    constructor(type) {
        switch (type) {
            case 'objUnit': { this.name = "Unit"; this.varPrototype = require('./variableTypes/objUnit').prototype; };
            case 'objVehicle': { this.name = "Vehicle"; this.varPrototype = require('./variableTypes/objVehicle').prototype; };
            case 'objGroup': { this.name = "Group"; this.varPrototype = require('./variableTypes/objGroup').prototype; };
            case 'objMagazine': { this.name = "Magazine"; this.varPrototype = require('./variableTypes/objMagazine').prototype; };
            case 'objMarker': { this.name = "Marker"; this.varPrototype = require('./variableTypes/objMarker').prototype; };
            case 'objWeapon': { this.name = "Weapon"; this.varPrototype = require('./variableTypes/objWeapon').prototype; };
        }
    }
};

let objUnit = new SqfVariableType('objUnit');
let objVehicle = new SqfVariableType('objVehicle');
let objGroup = new SqfVariableType('objGroup');
let objMagazine = new SqfVariableType('objMagazine');
let objMarker = new SqfVariableType('objMarker');
let objWeapon = new SqfVariableType('objWeapon');

exports.SqfVariableTypes = {
    'objUnit': objUnit,
    'objVehicle': objVehicle,
    'objGroup': objGroup,
    'objMagazine': objMagazine,
    'objMarker': objMarker,
    'objWeapon': objWeapon
};
