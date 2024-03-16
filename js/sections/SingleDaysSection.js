class SingleDaysSection extends GenericBlockSection
{
    // figure out whether we're excluding multi-days from the listing
    // should exclude meetings matched by other filters, too

    #displayFriendlyRows;

    #configuration;

    constructor(meetings, section, configuration, sectionIndex)
    {
        super(meetings, section, sectionIndex, configuration);

        this.#configuration = configuration;
    }

    /**
     * Create data blocks of each day
     * Renders seven blocks of content first
     * Then combines them in accordance with the days of week order
     * Then adds a main header,. then returns all as a string
     * @returns
     */
    render()
    {
        let data = this.meetings;

        // get arrays of meetings broken into separate arrays of days
        const daySets = this.getDaySets();

        const daysContent = Object.entries(daySets).map((entry, index) => [entry[0], this.renderDays(entry, index)]);

        // for each day, render the day
        let daysOfWeekContent = Object.fromEntries(daysContent);

        // add title, then loop array to add content
        const orderedContent = this.getOrderedDaysContent(daysOfWeekContent);

        return orderedContent;
    }

    get configuration()
    {
        if (this.#configuration) {
            return this.#configuration;
        }

        this.#configuration = new Configuration();

        return this.#configuration;
    }

    /**
     *
     * @param {*} data Contains day string, columns, and rows
     * @returns
     */
    renderDays(data, index)
    {
        const controlsTemplateEngine = Handlebars.compile(repeatDayAndColumnNameTemplate);
        const rowTemplateEngine = Handlebars.compile(rowTemplate);

        let content = "";

        const dayName = this.days[data[0]];

        let rows = [];

        const columnCount = this.section.columns.length;

        const headers = this.section.columns[index].map((column) => {
            return {"key": column.source, "name": column.title, "width": column.width};
        });

        data[1] = data[1].sort((a, b) => parseInt(a[1].time.replace(":", "")) - parseInt(b[1].time.replace(":", "")));

        Object.entries(data[1]).forEach((entry) => {
            const rowKey = entry[1][0];
            const meeting = entry[1][1];

            let row = {"key": rowKey.replace(/[: ]/g, "_"), "columns": {}};

            this.section.columns[index].forEach((column) => {
                if (column.source === "types") {
                    row.columns[column.source] = { "key": column.source, "value": this.#getTypesFromMeeting(meeting) };
                } else if (column.source in meeting) {
                    if (column.source === "name") {
                        row.columns[column.source] = { "key": column.source, "value": this.#getFormattedName(meeting[column.source]) };
                    } else {
                        row.columns[column.source] = { "key": column.source, "value": meeting[column.source] };
                    }
                } else if (column.source === "locationAddress") {
                    row.columns[column.source] = { "key": column.source, "value": this.#getFormattedAddress(meeting) };
                } else {
                    console.error("Unknown key", column);
                    console.log("Meeting", meeting);
                }
            });

            rows.push(rowTemplateEngine(row));
        });

        const handlebarsData = {
            "meetingFontSize": this.#configuration.settings.meetingFontSize,
            "day": dayName,
            "headers": headers,
            "rows": rows,
            "sectionIndex": this.sectionIndex,
            "dayIndex": index
        };

        content = controlsTemplateEngine(handlebarsData);

        return content;
    }

    #getFormattedAddress(meeting)
    {
        let locationAddress = "";

        let address = meeting['formatted_address'];

        let location = meeting['location'];

        this.#configuration.settings.addressReplacements.forEach((replacement) => {
            address = address.replace(new RegExp(replacement.replaceValue), replacement.withValue);

            location = location.replace(new RegExp(replacement.replaceValue), replacement.withValue);
        });

        if (address !== location) {
            locationAddress = `${location}: ${address}`;
        } else {
            locationAddress = location;
        }

        return locationAddress;
    }

    #getFormattedName(name)
    {
        this.#configuration.settings.nameReplacements.forEach((replacement) => {
            name = name.replace(new RegExp(replacement.replaceValue), replacement.withValue);
        });

        return name;
    }

    #getTypesFromMeeting(meeting)
    {
        if (!("types" in meeting)) {
            return " ";
        }

        let displayTypes = [];

        const configuredTypes = this.configuration.settings.types;

        meeting["types"].forEach((type) => {
            if (type in configuredTypes) {
                displayTypes.push(configuredTypes[type].displaySymbol);
            }
        });

        return displayTypes.join(" ");
    }

    getDaySets()
    {
        let meetingsByDay = {};

        Object.keys(this.days).forEach((day) => {
            meetingsByDay[day] = Object.entries(this.meetings).filter((entry) => entry[1].day === day)
        });

        return meetingsByDay;
    }

    getOrderedDaysContent(daysContent)
    {
        let content = "";

        Object.keys(this.days).forEach((day) => content += daysContent[day]);

        return content;
    }

    get days()
    {
        const order = this.orderOfDays ? this.orderOfDays : "SundayFirst";

        switch (order) {
            case 'SundayFirst':
                return {
                   "Su": "Sunday",
                    "M": "Monday",
                    "T": "Tuesday",
                    "W": "Wednesday",
                   "Th": "Thursday",
                    "F": "Friday",
                    "S": "Saturday"
                };
            break;

            case 'MondayFirst':
                return {
                    "M": "Monday",
                    "T": "Tuesday",
                    "W": "Wednesday",
                   "Th": "Thursday",
                    "F": "Friday",
                    "S": "Saturday",
                   "Su": "Sunday"
                };
            break;

            case 'SaturdayFirst':
                return {
                    "S": "Saturday",
                   "Su": "Sunday",
                    "M": "Monday",
                    "T": "Tuesday",
                    "W": "Wednesday",
                   "Th": "Thursday",
                    "F": "Friday"
                };
            break;
        }
    }
}
