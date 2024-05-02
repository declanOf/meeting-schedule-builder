class ConfigurationCloneDialog
{
    #configuration;

    #configurationCloneDialog;

    constructor() {
        this.#configuration = new Configuration();

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
        const submitHandler = (event) => {
            event.preventDefault();

            let formData = Object.entries($("form#configurationCloneForm").serializeArray()).pluck(1).serialiseToObject();

            if (formData.name.length < 3) {
                // TODO: add error

                alert("Name must be longer than two characters")
                return;
            }

            debugger;

            this.#configuration.cloneConfiguration(formData);

            location.reload();
        }

        const cancelHandler = (event) => {
            event.preventDefault();

            $("#configurationCloneDialog").dialog("close");
        };

        $('#configurationCloneForm input[type="submit"].submit').on("click", submitHandler);

        $("#configurationCloneForm .cancel").on("click", cancelHandler);
    }

    render() {
        const configurationCloneDialogEngine = Handlebars.compile(configurationCloneDialogTemplate);

        const activeConfigurationKey = localStorage.getItem("activeConfigurationKey")

        const availableConfigurations = JSON.parse(localStorage.getItem("availableConfigurations"));

        let currentConfiguration = '';

        availableConfigurations.forEach((config) => {
            if (config[0] === config[0]) {
                currentConfiguration = config;
            }
        });

        const templateData = {
            activeConfigurationKey: activeConfigurationKey,
            availableConfigurations: availableConfigurations,
            sourceUrl: this.#configuration.settings.sourceUrl,
            currentConfiguration: currentConfiguration,
            documentHeader: this.#configuration.settings.documentHeader
        };

        console.log("template data", templateData);
        return configurationCloneDialogEngine(templateData);
    }
}