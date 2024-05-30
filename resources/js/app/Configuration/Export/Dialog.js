class ConfigurationExportDialog
{
    #configurationExportDialog;

    constructor() {
        $("body").append(this.render());

        this.attachHandlers();

        this.#configurationExportDialog = $("#exportConfigurationDialog").dialog({title: "Export Configuration", width: 600, autoOpen: false, modal: true});
    }

    open() {
        this.#configurationExportDialog.dialog("open");
    }

    attachHandlers() {


        $("#exportConfigurationDialog textarea").on("click", (event) => $("#exportConfigurationDialog textarea").select());
    }

    render() {
        const configurationExportDialogEngine = Handlebars.compile(configurationExportDialogTemplate);

        const activeConfigurationKey = localStorage.getItem("activeConfigurationKey")

        const availableConfigurations = JSON.parse(localStorage.getItem("availableConfigurations"));

        let configurationName = '';

        availableConfigurations.forEach((config) => {
            if (activeConfigurationKey === config[0]) {
                configurationName = config[1];
            }
        });

        const configurationString = JSON.stringify(configuration.settings, null, 4);

        const templateData = {
            name: configurationName,
            configurationAsString: configurationString,
            downloadData: btoa(configurationString + "\n")
        };

        return configurationExportDialogEngine(templateData);
    }
}