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
    this.statusesToIntegrate = new Array();
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

/**
* Calculate all the possible positions for this CellSet.
*/
CellSet.prototype.calculatePossiblePositions = function() {
    this.possiblePositions = this.appendPossiblePositions(this.numberOfAvailableCells, "", 0);
}

/**
* Recursive function called by CellSet.calculatePossiblePositions.
* @param remainingAvailableSpaces the spaces still available to dispatch.
* @param currentCells the cells already positionned.
* @param currentBlockIndex the index of the next block to be dispatched.
*/
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

/**
* Calculate the status of all the fields from the possible positions.
*/
CellSet.prototype.calculateCellsStatuses = function() {
    var calculatedCells = "";
    for(var i = 0; i < this.length; i++) {
        calculatedCells += this.calculateCellStatus(i);
    }
    this.cells = calculatedCells;
}


/**
* Calculate the status of a cell from the possible positions.
* @param cellId the cell id.
* @return the calculated CellType.
*/
CellSet.prototype.calculateCellStatus = function(cellId) {
    if(this.cells[cellId] != CellType.UNDECIDED) {
        return this.cells[cellId];
    } else {
        var value = this.possiblePositions[0].charAt(cellId);
        for(i = 1; i < this.possiblePositions.length; i++) {
            if(this.possiblePositions[i].charAt(cellId) != value) {
                return CellType.UNDECIDED;
            }
        }
        if(this.statusesCallback != null) {
            this.statusesCallback(this, cellId, value);
        }
    }
    return value;
}

CellSet.prototype.getCells = function() {
    return this.cells;
}

/**
* Set a callback to be called when a status is calculated.
* @param callback a function, first param will be the CellSet, second one will be the id of the cell, third the cell status.
*/
CellSet.prototype.setStatusesCallback = function(callback) {
    this.statusesCallback = callback;
}

/**
 * Set the status of a cell.
 * @param cellId the cell id.
 * @param status the status.
 */
CellSet.prototype.setStatus = function(cellId, status) {
    this.statusesToIntegrate.push(new Array(cellId, status));
}

/**
 * Integrate the statuses set by calling CellSet.setStatus
 */
CellSet.prototype.integrateNewStatuses = function(){

}

/**
* Append a value to a string several times.
* @param valueToAppend the value to append.
* @param times the number of times to append the value.
* @returnt the new String.
*/
String.prototype.appendXTimes = function(valueToAppend, times) {
    var result = this;
    for (var i = 0; i < times; i ++) {
        result += valueToAppend;
    }
    return result;
}

