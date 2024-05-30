class ConfigurationCloneDialog
{
    #configurationCloneDialog;

    constructor() {
        $("body").append(this.render());

        this.attachHandlers();

        this.#configurationCloneDialog = $("#cloneConfigurationDialog").dialog({title: "Add Configuration", height: 580, width: 600, autoOpen: false, modal: true});
    }

    open() {
        // TODO: reset dialog content
        // $("form#cloneConfigurationForm")[0].reset();

        $("#configurationCloneDialog .errors").hide();

        this.#configurationCloneDialog.dialog("open");
    }

    attachHandlers() {
    }

    render() {
        const configurationCloneDialogEngine = Handlebars.compile(configurationCloneDialogTemplate);

        const activeConfigurationKey = localStorage.getItem("activeConfigurationKey")

        const availableConfigurations = JSON.parse(localStorage.getItem("availableConfigurations"));

        let currentConfiguration = '';

        availableConfigurations.forEach((config) => {
            if (activeConfigurationKey === config[0]) {
                currentConfiguration = config;
            }
        });

        const templateData = {
            activeConfigurationKey: activeConfigurationKey,
            availableConfigurations: availableConfigurations,
            sourceUrl: configuration.settings.sourceUrl,
            currentConfiguration: currentConfiguration,
            documentHeader: configuration.settings.documentHeader
        };

        console.log("template data", templateData);
        return configurationCloneDialogEngine(templateData);
    }
}