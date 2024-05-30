class Schedule
{
    #meetings;
    #multiDayCandidates;
    #sections;

    constructor(Configuration, meetings) {
        this.#meetings = meetings.meetings;

        this.#instantiate();
    }

    #instantiate()
    {
        this.#sections = [];

        configuration.settings.sections.forEach((section, index) => {
            if (!section.display) {
                return;
            }

            switch (section.type) {
                case 'generic':
                case 'spanish':
                    this.#sections.push(new GenericBlockSection(this.#getMultiDayCandidates().singleInclusiveDays, section, index, configuration));
                break;
                case 'service':
                    this.#sections.push(new GenericBlockSection(this.#getMultiDayCandidates().mixedFullDays, section, index, configuration));
                break;

                case 'multi-days':
                    this.#sections.push(new MultiDaysSection(this.#getMultiDayCandidates().multiDays, section, index, configuration));
                break;

                case 'mixed-full-days':
                    this.#sections.push(new SingleDaysSection(this.#getMultiDayCandidates().mixedFullDays, section, configuration, index));
                break;
                case 'single-inclusive-days':
                    this.#sections.push(new SingleDaysSection(this.#getMultiDayCandidates().singleInclusiveDays, section, configuration, index));
                break;
                case 'single-exclusive-days':
                    this.#sections.push(new SingleDaysSection(this.#getMultiDayCandidates().singleExclusiveDays, section, configuration, index));
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
            if (configuration.settings.showSectionDivider) {
                $('div.page').append('<hr class="section-divider">');
            }

            $('div.page').append(section.render());
        });

        if (configuration.settings.printDocumentFooter) {
            const footer = $(`<p style="text-align: center; padding-top: 12pt; margin-bottom: 0;" class="${configuration.settings.footerFontSize}">${configuration.settings.documentFooter}</p>`);

            $("div.page").append(footer);
        }

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

                            const size = entry.borderBoxSize[0].inlineSize;

                            changeData.columnSizes.push(size);
                        });

                        configuration.columnSizes = changeData;

                        configuration.copyColumnWidthChangesToFormFields(changeData);

                        configuration.write();
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
            this.#meetings = new MeetingFilter(this.#meetings, configuration.settings.filter).meetings;

            this.#multiDayCandidates = new MultiDayCandidates(this.#meetings, configuration);
        }

        return this.#multiDayCandidates;
    }
}