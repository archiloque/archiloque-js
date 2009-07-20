$(document).ready(function() {

    module("CellSets possible positions");

    test("testing 10 on 10", function() {
        var blocks = [10];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.getPossiblePositions();
        equals(1, possiblePositions.length, "1 position for 10 on 10");
        var position = possiblePositions[0];
        equals("".appendXTimes(CellType.CHECKED, 10), position, "all should be checked");
    });

    test("testing 9 on 10", function() {
        var blocks = [9];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.getPossiblePositions();
        equals(2, possiblePositions.length, "2 positions for 9 on 10");
        var position = possiblePositions[0];
        equals("".appendXTimes(CellType.CHECKED, 9) + CellType.EMPTY, position);
        position = possiblePositions[1];
        equals(CellType.EMPTY.appendXTimes(CellType.CHECKED, 9), position);
    });

    test("testing 8 on 10", function() {
        var blocks = [8];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.getPossiblePositions();
        equals(3, possiblePositions.length, "3 positions for 8 on 10");

        var position = possiblePositions[0];
        equals("".appendXTimes(CellType.CHECKED, 8) + CellType.EMPTY + CellType.EMPTY, position);

        position = possiblePositions[1];
        equals(CellType.EMPTY.appendXTimes(CellType.CHECKED, 8) + CellType.EMPTY, position);

        position = possiblePositions[2];
        equals(CellType.EMPTY + CellType.EMPTY.appendXTimes(CellType.CHECKED, 8), position);
    });

    test("testing 8 + 1 on 10", function() {
        var blocks = [8, 1]
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.getPossiblePositions();
        equals(possiblePositions.length, 1, "1 position for 8 + 1 on 10");

        var position = possiblePositions[0];
        equals("".appendXTimes(CellType.CHECKED, 8) + CellType.EMPTY + CellType.CHECKED, position);
    });

    test("testing 7 + 1 on 10", function() {
        var blocks = [7, 1]
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.getPossiblePositions();
        equals(possiblePositions.length, 3, "3 positions for 7 + 1 on 10");

        position = possiblePositions[0];
        equals("".appendXTimes(CellType.CHECKED, 7) + CellType.EMPTY + CellType.CHECKED + CellType.EMPTY, position);

        position = possiblePositions[1];
        equals(10, position.length, "length should be 10");
        equals("".appendXTimes(CellType.CHECKED, 7) + CellType.EMPTY + CellType.EMPTY + CellType.CHECKED, position);

        position = possiblePositions[2];
        equals(10, position.length, "length should be 10");
        equals(CellType.EMPTY + "".appendXTimes(CellType.CHECKED, 7) + CellType.EMPTY + CellType.CHECKED, position);
    });

    test("testing 0 on 10", function() {
        var blocks = [];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.getPossiblePositions();
        equals(1, possiblePositions.length, "1 position for 0 on 10");
        var position = possiblePositions[0];
        equals("".appendXTimes(CellType.EMPTY, 10), position, "all should be empty");
    });

    module("CellSets constants calculation");
    test("testing 7 + 1 on 10", function() {
        var blocks = [7, 1];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        cellSet.calculateCellsStatuses();
        equals(CellType.UNDECIDED + "".appendXTimes(CellType.CHECKED, 6) + CellType.UNDECIDED + CellType.UNDECIDED + CellType.UNDECIDED, cellSet.getCells());
    });

    module("Test calculation callback and iteration");

    test("Cells callback", function() {
        var blocks = [7, 1];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        var callbacksIds = "";
        var callbackStatuses = "";
        cellSet.calculatePossiblePositions();
        cellSet.setStatusesCallback(function(cellSet, cellId, status, callbackParam) {
            callbacksIds += cellId;
            callbackStatuses += status;
        }, null);
        cellSet.calculateCellsStatuses();
        equals(callbackStatuses, "".appendXTimes(CellType.CHECKED, 6), "6 checked cells");
        equals(callbacksIds, "123456", "6 checked cells");
    });

    test("Test integration of cells", function() {
        var blocks = [5];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        var callbackNumber = 0;
        var callbacksIds = "";
        var callbackStatuses = "";

        cellSet.calculatePossiblePositions();
        cellSet.setStatusesCallback(function(cellSet, cellId, status, callbackParam) {
            callbackNumber++;
            callbacksIds += cellId;
            callbackStatuses += status;
        }, null);
        cellSet.calculateCellsStatuses();
        equals(callbackNumber, 0, "Nothing calculated here");
        equals(cellSet.getPossiblePositions().length, 6, "6 possible solutions");
        cellSet.setStatus(5, CellType.EMPTY);
        cellSet.integrateNewStatuses();
        equals(cellSet.getPossiblePositions().length, 1);
        cellSet.calculateCellsStatuses();
        equals(callbackStatuses, "".appendXTimes(CellType.CHECKED, 5).appendXTimes(CellType.EMPTY, 4), "all is calculated now");
        equals(callbacksIds, "012346789", "all is calculated now");
    });

    module("Picros test");
    test("1 x 1", function() {
        var picros = new Picros([
            [2]
        ], [
            [1],
            [1]
        ]);
        equals(picros.calculatedCells.length, 2);
        equals(picros.getNumberOfMissingCells(), 0);
        equals(picros.lines[0].cells, CellType.CHECKED + CellType.CHECKED);
        equals(picros.columns[0].cells, CellType.CHECKED);
    });

    test("3 x 3", function() {
        var picros = new Picros([
            [3],
            [1],
            [1]
        ], [
            [1],
            [3],
            [1]
        ]);
        equals(picros.calculatedCells.length, 9);
        equals(picros.getNumberOfMissingCells(), 0);

        equals(picros.lines[0].cells, CellType.CHECKED + CellType.CHECKED + CellType.CHECKED, "L0");
        equals(picros.lines[1].cells, CellType.EMPTY + CellType.CHECKED + CellType.EMPTY, "L1");
        equals(picros.lines[2].cells, CellType.EMPTY + CellType.CHECKED + CellType.EMPTY, "L2");

        equals(picros.columns[0].cells, CellType.CHECKED + CellType.EMPTY + CellType.EMPTY, "C0");
        equals(picros.columns[1].cells, CellType.CHECKED + CellType.CHECKED + CellType.CHECKED, "C1");
        equals(picros.columns[2].cells, CellType.CHECKED + CellType.EMPTY + CellType.EMPTY, "C2");
    });

    test("5 x 5", function() {
        var picros = new Picros([
            [3],
            [1,1],
            [3,1],
            [1,1,1],
            [3]
        ], [
            [3],
            [1,1, 1],
            [1, 3],
            [1,1],
            [3]
        ]);
        equals(picros.calculatedCells.length, 25);
        equals(picros.getNumberOfMissingCells(), 0);
    });
});
