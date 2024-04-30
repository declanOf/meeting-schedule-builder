class MeetingFilter
{
    constructor(meetings, filters) {
        this.meetings = this.originalMeetings = meetings;

        if (typeof(filters) == "object") {
            this.exclusions = filters.exclude;
            this.inclusions = filters.include;
        }

        this.applyFilters();
    }

    applyFilters = () => this.meetingsLessExclusions().meetingsWithInclusions();

    filteredMeetings = () => this.applyFilters().meetings;

    meetingsLessExclusions() {
        if (typeof(this.exclusions) === "object") {
            if ("districts" in this.exclusions && Array.isArray(this.exclusions.districts)) {
                this.meetings = this.meetings.filter((meeting) => this.exclusions.districts.indexOf(meeting.district_id) === -1);
            }

            if ("groups" in this.exclusions && Array.isArray(this.exclusions.groups)) {
                this.meetings = this.meetings.filter((meeting) => this.exclusions.groups.indexOf(meeting.group_id) === -1);
            }

            if ("types" in this.exclusions && Array.isArray(this.exclusions.types)) {
                this.meetings = this.meetings.filter((meeting) => this.exclusions.types.intersect(meeting.types).length === 0);
            }

            if ("attendanceOption" in this.exclusions && Array.isArray(this.exclusions.attendanceOption)) {
                this.meetings = this.meetings.filter((meeting) => this.exclusions.attendanceOption.indexOf(meeting.attendance_option) === -1);
            }

            if ("name" in this.exclusions && typeof this.exclusions.name === "object" && this.exclusions.name !== null) {
                this.meetings = this.meetings.filter((meeting) => !this.matches(meeting.name, this.exclusions.name) );
            }
        }

        return this;
    };

    meetingsWithInclusions()
    {
        if (typeof(this.inclusions) === "object") {
            if ("districts" in this.inclusions && Array.isArray(this.inclusions.districts)) {
                this.meetings = this.meetings.filter((meeting) => this.inclusions.districts.indexOf(meeting.district_id) !== -1);
            }

            if ("groups" in this.inclusions && Array.isArray(this.inclusions.groups)) {
                this.meetings = this.meetings.filter((meeting) => this.inclusions.groups.indexOf(meeting.group_id) !== -1);
            }

            if ("types" in this.inclusions && Array.isArray(this.inclusions.types)) {
                this.meetings = this.meetings.filter((meeting) => this.inclusions.types.intersect(meeting.types).length > 0);
            }

            if ("attendanceOption" in this.inclusions && Array.isArray(this.inclusions.attendanceOption)) {
                this.meetings = this.meetings.filter((meeting) => this.inclusions.attendanceOption.indexOf(meeting.attendance_option) !== -1);
            }

            if ("name" in this.inclusions && typeof this.inclusions.name === "object") {
                this.meetings = this.meetings.filter((meeting) => this.matches(meeting.name, this.inclusions.name) );
            }

            if ("containsAllOf" in this.inclusions && typeof this.inclusions.containsOneOf === "object") {
                this.meetings = this.meetings.filter((meeting) => this.matchesAll(meeting, this.inclusions.containsOneOf) )
            }
        }

        return this;
    };

    matches(item, containsOneOf)
    {
        let match = false;
        containsOneOf.forEach((pattern) => {
            if (match) { return; }

            const testValue = item;

            const expression = `*.${pattern}.*`;

            if (-1 !== testValue.search(pattern)) {
                match = true;
                return;
            }
        });

        return match;
    };

    matchesAll(meeting, containsOneOf)
    {
        let match = false;
        Object.keys(containsOneOf).forEach((key) => {
            if (!match) { match = false; return; }

            const testValue = meeting[contains.key];

            containsOneOf[key].forEach((pattern) => {
                if (!match) { return; }

                const expression = `*.${pattern}.*`;
                if (-1 === testValue.search(expression)) {
                    match = false;
                    return;
                }

                match = true;
            })
        })

        return match;
    };
}
