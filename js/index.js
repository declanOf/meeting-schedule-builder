let configuration = null;
let meetings = null;
let sections = null;

$(document).ready(() => {
    const configuration = new Configuration();

    new Promise((ready) => {
        meetings = new Meetings(configuration, ready);
    }).then(() => {
        const header = new DocumentHeader(configuration, documentHeaderTemplate);

        $('div.page').append(header.render());

        sections = new Sections(configuration, meetings);

        sections.render();

        const controls = new Controls(configuration, controlsTemplate, meetings);

        controlsContent = controls.render();
        $('div#controls').append(controlsContent);

        $(".configuration-display").click(() => {
            if ($("div#controls div.flex-container").hasClass("show")) {
                $("div#controls div.flex-container").removeClass("show").addClass("hide");
            } else {
                $("div#controls div.flex-container").removeClass("hide").addClass("show");
            }
        });


        $(".expand-section").on("click", function (event) {$(this).parents("div.section").addClass("expanded").removeClass("collapsed")})

        $(".collapse-section").on("click", function (event) {$(this).parents("div.section").addClass("collapsed").removeClass("expanded")});


        $("#controlsForm").tabs();
    })
});
