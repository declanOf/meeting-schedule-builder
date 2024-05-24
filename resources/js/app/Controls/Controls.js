class Controls
{
    #configuration;
    #controlTypes;
    #template;

    #meetings;

    #groups;
    #regions;
    #districts;

    constructor(Configuration, meetings)
    {
        this.#configuration = Configuration;

        this.#template = controlsTemplate;

        this.#groups = meetings.groups;

        this.#meetings = meetings;

        this.#regions = meetings.regions;

        this.#districts = meetings.districts;

        this.#buildTypes();

        this.assignHandlers();
    }

    #buildTypes()
    {
        const types = this.#configuration.settings.types;

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

            alert("Using new configuration. Page will reload automatically.");

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

        const refreshSchedule = (event) => {
            event.preventDefault();

            const configuration = new Configuration();

            const prefix = configuration.activeConfigurationKey;

            localStorage.setItem(prefix + "timestamp", 0);

            location.reload();
        };

        const createScheduleFromScratch = ((event) => {
            event.preventDefault();

            const scheduleData = {
                url: $("#scratch-source-url").val(),
                name: $("#scratch-name").val()
            };

            if (createFreshSchedule(scheduleData)) {
                alert("Close this alert to load your new configuration!");

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

        setTimeout(() => {
            $("li a.select").on("click", selectConfigurationHandler);

            $("#controlsManageForm .delete").on("click", deleteConfigurationHandler);

            $("#controlsManageForm .rename").on("click", renameConfigurationHandler);

            $('#cloneScheduleForm input[type="submit"].submit').on("click", addScheduleHandler);

            $("#controlsManageForm #refresh-schedule").on("click", refreshSchedule);

            $("#create-schedule").on("click", createSchedule);

            $("#create-schedule-from-scratch").on("click", createScheduleFromScratch);

            $("#save-manual-edits").on("click", saveManualEdits);

            $("#exportConfiguration textarea").on("click", (event) => $("#exportConfiguration textarea").select());
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

        const sectionsControls = new SectionsControls(this.#meetings, this.#configuration.settings.sections);

        const filters = new Filters(this.#meetings, this.#configuration.settings.filter, null);

        const buildNewScheduleFormEngine = Handlebars.compile(buildNewScheduleFormTemplate);

        const configurationString = JSON.stringify(this.#configuration.settings, null, 4);

        let configurationName = "";

        this.#configuration.availableConfigurations.forEach((config) => {
            if (this.#configuration.activeConfigurationKey === config[0]) {
                configurationName = config[1];
            }
        })

        const controlTemplatesData = {
            pageSizes                   : PageSizes,
            pageOrientations            : PageOrientations,
            downloadData                : btoa(configurationString + "\n"),
            configurationAsString       : configurationString,
            configurationName           : configurationName,
            documentHeader              : this.#configuration.settings.documentHeader,
            documentFooter              : this.#configuration.settings.documentFooter,
            expiryHours                 : this.#configuration.settings.expiryHours,
            minimumMultidayCount        : this.#configuration.settings.minimumMultidayCount,
            showSectionDivider          : this.#configuration.settings.showSectionDivider,
            printDocumentFooter         : this.#configuration.settings.printDocumentFooter,
            showColumnHeadersForEachDay : this.#configuration.settings.showColumnHeadersForEachDay,
            sourceUrl                   : this.#configuration.settings.sourceUrl,
            addressReplacements         : this.#configuration.settings.addressReplacements,
            nameReplacements            : this.#configuration.settings.nameReplacements,
            meetingFontSize             : this.#configuration.settings.meetingFontSize,
            footerFontSize              : this.#configuration.settings.footerFontSize,
            activeConfigurationKey      : this.#configuration.activeConfigurationKey,
            availableConfigurations     : this.#configuration.availableConfigurations,
            pageSize                    : this.#configuration.settings.pageSize,
            pageOrientation             : this.#configuration.settings.pageOrientation,
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