class AddReplacementDialog
{
    #configuration;

    #replacementsContainer;

    #addReplacementDialog;

    constructor(target)
    {
        this.#replacementsContainer = $(".header-text-replacements");

        this.#configuration = new Configuration();

        $("body").append(this.render());

        this.#addReplacementDialog = $("#addReplacementDialog").dialog({title: "Add Replacement", height: 500, width: 450, autoOpen: false, modal: true});

        this.attachHandlers();
    }

    open()
    {
        $("#addReplacementDialog .errors").hide();

        this.#addReplacementDialog.dialog("open");
    }

    attachHandlers() {
        setTimeout(() => {
            const handleAddNameReplacementDialog = (event) => {
                // intercept submission event
                event.preventDefault();

                handleAddReplacementDialog("name");
            };

            const handleAddAddressReplacementDialog = (event) => {
                // intercept submission event
                event.preventDefault();

                handleAddReplacementDialog("address");
            };

            const handleAddReplacementDialog = (targetString) => {
                // add controls content

                event.preventDefault();

                const id = parseInt(Math.random() * 10000);

                let replacement =
                `<p class="hover-light">
                    <button class="borderless">&#x2326;</button>
                    In ${targetString}, replace
                    <input type="text" name="${targetString}Replacements.${id}.old" value="">
                    with
                    <input type="text" name="${targetString}Replacements.${id}.new" value="">
                </p>`;

                $(".header-text-replacements").append(replacement);

                // close dialog
                this.#addReplacementDialog.dialog("close");
            }

            const handleCancelAddReplacementDialog = (event) => {
                // intercept submission event
                event.preventDefault();

                // close dialog
                $("#replacementDialog").close();
            }

            $('#add-name-replacement').click(handleAddNameReplacementDialog.bind(this));

            $('#add-address-replacement').click(handleAddAddressReplacementDialog.bind(this));

            $('form#replacementForm input[type="cancel"]').click(handleCancelAddReplacementDialog);
        }, 1000);
    }

    render()
    {
        const addReplacementDialogEngine = Handlebars.compile(addReplacementDialogTemplate);

        return addReplacementDialogEngine();
    }
}
