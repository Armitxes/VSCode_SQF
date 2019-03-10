'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

exports.prototype = {
    typeOf: "object",
    typeName: "CONFIG",
    objName: { value: "", typeOf: "string", typeName: "STRING" },
    position: { value: [0,0,0], typeOf: "object", typeName: "ARRAY" },
    size: { value: [100,200], typeOf: "object", typeName: "ARRAY" },
    shape: {
        value: "RECTANGLE",
        typeOf: "string", typeName: "STRING",
        valid: ["ICON", "RECTANGLE", "ELLIPSE", "POLYLINE"]
    },
    color: {
        value: "Default",
        typeOf: "string", typeName: "STRING",
        valid: [
            "Default", "ColorBlack", "ColorGrey", "ColorRed", "ColorBrown",
            "ColorOrange", "ColorYellow", "ColorKhaki", "ColorGreen", "ColorBlue",
            "ColorPink", "ColorWhite", "ColorWEST", "ColorEAST", "ColorGUER",
            "ColorCIV", "ColorUNKNOWN", "colorBLUFOR", "colorOPFOR", "colorIndependent",
            "colorCivilian", "Color1_FD_F", "Color2_FD_F", "Color3_FD_F", "Color4_FD_F",
            "Color5_FD_F"
        ]
    },
    brush: {
        value: "Solid",
        typeOf: "string", typeName: "STRING",
        valid: [
            "Solid", "SolidFull", "Horizontal", "Vertical", "Grid", "FDiagonal",
            "BDiagonal", "DiagGrid", "Cross", "Border", "SolidBorder"
        ]
    },
}
