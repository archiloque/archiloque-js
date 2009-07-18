$(document).ready(function(){

	module("CellSets possible positions");

	test("testing 10 on 10", function() {
		var blocks = new Array();
		blocks.push(10);
		var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
		cellSet.calculatePossiblePositions();
		var possiblePositions = cellSet.getPossiblePositions();
		equals(possiblePositions.length, 1, "1 position for 10 on 10" );
		var position = possiblePositions[0];
		equals(position.length, 10, "length should be 10" );
		equals(position, "".appendXTimes(CellType.CHECKED, 10), "all should be checked" );
	});

	test("testing 9 on 10", function() {
		var blocks = new Array();
		blocks.push(9);
		var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
		cellSet.calculatePossiblePositions();
		var possiblePositions = cellSet.getPossiblePositions();
		equals(possiblePositions.length, 2, "2 positions for 9 on 10" );
		var position = possiblePositions[0];
		equals(position.length, 10, "length should be 10" );
		equals(position, "".appendXTimes(CellType.CHECKED, 9) + CellType.EMPTY);
		position = possiblePositions[1];
		equals(position.length, 10, "length should be 10" );
		equals(position, CellType.EMPTY.appendXTimes(CellType.CHECKED, 9));
	});

	test("testing 8 on 10", function() {
		var blocks = new Array();
		blocks.push(8);
		var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
		cellSet.calculatePossiblePositions();
		var possiblePositions = cellSet.getPossiblePositions();
		equals(possiblePositions.length, 3, "3 positions for 8 on 10" );

		var position = possiblePositions[0];
		equals(position.length, 10, "length should be 10" );
		equals(position, "".appendXTimes(CellType.CHECKED, 8) + CellType.EMPTY + CellType.EMPTY);

		position = possiblePositions[1];
		equals(position.length, 10, "length should be 10" );
		equals(position, CellType.EMPTY.appendXTimes(CellType.CHECKED, 8) + CellType.EMPTY);

		position = possiblePositions[2];
		equals(position.length, 10, "length should be 10" );
		equals(position, CellType.EMPTY + CellType.EMPTY.appendXTimes(CellType.CHECKED, 8));
	});

	test("testing 8 + 1 on 10", function() {
		var blocks = new Array(8, 1);
		var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
		cellSet.calculatePossiblePositions();
		var possiblePositions = cellSet.getPossiblePositions();
		equals(possiblePositions.length, 1, "1 position for 8 + 1 on 10" );

		var position = possiblePositions[0];
		equals(position.length, 10, "length should be 10" );
		equals(position, "".appendXTimes(CellType.CHECKED, 8) + CellType.EMPTY + CellType.CHECKED);
	});

	test("testing 7 + 1 on 10", function() {
		var blocks = new Array(7, 1);
		var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
		cellSet.calculatePossiblePositions();
		var possiblePositions = cellSet.getPossiblePositions();
		equals(possiblePositions.length, 3, "3 positions for 7 + 1 on 10" );

		position = possiblePositions[0];
		equals(position.length, 10, "length should be 10" );
		equals(position, "".appendXTimes(CellType.CHECKED, 7) + CellType.EMPTY + CellType.CHECKED + CellType.EMPTY );

		position = possiblePositions[1];
		equals(position.length, 10, "length should be 10" );
		equals(position, "".appendXTimes(CellType.CHECKED, 7) + CellType.EMPTY + CellType.EMPTY + CellType.CHECKED);

		position = possiblePositions[2];
		equals(position.length, 10, "length should be 10" );
		equals(position, CellType.EMPTY + "".appendXTimes(CellType.CHECKED, 7) + CellType.EMPTY + CellType.CHECKED );
	});

	module("CellSets constants calculation");
	test("testing 7 + 1 on 10", function() {
		var blocks = new Array(7, 1);
		var cellSet = new CellSet(CellSet.TYPE_COLUMN, 0, 10, blocks);
		cellSet.calculatePossiblePositions();
		cellSet.calculateCells();
		var constants = cellSet.getCells();
		equals(constants, CellType.UNDECIDED + "".appendXTimes(CellType.CHECKED, 6) + CellType.UNDECIDED + CellType.UNDECIDED + CellType.UNDECIDED);
	});

});
