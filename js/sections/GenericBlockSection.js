class GenericBlockSection
{
    #meetings;

    #section;

    #displayFriendlyRows;

    #sectionIndex;

    constructor(meetings, section, sectionIndex)
    {
        this.#meetings = meetings;

        this.#section = section;

        this.#sectionIndex = sectionIndex;

        this.#meetings = GenericBlockSection_Filter.filter(this.#meetings, this.#section);
    }

    get section()
    {
        return this.#section;
    }

    get sectionIndex()
    {
        return this.#sectionIndex;
    }

    get meetings()
    {
        return this.#meetings;
    }

    set meetings(meetings)
    {
        this.#meetings = meetings;
    }

    render()
    {
        return `<table class="meetings font-size-10-75pt" data-index="${this.sectionIndex}">${this.displayFriendlyRows}</table>`;
    }

    get displayFriendlyRows()
    {
        const rowHelper = new RowHelper(this.meetings, this.section);

        return `${rowHelper.headerRow} ${rowHelper.displayFriendlyRows}`;
    }
};
