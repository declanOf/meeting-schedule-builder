class Configuration {
    #settings;

    #activeConfigurationKey;

    #availableConfigurations;

    #dirtySettings = false;

    #dirtyReasons = [];

    #defaultSettings;

    constructor(autoCreate = true) {
        this.#defaultSettings = DefaultSettings;

        this.#loadSettings();

        if (!this.#settings && autoCreate) {
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
        this.write();
    }

    get availableConfigurations() {
        return this.#availableConfigurations;
    }

    get activeConfigurationKey() {
        return this.#activeConfigurationKey;
    }

    set activeConfigurationKey(configurationKey) {
        this.#activeConfigurationKey = configurationKey;

        return this;
    }

    cloneConfiguration(formData) {
        function uuidv4() {
            return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
              (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
            );
        }

        const newConfigurationKey = uuidv4();

        this.#availableConfigurations.push([newConfigurationKey, formData.name]);

        localStorage.setItem("availableConfigurations", JSON.stringify(this.#availableConfigurations));

        this.#activeConfigurationKey = newConfigurationKey;

        const validFormKeys = ["displayUrl", "officeTitle", "officeStreet", "officeCity", "officeState", "officeZipcode", "officePhone"];

        validFormKeys.forEach((key) => this.#settings.documentHeader[key] = formData[key]);

        this.#settings.sourceUrl = formData.sourceUrl;
        this.write();
    }

    write() {
        console.info("Writing to local storage");
        localStorage.setItem("activeConfigurationKey", this.#activeConfigurationKey);
        localStorage.setItem("settings-" + this.#activeConfigurationKey, JSON.stringify(this.#settings));
    }

    get initialized() {
        return (this.#settings) ? true : false;
    }

    get settings() {
        return this.#settings;
    }

    set settings(settings) {
        this.#settings = settings;
    }

    set columnSizes(tableData) {
        const sectionIndex = tableData.meetingIndex;
        const dayIndex = tableData.dayIndex;
        const columnSizes = tableData.columnSizes;

        let columns = this.#settings.sections[sectionIndex].columns;

        if (columnSizes.length > 10) {
            console.info("Window resize detected, not setting column sizes.");
            return;
        }

        if (!isNaN(dayIndex)) {
            columns = columns[dayIndex];
        }

        columnSizes.forEach((size, index) => {
            try {
                columns[index].width = size+"px";
            } catch (error) {
                console.error("error setting width for columns", columns)
                console.error("columnSizes", columnSizes);
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

        let settings = {...this.settings};

        settings.sections[sectionIndex] = section;

        this.settings = settings;
    }

    setDirty(isDirty, reason) {
        if (!isDirty) {
            this.#dirtyReasons = [];
            $("#save-changes").attr("title", "");
        }

        $("span.change-handler").removeClass("dirty");
        if (isDirty) {
            this.copyLiveFormChangesToConfiguration();

            $("span.change-handler").addClass("dirty");

            // TODO: rebuild schedule if needed
            app.addHeader();

            this.#dirtyReasons.push(reason);
        }
    }

    copyColumnWidthChangesToFormFields(columnWidths) {
        const inputIdPrefix = (isNaN(columnWidths.dayIndex))
            ? `#sections-${columnWidths.meetingIndex}-columns-`
            : `#sections-${columnWidths.meetingIndex}-days-${columnWidths.dayIndex}-columns-`;

        columnWidths.columnSizes.forEach((columnWidth, index) => $(inputIdPrefix + `${index}-width`).val(columnWidth + "px"));
    }

    copyLiveFormChangesToConfiguration() {
        this.settings = this.getConfigurationObjectFromForm();
    }

    saveEdit(editedConfiguration) {
        localStorage.setItem("settings-" + this.#activeConfigurationKey, JSON.stringify(editedConfiguration));

        location.reload();
    }

    getConfigurationObjectFromForm() {
        /**
         * Convert any objects with numerical keys into an array, nested
         * @param {*} targetObject
         * @returns
         */
        const convertObjectToArray = (targetObject) => {
            if (typeof targetObject !== "object" || Array.isArray(targetObject)) {
                if (typeof targetObject === "string")
                {
                    if (targetObject === "false" || targetObject === "off") {
                        targetObject = false;
                    } else if (targetObject === "true" || targetObject === "on") {
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

        formData = formData.serialiseToObject();

        formData = convertObjectToArray(formData);

        let settings = restructureSectionsWithSetsOfSingleDays(formData);

        settings.sections.forEach((section, index) => settings.sections[index].display = typeof(section.display) === "undefined" ? false : section.display);

        return settings;
    }

    // TODO: incorrect section types on save because the section type isn't set correctly in the controls
    saveChanges() {
        this.settings = this.getConfigurationObjectFromForm();

        localStorage.setItem("settings-" + this.#activeConfigurationKey, JSON.stringify(this.settings));

        this.setDirty(false);
    }

    addMeetingKeys(meetings) {
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
            this.write();
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
    }
};
