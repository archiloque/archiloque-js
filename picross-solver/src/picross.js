/**
 * Create a new Picross.
 * @param horizontalBlocks an array containing array defining horizontal blocks.
 * @param verticalBlocks an array containing array defining vertical blocks.
 * @param log an objetc to log to (optional).
 */
function Picross(horizontalBlocks, verticalBlocks) {
    if (arguments.length > 2) {
        this.log = arguments[2];
    }

    this.height = horizontalBlocks.length;
    this.width = verticalBlocks.length;

    this.lines = new Array(this.height);
    this.cellSetsToUpdate = new Array();

    var cellSet;
    for (var i = 0; i < this.height; i++) {
        cellSet = new CellSet(CellSet.TYPE_LINE, i, this.width, horizontalBlocks[i]);
        cellSet.setStatusesCallback(this.setStatusesCallback, this);
        cellSet.calculatePossiblePositions();
        this.cellSetsToUpdate.push(cellSet);
        this.lines[i] = cellSet;
    }
    this.columns = new Array(this.width);
    for (i = 0; i < this.width; i++) {
        cellSet = new CellSet(CellSet.TYPE_COLUMN, i, this.height, verticalBlocks[i])
        cellSet.setStatusesCallback(this.setStatusesCallback, this);
        cellSet.calculatePossiblePositions();
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

Picross.prototype.setStatusesCallback = function(cellSet, cellId, cellStatus, picros) {
    picros.numberOfMissingCells--;
    var targetCellSet;
    if (cellSet.getType() == CellSet.TYPE_COLUMN) {
        targetCellSet = picros.lines[cellId];
        picros.calculatedCells.push([cellId, cellSet.getIndex(), cellStatus]);
        if (picros.log) {
            picros.log.append(cellSet.toShortString() + " calculated that (" + cellId + "," + cellSet.getIndex() + ") is " + cellStatus + " and notify " + targetCellSet.toShortString() + "<br/>");
        }
    } else {
        targetCellSet = picros.columns[cellId];
        picros.calculatedCells.push([cellSet.getIndex(), cellId, cellStatus]);
        if (picros.log) {
            picros.log.append(cellSet.toShortString() + " calculated that (" + cellSet.getIndex() + "," + cellId + ") is " + cellStatus + " and notify " + targetCellSet.toShortString() + "<br/>");
        }
    }
    picros.cellSetsToUpdate.push(targetCellSet);
    targetCellSet.setStatus(cellSet.getIndex(), cellStatus);
}

Picross.prototype.getNumberOfMissingCells = function() {
    return this.numberOfMissingCells;
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
    for(var i = 0; i < sets.length; i++) {
        var currentSet = new Array();
        if(sets[i] != "0") {
            var cells = sets[i].split(",");
            for(var j = 0; j < cells.length; j++) {
                currentSet.push(parseInt(cells[j]));
            }

        }
        result.push(currentSet);
    }
    return result;
}