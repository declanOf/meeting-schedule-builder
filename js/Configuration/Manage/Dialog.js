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

            const lineItem = $($(event.target).parents("li")[0]);

            const configurationKey = lineItem.attr("data-key");

            localStorage.setItem("activeConfigurationKey", configurationKey);

            alert("Using new configuration. Page will reload automatically.");

            location.reload();
        };

        // TODO: show dialog requesting new name, and indicating origin configuration
        const cloneConfigurationHandler = (event) => {
            event.preventDefault();

            this.#configurationCloneDialog = new ConfigurationCloneDialog();

            this.#configurationCloneDialog.open();
        };

        // TODO: use dialog
        const deleteConfigurationHandler = (event) => {
            event.preventDefault();

            const lineItem = $($(event.target).parents("li")[0]);

            const configurationKey = lineItem.attr("data-key");

            this.configurationDeleteDialog = new ConfigurationDeleteDialog(configurationKey);

            this.configurationDeleteDialog.open();
        };

        // TODO: show dialog showing old name and requesting new name
        const renameConfigurationHandler = (event) => {
            event.preventDefault();

            const lineItem = $($(event.target).parents("li")[0]);

            const configurationKey = lineItem.attr("data-key");

            this.configurationRenameDialog = new ConfigurationRenameDialog(configurationKey);

            this.configurationRenameDialog.open();
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