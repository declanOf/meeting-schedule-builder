class ColumnDeleteDialog
{
    #deleteColumnDialog;

    #rowsContainer;

    #isMultiDays;

    #columnContainer;

    #columnIndex;

    constructor(target, meetings) {
        this.#rowsContainer = target.parents(".section-columns-container").find("columns-container");

        debugger; // count rows in rowContainer

        this.#isMultiDays = this.#rowsContainer.length > 1;

        debugger; // confirm accuracy of isMultiDays

        this.#columnContainer = $(target.parents(".column-container")[0]);

        debugger; // confirm that columnContainer is correct

        this.#columnIndex = parseInt(columnContainer.attr("attr-columnIndex"));

        $("body").append(this.render());

        this.attachHandlers();

        this.#deleteColumnDialog = $("#deleteColumnDialog").dialog({title: "Delete Column", height: 500, width: 450, autoOpen: false, modal: true});
    }

    open() {
        $("form#deleteColumnForm")[0].reset();

        $("#deleteColumnDialog .errors").hide();

        this.#deleteColumnDialog.dialog("open");
    }

    attachEventHandlers() {
        const handleCancelDeleteColumnDialog = (event) => {
            // intercept submission event
            event.preventDefault();

            // close dialog
            $("#deleteColumnDialog").close();
        }

        const handleSubmitDeleteColumnDialog = (event) => {
            event.preventDefault();
            try {
                if (this.#isMultiDays) {
                    this.#columnContainer.delete();
                } else {
                    const rows = $($(this.#columnContainer.parents(".section-columns-container")).find(".columns-container"));

                    rows.each((row) => {
                        const column = $($(row).find(".column-container").eq(this.#columnIndex));

                        column.delete();
                    })
                }
            } catch (error) {
                console.error("error", error);

                return;
            }

            $("#columnDeleteDialog").close();
        }

        $('form#deleteColumnForm input[type="submit"]').click(handleSubmitDeleteColumnDialog);

        $('form#deleteColumnForm input[type="cancel"]').click(handleCancelDeleteColumnDialog);
    }
}