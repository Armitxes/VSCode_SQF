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
        objMap
        objTask
        objItem
        objSide
        objCurator
        objTrigger
        objCamera
        objRope
        objFlag
    string
    bool
    scalar
    array
    function
    code

    ui:
        uiControl
        uiDisplay

    external:
        cfgClass
*/

class SqfVariableType {
    constructor(type, children=[]) {
        this.parents = [];
        this.children = children;

        switch (type) {
            case 'objUnit': { this.name = "Unit"; this.varPrototype = require('./variableTypes/objUnit').prototype; };
            case 'objVehicle': { this.name = "Vehicle"; this.varPrototype = require('./variableTypes/objVehicle').prototype; };
            case 'objGroup': { this.name = "Group"; this.varPrototype = require('./variableTypes/objGroup').prototype; };
            case 'objMagazine': { this.name = "Magazine"; this.varPrototype = require('./variableTypes/objMagazine').prototype; };
            case 'objMarker': { this.name = "Marker"; this.varPrototype = require('./variableTypes/objMarker').prototype; };
            case 'objWeapon': { this.name = "Weapon"; this.varPrototype = require('./variableTypes/objWeapon').prototype; };
            case 'object': { this.name = "Object"; this.varPrototype = require('./variableTypes/object').prototype; };
            case 'string': { this.name = "String"; this.varPrototype = require('./variableTypes/string').prototype; };
        }
    }
};

let objUnit = new SqfVariableType('objUnit');
let objVehicle = new SqfVariableType('objVehicle');
let objGroup = new SqfVariableType('objGroup');
let objMagazine = new SqfVariableType('objMagazine');
let objMarker = new SqfVariableType('objMarker');
let objWeapon = new SqfVariableType('objWeapon');
let obj = new SqfVariableType('object', [objVehicle, objGroup, objMagazine, objMarker, objWeapon]);

exports.SqfVariableTypes = {
    'object': obj,
    'objUnit': objUnit,
    'objVehicle': objVehicle,
    'objGroup': objGroup,
    'objMagazine': objMagazine,
    'objMarker': objMarker,
    'objWeapon': objWeapon
};
