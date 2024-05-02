class ConfigurationExportDialog
{
    #configuration;

    #configurationExportDialog;

    constructor() {
        this.#configuration = new Configuration();

        $("body").append(this.render());

        this.attachHandlers();

        this.#configurationExportDialog = $("#exportConfigurationDialog").dialog({title: "Export Configuration", width: 600, autoOpen: false, modal: true});
    }

    open() {
        this.#configurationExportDialog.dialog("open");
    }

    attachHandlers() {
        const submitHandler = (event) => {
            event.preventDefault();

            let formData = Object.entries($("form#configurationExportForm").serializeArray()).pluck(1).serialiseToObject();

            debugger;

            this.#configuration.exportConfiguration(formData);

            location.reload();
        }

        $('#configurationCloneForm input[type="submit"].submit').on("click", submitHandler);

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

        const configurationString = JSON.stringify(this.#configuration.settings, null, 4);

        const templateData = {
            name: configurationName,
            configurationAsString: configurationString,
            downloadData: btoa(configurationString + "\n")
        };

        return configurationExportDialogEngine(templateData);
    }
}