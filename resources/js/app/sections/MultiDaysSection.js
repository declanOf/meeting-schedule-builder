class MultiDaysSection extends GenericBlockSection
{
    #multiDays;

    constructor (meetings, section, sectionIndex, configuration)
    {
        super(meetings, section, sectionIndex, configuration);

        this.#multiDays = this.meetings;

        this.#process();
    }

    #process()
    {
        this.#filterBlocksOfMeetings();

        this.#sortMeetings();
    }

    get meetings()
    {
        if (this.#multiDays) {
            return this.#multiDays;
        }

        return super.meetings;
    }

    #sortMeetings()
    {
        const multiDays = Object
            .entries(this.#multiDays)
            .map((meeting) => {
                if ("days" in meeting[1]) {
                    meeting[1].day = meeting[1].days;
                }

                meeting[1].key = meeting[0];

                return meeting[1];
            })
            .sort((a, b) => {
                let aTime = parseInt(a.time.replace(":", ""));

                let bTime = parseInt(b.time.replace(":", ""));

                if (configuration.midnightMeetingPosition === "end") {
                    if (aTime === 0) {
                        aTime = 2359;
                    }

                    if (bTime === 0) {
                        bTime = 2359;
                    }
                }

                return aTime - bTime;
            });

        this.#multiDays = Object.fromEntries(multiDays.map((meeting) => [meeting.key, meeting]));
    }

    #filterBlocksOfMeetings()
    {
        Object.keys(this.#multiDays).forEach((key) => this.#multiDays[key] = (new MeetingFilter(this.#multiDays[key], this.section)).meetings);
    }
}
