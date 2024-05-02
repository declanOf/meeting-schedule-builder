class SectionsControls
{
    #columns;

    #meetings;
    
    #sections;

    #template;

    constructor(meetings, sections)
    {
        this.#template = sectionsControlsTemplate;

        this.#meetings = meetings;

        this.#sections = sections;
        
        this.#columns = this.getAvailableColumns();
    }

    getAvailableColumns() {
        let columns = localStorage.getItem("availableColumns");
        
        return columns !== "undefined" ? JSON.parse(columns) : this.buildAvailableColumns();
    }

    buildAvailableColumns()
    {
        let columns = [];

        this.#meetings.meetings.forEach((elem) => columns = columns.concatUnique(Object.keys(elem)));

        localStorage.setItem("availableColumns", JSON.stringify(columns));

        return columns;
    }

    buildColumns()
    {
        Object.entries(this.#meetings).forEach((elem) => {
            const key = elem[0];
/**
 * [
 * {"key": "blah", "name": "blah", "order": 0}
 * ]
 */
            const selected   = headerTypes.pluck("key").indexOf(key);

            let withKey = null;

            if (selected > -1) {
                const headerType = headerTypes[selected];

                withKey = "withKey" in headerType ? headerType.withKey : null;
            }

            // this.#controlTypes.push({
            //     "key"          : key,
            //     "withKey"      : withKey,
            //     "withableTypes": withableTypes,
            //     "description"  : elem[1].description,
            //     "displaySymbol": elem[1].displaySymbol
            // });
        });

        // get displayed columns from sections
        // get columns from the meetings lists
        // build column selection options for each section
    }

    getSectionsControlsContent()
    {
        
        let sectionsControlsContent = "";

        this.#sections.forEach((section, key) => {
            const sectionControls = new SectionControls(this.#meetings, section, key)
            sectionsControlsContent += sectionControls.render();
        });

        return sectionsControlsContent;
    }

    render()
    {
        const sectionsControlsContent = this.getSectionsControlsContent();

        Handlebars.registerPartial('sectionControls', sectionControlsTemplate);

        const sectionsControlsTemplateEngine = Handlebars.compile(this.#template);

        return sectionsControlsTemplateEngine({
            "sectionsControlsContent" : sectionsControlsContent
        });
    }
}