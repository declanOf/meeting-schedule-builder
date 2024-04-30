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

            alert("create new");
        });

        $("#use-preexisting-schedule").click((event) => {
            event.preventDefault();

            const createFreshConfiguration = (scheduleData) => {
                function uuidv4() {
                    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
                    );
                }

                const settings = {...FreshSettings};

                settings.sourceUrl = scheduleData.url + "/wp-admin/admin-ajax.php?action=meetings";
                settings.documentHeader.officeTitle = scheduleData.name;
                settings.documentHeader.displayUrl = scheduleData.url;

                const newConfigurationKey = uuidv4();

                const availableConfigurations = [[newConfigurationKey, scheduleData.name]];

                localStorage.setItem("availableConfigurations", JSON.stringify(availableConfigurations));

                localStorage.setItem("activeConfigurationKey", newConfigurationKey);

                localStorage.setItem("settings-" + newConfigurationKey, JSON.stringify(settings));

                alert("Close this alert to load your new configuration!");

                location.reload();
            }

            const schedule = $("#preexisting-schedule").find(":selected");

            const scheduleData = {
                 url: schedule.val(),
                name: schedule.text()
            };

            createFreshConfiguration(scheduleData);
        });

    }

    render() {
        const installDialogEngine = Handlebars.compile(installDialogTemplate);

        return installDialogEngine({centralOffices: CentralOffices});
    }
}