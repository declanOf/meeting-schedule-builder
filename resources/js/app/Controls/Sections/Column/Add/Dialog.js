class ColumnAddDialog
{
    #parentRow;

    #columnsContainer;

    #addColumnDialog;

    #meetings;

    #columnSources;

    #section;

    constructor(target, meetings) {
        this.#parentRow = $(target.parents(".section-columns-container")[0]);

        this.#columnsContainer = $(this.#parentRow.find(".columns-container"));

        this.#meetings = meetings;

        this.#columnSources = meetings.columnSources;

        this.#section = $(target).attr("attr-section");

        $("body").append(this.render());

        this.attachHandlers();

        this.#addColumnDialog = $("#addColumnDialog").dialog({title: "Add Column", height: 500, width: 450, autoOpen: false, modal: true});
    }

    open() {
        $("form#addColumnForm")[0].reset();

        $("#addColumnDialog .errors").hide();

        this.#addColumnDialog.dialog("open");
    }

    attachHandlers() {
        const parentRow = this.#parentRow;

        const columnSources = this.#columnSources;

        const handleSubmitAddColumnDialog = (event) => {
            // intercept submission event
            event.preventDefault();

            // validate
            const isValid = (values) => {
                return true;
            };

            const getTotalColumnsWidth = (columns) => {
                let width = 0;

                columns.forEach((column) => width += parseFloat(column.width.replace("px", "")));

                return width;
            }

            const removeColumn = (event) => {
                event.preventDefault();

                if (!window.confirm("Do you want to delete this column?")) {
                    return;
                }

                const target = $(event.target);

                const rowsContainer = $(target.parents(".section-columns-container")).find(".columns-container");

                const isMultiDays = rowsContainer.length > 1;

                const columnContainer = $(target.parents(".column-container")[0]);

                const columnIndex = parseInt(columnContainer.attr("attr-columnIndex"));

                try {
                    if (isMultiDays) {
                        const rows = $($(columnContainer.parents(".section-columns-container")).find(".columns-container"));

                        rows.each((index, row) => {
                            const column = $($(row).find(".column-container").eq(columnIndex));

                            column.remove();
                        })
                    } else {
                        columnContainer.remove();
                    }

                    // set configuration to dirty
                    (new Configuration()).setDirty(true);
                } catch (error) {
                    console.error("error", error);

                    return;
                }
            };

            // add to section
            const addColumn = (values) => {
                // load configuration
                const configuration = new Configuration();

                const sectionId = parseInt(values.section);

                // load settings
                let settings = configuration.settings;

                // load columns
                let columns = configuration.settings.sections[sectionId].columns;

                let totalColumns = columns.length;

                // convert form data into column data
                let newColumn = {source: values.source, title: values.label, width: null};

                // identify whether section has multiple subsections (days)
                const hasDays = Array.isArray(columns[0]);

                // add column to section or subsections
                if (hasDays) {
                    newColumn.dayKey = 0;

                    columns.map((elem) => {
                        const totalWidth = getTotalColumnsWidth(elem);

                        newColumn.width = parseInt((parseInt(values.width) / 100) * totalWidth) + "px";

                        ++newColumn.dayKey;

                        return elem;
                    });
                } else {
                    const totalWidth = getTotalColumnsWidth(columns);

                    newColumn.width = parseInt((parseInt(values.width) / 100) * totalWidth) + "px";
                }

                // overwrite section in configuration
                configuration.settings = settings;

                let idPrefix = `sections-${sectionId}-days-dayKey-columns-{{@key}}`;

                let namePrefix = `sections.${sectionId}.days.dayKey.columns.{{@key}}`;

                let selectOptions = columnSources.map((source) => `<option value="${source}"` + (values.source === source ? ` selected="selected" ` : ``) + `>` + source.replace("_", " ") + `</option>`);

                // add once
                if (!hasDays) {
                    idPrefix = idPrefix.replace("-days-dayKey", "");

                    namePrefix = namePrefix.replace(".days.dayKey", "");

                    const columnCount = columns.length;

                    let columnNode = $(`
                        <div class="column-container col-2 draggable" attr-columnIndex="${totalColumns}" draggable="true">
                            <p style="cursor: pointer">COLUMN <span class="remove-column-container"><a class="remove-column">X</a></span></p>
                            <select name="sections.${sectionId}.columns.${columnCount}.source">
                                ${selectOptions}
                            </select>
                            <input name="sections.${sectionId}.columns.${columnCount}.title" type="text" style="width: 65px" value="${newColumn.title}">
                            <input id="sections-${sectionId}-columns-${columnCount}-width" name="sections.${sectionId}.columns.${columnCount}.width" type="text" style="width:50px" value="${newColumn.width}">
                        </div>
                    `);

                    const deleteNode = $(columnNode.find("a.remove-column")[0]);

                    deleteNode.on("click", removeColumn);

                    $(parentRow.find(".row")[0]).append(columnNode);

                    // rebuild the parent row's columns
                    ControlsSectionsRow.updateColumnIndexes(parentRow);
                } else {
                    const columnCount = columns[0].length;

                    // for each day container
                    parentRow.find(".columns-container").each((dayKey, columnsContainer) => {
                        totalColumns = $(columnsContainer).find(".column-container").length;
                        idPrefix = idPrefix.replace("dayKey", dayKey);

                        namePrefix = namePrefix.replace("dayKey", dayKey);

                        let columnNode = $(`
                        <div class="column-container col-2 draggable" attr-columnIndex="${totalColumns}" draggable="true">
                            <p style="cursor: pointer">COLUMN <span class="remove-column-container"><a class="remove-column">X</a></span></p>
                            <select name="sections.${sectionId}.days.${dayKey}.columns.${columnCount}.source">
                                ${selectOptions}
                            </select>
                            <input name="sections.${sectionId}.days.${dayKey}.columns.${columnCount}.title" type="text" style="width: 65px" value="${newColumn.title}">
                            <input id="sections-${sectionId}-days-${dayKey}-columns-${columnCount}-width" name="sections.${sectionId}.days.${dayKey}.columns.${columnCount}.width" type="text" style="width:50px" value="${newColumn.width}">
                            <input name="sections.${sectionId}.days.${dayKey}.columns.${columnCount}.dayKey" type="hidden" style="width:50px" value="${dayKey}">
                        </div>
                        `);

                        const deleteNode = $(columnNode.find("a.remove-column")[0]);

                        deleteNode.on("click", removeColumn);

                        $(columnsContainer).append(columnNode);
                    });

                    const rows = $(parentRow.parents(".section-columns-container"));

                    // rebuild the parent row's columns
                    $(rows.find(".columns-container")).each((row) => ControlsSectionsRow.updateColumnIndexes(row));
                }

                (new Configuration()).setDirty(true);
            };

            $("#addColumnDialog .errors").show();

            const values = {};

            const formData = Object
                .entries($("form#addColumnForm")
                .serializeArray())
                .pluck(1)
                .forEach((entry) => values[entry.name] = entry.value);

            values["section"] = this.#section;

            // validate
            if (!isValid(values)) {
                return;
            }

            // add column to section
            addColumn(values);

            // reset dialog
            $("form#addColumnForm")[0].reset();

            // close dialog
            this.#addColumnDialog.dialog("close");
        };

        const handleCancelAddColumnDialog = (event) => {
            // intercept submission event
            event.preventDefault();

            // reset dialog
            $("form#addColumnForm")[0].reset();

            // close dialog
            $("#addColumnDialog").close();
        }

        const handleSelectSourceChange = (event) => {
            const target = $(event.target);

            const val = target.val();

            const label = val.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

            $(target.parents("form")[0]).find("input.label").val(label);
        }

        $('form#addColumnForm input[type="submit"]').click(handleSubmitAddColumnDialog.bind(this));

        $('form#addColumnForm input[type="cancel"]').click(handleCancelAddColumnDialog);

        $(".select-source").change(handleSelectSourceChange);
    }

    render() {
        const addColumnDialogEngine = Handlebars.compile(addColumnDialogTemplate);

        const sources = this.#meetings.sources;

        let showSources = [];

        sources.forEach((entry) => {
            showSources.push({
                "source": entry
            });
        });

        const firstSourceLabel = sources[0].charAt(0).toUpperCase() + sources[0].slice(1).replace("_", " ");

        let data = {
                     sources: showSources,
            firstSourceLabel: firstSourceLabel,
        };

        return addColumnDialogEngine(data);
    }
}