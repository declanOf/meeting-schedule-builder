class ConfigurationCloneDialog
{
    #configuration;

    #configurationCloneDialog;

    constructor() {
        this.#configuration = new Configuration();

        $("body").append(this.render());

        this.attachHandlers();

        this.#configurationCloneDialog = $("#cloneConfigurationDialog").dialog({title: "Add Configuration", height: 500, width: 450, autoOpen: false, modal: true});
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

            const name = $("#configurationCloneForm input.new-name").val();

            if (name.length < 3) {
                // TODO: add error

                alert("Name must be longer than two characters")
                return;
            }

            this.#configuration.cloneConfiguration(name);

            location.reload();
        }

        const cancelHandler = (event) => {
            event.preventDefault();

            $("#configurationCloneDialog").dialog("close");
        };

        $("#configurationCloneForm .submit").on("click", submitHandler);

        $("#configurationCloneForm .cancel").on("click", cancelHandler);
    }

    render() {
        const configurationCloneDialogEngine = Handlebars.compile(configurationCloneDialogTemplate);

        const activeConfigurationKey = localStorage.getItem("activeConfigurationKey")

        const activeConfigurations = JSON.parse(localStorage.getItem("availableConfigurations"));

        const currentConfiguration = activeConfigurations[activeConfigurationKey];

        return configurationCloneDialogEngine(currentConfiguration);
    }
}