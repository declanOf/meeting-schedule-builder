class AddReplacementDialog
{

    #addReplacementDialog;

    constructor(target)
    {
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
                event.preventDefault();

                handleAddReplacementDialog("name");
            };

            const handleAddAddressReplacementDialog = (event) => {
                event.preventDefault();

                handleAddReplacementDialog("address");
            };

            const handleAddReplacementDialog = (targetString) => {
                event.preventDefault();

                const id = parseInt(Math.random() * 10000);

                let replacement =
                $(`<p class="replacement hover-light">
                    <button class="borderless remove-replacement">&#x2326;</button>
                    In ${targetString}, replace
                    <input type="text" name="${targetString}Replacements.${id}.old" value="">
                    with
                    <input type="text" name="${targetString}Replacements.${id}.new" value="">
                </p>`);

                const removeReplacement = (event) => {
                    event.preventDefault();

                    (new Configuration()).setDirty(true);

                    if (window.confirm("Remove this text replacement?")) {
                        $(event.target).parents("p.replacement").remove();
                    }
                };

                $(replacement.find("button.remove-replacement")).on("click", removeReplacement);

                $(".header-text-replacements").append(replacement);

                (new Configuration()).setDirty(true);

                this.#addReplacementDialog.dialog("close");
            }

            const handleCancelAddReplacementDialog = (event) => {
                event.preventDefault();

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
