class InstallDialog
{
    constructor() {
        $("body").append(this.render());

        $("#installDialog").dialog({title: "Meeting Schedule Builder", width: 600});

        this.attachHandlers();
    }

    attachHandlers() {
        $("#create-new-schedule").click((event) => {
            event.preventDefault();

        });

        $("#create-schedule").click((event) => {
            event.preventDefault();

            const schedule = $("#preexisting-schedule").find(":selected");

            const scheduleData = {
                 url: schedule.val(),
                name: schedule.text()
            };

            if (createFreshConfiguration(scheduleData)) {
                alert("Close this alert to load your new configuration!");

                location.reload();
            }
        });
    }

    render() {
        const buildNewScheduleFormEngine = Handlebars.compile(buildNewScheduleFormTemplate);
        const installDialogEngine = Handlebars.compile(installDialogTemplate);

        return installDialogEngine({
            buildNewScheduleForm: buildNewScheduleFormEngine({centralOffices: CentralOffices})
        });
    }
}