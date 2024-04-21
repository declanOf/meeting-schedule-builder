class AddConfigurationDialog
{
    #addConfigurationDialog;

    #handlersAttached = false;

    constructor() {
        this.#configuration = new Configuration();

        $("body").append(this.render());

        this.attachHandlers();

        this.#addConfigurationDialog = $("#configurationDialog").dialog({title: "Add Configuration", height: 500, width: 450, autoOpen: false});
    }

    openDialog() {
        $("form#addConfigurationForm")[0].reset();

        $("#addConfigurationDialog .filter-targets").hide();

        $("#addConfigurationDialog .errors").hide();

        this.#addConfigurationDialog.dialog("open");

    }

    attachHandlers() {
        if (this.#handlersAttached) {
            return;
        }

        const handleSubmitAddFilterDialog = (event) => {
            event.preventDefault();

            const name = $("#configuration-name-input").val();

            if (name.length < 1) {
                // TODO: add error

                return;
            }

            (new Configuration()).cloneConfiguration(name);
            location.reload();
        }

        $("#addConfigurationButton").on("click", )
        this.#handlersAttached = true;
    }

    render()
    {
        const addConfigurationDialogEngine = Handlebars.compile(addConfigurationDialogTemplate);

        return addConfigurationDialogEngine(data);
    }
}