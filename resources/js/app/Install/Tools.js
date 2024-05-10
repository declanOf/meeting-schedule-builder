const createFreshConfiguration = (scheduleData) => {
    function uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
          (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }

    const settings = {...FreshSettings};

    settings.sourceUrl = scheduleData.url + "/wp-admin/admin-ajax.php?action=meetings";
    settings.documentHeader.officeTitle = scheduleData.name;
    settings.documentHeader.displayUrl = scheduleData.url;

    const newConfigurationKey = uuidv4();

    const availableConfigurations = JSON.parse(localStorage.getItem("availableConfigurations")) ?? [];

    availableConfigurations.push([newConfigurationKey, scheduleData.name]);

    localStorage.setItem("availableConfigurations", JSON.stringify(availableConfigurations));

    localStorage.setItem("activeConfigurationKey", newConfigurationKey);

    localStorage.setItem("settings-" + newConfigurationKey, JSON.stringify(settings));

    return true;
}