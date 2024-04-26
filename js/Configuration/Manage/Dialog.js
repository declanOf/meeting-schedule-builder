class ConfigurationManageDialog
{
    #configurationCloneDialog;

    constructor() {
        this.render();

        this.attachHandlers();
    }

    attachHandlers() {
        // TODO: show alert indicating new configuration, then immediately load to new config
        const selectConfigurationHandler = (event) => {
            event.preventDefault();

            alert("select");
        };

        // TODO: show dialog requesting new name, and indicating origin configuration
        const cloneConfigurationHandler = (event) => {
            event.preventDefault();

            this.#configurationCloneDialog = new ConfigurationCloneDialog();
            this.#configurationCloneDialog.open();
            alert("clone");
        };

        // TODO: show dialog requesting confirmation with name of configuration to be deleted
        const deleteConfigurationHandler = (event) => {
            event.preventDefault();

            alert("delete");
        };

        // TODO: show dialog showing old name and requesting new name
        const renameConfigurationHandler = (event) => {
            event.preventDefault();

            alert("rename");
        };

        $("#configuration-manage-dialog .select").click(selectConfigurationHandler);

        $("#configuration-manage-dialog .clone").click(cloneConfigurationHandler);

        $("#configuration-manage-dialog .delete").click(deleteConfigurationHandler);

        $("#configuration-manage-dialog .rename").click(renameConfigurationHandler);
    }

    render() {
        const configurationManageDialogTemplateEngine = Handlebars.compile(configurationManageDialogTemplate);

        let content = configurationManageDialogTemplateEngine({
            availableConfigurations: JSON.parse(localStorage.getItem("availableConfigurations")),
            activeConfigurationKey:  localStorage.getItem("activeConfigurationKey")
        });

        $("body").append(content);

        this.configurationManageDialog = $("#configuration-manage-dialog")
            .dialog({
                title: "Manage Configurations",
                autoOpen: false,
                modal: true
            });
    }

    open(event) {
        event.preventDefault();

        this.configurationManageDialog.dialog("open");
    }
}