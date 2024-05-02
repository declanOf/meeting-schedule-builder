    const App = class
    {
        #configuration;

        #meetings;

        constructor()
        {
            $(document).ready(() => {
                this.#configuration = new Configuration(false);

                if (this.#configuration.initialized) {
                    new Promise((ready) => this.buildMeetings(ready))
                        .then(this.buildPage.bind(this));
                } else {
                    new Installer();
                }
            });
        }

        buildMeetings(ready) {
            this.#meetings = new Meetings(this.#configuration, ready);
        }

        buildPage() {
            this.#configuration.addMeetingKeys(this.#meetings);

            this.addHeader()
                .addSections()
                .addControls()
                .addBehaviour();
        }

        addControls() {
            const controls = new Controls(this.#configuration, this.#meetings);

            const controlsContent = controls.render();

            $('div#controls').append(controlsContent);

            $('div#controls input[type="text"]').keyup(() => { this.#configuration.setDirty(true, "Text changes have been made") });

            $('div#controls textarea').keyup(() => { this.#configuration.setDirty(true, "Text changes have been made") });

            $('div#controls select').change(() => { this.#configuration.setDirty(true, "Text changes have been made") });

            $('div#controls input[type="checkbox"]').change(() => { this.#configuration.setDirty(true, "Text changes have been made") });

            const addFilterDialog = new AddFilterDialog($(event.target));

            $(".add-filter").click((event) => {
                event.preventDefault();

                addFilterDialog.open();
            })

            const addReplacementDialog = new AddReplacementDialog();

            $("#add-text-replacement").click((event) => {
                event.preventDefault();

                addReplacementDialog.open();
            });

            $("#save-changes").click(this.#configuration.saveChanges.bind(this.#configuration));

            $("#reset-changes").click(() => window.reload());

            $("#controlsForm").tabs({
                "create": () => {
                    this.#configuration.availableConfigurations.forEach((elem) => {
                        if (this.#configuration.activeConfigurationKey !== elem[0]) {
                            return;
                        }

                        $("ul.ui-tabs-nav").append($(`<label style="padding-left: 2em; line-height: 2.5em;">Current Configuration: <a href="#" id="show-configuration-manage-dialog">${elem[1]}</a></label>`));
                    });
                }
            });

            return this;
        };

        addBehaviour() {
            const configurationDisplay = (event) => {
                const flexContainer = $("div#controls div.flex-container");

                if (flexContainer.hasClass("show")) {
                    flexContainer.removeClass("show").addClass("hide");
                } else {
                    flexContainer.removeClass("hide").addClass("show");
                }
            };

            $(".configuration-display").on("click", configurationDisplay);

            const expandSection = (event) => $(event.target).parents("div.section").addClass("expanded").removeClass("collapsed");

            $(".expand-section").on("click", expandSection)

            const collapseSection = (event) => $(event.target).parents("div.section").addClass("collapsed").removeClass("expanded");

            $(".collapse-section").on("click", collapseSection);

            const removeReplacement = (event) => {
                event.preventDefault();

                (new Configuration()).setDirty(true);

                if (window.confirm("Remove this text replacement?")) {
                    $(event.target).parents("p.replacement").remove();
                }
            };

            $(".remove-replacement").on("click", removeReplacement);

            $("#print-page").on("click", (event) => window.print());

            window.scrollTo(0,0);

            return this;
        };

        addHeader() {
            const header = new DocumentHeader(this.#configuration);

            $('div.page').append(header.render());

            return this;
        };

        addSections() {
            const sections = new Schedule(this.#configuration, this.#meetings);

            sections.render();

            return this;
        };
    };