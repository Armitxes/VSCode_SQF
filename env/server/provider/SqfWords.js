'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const string = require('../../shared/helper/StringHelper');


class SqfWords {
	constructor() {
		this.lines = 1;
		this.charPos = 0;
		this.sqfWords = [];
		this.sqfWordNew = true;

		// Variables collected by GC
		this.__sqfChars = [];
		this.__varHolder = null;
		this._commentMode = '';
		this._stringMode = false;
	}
	
	__commentStart(char) {
		let lastChar = this.__sqfChars[this.__sqfChars.length-1];
		if (lastChar == '/' && char in ['/', '*']) { return true; }
		return false;
	}

	__commentEnd(char) {
		let lastChar = this.__sqfChars[this.__sqfChars.length-1];
		if (
			(this._commentMode == '/*' && lastChar == '*' && char == '/')
			|| (this._commentMode == '//' && lastChar in ['\n', '\r'])
		) { return true }
		return false
	}

	_isComment(char) {
		if (this.__commentStart(char)) { this._commentMode = lastChar+char; return true; }
		if (this.__commentEnd(char)) { this._commentMode = ''; return true; }
		if (this._commentMode != '') { return true; }
		return false;
	}

	addLine() { this.lines += 1; this.charPos = 0; }
	addChar(char) {
		this.__sqfChars.push(char);
		this.charPos += 1;

		if (this._isComment(char)) { continue; }
		if (string.isEmptyCharacter(char)) { continue; }

		if (this.sqfWordNew) {
			// Last word or char has ended. Requesting new word.
			let word = new SqfWord(this.lines, this.charPos);
			this.sqfWords.push(word);
			this.sqfWordNew = false;
		}

		let currentWord = this.sqfWords[this.sqfWords.length-1];
		if (currentWord.isSpecial) {
			// Any special character
			this.sqfWordNew = true;
		}
	}
}

class SqfWord {
	constructor(line, charStart) {
		this.line = line;
		this.charStart = charStart-1;
		this.charEnd = this.charStart;

		this.isAlpha = true;
		this.isAlphaNumeric = true;
		this.isNumeric = true;
		this.isSpecial = false;

		this.word = '';
		this.assignment = '';
	}

	addChar(char) {
		// return: Continue word?
		this.word += char;
		let isAlphaNum = string.isCharAlphaNumeric(char);
		if(!isAlphaNum) {
			this.isAlpha = false;
			this.isAlphaNumeric = false;
			this.isNumeric = false;
			this.isSpecial = true;
		}

		let isAlpha = string.isCharAlpha(char);
		let isNum = string.isCharNumeric(char);
		if (this.isAlpha && isNum) { this.isAlpha = false; }
		if (this.isNumeric && isAlpha) { this.isNumeric = false; }
	}
}
