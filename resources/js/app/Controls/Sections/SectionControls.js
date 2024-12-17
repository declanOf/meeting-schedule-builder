class SectionControls
{
    #section;

    #key;

    #template;

    #meetings;

    constructor(meetings, section, key)
    {
        this.#template = sectionControlsTemplate;

        this.#meetings = meetings;

        this.#section = section;

        this.#key = key;
    }

    getFiltersContent()
    {
        const filters = new Filters(this.#meetings, this.#section.filter);

        filters.prefix = `sections.${this.#key}.`;
        return filters.render();
    }

    convertDaysetColumnsStructure()
    {
        let columns = [];

        this.#section.columns.forEach((day, dayIndex) => {
            day.forEach((column, colIndex) => {
                if (dayIndex === 0) {
                    columns.push([]);
                }

                columns[colIndex].push(column);
            });
        });

        this.#section.transposedColumns = columns;
    }

    render()
    {
        const filtersContent = this.getFiltersContent();

        const sectionControlsTemplateEngine = Handlebars.compile(this.#template);

        const isArrayOfColumns = Array.isArray(this.#section.columns[0]);

        if (isArrayOfColumns) {
            this.convertDaysetColumnsStructure();
        }

        return sectionControlsTemplateEngine({
                     "section": this.#section,
                     "sources": this.#meetings.sources,
                     "columns": this.#section.columns,
           "transposedColumns": this.#section.transposedColumns,
              "arrayOfColumns": isArrayOfColumns,
              "filtersContent": filtersContent,
                  "sectionKey": this.#key
        });
    }
}