const ConfigurationImportPerform = class {
    static run = (formData) => {
        if (!ConfigurationImportPerform.valid(formData)) {
            return false;
        }

        let name = formData.name;

        const settings = JSON.parse(formData.settings);

        const key = uuidv4();

        let availableConfigurations = ConfigurationImportPerform.getConfigurations();

        availableConfigurations.push([key, name]);

        localStorage.setItem("availableConfigurations", JSON.stringify(availableConfigurations));

        localStorage.setItem("settings-" + key, JSON.stringify(settings));

        localStorage.setItem("activeConfigurationKey", key);

        return true;
    }

    static getConfigurations = () => {
        const availableConfigurations = localStorage.getItem("availableConfigurations") ?? "[]";

        return JSON.parse(availableConfigurations);
    }

    static valid = (formData) => {
        const name = formData.name;

        let settings = formData.settings;

        // Check name length
        if (name.length === 0) {
            return false;
        }

        // Verify valid JSON
        try {
            settings = JSON.parse(formData.settings);
        } catch (error) {
            return false;
        }

        // Check for header settings
        if (!("documentHeader" in settings) || "object" !== typeof settings.documentHeader || settings.documentHeader === null) {
            return false;
        }

        // Check for sections
        if (!("sections" in settings) || !Array.isArray(settings.sections)) {
            return false;
        }

        // Check that each section is valid at a shallow level
        settings.sections.forEach((section) => {
            if ("object" !== section || null === section) {
                return false;
            }
        });

        // Check for filters
        if (!("filter" in settings)) {
            return false;
        }

        return settings;
    }
}
