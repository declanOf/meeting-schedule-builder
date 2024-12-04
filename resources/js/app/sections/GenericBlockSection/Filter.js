class GenericBlockSection_Filter
{
    static filter(meetings, section)
    {
        if (Array.isArray(meetings)) {
            console.error("GenericBlockSection being fed mix of arrays and objects");
        }

        if (!(typeof meetings === "object") || meetings === null) {
            return;
        }

        meetings = Object
            .entries(meetings)
            .map((meeting) => {
                meeting[1].key = meeting[0];

                if ("days" in meeting[1]) {
                    meeting[1].day = meeting[1].days;
                }

                return meeting[1];
            });

        meetings = new MeetingFilter(meetings, section.filter).meetings;

        return Object.fromEntries(meetings.map((meeting) => [meeting.key, meeting]));
    }
}