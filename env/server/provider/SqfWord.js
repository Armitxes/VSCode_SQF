'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const string = require('../../shared/helper/StringHelper');

class SqfWord {
	constructor(SqfScope) {
		this.scope = SqfScope;

		this.charPosStart = this.scope.charPos;
		this.charPosEnd = this.charPosStart;

		this.isAlpha = true;
		this.isAlphaNumeric = true;
		this.isNumeric = true;
		this.isSpecial = false;

		this.word = '';
	}

	_isEmtpyChar(char) {
		if (string.isEmptyCharacter(char)){
			this.finishWord();
			return true;
		}
		return false;
	}

	_isSemicolon(char) {
		if (char == ';') {
			this.finishWord();
			return true;
		}
		return false;
	}

	finishWord() {
		this.scope.console.log('End word: "' + this.word + '"');
		this.charPosEnd = this.scope.charPos;
		this.scope.__currentSqfWord=null;
	}
	
	addChar(char) {
		// Word finishers
		if (this._isSemicolon(char)) { return; };
		if (this._isEmtpyChar(char)) { return; };


		this.word += char;
		let isAlphaNum = string.isCharAlphaNumeric(char);
		if(!isAlphaNum) {
			this.isAlpha = false;
			this.isAlphaNumeric = false;
			this.isNumeric = false;
			this.isSpecial = false;
		}

		let isAlpha = string.isCharAlpha(char);
		let isNum = string.isCharNumeric(char);
		if (this.isAlpha && isNum) { this.isAlpha = false; }
		if (this.isNumeric && isAlpha) { this.isNumeric = false; }
		if (!string.isCharAlphaNumeric(char)) {
			this.isSpecial = true;
		}
	}
}

exports.SqfWord = SqfWord;