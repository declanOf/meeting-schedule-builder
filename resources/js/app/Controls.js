class Controls
{
    #configuration;
    #controlTypes;
    #template;

    #meetings;

    #groups;
    #regions;
    #districts;

    #configurationManageDialog;

    constructor(Configuration, meetings)
    {
        this.#configuration = Configuration;

        this.#template = controlsTemplate;

        this.#groups = meetings.groups;

        this.#meetings = meetings;

        this.#regions = meetings.regions;

        this.#districts = meetings.districts;

        this.#buildTypes();

        this.assignConfigurationChangeHandler();

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
                "displaySymbol": elem[1].displaySymbol,
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


        // TODO: show dialog requesting new name, and indicating origin configuration

        // TODO: use dialog
        const deleteConfigurationHandler = (event) => {
            event.preventDefault();

            const lineItem = $($(event.target).parents("li")[0]);

            const configurationKey = lineItem.attr("data-key");

            this.configurationDeleteDialog = new ConfigurationDeleteDialog(configurationKey);

            this.configurationDeleteDialog.open();
        };

        // TODO: show dialog showing old name and requesting new name
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
        }

        const refreshSchedule = (event) => {
            event.preventDefault();

            const configuration = new Configuration();

            const prefix = configuration.activeConfigurationKey;

            localStorage.setItem(prefix + "timestamp", 0);

            debugger;

            location.reload();
        };

        $("#create-new-schedule").click((event) => {
            event.preventDefault();

            alert("create new");
        });

        const createSchedule = (event) => {
            event.preventDefault();

            const schedule = $("#preexisting-schedule").find(":selected");

            const scheduleData = {
                 url: schedule.val(),
                name: schedule.text()
            };

            if (createFreshConfiguration(scheduleData)) {
                alert("Close this alert to load your new configuration!");

                location.reload();
            }
        }

        setTimeout(() => {
            $("li a.select").click(selectConfigurationHandler);

            $("#controlsManageForm .delete").click(deleteConfigurationHandler);

            $("#controlsManageForm .rename").click(renameConfigurationHandler);

            $('#cloneScheduleForm input[type="submit"].submit').on("click", addScheduleHandler);

            $("#controlsManageForm #refresh-schedule").on("click", refreshSchedule);

            $("#create-schedule").click(createSchedule);

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

                this.#configurationManageDialog = new ConfigurationManageDialog();

                $('#show-configuration-manage-dialog').click((event) => this.#configurationManageDialog.open(event));
            },
            1000
        )
    }

    // build existing section from configuration
    /**
     * title
     * columns (displayed)
     * filter
     *  name contains none of
     *  name contains one of
     *  types
     *  attendance option
     *  in district, regions, groups
     *  out districts, regions, groups
     * showTypes
     *
     */
    // build empty section

    render()
    {
        const controlsTemplateEngine = Handlebars.compile(this.#template);

        // get the main controls, and filters
        // loop each section, get controls and filters

        Handlebars.registerPartial('filters', filtersTemplate);

        // instantiate and render the sections controller, then pass that to the control template.
        // the advantage is the sections controller then handles the logic for columns, and possibly other logic that arises.

        const sectionsControls = new SectionsControls(this.#meetings, this.#configuration.settings.sections);

        const filters = new Filters(this.#meetings, this.#configuration.settings.filter, null);

        const buildNewScheduleFormEngine = Handlebars.compile(buildNewScheduleFormTemplate);


        const configurationString = JSON.stringify(this.#configuration.settings, null, 4);

        const controlTemplatesData = {
            downloadData                : btoa(configurationString + "\n"),
            configurationAsString       : configurationString,
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