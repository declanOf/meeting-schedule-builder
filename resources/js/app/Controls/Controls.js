class Controls
{
    #controlTypes;
    #template;

    #meetings;

    #groups;
    #regions;
    #districts;

    constructor(Configuration, meetings)
    {
        this.#template = controlsTemplate;

        this.#groups = meetings.groups;

        this.#meetings = meetings;

        this.#regions = meetings.regions;

        this.#districts = meetings.districts;

        this.#buildTypes();

    }

    #buildTypes()
    {
        const types = configuration.settings.types;

        this.#controlTypes = [];

        Object.entries(types).forEach((elem) => {
            const key = elem[0];

            const withableTypes = Object.fromEntries(Object.entries(types).filter((entry) => entry[0] !== key));

            this.#controlTypes.push({
                "key"          : key,
                "withKey"      : elem[1].withKey ? elem[1].withKey : null,
                "withableTypes": withableTypes,
                "description"  : elem[1].description,
                "displaySymbol": elem[1].displaySymbol.length > 0 ? elem[1].displaySymbol : key,
                "showInHeader": elem[1].showInHeader,
                "showInColumn": elem[1].showInColumn
            });
        });
    }

    assignHandlers() {
        console.info("Assigning handlers");

        const selectConfigurationHandler = (event) => {
            event.preventDefault();

            const lineItem = $($(event.target).parents("li")[0]);

            const configurationKey = lineItem.attr("data-key");

            localStorage.setItem("activeConfigurationKey", configurationKey);

            alert("Using new schedule. Page will reload automatically.");

            location.reload();
        };

        // TODO: use dialog
        const deleteConfigurationHandler = (event) => {
            event.preventDefault();

            const lineItem = $($(event.target).parents("li")[0]);

            const configurationKey = lineItem.attr("data-key");

            this.configurationDeleteDialog = new ConfigurationDeleteDialog(configurationKey);

            this.configurationDeleteDialog.open();
        };

        const renameConfigurationHandler = (event) => {
            event.preventDefault();

            const lineItem = $($(event.target).parents("li")[0]);

            const configurationKey = lineItem.attr("data-key");

            const configurationRenameDialog = new ConfigurationRenameDialog(configurationKey);

            configurationRenameDialog.open();
        };

        const addScheduleHandler = (event) => {
            event.preventDefault();

            let formData = Object.entries($("form#cloneScheduleForm").serializeArray()).pluck(1).serialiseToObject();

            if (formData.name.length < 3) {
                window.alert("Name must be longer than two characters")
                return;
            }

            const configuration = new Configuration();

            configuration.cloneConfiguration(formData);

            location.reload();
        };

        const createScheduleFromScratch = ((event) => {
            event.preventDefault();

            const scheduleData = {
                url: $("#scratch-source-url").val(),
                name: $("#scratch-name").val()
            };

            if (createFreshSchedule(scheduleData)) {
                alert("Close this alert to load your new schedule!");

                location.reload();

                return;
            }
        });

        const createSchedule = (event) => {
            event.preventDefault();

            const schedule = $("#preexisting-schedule").find(":selected");

            const scheduleData = {
                 url: schedule.val() + "/wp-admin/admin-ajax.php?action=meetings",
                name: schedule.text()
            };

            if (createFreshSchedule(scheduleData)) {
                alert("Close this alert to load your new configuration!");

                location.reload();

                return;
            }
        }

        const saveManualEdits = (event) => {
            event.preventDefault();

            const configurationString = $("#configuration-textarea").val();

            try {
                JSON.parse(configurationString);

                (new Configuration()).saveEdit(configurationString);
            } catch (error) {
                return alert("Error: " + error);
            }
        }

        const addFilter = (event) => {
            event.preventDefault();

            const addFilterDialog = new AddFilterDialog($(event.target));

            addFilterDialog.open();
        };

        const addTextReplacement = (event) => {
            event.preventDefault();

            const addReplacementDialog = new AddReplacementDialog();

            addReplacementDialog.open();
        };

        const setControlsDirty = (event) => {
            configuration.setDirty(true, "Text changes have been made");
        };

        const resetChanges = (event) => {
            window.reload();
        };

        const saveChanges = function (event) {
            event.preventDefault();

            configuration.saveChanges();
        };

        setTimeout(() => {
            $("#save-changes").on("click", saveChanges);

            $("#reset-changes").on("click", resetChanges);

            $('div#controls input[type="text"]').on("keyup", setControlsDirty);

            $('div#controls textarea').on("keyup", setControlsDirty);

            $('div#controls select').on("change", setControlsDirty);

            $('div#controls input[type="checkbox"]').on("change", setControlsDirty);

            $("#add-text-replacement").on("click", addTextReplacement);

            $(".filters-container .add-filter").on("click", addFilter);

            $("#controlsManageForm li a.select").on("click", selectConfigurationHandler);

            $("#controlsManageForm .delete").on("click", deleteConfigurationHandler);

            $("#controlsManageForm .rename").on("click", renameConfigurationHandler);

            $('#cloneScheduleForm input[type="submit"].submit').on("click", addScheduleHandler);

            $("#create-schedule").on("click", createSchedule);

            $("#create-schedule-from-scratch").on("click", createScheduleFromScratch);

            $("#save-manual-edits").on("click", saveManualEdits);

            $("#exportConfiguration textarea").on("click", (event) => $("#exportConfiguration textarea").select());

            $("#controlsForm").tabs({
                "create": () => {
                    configuration.availableConfigurations.forEach((elem) => {
                        if (configuration.activeConfigurationKey !== elem[0]) {
                            return;
                        }

                        $("ul.ui-tabs-nav").append($(`<label style="padding-left: 2em; line-height: 2.5em;">Current Configuration: ${elem[1]}</label>`));
                    });
                }
            });

            $("#controlsManageForm").tabs();

        }, 1000);
    }

    assignConfigurationChangeHandler() {
        setTimeout(
            () => {
                $("#select-available-configuration").on("change", (event) => {
                    const selection = $("#select-available-configuration").val();

                    if (selection === "clone-configuration") {
                        (new Configuration().cloneConfiguration());
                        location.reload();
                    } else {
                        localStorage.setItem("activeConfigurationKey", selection);
                        location.reload();
                    }
                });
            },
            1000
        )
    }

    render()
    {
        const controlsTemplateEngine = Handlebars.compile(this.#template);

        Handlebars.registerPartial('filters', filtersTemplate);

        const sectionsControls = new SectionsControls(this.#meetings, configuration.settings.sections);

        const filters = new Filters(this.#meetings, configuration.settings.filter, null);

        const buildNewScheduleFormEngine = Handlebars.compile(buildNewScheduleFormTemplate);

        const configurationString = JSON.stringify(configuration.settings, null, 4);

        let configurationName = "";

        configuration.availableConfigurations.forEach((config) => {
            if (configuration.activeConfigurationKey === config[0]) {
                configurationName = config[1];
            }
        })

        const controlTemplatesData = {
            pageSizes                   : PageSizes,
            pageOrientations            : PageOrientations,
            downloadData                : btoa(configurationString + "\n"),
            configurationAsString       : configurationString,
            configurationName           : configurationName,
            documentHeader              : configuration.settings.documentHeader,
            documentFooter              : configuration.settings.documentFooter,
            expiryHours                 : configuration.settings.expiryHours,
            minimumMultidayCount        : configuration.settings.minimumMultidayCount,
            showSectionDivider          : configuration.settings.showSectionDivider,
            printDocumentFooter         : configuration.settings.printDocumentFooter,
            showColumnHeadersForEachDay : configuration.settings.showColumnHeadersForEachDay,
            sourceUrl                   : configuration.settings.sourceUrl,
            addressReplacements         : configuration.settings.addressReplacements,
            nameReplacements            : configuration.settings.nameReplacements,
            meetingFontSize             : configuration.settings.meetingFontSize,
            footerFontSize              : configuration.settings.footerFontSize,
            activeConfigurationKey      : configuration.activeConfigurationKey,
            availableConfigurations     : configuration.availableConfigurations,
            pageSize                    : configuration.settings.pageSize,
            pageOrientation             : configuration.settings.pageOrientation,
            margin                      : configuration.settings.margin,
            controlTypes                : this.#controlTypes,
            sectionsControlsContent     : sectionsControls.render(),
            filtersContent              : filters.render(),
            regions                     : this.#regions,
            groups                      : this.#groups,
            districts                   : this.#districts,
            fontSizes                   : fontSizes,
            centralOffices              : CentralOffices,
            buildNewScheduleForm        : buildNewScheduleFormEngine({centralOffices: CentralOffices}),
            columnsMap                  : {"time": "Time", "locationAddress": "Location / Address", "days": "Days", "name": "Name", "types": "Types"}
        }

        return controlsTemplateEngine(controlTemplatesData);
    }
}