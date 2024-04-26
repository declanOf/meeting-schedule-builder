class ConfigurationRenameDialog
{
    #configuration;

    #configurationRenameDialog;

    #configurationKey;

    constructor(configurationKey) {
        this.#configuration = new Configuration();

        this.#configurationKey = configurationKey;

        $("body").append(this.render());

        this.attachHandlers();

        this.#configurationRenameDialog = $("#renameConfigurationDialog").dialog({title: "Rename Configuration", height: 500, width: 450, autoOpen: false, modal: true});
    }

    open() {
        // TODO: reset dialog content

        $("#configurationRenameDialog .errors").hide();

        this.#configurationRenameDialog.dialog("open");
    }

    attachHandlers() {
        const submitHandler = (event) => {
            event.preventDefault();

            const name = $("#configurationRenameForm input.new-name").val();

            if (name.length < 3) {

                return alert("Name must be longer than two characters")
            }

            let availableConfigurations = this.#configuration.availableConfigurations;

            availableConfigurations.forEach((elem, index) => {
                if (configurationKey === elem[0]) {
                    availableConfigurations[index][1] = name;
                }
            });

            debugger;

            localStorage.setItem("availableConfigurations", JSON.stringify(availableConfigurations));

            alert("Configuration renamed. Page will now reload");

            location.reload();
        }

        const cancelHandler = (event) => {
            event.preventDefault();

            $("#configurationRenameDialog").dialog("close");
        };

        $("#configurationRenameForm .submit").on("click", submitHandler);

        $("#configurationRenameForm .cancel").on("click", cancelHandler);
    }

    render() {
        const configurationRenameDialogEngine = Handlebars.compile(configurationRenameDialogTemplate);

        let configurationName = '';

        this.#configuration.availableConfigurations.forEach((elem) => {
            if (this.#configurationKey === elem[0]) {
                configurationName = elem[1];
            }
        });

        return configurationRenameDialogEngine({configurationKey: this.#configurationKey, configurationName: configurationName});
    }
}