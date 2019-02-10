'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const string = require('../../shared/helper/StringHelper');

class SqfScope {
	constructor(file, parent=null) {
		this.sqfFile = file;
		this.sqfProject = this.sqfFile.sqfProject;
		this.connection = this.sqfProject.connection;
		this.console = this.connection.console;
		this.parent = parent
		this.lines = 1;
		this.charPos = 0;
		this.sqfWords = [];
		this.sqfWordNew = true;

		// Variables collected by GC
		this.__sqfChars = [];
		this.__word = null;
		this._commentMode = '';
		this._stringMode = '';
	}

	__stringStart(char) {
		if (['\'', '"'].indexOf(char) > -1) { return true; }
		return false;
	}

	__stringEnd(char) {
		if (
			(this._stringMode == '"' && char == '"')
			|| (this._stringMode == '\'' && char == '\'')
		) { return true }
		return false
	}

	__commentStart(lastChar, char) {
		if (lastChar == '/' && ['/', '*'].indexOf(char) > -1) {  return true; }
		return false;
	}

	__commentEnd(lastChar, char) {
		// We only check for ML comments. SL comments are sorted in _isNewLine
		if (this._commentMode == '/*' && lastChar == '*' && char == '/') { return true }
		return false
	}

	_isComment(char) {
		let lastChar = this.__sqfChars[this.__sqfChars.length-2];
		if (this.__commentEnd(lastChar, char)) { this._commentMode = ''; return true; }
		if (this._commentMode != '') { return true; }
		if (this.__commentStart(lastChar, char)) { this._commentMode = lastChar+char; return true; }
		return false;
	}

	_isNewLine(char) {
		if (['\n', '\r'].indexOf(char) > -1) {
			this.lines += 1;
			this.charPos = 0;

			if (this._commentMode == '//') { this._commentMode = '' }
			return true;
		}
		return false;
	}

	addChar(char) {
		this.console.log("-- scope addChar: '" + char.toString() + "'");
		this.__sqfChars.push(char);
		this.charPos += 1;

		if (this._isNewLine(char)) { return; }
		if (this._isComment(char)) { this.console.log('  -- is comment'); return; };
		if (string.isEmptyCharacter(char)) { this.console.log('  -- is empty char'); return; };
		if (this.sqfWords.length > 0) { this.__word = this.sqfWords[this.sqfWords.length-1]; }

		if (!string.isCharAlphaNumeric(char) && char != '_') {
			if (char == '=') { this.subScope(); }
		}

		if (this.sqfWordNew) {
			// Last word or char has ended. Requesting new word.
			let word = new SqfWord(this.lines, this.charPos);
			this.sqfWords.push(word);
			this.sqfWordNew = false;
		}
	}
	subScope() { new SqfScope(this); }
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
exports.SqfScope = SqfScope;