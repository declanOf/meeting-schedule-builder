class RowHelper
{
    #meetings;

    #section;

    #configuration;

    #displayFriendlyRows;

    constructor(meetings, section)
    {
        this.#meetings = meetings;

        this.#section = section;
    }

    get configuration()
    {
        if (this.#configuration) {
            return this.#configuration;
        }

        this.#configuration = new Configuration();

        return this.#configuration;
    }

    get headerRow()
    {
        // Build header
        const headerTemplateEngine = Handlebars.compile(headerTemplate);

        let headerRows = [];
        let headerRow = [];

        const columnCount = this.section.columns.length;

        if (this.#section.title) {
            headerRows.push([{"key": "title", "value": this.#section.title, "colspan": columnCount}]);
        };

        this.section.columns.forEach((column) => {
            headerRow.push({"key": column.source, "value": column.title, "colspan": 1, "width": column.width});
        });

        headerRows.push(headerRow);
        const header = {
            "rows": headerRows,
        }

        return headerTemplateEngine(header);
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

    get meetings()
    {
        return this.#meetings;
    }

    get section()
    {
        return this.#section;
    }

    get displayFriendlyRows()
    {
        let content = "";

        if (this.#displayFriendlyRows) {
            return this.#displayFriendlyRows;
        }

        const rowTemplateEngine = Handlebars.compile(rowTemplate);

        // Build rows
        Object.entries(this.meetings).forEach((entry) => {
            const key = entry[0];
            const meeting = entry[1];

            let row = {"key": key.replace(/[: ]/g, "_"), "columns": {}};

            this.section.columns.forEach((column) => {
                if (column.source === "types") {
                    row.columns[column.source] = {"key": column.source, "name": column.name, "width": column.width, "value": this.#getTypesFromMeeting(meeting)};
                } else if (column.source in meeting) {
                    row.columns[column.source] = {"key": column.source, "name": column.name, "width": column.width, "value": meeting[column.source]};
                } else if (column.source === "locationAddress") {
                    row.columns[column.source] = {"key": column.source, "name": column.name, "width": column.width, "value": this.#getFormattedAddress(meeting)};
                } else {
                    console.error("Unknown key", column.source);
                    console.log("Meeting", meeting);
                }
            });

            content += rowTemplateEngine(row);
        });

        this.#displayFriendlyRows = `<tbody>${content}</tbody>`;

        return this.#displayFriendlyRows;
    }

    #getFormattedAddress(meeting)
    {
        let locationAddress = "";

        let address = meeting['formatted_address'];

        let location = meeting['location'];

        this.configuration.settings.addressReplacements.forEach((replacement) => {
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
}