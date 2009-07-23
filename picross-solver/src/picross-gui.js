function solve() {
    var div = $("#picross");
    var linesValue = $("#lines").val();
    var columnsValue = $("#columns").val();
    if ((linesValue == "") || (columnsValue == "")) {
        alert("Definition is incomplete / La defintion est incomplète");
        return false;
    }

    var lines = Picross.parseBlocks(linesValue);
    var columns = Picross.parseBlocks(columnsValue);

    var content = "<table><thead><th></th>";

    for (var i = 0; i < columns.length; i ++) {
        content += "<th class=\"columnInformation\">" + columns[i].join("<br/>") + "</th>";
    }

    content += "</thead><tbody>";

    for (i = 0; i < lines.length; i ++) {
        var curentLine = lines[i];
        content += "<tr><td class=\"lineInformation\">";
        if (curentLine.length > 0) {
            content += curentLine.join(" ");
        } else {
            content += "&nbsp;";
        }
        content += "</td>";
        for (j = 0; j < columns.length; j ++) {
            content += "<td><div id=\"cell_" + i + "_" + j + "\" class=\"value\">&nbsp;</div></td>";
        }
        content += "</tr>";
    }
    content += "</tbody></table>";
    div.html(content);

    var picross = new Picross(lines, columns, null, statusesCallback);
    return false;
}

/**
 * Called when a cell status is calculated.
 * @param column the cell column.
 * @param line the cell line.
 * @param status the CellStatus.
 */
function statusesCallback(column, line, status) {
    var cell = $("#cell_" + column + "_" + line);
    if (CellStatus.EMPTY == status) {
        cell.html("X");
    } else {
        cell.addClass("filledCell");
    }
}

function setPuzzle(lines, columns) {
    $("#lines").val(lines);
    $("#columns").val(columns);
}