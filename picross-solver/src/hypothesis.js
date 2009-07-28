/**
 * Represents an hypothesis to be evaluated.
 * @param picross the picross that created the hypothesis.
 * @param cellLine the line of the cell we will try the hypothesis.
 * @param cellColumn the column of the cell we will try the hypothesis.
 * @param statusToTry the status we will try
 * @param log an objetc to log to (optional).
 */
function Hypothesis(picross, cellLine, cellColumn, statusToTry) {
    this.log = null;

    if (arguments.length > 4) {
        this.log = arguments[2];
    }

    this.picross = picross;
    this.cellSetsToUpdate = new Array();
    this.lines = new Array(picross.height);
    this.columns = new Array(picross.width);
    this.calculatedCells = new Array();
    this.statusToTry = statusToTry;

    var newLineCellSet = this.getCellSet(CellSet.TYPE_LINE, cellLine);
    newLineCellSet.setCellStatus(cellColumn, statusToTry);
    this.lines[cellLine] = newLineCellSet;
    this.cellSetsToUpdate.push(newLineCellSet);

    var newColumnCellSet = this.getCellSet(CellSet.TYPE_COLUMN, cellColumn);
    newColumnCellSet.setCellStatus(cellLine, statusToTry);
    this.columns[cellColumn] = newColumnCellSet;
    this.cellSetsToUpdate.push(newColumnCellSet);
}

/**
 * Check an hypothesis: try if something goes wrong.
 * @return a boolean indicating if it goes ok.
 */
Hypothesis.prototype.evaluate = function() {
    while (this.cellSetsToUpdate.length != 0) {
        var cellSet = this.cellSetsToUpdate.shift();
        cellSet.integrateNewStatuses();
        if (cellSet.possiblePositions.length == 0) {
            return false;
        }
        cellSet.calculateCellsStatuses();
    }
    return true;
}

Hypothesis.prototype.internalCallback = function(cellSet, cellId, cellStatus, hypothesis) {
    var targetCellSet;
    var calculatedCell;
    if (cellSet.type == CellSet.TYPE_COLUMN) {
        targetCellSet = hypothesis.getCellSet(CellSet.TYPE_LINE, cellId);
        calculatedCell = [cellId, cellSet.index, cellStatus];
    } else {
        targetCellSet = hypothesis.getCellSet(CellSet.TYPE_COLUMN, cellId);
        calculatedCell = [cellSet.index, cellId, cellStatus];
    }

    if (hypothesis.log) {
        hypothesis.log.append(cellSet.toShortString() + " calculated that (" + calculatedCell[0] + "," + calculatedCell[1] + ") is " + cellStatus + " and notify " + targetCellSet.toShortString() + "<br/>");
    }

    hypothesis.calculatedCells.push(calculatedCell);
    hypothesis.cellSetsToUpdate.push(targetCellSet);
    targetCellSet.setCellStatus(cellSet.index, cellStatus);
}


Hypothesis.prototype.getCellSet = function(type, index) {
    if (CellSet.TYPE_COLUMN == type) {
        if (this.columns[index] != null) {
            return this.columns[index];
        } else {
            var originalColumnCellSet = this.picross.columns[index];
            var columnCellSet = new CellSet(CellSet.TYPE_COLUMN, index, this.picross.height, originalColumnCellSet.blocks, originalColumnCellSet.possiblePositions, originalColumnCellSet.cells);
            columnCellSet.setStatusesCallback(this.internalCallback, this);
            this.columns[index] = columnCellSet;
            return columnCellSet;
        }
    } else {
        if (this.lines[index] != null) {
            return this.lines[index];
        } else {
            var originalLineCellSet = this.picross.lines[index];
            var lineCellSet = new CellSet(CellSet.TYPE_LINE, index, this.picross.width, originalLineCellSet.blocks, originalLineCellSet.possiblePositions, originalLineCellSet.cells);
            lineCellSet.setStatusesCallback(this.internalCallback, this);
            this.lines[index] = lineCellSet;
            return lineCellSet;
        }
    }
}
