class AddFilterDialog
{
    // Add type: exclude or include based on filter
    // list types of filters: attendance option, district, types, name string
    // allow entry of district, type, name, or attendance option

    #filterList;

    #filtersContainer;

    #addFilterDialog;

    constructor(target)
    {
        this.#filtersContainer = $(target.parents(".filters-container")[0]);

        this.#filterList = $(this.#filtersContainer.find(".filter-list"));

        $("body").append(this.render());

        this.attachHandlers();

        this.#addFilterDialog = $("#filterDialog").dialog({title: "Add Filter", height: 500, width: 450, autoOpen: false, modal: true});
    }

    open()
    {
        $("form#filterForm")[0].reset();

        $("#filterDialog .filter-targets").hide();

        $("#filterDialog .errors").hide();

        this.#addFilterDialog.dialog("open");
    }

    attachHandlers() {
        const handleSubmitAddFilterDialog = (event) => {
            const isValid = (values) => {

                const getErrors = (values) => {
                    let errors = [];

                    if (!("type" in values)) {
                        errors.push("Please choose a filter to include or exclude.");
                    }

                    switch (values.target) {
                        case "":
                            errors.push("Please select a filter type.");
                        break;

                        case "district_id":
                            if (values.districts.length === 0) {
                                errors.push("Please enter one or more districts separated by commas.");
                            }
                            break;

                        case "attendanceOption":
                            if (!("attendance-option" in values)) {
                                errors.push("Please select one or more attendance options.");
                            }
                        break;

                        case "types":
                            if (!("keys[]" in values)) {
                                errors.push("Please select one or more types");
                            }
                        break;

                        case "name":
                            if (values.name.length === 0) {
                                errors.push("Please enter text into the name field");
                            }
                        break;
                    }

                    return errors;
                }

                const errors = getErrors(values);

                $("#filterDialog .errors").hide();
                $("#filterDialog .errors").html("");

                if (errors.length > 0) {
                    let errorContent = $("<ul>");
                    errors.forEach((error) => errorContent.append($(`<li>${error}</li>`)));

                    $("#filterDialog .errors").html("ERRORS<br>"+errorContent.html());
                    $("#filterDialog .errors").show();

                    return false;
                }

                return true;
            }

            const addControlsContent = (values) => {
                values.keys = $("form#filterForm .keys").val();

                values.attendanceOption = $("form#filterForm .attendance-option").val();

                const index = parseInt(Math.random() * 100000);

                const prefix = $(this.#filtersContainer).attr("data-prefix");

                const friendlyType = values.type.charAt(0).toUpperCase() + values.type.slice(1);

                let targetType = "";

                let target = "";

                switch (values.target) {
                    case "district_id":
                        target = values.districts;
                        targetType = "districts";
                    break;

                    case "attendanceOption":
                        target = values.attendanceOption.join(",");
                        targetType = "attendance";
                    break;

                    case "types":
                        target = values.keys.join(",");
                        targetType = "types";
                    break;

                    case "name":
                        target = values.name;
                        targetType = "name";
                    break;
                };

                const content = $(`
                <div class="col-12 hover-light filter-container" data-id="${values['type']}-${values['key']}-${index}">
                    <button class="edit-filter borderless">&#128462;</button> <button class="remove-filter borderless">&#8998;</button> ${friendlyType} groups with ${targetType} including "${target}"
                    <input type="hidden" name="${prefix}filter.${index}.type" value="${values['type']}">
                    <input type="hidden" name="${prefix}filter.${index}.key" value="${values['target']}">
                    <input type="hidden" name="${prefix}filter.${index}.item" value="${target}">
                </div>`);

                $("div.filter-list").append(content);

                configuration.setDirty(true);
            }

            // intercept submission event
            event.preventDefault();

            $("#filterDialog .errors").show();

            const values = {};

            const formData = Object
                .entries($("form#filterForm")
                .serializeArray())
                .pluck(1)
                .forEach((entry) => values[entry.name.replace("filter-", "")] = entry.value);

            // validate
            if (!isValid(values)) {
                return;
            }

            // add content
            addControlsContent(values);

            // reset dialog
            $("form#filterForm")[0].reset();

            // close dialog
            this.#addFilterDialog.dialog("close");
        }

        const handleCancelAddFilterDialog = (event) => {
            // intercept submission event
            event.preventDefault();

            // reset dialog
            $("form#filterForm")[0].reset();

            // close dialog
            $("#filterDialog").close();
        }

        const changeFilterType = (event) => {
            const targetClass = ".filter-target-" + $(event.target).val();

            $(".filter-targets").hide();

            $(targetClass).show();
        };

        $('form#filterForm select.filter-target').change(changeFilterType);

        $('form#filterForm input[type="submit"]').click(handleSubmitAddFilterDialog.bind(this));

        $('form#filterForm input[type="cancel"]').click(handleCancelAddFilterDialog);
    }

    render()
    {
        const addFilterDialogEngine = Handlebars.compile(addFilterDialogTemplate);

        const types = Object.entries(configuration.settings.types);
        let showTypes = [];

        types.forEach((entry) => {
            showTypes.push({
                "key": entry[0],
                "displaySymbol": entry[1].displaySymbol.length > 0 ? entry[1].displaySymbol : `<i>${entry[0]}</i>`,
                "description": entry[1].description.length > 0 ? entry[1].description : `<i>No description</i>`
            });
        });

        let data = {
            types: showTypes
        };

        return addFilterDialogEngine(data);
    }
}
