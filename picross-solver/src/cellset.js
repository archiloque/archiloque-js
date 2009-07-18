function CellType() {
}

CellType.EMPTY = 'E';
CellType.CHECKED = 'C';
CellType.UNDECIDED = 'U';

/**
* Create a new CellSet.
* @param type the CellType.
* @param index the index.
* @param length the length.
* @param blocks the lengthes of the blocks to be checked.
* @param cells a String representing the CellSet content (optional).
*/
function CellSet(type, index, length, blocks) {
	if(arguments.length > 4) {
		this.cells = arguments[4];
	} else {
		this.cells = "";
		for (var i = 0; i < length; i++) {
			this.cells += CellType.UNDECIDED;
		}
	}
	this.type = type;
	this.index = index;
	this.length = length;
	this.blocks = blocks;

	this.numberOfOccupiedCells = 0;
	for (var j = 0; j < blocks.length; j++) {
		this.numberOfOccupiedCells += blocks[j];
	}

	this.numberOfAvailableCells = length - this.numberOfOccupiedCells - (blocks.length - 1);
}

CellSet.TYPE_LINE = 'L';
CellSet.TYPE_COLUMN = 'C';

CellSet.prototype.toString = function () {
	var value = this.type + this.index + " : ";
	for (var i = 0; i < this.length; i++) {
		value += this.cells[i].getStatus();
	}
	return value;
}

CellSet.prototype.calculatePossiblePositions = function() {
	this.possiblePositions = this.appendPossiblePositions(this.numberOfAvailableCells, "", 0);
}

CellSet.prototype.appendPossiblePositions = function(remainingAvailableSpaces, currentCells, currentBlockIndex) {
	var result = new Array();
	for (var i = 0; i <= remainingAvailableSpaces; i++) {
		var currentString = currentCells.appendXTimes(CellType.EMPTY, i);
		currentString = currentString.appendXTimes(CellType.CHECKED, this.blocks[currentBlockIndex]);
		if (currentBlockIndex == (this.blocks.length - 1)) {
			currentString = currentString.appendXTimes(CellType.EMPTY, this.length - currentString.length);
			result.push(currentString);
		} else {
			currentString += CellType.EMPTY;
			result = result.concat(this.appendPossiblePositions(remainingAvailableSpaces - i, currentString, currentBlockIndex + 1));
		}
	}
	return result;
}

CellSet.prototype.getPossiblePositions = function() {
	return this.possiblePositions;
}

CellSet.prototype.calculateCells = function() {
	var calculatedCells = "";
	for(var i = 0; i < this.length; i++) {
		calculatedCells += this.calculateCell(i);
	}
	this.cells = calculatedCells;
}

CellSet.prototype.calculateCell = function(cellId) {
	var value = this.possiblePositions[0].charAt(cellId);
	for(i = 1; i < this.possiblePositions.length; i++) {
		if(this.possiblePositions[i].charAt(cellId) != value) {
			return CellType.UNDECIDED;
		}
	}
	return value;
}

CellSet.prototype.getCells = function() {
	return this.cells;
}

CellSet.prototype.createCell = function (cellIndex, status) {
	if (this.type == CellSet.TYPE_LINE) {
		return new Cell(this.index, cellIndex, status);
	} else {
		return new Cell(cellIndex, this.index, status);
	}
}

String.prototype.appendXTimes = function(valueToAppen, times) {
	var result = this;
	for (var i = 0; i < times; i ++) {
		result += valueToAppen;
	}
	return result;
}
