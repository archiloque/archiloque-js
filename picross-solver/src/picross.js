/**
 * Create a new Picross.
 * @param horizontalBlocks an array containing array defining horizontal blocks.
 * @param verticalBlocks an array containing array defining vertical blocks.
 * @param log an objetc to log to (optional).
 * @param statusesCallBack a method to be called when an item is calculated (optional).
 */
function Picross(horizontalBlocks, verticalBlocks) {
    this.log = null;
    this.statusesCallbackFunction = null;

    if (arguments.length > 2) {
        this.log = arguments[2];
        if (arguments.length > 3) {
            this.statusesCallbackFunction = arguments[3];
        }
    }

    this.height = horizontalBlocks.length;
    this.width = verticalBlocks.length;

    if (Math.max(this.height, this.width) > 10) {
        PrecalculatedSegments.populate(Math.max(this.height, this.width));
    }

    this.lines = new Array(this.height);
    this.cellSetsToUpdate = new Array();

    var blocksCache = {};

    var cellSet;
    var currentBlocks;
    var blocksSignature;
    for (var i = 0; i < this.height; i++) {
        currentBlocks = horizontalBlocks[i];
        blocksSignature = this.width + ':' + currentBlocks.join(",");
        if (blocksCache[blocksSignature] != null) {
            cellSet = new CellSet(CellSet.TYPE_LINE, i, this.width, currentBlocks, blocksCache[blocksSignature]);
        } else {
            cellSet = new CellSet(CellSet.TYPE_LINE, i, this.width, currentBlocks);
            cellSet.calculatePossiblePositions();
            blocksCache[blocksSignature] = cellSet.possiblePositions;
        }

        cellSet.setStatusesCallback(this.internalCallback, this);
        this.cellSetsToUpdate.push(cellSet);
        this.lines[i] = cellSet;
    }
    this.columns = new Array(this.width);
    for (i = 0; i < this.width; i++) {
        currentBlocks = verticalBlocks[i];
        blocksSignature = this.height + ':' + currentBlocks.join(",");
        if (blocksCache[blocksSignature] != null) {
            cellSet = new CellSet(CellSet.TYPE_COLUMN, i, this.height, currentBlocks, blocksCache[blocksSignature]);
        } else {
            cellSet = new CellSet(CellSet.TYPE_COLUMN, i, this.height, currentBlocks);
            cellSet.calculatePossiblePositions();
            blocksCache[blocksSignature] = cellSet.possiblePositions;
        }

        cellSet.setStatusesCallback(this.internalCallback, this);
        this.cellSetsToUpdate.push(cellSet);
        this.columns[i] = cellSet;
    }
    this.numberOfMissingCells = this.width * this.height;
    this.calculatedCells = new Array();

    while (this.cellSetsToUpdate.length != 0) {
        cellSet = this.cellSetsToUpdate.shift();
        cellSet.integrateNewStatuses();
        cellSet.calculateCellsStatuses();
    }
}

Picross.prototype.internalCallback = function(cellSet, cellId, cellStatus, picross) {
    picross.numberOfMissingCells--;
    var targetCellSet;
    var calculatedCell;
    if (cellSet.type == CellSet.TYPE_COLUMN) {
        targetCellSet = picross.lines[cellId];
        calculatedCell = [cellId, cellSet.index, cellStatus];

    } else {
        targetCellSet = picross.columns[cellId];
        calculatedCell = [cellSet.index, cellId, cellStatus];
    }

    if (picross.log) {
        picross.log.append(cellSet.toShortString() + " calculated that (" + calculatedCell[0] + "," + calculatedCell[1] + ") is " + cellStatus + " and notify " + targetCellSet.toShortString() + "<br/>");
    }
    picross.calculatedCells.push(calculatedCell);
    picross.cellSetsToUpdate.push(targetCellSet);
    if (picross.statusesCallbackFunction) {
        picross.statusesCallbackFunction(calculatedCell[0], calculatedCell[1], calculatedCell[2]);
    }
    targetCellSet.setStatus(cellSet.index, cellStatus);
}

/**
 * Parse a String of the form.
 * "1,2;3,2,1;1,2,1,4,1;1,2,2,2,1;1,3,2;2,3,2;10;5,4,2;1,2,2,1,4;2,3,1;1,2,2,1;1,5,2;2,3,1,1;4,1,1,1;1,3"
 * and return an Array that can be used to create a Picros.
 * @param value a string defining the blocks.
 */
Picross.parseBlocks = function(value) {
    var result = new Array();
    var sets = value.split(';');
    for (var i = 0; i < sets.length; i++) {
        var currentSet = new Array();
        if (sets[i] != "0") {
            var cells = sets[i].split(",");
            for (var j = 0; j < cells.length; j++) {
                currentSet.push(parseInt(cells[j]));
            }

        }
        result.push(currentSet);
    }
    return result;
}