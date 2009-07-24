function CellStatus() {
}

CellStatus.EMPTY = 'E';
CellStatus.CHECKED = 'C';
CellStatus.UNDECIDED = 'U';


function PrecalculatedSegments() {
}

PrecalculatedSegments.populate = function(length) {
    PrecalculatedSegments.EMPTY = [""];
    PrecalculatedSegments.CHECKED = [""];
    for (var i = 1; i <= length; i ++) {
        PrecalculatedSegments.EMPTY[i] = PrecalculatedSegments.EMPTY[i - 1] + CellStatus.EMPTY;
        PrecalculatedSegments.CHECKED[i] = PrecalculatedSegments.CHECKED[i - 1] + CellStatus.CHECKED;
    }
}

PrecalculatedSegments.populate(10);

/**
 * Create a new CellSet.
 * @param type the CellStatus.
 * @param index the index.
 * @param length the length.
 * @param blocks the length of the blocks to be checked.
 * @param possiblePositions an Array containing the possible solutions (optional).
 * @param cells a String representing the CellSet content (optional).
 */
function CellSet(type, index, length, blocks) {
    if (arguments.length > 4) {
        this.possiblePositions = arguments[4];
    }
    if (arguments.length > 5) {
        this.cells = arguments[5];
    } else {
        this.cells = "";
        for (var i = 0; i < length; i++) {
            this.cells += CellStatus.UNDECIDED;
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

CellSet.prototype.toShortString = function () {
    return this.type + this.index;
}

CellSet.prototype.getType = function() {
    return this.type;
}

CellSet.prototype.getIndex = function() {
    return this.index;
}

/**
 * Calculate all the possible positions for this CellSet.
 */
CellSet.prototype.calculatePossiblePositions = function() {
    if (this.blocks.length == 0) {
        this.possiblePositions = new Array();
        this.possiblePositions.push(PrecalculatedSegments.EMPTY[this.length]);
    } else {
        this.possiblePositions = this.appendPossiblePositions(this.numberOfAvailableCells, "", 0);
    }
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
        var currentString = currentCells + PrecalculatedSegments.EMPTY[i] + PrecalculatedSegments.CHECKED[this.blocks[currentBlockIndex]];
        if (currentBlockIndex == (this.blocks.length - 1)) {
            currentString += PrecalculatedSegments.EMPTY[this.length - currentString.length];
            result.push(currentString);
        } else {
            currentString += CellStatus.EMPTY;
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
    for (var i = 0; i < this.length; i++) {
        calculatedCells += this.calculateCellStatus(i);
    }
    this.cells = calculatedCells;
}


/**
 * Calculate the status of a cell from the possible positions.
 * @param cellId the cell id.
 * @return the calculated CellStatus.
 */
CellSet.prototype.calculateCellStatus = function(cellId) {
    if (this.cells[cellId] != CellStatus.UNDECIDED) {
        return this.cells[cellId];
    } else {
        var value = this.possiblePositions[0].charAt(cellId);
        for (i = 1; i < this.possiblePositions.length; i++) {
            if (this.possiblePositions[i].charAt(cellId) != value) {
                return CellStatus.UNDECIDED;
            }
        }
        this.updateStatus(cellId, value);
        if (this.statusesCallbackFunction != null) {
            this.statusesCallbackFunction(this, cellId, value, this.statusesCallbackParam);
        }
    }
    return value;
}

CellSet.prototype.getCells = function() {
    return this.cells;
}

/**
 * Set a callback to be called when a status is calculated.
 * First param will be the CellSet, second one will be the id of the cell, third the cell status and fourth the callbackParam.
 * @param callbackFunction a function.
 * @param callbackParam a param to be added when the callback will be called.
 */
CellSet.prototype.setStatusesCallback = function(callbackFunction, callbackParam) {
    this.statusesCallbackFunction = callbackFunction;
    this.statusesCallbackParam = callbackParam;
}

/**
 * Set the status of a cell.
 * @param cellId the cell id.
 * @param status the status.
 * @return a boolean indicating if the status wasn't already known.
 */
CellSet.prototype.setStatus = function(cellId, status) {
    this.statusesToIntegrate.push(new Array(cellId, status));
}

/**
 * Integrate the statuses set by calling CellSet.setStatus
 */
CellSet.prototype.integrateNewStatuses = function() {
    var possiblePositions = this.possiblePositions;
    this.possiblePositions = new Array();
    for (var i = 0; i < possiblePositions.length; i++) {
        var curentPosition = possiblePositions[i];
        if (this.checkPosition(curentPosition)) {
            this.possiblePositions.push(curentPosition);
        }
    }
    for (i = 0; i < this.statusesToIntegrate.length; i++) {
        var curentStatus = this.statusesToIntegrate[i];
        this.updateStatus(curentStatus[0], curentStatus[1]);
    }
    this.statusesToIntegrate = new Array();
}


/**
 * Update the cells by updating a cell status.
 * @param cellId the cell id.
 * @param cellValue the cell sttargetCellSetatus.
 */
CellSet.prototype.updateStatus = function(cellId, cellValue) {
    var result = "";
    if (cellId > 0) {
        result = this.cells.substring(0, cellId);
    }
    result += cellValue;
    if (cellId < (this.length - 1)) {
        result += this.cells.substring(cellId + 1);
    }
    this.cells = result;
}

/**
 * Check if a position is compliant with the statusesToIntegrate.
 * @param position the position to check.
 * @return a boolean that indicate if the position is compliant
 */
CellSet.prototype.checkPosition = function(position) {
    for (var i = 0; i < this.statusesToIntegrate.length; i++) {
        var curentStatus = this.statusesToIntegrate[i];
        if (position[curentStatus[0]] != curentStatus[1]) {
            return false;
        }
    }
    return true;
}
