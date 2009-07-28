$(document).ready(function() {

    module("CellSets possible positions");

    test("testing 10 on 10", function() {
        var blocks = [10];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.possiblePositions;
        equals(1, possiblePositions.length, "1 position for 10 on 10");
        var position = possiblePositions[0];
        equals(PrecalculatedSegments.CHECKED[10], position, "all should be checked");
    });

    test("testing 9 on 10", function() {
        var blocks = [9];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.possiblePositions;
        equals(2, possiblePositions.length, "2 positions for 9 on 10");
        var position = possiblePositions[0];
        equals(PrecalculatedSegments.CHECKED[9] + CellStatus.EMPTY, position);
        position = possiblePositions[1];
        equals(CellStatus.EMPTY + PrecalculatedSegments.CHECKED[9], position);
    });

    test("testing 8 on 10", function() {
        var blocks = [8];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.possiblePositions;
        equals(3, possiblePositions.length, "3 positions for 8 on 10");

        var position = possiblePositions[0];
        equals(PrecalculatedSegments.CHECKED[8] + CellStatus.EMPTY + CellStatus.EMPTY, position);

        position = possiblePositions[1];
        equals(CellStatus.EMPTY + PrecalculatedSegments.CHECKED[8] + CellStatus.EMPTY, position);

        position = possiblePositions[2];
        equals(CellStatus.EMPTY + CellStatus.EMPTY + PrecalculatedSegments.CHECKED[8], position);
    });

    test("testing 8 + 1 on 10", function() {
        var blocks = [8, 1];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.possiblePositions;
        equals(possiblePositions.length, 1, "1 position for 8 + 1 on 10");

        var position = possiblePositions[0];
        equals(PrecalculatedSegments.CHECKED[8] + CellStatus.EMPTY + CellStatus.CHECKED, position);
    });

    test("testing 7 + 1 on 10", function() {
        var blocks = [7, 1];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.possiblePositions;
        equals(possiblePositions.length, 3, "3 positions for 7 + 1 on 10");

        position = possiblePositions[0];
        equals(PrecalculatedSegments.CHECKED[7] + CellStatus.EMPTY + CellStatus.CHECKED + CellStatus.EMPTY, position);

        position = possiblePositions[1];
        equals(10, position.length, "length should be 10");
        equals(PrecalculatedSegments.CHECKED[7] + CellStatus.EMPTY + CellStatus.EMPTY + CellStatus.CHECKED, position);

        position = possiblePositions[2];
        equals(10, position.length, "length should be 10");
        equals(CellStatus.EMPTY + PrecalculatedSegments.CHECKED[7] + CellStatus.EMPTY + CellStatus.CHECKED, position);
    });

    test("testing 0 on 10", function() {
        var blocks = [];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        var possiblePositions = cellSet.possiblePositions;
        equals(1, possiblePositions.length, "1 position for 0 on 10");
        var position = possiblePositions[0];
        equals(PrecalculatedSegments.EMPTY[10], position, "all should be empty");
    });

    module("CellSets constants calculation");
    test("testing 7 + 1 on 10", function() {
        var blocks = [7, 1];
        var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
        cellSet.calculatePossiblePositions();
        cellSet.calculateCellsStatuses();
        equals(CellStatus.UNDECIDED + PrecalculatedSegments.CHECKED[6] + CellStatus.UNDECIDED + CellStatus.UNDECIDED + CellStatus.UNDECIDED, cellSet.cells);
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
        equals(callbackStatuses, PrecalculatedSegments.CHECKED[6], "6 checked cells");
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
        equals(cellSet.possiblePositions.length, 6, "6 possible solutions");
        cellSet.setCellStatus(5, CellStatus.EMPTY);
        cellSet.integrateNewStatuses();
        equals(cellSet.possiblePositions.length, 1);
        cellSet.calculateCellsStatuses();
        equals(callbackStatuses, PrecalculatedSegments.CHECKED[5] + PrecalculatedSegments.EMPTY[    4], "all is calculated now");
        equals(callbacksIds, "012346789", "all is calculated now");
    });

    module("Picross test");
    test("1 x 1", function() {
        var picross = new Picross([
            [2]
        ], [
            [1],
            [1]
        ]);
        equals(picross.calculatedCells.length, 2);
        equals(picross.numberOfMissingCells, 0);
        equals(picross.lines[0].cells, CellStatus.CHECKED + CellStatus.CHECKED);
        equals(picross.columns[0].cells, CellStatus.CHECKED);
    });

    test("3 x 3", function() {
        var picross = new Picross([
            [3],
            [1],
            [1]
        ], [
            [1],
            [3],
            [1]
        ]);
        equals(picross.calculatedCells.length, 9);
        equals(picross.numberOfMissingCells, 0);

        equals(picross.lines[0].cells, CellStatus.CHECKED + CellStatus.CHECKED + CellStatus.CHECKED, "L0");
        equals(picross.lines[1].cells, CellStatus.EMPTY + CellStatus.CHECKED + CellStatus.EMPTY, "L1");
        equals(picross.lines[2].cells, CellStatus.EMPTY + CellStatus.CHECKED + CellStatus.EMPTY, "L2");

        equals(picross.columns[0].cells, CellStatus.CHECKED + CellStatus.EMPTY + CellStatus.EMPTY, "C0");
        equals(picross.columns[1].cells, CellStatus.CHECKED + CellStatus.CHECKED + CellStatus.CHECKED, "C1");
        equals(picross.columns[2].cells, CellStatus.CHECKED + CellStatus.EMPTY + CellStatus.EMPTY, "C2");
    });

    test("5 x 5", function() {
        var picross = new Picross([
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
        equals(picross.calculatedCells.length, 25);
        equals(picross.numberOfMissingCells, 0);
    });

    test("Parsing", function() {
	 equals(Picross.parseBlocks("1,2;3,2,1;1,2,1,4,1;1,2,2,2,1;1,3,2;2,3,2;10;5,4,2;1,2,2,1,4;2,3,1;1,2,2,1;1,5,2;2,3,1,1;4,1,1,1;1,3").length, 15);
	 equals(Picross.parseBlocks("3,1;1,1,1,4;1,1,3,2;2,5,1;1,2,2,1;1,3,2;4,1,2,2,1;2,4,5;10;2,3,2;2,3,1;1,2,2,2,1;1,4,1,2,1;1,2,3;2,1").length, 15);
    });
});
