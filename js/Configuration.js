class Configuration {
    #settings;

    #activeConfigurationKey;

    #availableConfigurations;

    #dirtySettings = false;

    #dirtyReasons = [];

    constructor() {
        this.#loadSettings();

        if (!this.#settings) {
            this.#initialize();
        }
    };

    #initialize()
    {
        localStorage.setItem("settings-" + this.#activeConfigurationKey, JSON.stringify(this.#defaultSettings));

        this.#loadSettings();
    }

    #loadSettings() {
        if (this.#settings) {
            return;
        }

        this.#availableConfigurations = JSON.parse(localStorage.getItem("availableConfigurations")) ?? [['default', "Default"]];
        this.#activeConfigurationKey = localStorage.getItem("activeConfigurationKey") ?? 'default';
        this.#settings = JSON.parse(localStorage.getItem("settings-" + this.#activeConfigurationKey));

        this.createDefaults();
    }

    createDefaults() {
        const availableConfigurations = localStorage.getItem("availableConfigurations") ?? false;

        if (availableConfigurations) {
            return;
        }

        localStorage.setItem("availableConfigurations", JSON.stringify([["default", "Default"]]));
        localStorage.setItem("activeConfigurationKey", "default");
        this.#write();
    }

    get availableConfigurations()
    {
        return this.#availableConfigurations;
    }

    get activeConfigurationKey()
    {
        return this.#activeConfigurationKey;
    }

    cloneConfiguration() {
        function uuidv4() {
            return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
              (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
            );
        }

        const newConfigurationKey = uuidv4();

        this.#availableConfigurations.push([newConfigurationKey, "New configuration"]);

        localStorage.setItem("availableConfigurations", JSON.stringify(this.#availableConfigurations));

        this.#activeConfigurationKey = newConfigurationKey;

        this.#write();
    }

    write() { this.#write(); }

    #write()
    {
        console.info("Writing to local storage");
        localStorage.setItem("activeConfigurationKey", this.#activeConfigurationKey);
        localStorage.setItem("settings-" + this.#activeConfigurationKey, JSON.stringify(this.#settings));
    }

    get settings()
    {
        return this.#settings;
    }

    set settings(settings)
    {
        this.#settings = settings;
    }

    set columnSizes(tableData)
    {
        const sectionIndex = tableData.meetingIndex;
        const dayIndex = tableData.dayIndex;
        const columnSizes = tableData.columnSizes;

        let columns = this.#settings.sections[sectionIndex].columns;

        if (!isNaN(dayIndex)) {
            columns = columns[dayIndex];
        }
            columnSizes.forEach((size, index) => {
                try {
                    columns[index].width = size+"px";
                } catch (error) {
                    console.error("error setting width for columns", columns)
                    console.error("index", index);
                    console.error(error);

                    throw error;
                }
            });

        if (!isNaN(dayIndex)) {
            this.#settings.sections[sectionIndex].columns[dayIndex] = columns;
        } else {
            this.#settings.sections[sectionIndex].columns = columns;
        }

        this.setDirty(true, "Column width changes");

        this.modifyConfiguredColumnSizes(sectionIndex, dayIndex, columnSizes);
    }

    modifyConfiguredColumnSizes(sectionIndex, dayIndex, columnSizes) {
        let section = this.settings.sections[sectionIndex];

        if (isNaN(dayIndex)) {
            columnSizes.forEach((columnSize, index) => {
                section.columns[index].width = columnSize + "px";
            });
        } else {
            columnSizes.forEach((columnSize, index) => {
                section.columns[dayIndex][index].width = columnSize + "px";
            });
        }

        this.settings.sections[sectionIndex] = section;
    }

    setDirty(isDirty, reason) {
        if (!isDirty) {
            this.#dirtyReasons = [];
            $("#save-changes").attr("title", "");
        }

        $("span.change-handler").removeClass("dirty");
        if (isDirty) {
            $("span.change-handler").addClass("dirty");
            this.#dirtyReasons.push(reason);
        }
    }

    saveChanges(event) {
        event.preventDefault();

        /**
         * Convert a flat array into a structured array
         * @param {*} flatArray
         * @returns
         */
        function reserialize(flatArray) {
            var data = {};
            flatArray.forEach((element) => {
                let val = element.value;

                if (!val) {
                    val = "";
                }

                val = val.replace("\r", "").replace("\n", "<br>");

                if (val === "on") {
                    val = true;
                } else if (val === "off") {
                    val = false;
                }

                let fullName = element.name;

                if (!fullName) {
                    return;
                }

                let fullNameParts = fullName.split('.');

                let prefix = '';

                let stack = data;

                for (let k = 0; k < fullNameParts.length - 1; k++) {
                    prefix = fullNameParts[k];

                    if (!stack[prefix]) {
                        stack[prefix] = {};
                    }

                    stack = stack[prefix];
                }

                prefix = fullNameParts[fullNameParts.length - 1];

                if (stack[prefix]) {
                    stack[prefix] += newVal = stack[prefix] + ',' + val;
                } else {
                    stack[prefix] = val;
                }
            });

            return data;
        }

        /**
         * Convert any objects with numerical keys into an array, nested
         * @param {*} targetObject
         * @returns
         */
        const convertObjectToArray = (targetObject) => {
            if (typeof targetObject !== "object" || Array.isArray(targetObject)) {
                if (typeof targetObject === "string")
                {
                    if (targetObject === "false") {
                        targetObject = false;
                    } else if (targetObject === "true") {
                        targetObject = true;
                    }
                }

                return targetObject;
            }

            let keys = Object.keys(targetObject);

            let numericalKeys = keys.filter((elem) => parseInt(elem) == elem);

            // deal with strange formatting anomaly
            if (keys.length === 1 && keys[0] === "") {
                return Object.values(targetObject)[0];
            }

            keys.forEach((key) => {
                if ("filter" === key) {
                    targetObject[key] = denormaliseFilter(targetObject[key]);
                } else if ("districts" === key) {
                    targetObject[key] = targetObject[key].map((elem) => parseInt(elem));
                } else if (key === "withKey" && typeof targetObject[key] === "string" && targetObject[key].length === 0) {
                    targetObject[key] = false;
                } else {
                    targetObject[key] = convertObjectToArray(targetObject[key]);
                }
            });

            if (numericalKeys.length === keys.length) {
                targetObject = Object.values(targetObject);
            }

            return targetObject;
        }

        const denormaliseFilter = (filter) => {
            let filterObject = {
                "exclude": {
                },
                "include": {
                }
            };

            Object.values(filter).forEach((elem) => {
                if (elem.key === "districts") {
                    elem.item = parseInt(elem.item);
                }

                if (!(elem.key in filterObject[elem.type.toLowerCase()])) {
                    filterObject[elem.type.toLowerCase()][elem.key] = [];
                }
                filterObject[elem.type.toLowerCase()][elem.key].push(elem.item);
            });

            return filterObject;
        };

        const restructureSectionsWithSetsOfSingleDays = (data) => {
            data.sections = data.sections.map((section) => {
                if ("days" in section) {
                    section.columns = [];
                    section.days.forEach((day) => {
                        // numericise dayKey column
                        day.columns = day.columns.map((column) => {
                            column.dayKey = parseInt(column.dayKey);
                            return column;
                        });

                        section.columns.push(day.columns)
                    });

                    delete section.days;
                }

                return section;
            });

            return data;
        };


        let formData = Object.entries($("form#controlsForm").serializeArray()).pluck(1);

        formData = reserialize(formData);

        formData = convertObjectToArray(formData);

        const settings = restructureSectionsWithSetsOfSingleDays(formData);

        console.log("current", this.settings);
        console.log("new", settings);

        // TODO: activate settings, and save them
        this.settings = settings;

        localStorage.setItem("settings-" + this.#activeConfigurationKey, JSON.stringify(this.settings));

        this.setDirty(false);

        return settings;
    }

    addMeetingKeys(meetings)
    {
        let keyAdded = false;

        meetings.types.forEach((key) => {
            if (!(key in this.settings.types)) {
                keyAdded = true;

                this.settings.types[`${key}`] = {
                    "displaySymbol": "",
                    "description"  : "",
                    "showInHeader" : false,
                    "showInColumn" : false
                };
            }
        });

        if (keyAdded) {
            this.#write();
        }
    }

    addFilter(filterData) {
        let filterValues = {"type": filterData.type, "target": filterData.target};

        switch (filterData.target) {
            case "types":
                filterValues["types"] = filterData.types;
            break;

            case "name":
                filterValues["name"] = filterData.name.split(",");
            break;

            case "districts":
                filterValues["districts"] = filterData.districts.split(",");
            break;

            case "attendanceOption":
                filterValues["attendanceOption"] = filterData.attendanceOption;
            break;
        }

        debugger;
    }

    #defaultSettings = {
        "sourceUrl": "https://www.saltlakeaa.org/wp-admin/admin-ajax.php?action=meetings",
        "expiryHours": 24,
        "meetingFontSize": "font-size-10-25pt",
        "footerFontSize": "font-size-9pt",
        "documentHeader": {
            "displayUrl": "https://www.saltlakeaa.org/meetings",
            "holidayHours": "Call For Holiday Hours",
            "inPerson": "In-Person Meetings Only",
            "lastUpdated": "Last Updated",
            "officeTitle": "Central Office<br>of Salt Lake City",
            "officeStreet": "80 West Louise Ave (2860 South)",
            "officeCity": "Salt Lake City",
            "officeState": "UT",
            "officeZipcode": "84115",
            "officePhone": "(801) 484-7871",
            "officeHours": "Monday-Friday 10AM-5PM<br>Saturday 10AM-2PM",
            "title": "AA Meeting Schedule",
            "website": "Check website for online meetings, accessibility services, and holiday changes.",
        },
        "minimumMultidayCount": 3,
        "showSectionDivider": true,
        "printDocumentFooter": true,
        "showColumnHeadersForEachDay": true,
        "documentFooter": "All meetings are self-reported. Central Office doesn't independently verify or endorse meetings.<br>* Holidays may affect some meetings.",
        "types": {
            "O": {
                "displaySymbol": "O",
                "showInHeader": true,
                "showInColumn": true,
                "description": "Open to anyone interested in AA",
                "withKey": false
            },
            "C": {
                "showInHeader": true,
                "displaySymbol": "C",
                "showInColumn": true,
                "description": "Closed to non-alcoholics",
                "withKey": false
            },
            "X": {
                "displaySymbol": "@",
                "showInHeader": true,
                "showInColumn": true,
                "description": "Wheelchair-accessible",
                "withKey": false
            },
            "LGBTQ": {
                "displaySymbol": "+",
                "showInHeader": true,
                "showInColumn": true,
                "description": "LGBTQ+",
                "withKey": false
            },
            "W": {
                "showInHeader": true,
                "displaySymbol": "W",
                "showInColumn": true,
                "description": "Women",
                "withKey": "M"
            },
            "M": {
                "displaySymbol": "M",
                "showInHeader": false,
                "showInColumn": true,
                "description": "Men",
                "withKey": false
            },
            "Y": {
                "displaySymbol": "Y",
                "showInHeader": true,
                "showInColumn": true,
                "description": "Young people",
                "withKey": false
            },
            "ASL": {
                "displaySymbol": "S",
                "showInHeader": true,
                "showInColumn": true,
                "description": "ASL interpreter present",
                "withKey": false
            },
        },
        "filter": {
            "exclude": {
                "districts": [501, 491],
                "group": null,
                "types": [],
                "attendanceOption": ["online", "inactive"]
            },
        },
        "sections": [
            {
                "title": "Daily Meetings",
                "type": "multi-days",
                "source": "multiDays",
                "display": true,
                "filter": {
                    "exclude": {
                        "districts": null,
                        "groups": null,
                        "types": ["S"],
                        "name": ["Central Office", "District"],
                    }
                },
                "columns": [
                    {
                        "source": "time_formatted",
                        "title": "Time",
                        "width": "68px",
                    },
                    {
                        "source": "name",
                        "title": "Name",
                        "width": "178px",
                    },
                    {
                        "source": "locationAddress",
                        "title": "Location",
                        "width": "422px",
                    },
                    {
                        "source": "days",
                        "title": "Days",
                        "width": "84px",
                    },
                    {
                        "source": "types",
                        "title": "Types",
                        "width": "60px",
                    },
                ],
            },
            {
                "title": null,
                "source": "singleDays",
                "type": "single-exclusive-days",
                "display": true,
                "filter": {
                    "exclude": {
                        "districts": null,
                        "groups": null,
                        "types": ["S"],
                        "name": ["Central Office", "District"],
                    },
                },
                "columns": [
                    [
                        {"dayKey": 0, "source": "time_formatted",  "title": "Time",     "width": "68px",},
                        {"dayKey": 0, "source": "name",            "title": "Name",     "width": "254px",},
                        {"dayKey": 0, "source": "locationAddress", "title": "Location", "width": "444px",},
                        {"dayKey": 0, "source": "types",           "title": "Types",     "width": "62px",},
                    ], [
                        {"dayKey": 1, "source": "time_formatted",  "title": "Time",     "width": "69px",},
                        {"dayKey": 1, "source": "name",            "title": "Name",     "width": "220px",},
                        {"dayKey": 1, "source": "locationAddress", "title": "Location", "width": "460px",},
                        {"dayKey": 1, "source": "types",           "title": "Types",     "width": "62px",},
                    ], [
                        {"dayKey": 2, "source": "time_formatted",  "title": "Time",     "width": "69px",},
                        {"dayKey": 2, "source": "name",            "title": "Name",     "width": "224px",},
                        {"dayKey": 2, "source": "locationAddress", "title": "Location", "width": "388px",},
                        {"dayKey": 2, "source": "types",           "title": "Types",     "width": "62px",},
                    ], [
                        {"dayKey": 3, "source": "time_formatted",  "title": "Time",     "width": "67px",},
                        {"dayKey": 3, "source": "name",            "title": "Name",     "width": "224px",},
                        {"dayKey": 3, "source": "locationAddress", "title": "Location", "width": "436px",},
                        {"dayKey": 3, "source": "types",           "title": "Types",     "width": "61px",},
                    ], [
                        {"dayKey": 4, "source": "time_formatted",  "title": "Time",     "width": "67px",},
                        {"dayKey": 4, "source": "name",            "title": "Name",     "width": "240px",},
                        {"dayKey": 4, "source": "locationAddress", "title": "Location", "width": "426px",},
                        {"dayKey": 4, "source": "types",           "title": "Types",     "width": "61px",},
                    ], [
                        {"dayKey": 5, "source": "time_formatted",  "title": "Time",     "width": "67px",},
                        {"dayKey": 5, "source": "name",            "title": "Name",     "width": "252px",},
                        {"dayKey": 5, "source": "locationAddress", "title": "Location", "width": "415px",},
                        {"dayKey": 5, "source": "types",           "title": "Types",     "width": "60px",},
                    ], [
                        {"dayKey": 6, "source": "time_formatted",  "title": "Time",     "width": "69px",},
                        {"dayKey": 6, "source": "name",            "title": "Name",     "width": "228px",},
                        {"dayKey": 6, "source": "locationAddress", "title": "Location", "width": "424px",},
                        {"dayKey": 6, "source": "types",           "title": "Types",     "width": "62px",},
                    ]
                ]
            },
            {
                "type": "service",
                "source": "mixedDays",
                "display": true,
                "title": "General Service and Central Office",
                "filter": {
                    "include": {
                        "districts": null,
                        "groups": null,
                        "types": null,
                        "name": ["Central Office", "District"],
                    },
                },
                "columns": [
                    {
                        "source": "time_formatted",
                        "title": "Time",
                        "width": "74px",
                    },
                    {
                        "source": "name",
                        "title": "Name",
                        "width": "278px",
                    },
                    {
                        "source": "locationAddress",
                        "title": "Location",
                        "width": "387px",
                    },
                    {
                        "source": "types",
                        "title": "Types",
                        "width": "52px",
                    },
                ],
            },
            {
                "type": "generic",
                "source": "mixedDays",
                "display": true,
                "title": "Espa&ntilde;ol",
                "filter": {
                    "include": {
                        "types": ["S"],
                    },
                },
                "columns": [
                    {
                        "source": "time_formatted",
                        "title": "Time",
                        "width": "66px",
                    },
                    {
                        "source": "name",
                        "title": "Name",
                        "width": "250px",
                    },
                    {
                        "source": "locationAddress",
                        "title": "Location",
                        "width": "340px",
                    },
                    {
                        "source": "day",
                        "title": "Day",
                        "width": "90px",
                    },
                    {
                        "source": "types",
                        "title": "Types",
                        "width": "56px",
                    },
                ],
            }
        ],
        "addressReplacements": [
            { "old": "Salt Lake City", "new": "SLC" },
            { "old": "West Valley City", "new": "WVC" },
            { "old": ", UT [0-9][0-9][0-9][0-9][0-9], USA", "new": ""},
            { "old": ", UT, [0-9][0-9][0-9][0-9][0-9]", "new": ""},
            { "old": ", UT, USA", "new": ""},
            { "old": ", NV [0-9][0-9][0-9][0-9][0-9], USA", "new": ""},
            { "old": "/ Backstreet Club", "new": ""},
            { "old": " \\(Formerly Utah Neurological Institute\\)", "new": ""},
        ],
        "nameReplacements": [
            { "old": " of AA", "new": ""},
            { "old": "12 & 12", "new": "12&12"},
            { "old": " of the month. If that's a holiday, then 2nd Monday", "new": " *"}
        ],
    };
};
