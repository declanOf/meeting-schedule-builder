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
    }

    #buildTypes()
    {
        const types = this.#configuration.settings.types;

        this.#controlTypes = [];

        Object.entries(types).forEach((elem) => {
            const key = elem[0];

            const withableTypes = Object.fromEntries(Object.entries(types).filter((entry) => entry[0] !== key));

            const selected   = withableTypes;

            let withKey = null;

            if (selected > -1) {
                const headerType = headerTypeKeys[selected];

                withKey = "withKey" in headerType ? headerType.withKey : null;
            }

            this.#controlTypes.push({
                "key"          : key,
                "withKey"      : withKey,
                "withableTypes": withableTypes,
                "description"  : elem[1].description,
                "displaySymbol": elem[1].displaySymbol,
                "showInHeader": elem[1].showInHeader,
                "showInColumn": elem[1].showInColumn
            });
        });
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
        // Handlebars.registerPartial

        // instantiate and render the sections controller, then pass that to the control template.
        // the advantage is the sections controller then handles the logic for columns, and possibly other logic that arises.

        const sectionsControls = new SectionsControls(this.#meetings, this.#configuration.settings.sections);

        const filters = new Filters(this.#meetings, this.#configuration.settings.filter);

        const controlTemplatesData = {
            "documentHeader"           : this.#configuration.settings.documentHeader,
            "documentFooter"           : this.#configuration.settings.documentFooter,
            "expiryHours"              : this.#configuration.settings.expiryHours,
            "sourceUrl"                : this.#configuration.settings.sourceUrl,
            "addressReplacements"      : this.#configuration.settings.addressReplacements,
            "nameReplacements"         : this.#configuration.settings.nameReplacements,
            "meetingFontSize"          : this.#configuration.settings.meetingFontSize,
            "controlTypes"             : this.#controlTypes,
            "sectionsControlsContent"  : sectionsControls.render(),
            "filtersContent"           : filters.render(),
            "regions"                  : this.#regions,
            "groups"                   : this.#groups,
            "districts"                : this.#districts,
            "fontSizes"                : fontSizes,
            "columnsMap"               : {"time": "Time", "locationAddress": "Location / Address", "days": "Days", "name": "Name", "types": "Types"}
        }
        return controlsTemplateEngine(controlTemplatesData);
    }
}