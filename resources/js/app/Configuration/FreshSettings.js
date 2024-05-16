const FreshSettings = {
    "sourceUrl": "",
    "expiryHours": 24,
    "meetingFontSize": "font-size-10-25pt",
    "footerFontSize": "font-size-9pt",
    "documentHeader": {
        "displayUrl": "https://www.saltlakeaa.org/meetings",
        "holidayHours": "Call For Holiday Hours",
        "inPerson": "In-Person Meetings Only",
        "lastUpdated": "Last Updated",
        "officeTitle": "Central Office<br>of Xxxx Xxxxxxxx",
        "officeStreet": "## Xxxx Xxxxxxxxxx",
        "officeCity": "Xxxxxxxxxxx",
        "officeState": "XX",
        "officeZipcode": "#####",
        "officePhone": "(###) ###-####",
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
            "footer": "* Daily meetings are not repeated in the individual days below.",
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
                    {"dayKey": 0, "source": "time_formatted",  "title": "Time",     "width": "61px",},
                    {"dayKey": 0, "source": "name",            "title": "Name",     "width": "250px",},
                    {"dayKey": 0, "source": "locationAddress", "title": "Location", "width": "400px",},
                    {"dayKey": 0, "source": "types",           "title": "Types",     "width": "74px",},
                ], [
                    {"dayKey": 1, "source": "time_formatted",  "title": "Time",     "width": "61px",},
                    {"dayKey": 1, "source": "name",            "title": "Name",     "width": "250px",},
                    {"dayKey": 1, "source": "locationAddress", "title": "Location", "width": "400px",},
                    {"dayKey": 1, "source": "types",           "title": "Types",     "width": "74px",},
                ], [
                    {"dayKey": 2, "source": "time_formatted",  "title": "Time",     "width": "61px",},
                    {"dayKey": 2, "source": "name",            "title": "Name",     "width": "250px",},
                    {"dayKey": 2, "source": "locationAddress", "title": "Location", "width": "400px",},
                    {"dayKey": 2, "source": "types",           "title": "Types",     "width": "74px",},
                ], [
                    {"dayKey": 3, "source": "time_formatted",  "title": "Time",     "width": "61px",},
                    {"dayKey": 3, "source": "name",            "title": "Name",     "width": "250px",},
                    {"dayKey": 3, "source": "locationAddress", "title": "Location", "width": "400px",},
                    {"dayKey": 3, "source": "types",           "title": "Types",     "width": "74px",},
                ], [
                    {"dayKey": 4, "source": "time_formatted",  "title": "Time",     "width": "61px",},
                    {"dayKey": 4, "source": "name",            "title": "Name",     "width": "250px",},
                    {"dayKey": 4, "source": "locationAddress", "title": "Location", "width": "400px",},
                    {"dayKey": 4, "source": "types",           "title": "Types",     "width": "74px",},
                ], [
                    {"dayKey": 5, "source": "time_formatted",  "title": "Time",     "width": "61px",},
                    {"dayKey": 5, "source": "name",            "title": "Name",     "width": "250px",},
                    {"dayKey": 5, "source": "locationAddress", "title": "Location", "width": "400px",},
                    {"dayKey": 5, "source": "types",           "title": "Types",     "width": "74px",},
                ], [
                    {"dayKey": 6, "source": "time_formatted",  "title": "Time",     "width": "61px",},
                    {"dayKey": 6, "source": "name",            "title": "Name",     "width": "250px",},
                    {"dayKey": 6, "source": "locationAddress", "title": "Location", "width": "400px",},
                    {"dayKey": 6, "source": "types",           "title": "Types",     "width": "74px",},
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
        { "old": ", [A-Z][A-Z] [0-9][0-9][0-9][0-9][0-9], USA", "new": ""},
        { "old": ", [A-Z][A-Z], [0-9][0-9][0-9][0-9][0-9]", "new": ""},
        { "old": ", [A-Z][A-Z], USA", "new": ""},
        { "old": "/ Backstreet Club", "new": ""},
        { "old": " \\(Formerly Utah Neurological Institute\\)", "new": ""},
    ],
    "nameReplacements": [
        { "old": " of Alcoholics Anonymous", "new": ""},
        { "old": "Alcoholics Anonymous", "new": "AA"},
        { "old": " of AA", "new": ""},
        { "old": "12 & 12", "new": "12&12"},
        { "old": " of the month. If that's a holiday, then 2nd Monday", "new": " *"}
    ],
};