class InstallDialog
{
    constructor() {
        $("body").append(this.render());

        $("#installDialog").dialog({title: "Meeting Schedule Builder", width: 600});

        this.attachHandlers();
    }

    attachHandlers() {
        $("#create-schedule").click((event) => {
            event.preventDefault();

            const schedule = $("#preexisting-schedule").find(":selected");

            const scheduleData = {
                 url: schedule.val() + "/wp-admin/admin-ajax.php?action=meetings",
                name: schedule.text()
            };

            if (createFreshSchedule(scheduleData)) {
                alert("Close this alert to load your new configuration!");

                location.reload();
            }
        });

        const createScheduleFromScratch = ((event) => {
            event.preventDefault();

            const scheduleData = {
                url: $("#scratch-source-url").val(),
                name: $("#scratch-name").val()
            };

            if (createFreshSchedule(scheduleData)) {
                alert("Close this alert to load your new configuration!");

                location.reload();

                return;
            }
        });

        $("#create-schedule-from-scratch").on("click", createScheduleFromScratch);
    }

    render() {
        const buildNewScheduleFormEngine = Handlebars.compile(buildNewScheduleFormTemplate);
        const installDialogEngine = Handlebars.compile(installDialogTemplate);

        return installDialogEngine({
            buildNewScheduleForm: buildNewScheduleFormEngine({centralOffices: CentralOffices})
        });
    }
}