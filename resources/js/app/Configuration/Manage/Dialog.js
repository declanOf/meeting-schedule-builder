class ConfigurationManageDialog
{
    #configurationCloneDialog;

    #configurationExportDialog;

    constructor() {
        this.render();

        this.attachHandlers();
    }

    attachHandlers() {
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