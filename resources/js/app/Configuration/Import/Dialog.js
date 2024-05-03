class ConfigurationImportDialog
{
    #configuration;

    #configurationImportDialog;

    constructor() {
        this.#configuration = new Configuration();

        $("body").append(this.render());

        this.attachHandlers();

        this.#configurationImportDialog = $("#importConfigurationDialog").dialog({title: "Import Configuration", width: 600, height: 400, autoOpen: false, modal: true});
    }

    open() {
        this.#configurationImportDialog.dialog("open");
    }

    attachHandlers() {
        const submitHandler = (event) => {
            event.preventDefault();

            let formData = Object.entries($("form#importConfigurationForm").serializeArray()).pluck(1);

            formData = {name: formData[0].value, settings: formData[1].value};

            if (ConfigurationImportPerform.run(formData)) {
                alert("Configuration Imported. Close dialog to load configuration.");

                location.reload();
            } else {
                alert("Errors detected in your configuration. Please review the settings and re-submit later.");
            }
        }

        $('#import-configuration').on("click", submitHandler);
    }

    render() {
        const configurationImportDialogEngine = Handlebars.compile(configurationImportDialogTemplate);

        return configurationImportDialogEngine();
    }
}