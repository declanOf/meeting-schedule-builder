class Configuration {
    #settings;

    constructor() {
        // this.#loadSettings();

        if (!this.#settings) {
            this.#initialize();
        }
    };

    #initialize()
    {
        localStorage.setItem("settings", JSON.stringify(this.#defaultSettings));
        this.#loadSettings();
    }

    #loadSettings() {
        if (this.#settings) {
            return;
        }

        this.#settings = JSON.parse(localStorage.getItem("settings"));
    }

    #write()
    {
        console.info("Writing to local storage");
        localStorage.setItem("settings", JSON.stringify(this.#settings));
    }

    get settings()
    {
        return this.#settings;
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

        columnSizes.forEach((size, index) => columns[index].width = size+"px")

        if (!isNaN(dayIndex))
        {
            this.#settings.sections[sectionIndex].columns[dayIndex] = columns;
        } else {
            this.#settings.sections[sectionIndex].columns = columns;
        }
    }

    saveChanges() {
        function reserialize(flatArray) {
            var data = {};
            flatArray.forEach((element) => {
                let val = element.value;

                if (!val) {
                    val = "";
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

        const formData = Object.entries($("form#controlsForm").serializeArray()).pluck(1);

        const nestedData = reserialize(formData);

        const convertObjectToArray = (targetObject) => {
            if (typeof targetObject !== "object" || Array.isArray(targetObject)) {
                return targetObject;
            }

            let keys = Object.keys(targetObject);

            let numericalKeys = keys.filter((elem) => parseInt(elem) == elem);

            // deal with strange formatting anomaly
            if (keys.length === 1 && keys[0] === "") {
                return Object.values(targetObject)[0];
            }

            keys.forEach((key) => {
                targetObject[key] = convertObjectToArray(targetObject[key]);
            });

            if (numericalKeys.length === keys.length) {
                targetObject = Object.values(targetObject);
            }

            return targetObject;
        }

        return convertObjectToArray(nestedData);
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

    #defaultSettings = {
        "sourceUrl": "https://www.saltlakeaa.org/wp-admin/admin-ajax.php?action=meetings",
        "expiryHours": 24,
        "meetingFontSize": "font-size-10-75pt",
        "documentHeader": {
            "title": "AA Meeting Schedule",
            "officeTitle": "Central Office<br>of Salt Lake City",
            "officeStreet": "80 West Louise Ave (2860 South)",
            "officeCity": "Salt Lake City",
            "officeState": "UT",
            "officeZipcode": "84115",
            "officePhone": "(801) 484-7871",
            "displayUrl": "https://www.saltlakeaa.org/meetings",
            "officeHours": "Monday-Friday 10AM-5PM<br>Saturday 10AM-2PM",
            "holidayHours": "Call For Holiday Hours",
            "lastUpdated": "Last Updated",
            "inPerson": "In-Person Meetings Only",
            "website": "Check website for online meetings and schedule updates",
        },
        "documentFooter": "All meetings are self-reported. Central Office doesn't independently verify or endorse meetings.<br><br>To add, change, or deactivate meetings, please visit https://www.saltlakeaa.org/meeting-changes/.",
        "types": {
            "O": {
                "displaySymbol": "O",
                "showInHeader": true,
                "showInColumn": true,
                "description": "Open to anyone interested in AA",
                "withKey": false
            },
            "Y": {
                "displaySymbol": "Y",
                "showInHeader": true,
                "showInColumn": true,
                "description": "Young people",
                "withKey": false
            },
            "A": {
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
            "C": {
                "showInHeader": true,
                "displaySymbol": "C",
                "showInColumn": true,
                "description": "Closed to non-alcoholics",
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
                "title": "Multi-Day Meetings",
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
                "showTypes": ["+", "M", "W", "C", "@", "S", "Y", ],
                "columns": [
                    {
                        "source": "time_formatted",
                        "title": "Time",
                        "width": "60px",
                    },
                    {
                        "source": "name",
                        "title": "Name",
                        "width": "185px",
                    },
                    {
                        "source": "locationAddress",
                        "title": "Location",
                        "width": "418px",
                    },
                    {
                        "source": "days",
                        "title": "Days",
                        "width": "84px",
                    },
                    {
                        "source": "types",
                        "title": "Keys",
                        "width": "44px",
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
                        {"dayKey": 0, "source": "time_formatted",  "title": "Time",     "width": "69px",},
                        {"dayKey": 0, "source": "name",            "title": "Name",     "width": "230px",},
                        {"dayKey": 0, "source": "locationAddress", "title": "Location", "width": "440px",},
                        {"dayKey": 0, "source": "types",           "title": "Keys",     "width": "44px",},
                    ], [
                        {"dayKey": 1, "source": "time_formatted",  "title": "Time",     "width": "69px",},
                        {"dayKey": 1, "source": "name",            "title": "Name",     "width": "220px",},
                        {"dayKey": 1, "source": "locationAddress", "title": "Location", "width": "460px",},
                        {"dayKey": 1, "source": "types",           "title": "Keys",     "width": "50px",},
                    ], [
                        {"dayKey": 2, "source": "time_formatted",  "title": "Time",     "width": "69px",},
                        {"dayKey": 2, "source": "name",            "title": "Name",     "width": "221px",},
                        {"dayKey": 2, "source": "locationAddress", "title": "Location", "width": "388px",},
                        {"dayKey": 2, "source": "types",           "title": "Keys",     "width": "44px",},
                    ], [
                        {"dayKey": 3, "source": "time_formatted",  "title": "Time",     "width": "67px",},
                        {"dayKey": 3, "source": "name",            "title": "Name",     "width": "224px",},
                        {"dayKey": 3, "source": "locationAddress", "title": "Location", "width": "436px",},
                        {"dayKey": 3, "source": "types",           "title": "Keys",     "width": "61px",},
                    ], [
                        {"dayKey": 4, "source": "time_formatted",  "title": "Time",     "width": "67px",},
                        {"dayKey": 4, "source": "name",            "title": "Name",     "width": "240px",},
                        {"dayKey": 4, "source": "locationAddress", "title": "Location", "width": "426px",},
                        {"dayKey": 4, "source": "types",           "title": "Keys",     "width": "61px",},
                    ], [
                        {"dayKey": 5, "source": "time_formatted",  "title": "Time",     "width": "67px",},
                        {"dayKey": 5, "source": "name",            "title": "Name",     "width": "252px",},
                        {"dayKey": 5, "source": "locationAddress", "title": "Location", "width": "415px",},
                        {"dayKey": 5, "source": "types",           "title": "Keys",     "width": "60px",},
                    ], [
                        {"dayKey": 6, "source": "time_formatted",  "title": "Time",     "width": "69px",},
                        {"dayKey": 6, "source": "name",            "title": "Name",     "width": "228px",},
                        {"dayKey": 6, "source": "locationAddress", "title": "Location", "width": "424px",},
                        {"dayKey": 6, "source": "types",           "title": "Keys",     "width": "44px",},
                    ]
                ]
            },
            {
                "type": "generic",
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
                "showTypes": ["O", "C", "A"],
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
                        "title": "Keys",
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
                        "title": "Keys",
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
        ],
    };
};
