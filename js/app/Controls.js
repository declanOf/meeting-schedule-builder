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

        const controlTemplatesData = {
            "documentHeader"              : this.#configuration.settings.documentHeader,
            "documentFooter"              : this.#configuration.settings.documentFooter,
            "expiryHours"                 : this.#configuration.settings.expiryHours,
            "minimumMultidayCount"        : this.#configuration.settings.minimumMultidayCount,
            "showSectionDivider"          : this.#configuration.settings.showSectionDivider,
            "printDocumentFooter"         : this.#configuration.settings.printDocumentFooter,
            "showColumnHeadersForEachDay" : this.#configuration.settings.showColumnHeadersForEachDay,
            "sourceUrl"                   : this.#configuration.settings.sourceUrl,
            "addressReplacements"         : this.#configuration.settings.addressReplacements,
            "nameReplacements"            : this.#configuration.settings.nameReplacements,
            "meetingFontSize"             : this.#configuration.settings.meetingFontSize,
            "footerFontSize"              : this.#configuration.settings.footerFontSize,
            "controlTypes"                : this.#controlTypes,
            "sectionsControlsContent"     : sectionsControls.render(),
            "filtersContent"              : filters.render(),
            "regions"                     : this.#regions,
            "groups"                      : this.#groups,
            "districts"                   : this.#districts,
            "fontSizes"                   : fontSizes,
            "columnsMap"                  : {"time": "Time", "locationAddress": "Location / Address", "days": "Days", "name": "Name", "types": "Types"}
        }
        return controlsTemplateEngine(controlTemplatesData);
    }
}