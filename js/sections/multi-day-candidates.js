class MultiDayCandidates
{
    #configuration;

    constructor(meetings, configuration)
    {
        this.#configuration = configuration;

        this.multiDayCandidates = [];
        this.mixedDays = {};

        this.meetings = meetings;

        this.process();
    };

    /**
     * Get string representing the days of the meeting
     *
     * @param  array
     * @return string
     */
    #getDaysFromMultipleMeetings(meetings)
    {
        /**
          *
          * @param {*} dayIndex
          * @returns
          */
        const getDayLabel = function(dayIndex)
        {
            const dayLabels = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S']

            return dayLabels[dayIndex];
        }

        if (meetings.length === 1) {
            return getDayLabel(meetings[0].day);
        }

        if (meetings.length === 7) {
            return "Daily";
        }

        let days = meetings.pluck("day");

        if (days.length === 5 && days.equals([1, 2, 3, 4, 5])) {
            return "Mon - Fri";
        }

        if (days.length === 6 && days.equals([1, 2, 3, 4, 5, 6])) {
            return "Mon - Sat";
        }

        if (days.length === 6 && days.equals([1, 2, 3, 4, 5, 0])) {
            return "Sun - Fri";
        }

        days = days.map((day) => getDayLabel(day));

        return days.join(",");
    }

    process()
    {
        this.meetings.forEach((meeting) => {
            let groupIdTime = `${meeting.time} ${meeting.group_id} ${meeting.name}`;

            if (meeting.types) {
                if (meeting.types.find((elem) => elem === 'M')) {
                    groupIdTime += "M";
                } else if (meeting.types.find((elem) => elem === 'W')) {
                    groupIdTime += "W";
                }
            }

            if (groupIdTime in this.multiDayCandidates) {
                this.multiDayCandidates[groupIdTime].push(meeting);
            } else {
                this.multiDayCandidates[groupIdTime] = [meeting];
            }
        });

        Object.keys(this.multiDayCandidates).forEach((key) => {
            const candidate = this.multiDayCandidates[key];

            const daysOfTheWeek = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'];

            if (candidate.length === 1) {
                candidate[0].dayType = "single";
                candidate[0].day = daysOfTheWeek[candidate[0].day];

                this.mixedDays[key] = candidate[0];
            } else {
                // clone object
                if (candidate.length > this.#configuration.settings.minimumMultidayCount) {
                    let firstCandidate = {...candidate[0]};

                    firstCandidate.dayType = "multi";
                    firstCandidate.days = this.#getDaysFromMultipleMeetings(candidate);
                    this.mixedDays[key] = firstCandidate;
                }

                candidate.forEach((item, index) => {
                    if (candidate.length <= this.#configuration.settings.minimumMultidayCount) {
                        let tempItem = {...item};

                        tempItem.dayType = "semi-single";
                        tempItem.day = daysOfTheWeek[item.day];

                        this.mixedDays[key + "_" + index + "_exception"] = tempItem;
                    }

                    item.dayType = "single-multi";
                    item.day = daysOfTheWeek[item.day];

                    this.mixedDays[key + "_" + index] = item;
                });
            }
        });
    };

    /**
     * Get meetings that only meet multiple days a week
     * in blocks
     */
    get multiDays()
    {
        let filtered = {};

        Object
            .entries(this.mixedDays)
            .map((entry) => {
                if (entry[1].dayType === "multi") {
                    filtered[entry[0]] = entry[1];
                }

        });

        return filtered;
    }

    /**
     * Get meetings that only meet one day a week
     */
    get singleExclusiveDays()
    {
        let filtered = {};

        Object
            .entries(this.mixedDays)
            .map((entry) => {
                if (entry[1].dayType === "single" || entry[1].dayType === "semi-single") {
                    filtered[entry[0]] = entry[1];
                }

        });

        return filtered;
    }

    /**
     * Get meetings for each day of the week,
     * but include meetings with blocks of multiple days
     */
    get singleInclusiveDays()
    {
        let filtered = {};

        Object
            .entries(this.mixedDays)
            .map((entry) => {
                if (entry[1].dayType === "single" || entry[1].dayType === "multi") {
                    filtered[entry[0]] = entry[1];
                }

        });

        return filtered;
    }

    /**
     * Get meetings for each day of the week,
     * including multi-day meetings for their
     * individual day listings
     */
    get mixedFullDays()
    {
        let filtered = {};

        Object
            .entries(this.mixedDays)
            .map((entry) => {
                if (entry[1].dayType === "single" || entry[1].dayType === "single-multi") {
                    filtered[entry[0]] = entry[1];
                }
        });

        return filtered;
    }
}
