class Meetings {
    #configuration;
    
    #lastUpdate;

    #meetings;

    #rawMeetings;

    #groups;

    #regions;
    
    #districts;
    
    #types;

    constructor(Configuration, ready) 
    {
        this.#configuration = Configuration;

        this.#loadMeetings(ready);
    }

    #loadMeetings(ready) {
        this.#loadFromLocalStorage(ready);

        if (this.#rawMeetings) {
            return ready();
        }

        this.#refresh(ready);
    }

    #loadFromLocalStorage(ready)
    {
        this.#loadTimestamp();

        if (this.#needsRefresh()) {
            return;
        }

        console.log("Loading from local storage");

        try {
            this.#rawMeetings = this.meetings = JSON.parse(localStorage.getItem('rawMeetings'));

            this.#groups = JSON.parse(localStorage.getItem("groups"));

            this.#regions = JSON.parse(localStorage.getItem("regions"));

            this.#districts = JSON.parse(localStorage.getItem("districts"));

            this.#types = JSON.parse(localStorage.getItem("types"));
        } catch (e) {
            this.#rawMeetings = false;
            
            this.#refresh(ready);
        }
    };

    #loadTimestamp()
    {
        const timestamp = localStorage.getItem("timestamp");

        this.#lastUpdate = timestamp ? parseInt(timestamp) : false;
    }

    #saveTimestamp()
    {
        const timestamp = Date.now();

        localStorage.setItem("timestamp", timestamp);
    }

    #needsRefresh()
    {
        if (!this.#lastUpdate) {
            return true;
        }

        // one hour
        const expiryTimestamp = Date.now() - 1000 * 60 * 60 * this.#configuration.settings.expiryHours;

        return this.#lastUpdate < expiryTimestamp;
    }

    #refresh(ready)
    {
        jQuery.get({url: this.#configuration.settings.sourceUrl})
            .done((response) => { 
                this.#saveTimestamp();

                localStorage.setItem("rawMeetings", JSON.stringify(response));

                this.meetings = response;

                this.#populateGroups();
                this.#populateRegions();
                this.#populateDistricts();
                this.#populateTypes();
        
                ready();
            });
    }

    #populateGroups()
    {
        let groups = [];

        this.#rawMeetings.map((meeting) => { 
            groups.push({
                "group_id": meeting.group_id,
                "group": meeting.group
            });
        });

        groups = this.#filterUnique(groups, "group", "group_id")
            .sort((a, b) => (a.group < b.group) ? -1 : (a.group > b.group) ? 1 : 0);

        localStorage.setItem("groups", JSON.stringify(groups));
    }

    #populateRegions()
    {
        let regions = [];

        this.#rawMeetings.map((meeting) => { 
            regions.push({
                "region_id": meeting.region_id,
                "region": meeting.region
            });
        });

        regions = this.#filterUnique(regions, "region", "region_id")
            .sort((a, b) => (a.region < b.region) ? -1 : (a.region > b.region) ? 1 : 0);

        localStorage.setItem("regions", JSON.stringify(regions));
    }

    #populateDistricts()
    {
        let districts = [];

        this.#rawMeetings.map((meeting) => { 
            districts.push({
                "district_id": meeting.district_id,
                "district": meeting.district
            });
        
        });

        districts = this.#filterUnique(districts, "district", "district_id")
            .sort((a, b) => parseInt(a.district.split(" ")[1]) - parseInt(b.district.split(" ")[1]));

        localStorage.setItem("districts", JSON.stringify(districts));
    }

    #populateTypes()
    {
        let types = [];

        this.#rawMeetings.map(
            (meeting) => { 
                if (Array.isArray(meeting.types)) {
                    meeting.types.map(
                        (type) => { 
                            if (-1 === types.indexOf(type)) {
                                types.push(type)
                            }
                        }
                    )
                }
            }
        );

        types.sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0);

        localStorage.setItem("types", JSON.stringify(types));
    }

    #filterUnique(data, label, id)
    {
        var results = [];
        
        data.filter(function(item){
            if (item[id] === undefined || item[label] === undefined) {
                return null;
            }
            
            var i = results.findIndex(x => (x[id] == item[id] && x[label] == item[label]));
            
            if (i <= -1) {
                results.push(item);
            }
        
            return null;
        });

        return results;
    }

    get groups()
    {
        if (!this.#groups)
        {
            this.#groups = JSON.parse(localStorage.getItem("groups"));
        }

        return this.#groups;
    }

    get regions()
    {
        if (!this.#regions)
        {
            this.#regions = JSON.parse(localStorage.getItem("regions"));
        }

        return this.#regions;
    }

    get districts()
    {
        if (!this.#districts)
        {
            this.#districts = JSON.parse(localStorage.getItem("districts"));
        }

        return this.#districts;
    }

    get types()
    {
        if (!this.#types)
        {
            this.#types = JSON.parse(localStorage.getItem("types"));
        }

        return this.#types;
    }
    
    get rawMeetings()
    {
        return this.#rawMeetings;
    }

    set meetings(meetings)
    {
        if (!this.#rawMeetings) {
            this.#rawMeetings = meetings;
        }

        this.#meetings = meetings;
    }

    get meetings()
    {
        return this.#meetings;
    }
};
