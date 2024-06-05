const createFreshSchedule= (scheduleData) => {
    function uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
          (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }

    const settings = {...FreshSettings};

    const url = new URL(scheduleData.url);

    settings.sourceUrl = scheduleData.url;

    settings.documentHeader.officeTitle = scheduleData.name;

    settings.documentHeader.displayUrl = url.origin;

    const newConfigurationKey = uuidv4();

    const availableConfigurations = JSON.parse(localStorage.getItem("availableConfigurations")) ?? [];

    availableConfigurations.push([newConfigurationKey, scheduleData.name]);

    localStorage.setItem("availableConfigurations", JSON.stringify(availableConfigurations));

    localStorage.setItem("activeConfigurationKey", newConfigurationKey);

    localStorage.setItem("settings-" + newConfigurationKey, JSON.stringify(settings));

    return true;
}