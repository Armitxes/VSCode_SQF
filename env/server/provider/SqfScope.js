'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const string = require('../../shared/helper/StringHelper');
const SqfWord = require('./SqfWord').SqfWord;

class SqfScope {
	/*
	 * Scopes are considered code blocks that have to complete a specific (side)task.
	 * The file itself is considered a scope. Each scope can contain endless subscopes.
	 * Scopes are usually defined by the usage of curly brackets (i.e. if/else blocks, loops, etc.)
	 * 
	 * This is not only important for structuring purposes but also to handle with access/gc 
	 * limitations i.e. for variables which are unavailable/truncated outside their defined scope.
	 */

	constructor(file, parent=null) {
		this.sqfFile = file;
		this.sqfProject = this.sqfFile.sqfProject;
		this.connection = this.sqfProject.connection;
		this.console = this.connection.console;
		this.sqfWords = [];
		this.lines = parent == null ? 0 : parent.lines;

		// Scope chain
		this.parent = parent;
		this.childs = [];

		// Start and end of our scope
		this.charPosStart = parent == null ? 0 : parent.charPos;
		this.charPos = this.charPosStart;
		this.charPosLine = parent == null ? -1 : parent.charPosLine;
		this.charPosEnd = this.charPosStart;
		this.content = ''

		// Variables collected by GC
		this.__sqfChars = [];
		this.__currentSqfWord = null;
		this._commentMode = '';
		this._stringMode = '';

		this.forceExit = false;
		this.parse();
	}

	parse() {
		let file = this.sqfFile.fileUri.split('/')
		this.console.log("Scope " + file[file.length-1] + "-" + this.parent)
		this.content = this.sqfFile.fileContent.substring(this.charPosStart);

		for (var i = 0; i < this.content.length; i++) {
			if (this.forceExit) { break; }
			this.addChar(this.content[i]);
		}		
	}

	_isInString(char) {
		function __stringStart(char) {
			if (['\'', '"'].indexOf(char) > -1) { return true; }
			return false;
		}

		function __stringEnd(mode, char) {
			if (
				(mode == '"' && char == '"')
				|| (mode == '\'' && char == '\'')
			) { return true }
			return false
		}

		if (__stringEnd(this._stringMode, char)) { this._stringMode = ''; return true; }
		if (this._stringMode != '') { return true; }
		if (__stringStart(char)) { this._stringMode = char; return true; }
	}

	_isComment(char) {
		function __commentStart(lastChar, char) {
			if (lastChar == '/' && ['/', '*'].indexOf(char) > -1) {  return true; }
			return false;
		}

		function __commentEnd(mode, lastChar, char) {
			// We only check for ML comments. SL comments are sorted in _isNewLine
			if (mode == '/*' && lastChar == '*' && char == '/') { return true }
			return false
		}

		let lastChar = this.__sqfChars[this.__sqfChars.length-2];
		if (__commentEnd(this._commentMode, lastChar, char)) { this._commentMode = ''; return true; }
		if (this._commentMode != '') { return true; }
		if (__commentStart(lastChar, char)) { this._commentMode = lastChar+char; return true; }
		return false;
	}

	_isNewLine(char) {
		if ('\n'.indexOf(char) > -1) {
			this.lines += 1;
			this.charPosLine = -1;

			if (this._commentMode == '//') { this._commentMode = '' }
			return true;
		}
		return false;
	}

	_handledByChild() {
		return this.childs.length > 0 && this.charPos <= this.childs[this.childs.length-1].charPos;
	}

	_isSubScope(char) {
		if (char == '}') {
			this.__currentSqfWord=null;
			if (this.parent != null) {
				// This scope ended
				this.content = this.content.substring(0, this.charPos);
				this.charPosEnd = this.charPos;
				this.forceExit = true;
				return true;
			} else {
				this.sqfFile.issues.push({
                    severity: 2,
                    range: {
                        start: { line: this.lines, character: this.charPosLine },
                        end: { line: this.lines, character: this.charPosLine }
                    },
                    message: 'Unexpected end of scope.',
                    source: 'sqf'
                });
			}
		} else if (char == '{') {
			// New SubScope
			this.__currentSqfWord=null;
			let child = new SqfScope(this.sqfFile, this);
			this.childs.push(child);
			return true;
		}

		return false;
	}

	addChar(char) {
		this.__sqfChars.push(char);
		this.charPos += 1;
		this.charPosLine += 1;

		// Stuff to ignore/skip
		if (this._handledByChild()) { return; }
		if (this._isNewLine(char)) { return; }
		if (this._isInString(char)) { return; };
		if (this._isComment(char)) { return; };
	
		this.console.log(
			"-- (" + this.lines.toString() + 'x' + this.charPosLine.toString() + 
			") scope addChar: '" + char.toString() + "'"
		);

		// SubScope handling
		if (this._isSubScope(char)) { return; }

		// Word handling
		if (this.__currentSqfWord == null) {
			this.__currentSqfWord = new SqfWord(this);
			this.sqfWords.push(this.__currentSqfWord);
		}

		this.__currentSqfWord.addChar(char);
	}
}

exports.SqfScope = SqfScope;
