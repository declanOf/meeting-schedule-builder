    const App = class
    {
        #configuration;

        #meetings;

        constructor()
        {
            $(document).ready(() => {
                this.#configuration = new Configuration();

                new Promise((ready) => this.buildMeetings(ready))
                    .then(this.buildPage.bind(this));
            });
        }

        buildMeetings(ready) {
            this.#meetings = new Meetings(this.#configuration, ready);
        }

        buildPage() {
            this.#configuration.addMeetingKeys(this.#meetings);

            this.addHeader()
                .addSections()
                .addFooter()
                .addControls()
                .addBehaviour();
        }

        addControls() {
            const controls = new Controls(this.#configuration, this.#meetings);

            const controlsContent = controls.render();

            $('div#controls').append(controlsContent);

            $(".add-filter").click((event) => {
                event.preventDefault();
                const addFilterDialog = new AddFilterDialog($(event.target));
                addFilterDialog.openDialog();
            })

            $("#save-changes").click(this.#configuration.saveChanges.bind(this.#configuration));

            $("#reset-changes").click(() => window.reload())
            return this;
        };

        addBehaviour() {
            const configurationDisplay = (event) => {
                if ($("div#controls div.flex-container").hasClass("show")) {
                    $("div#controls div.flex-container")
                        .removeClass("show")
                        .addClass("hide");
                } else {
                    $("div#controls div.flex-container")
                        .removeClass("hide")
                        .addClass("show");
                }
            };

            $(".configuration-display").on("click", configurationDisplay);

            const expandSection = (event) => $(event.target)
                .parents("div.section")
                .addClass("expanded")
                .removeClass("collapsed");

            $(".expand-section").on("click", expandSection)

            const collapseSection = (event) => $(event.target)
                .parents("div.section")
                .addClass("collapsed")
                .removeClass("expanded");

            $(".collapse-section").on("click", collapseSection);

            /** TODO: Add list configurations from which one can be selected and applied, and new ones added */
            $("#controlsForm").tabs(
                {
                    "create": () => {
                        this.#configuration.availableConfigurations.forEach((elem) => {
                            if (this.#configuration.activeConfigurationKey !== elem[0]) {
                                return;
                            }

                            $("ul.ui-tabs-nav").append($(`<label>Current Configuration: <a href="#" id="show-configuration-manage-dialog">${elem[1]}</a></label>`));
                        });
                    }
                }
            );


            return this;
        };

        addHeader() {
            const header = new DocumentHeader(this.#configuration);

            $('div.page').append(header.render());

            return this;
        };

        addSections() {
            const sections = new Sections(this.#configuration, this.#meetings);

            sections.render();

            return this;
        };

        addFooter() {
            if (!this.#configuration.settings.printDocumentFooter) {
                return this;
            }

            const footer = $(`<p style="text-align: center; padding-top: 12pt; margin-bottom: 0;" class="${this.#configuration.settings.footerFontSize}">${this.#configuration.settings.documentFooter}</p>`);

            $("div.page").append(footer);

            return this;
        }
    };