class ControlsSectionsRow {
    static updateColumnIndexes = (row) => {
        row.find(".column-container").each((index, node) => {
            $(node).attr("attr-columnIndex", index);
        });
    }
};