'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

exports.isCharAlphaNumeric = (char) => {
	if (!(char > 47 && char < 58) && // numeric (0-9)
		!(char > 64 && char < 91) && // upper alpha (A-Z)
		!(char > 96 && char < 123)) { // lower alpha (a-z)
			return false;
		}
	return true
}

exports.isCharNumeric = (char) => {
	if (!(char > 47 && char < 58)) { return false; } // numeric (0-9)
	return true
}

exports.isCharAlpha = (char) => {
	if (!(char > 64 && char < 91) && // upper alpha (A-Z)
		!(char > 96 && char < 123)) { // lower alpha (a-z)) { return false; } // numeric (0-9)
			return false;
		}
	return true
}

exports.isEmptyCharacter = (char) => {
	if (' \t\n\r\v'.indexOf(char) > -1) { return true; }
	return false;
}