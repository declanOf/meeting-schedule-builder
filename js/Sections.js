class Sections
{
    #configuration;
    #meetings;
    #multiDayCandidates;
    #sections;

    constructor(Configuration, meetings) {
        this.#configuration = Configuration;

        this.#meetings = meetings.meetings;

        this.#instantiate();
    }

    #instantiate()
    {
        this.#sections = [];

        this.#configuration.settings.sections.forEach((section, index) => {
            if (!section.display) {
                return;
            }

            switch (section.type) {
                case 'generic':
                case 'spanish':
                    this.#sections.push(new GenericBlockSection(this.#getMultiDayCandidates().singleInclusiveDays, section, index, this.#configuration));
                break;
                case 'service':
                    this.#sections.push(new GenericBlockSection(this.#getMultiDayCandidates().mixedFullDays, section, index, this.#configuration));
                break;

                case 'multi-days':
                    this.#sections.push(new MultiDaysSection(this.#getMultiDayCandidates().multiDays, section, index, this.#configuration));
                break;

                // TODO: Add different day options to section type options
                case 'mixed-full-days':
                    this.#sections.push(new SingleDaysSection(this.#getMultiDayCandidates().mixedFullDays, section, this.#configuration, index));
                break;
                case 'single-inclusive-days':
                    this.#sections.push(new SingleDaysSection(this.#getMultiDayCandidates().singleInclusiveDays, section, this.#configuration, index));
                break;
                case 'single-exclusive-days':
                    this.#sections.push(new SingleDaysSection(this.#getMultiDayCandidates().singleExclusiveDays, section, this.#configuration, index));
                break;
            }
        });
    }

    get sections()
    {
        return this.#sections;
    }

    render()
    {
        this.#sections.forEach((section) => {
            if (this.#configuration.settings.showSectionDivider) {
                $('div.page').append('<hr class="section-divider">');
            }

            $('div.page').append(section.render());
        });

        window.setTimeout(
            () => {
                let handler = null;

                let activate = false;

                // Create observer
                const headerResizeObserver = new ResizeObserver((entries) => {
                    if (!activate) {
                        return activate = true;
                    }

                    if (handler) {
                        window.clearTimeout(handler);
                    }

                    /**
                     * Create timeout for resize to avoid a flood of executions.
                     *
                     * After half a second, the new size is to be saved.
                     *
                     * TODO: store widths
                     */
                    handler = window.setTimeout(() => {
                        const table = $($(entries[0].target).parents("table")[0]);

                        const meetingIndex = parseInt(table.attr('data-index'));

                        const dayIndex = parseInt(table.attr('data-dayindex'));

                        let changeData = {meetingIndex: meetingIndex, dayIndex: dayIndex, columnSizes: []};

                        entries.forEach((entry, columnIndex) => {
                            const target = $(entry.target);

                            const size = entry.borderBoxSize[0].inlineSize

                            changeData.columnSizes.push(size);
                        });

                        this.#configuration.columnSizes = changeData;
                    }, 500);
                });

                // Assign observer to elements
                [...document.getElementsByClassName('column-header')].forEach((element) => {
                    headerResizeObserver.observe(element);
                });
            }, 500
        );

        return this;
    }

    #getMultiDayCandidates()
    {
        if (!this.#multiDayCandidates) {
            this.#meetings = new MeetingFilter(this.#meetings, this.#configuration.settings.filter).meetings;

            this.#multiDayCandidates = new MultiDayCandidates(this.#meetings, this.#configuration);
        }

        return this.#multiDayCandidates;
    }
}