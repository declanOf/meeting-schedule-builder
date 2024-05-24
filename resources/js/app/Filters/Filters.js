class Filters
{
    #uuid;

    #template;

    #meetings;

    #excludes;

    #includes;

    #prefix;

    // instantiate filters template engine, pass filters array to it,
    constructor(meetings, filters)
    {
        this.#template = filtersTemplate;

        this.#uuid = crypto.randomUUID();

        this.#meetings = meetings;

        this.#excludes = {
                        "name":[],
                       "types":[],
                      "groups":[],
                     "regions":[],
                   "districts":[],
            "attendanceOption":[],
        };

        this.#includes = {
                        "name":[],
                       "types":[],
                      "groups":[],
                     "regions":[],
                   "districts":[],
            "attendanceOption":[],
        };

        if (Object.keys(filters).includes('exclude')) {
            const exclusionKeys = Object.keys(filters.exclude);
            Object.keys(this.#excludes).forEach((key) => {
                if (exclusionKeys.includes(key) && filters.exclude[key]) {
                    this.#excludes[key] = filters.exclude[key];
                }
            })
        }

        if (Object.keys(filters).includes("include")) {
            const inclusionKeys = Object.keys(filters.include);
            Object.keys(this.#includes).forEach((key) => {
                if (inclusionKeys.includes(key) && filters.include[key]) {
                    this.#includes[key] = filters.include[key] ?? [];
                }
            })
        }
    }

    getFilterInAttendanceOption()
    {
        return [
            {
                  "symbol":"in-person",
                    "name":"In-Person",
                "selected":this.#includes.attendanceOption == "in-person",
            },
            {
                  "symbol":"online",
                    "name":"Online",
                "selected":this.#includes.attendanceOptions == "remote"
            }
        ];
    }

    getFilterOutAttendanceOption()
    {
        return [
            {
                  "symbol":"in-person",
                    "name":"In-Person",
                "selected":this.#excludes.attendanceOption == "in-person",
            },
            {
                  "symbol":"online",
                    "name":"Online",
                "selected":this.#excludes.attendanceOptions == "remote"
            }
        ];
    }

    getFilterInTypes()
    {
        if (!this.#meetings.isValid) {
            throw "Invalid meeting";
        }

        return this.#meetings.types.map((type) => {
            return {
                  "symbol":type,
                "selected":"types" in this.#includes && this.#includes.types.indexOf(type) !== -1 ? "selected":""
            }
        });
    }

    getFilterOutTypes()
    {
        return this.#meetings.types.map((type) => {
            return {
                  "symbol":type,
                "selected":this.#excludes.types.indexOf(type) !== -1 ? "selected":""
            }
        });
    }

    getFilterInDistricts()
    {
        return this.#meetings.districts.map((district) => {
            return {
                    "name":district.district,
                      "id":district.district_id,
                "selected":this.#includes.districts.indexOf(district.district_id) !== -1 ? "selected":""
            };
        });
    }

    getFilterOutDistricts()
    {
        return this.#meetings.districts.map((district) => {
            return {
                    "name":district.district,
                      "id":district.district_id,
                "selected":this.#excludes.districts.indexOf(district.district_id) !== -1 ? "selected":""
            };
        });
    }

    getFilterInRegions()
    {
        return this.#meetings.regions.map((region) => {
            return {
                    "name":region.region,
                      "id":region.region_id,
                "selected":this.#includes.regions.indexOf(region.region_id) !== -1 ? "selected":""
            };
        });
    }

    getFilterOutRegions()
    {
        return this.#meetings.regions.map((region) => {
            return {
                    "name":region.region,
                      "id":region.region_id,
                "selected":this.#excludes.regions.indexOf(region.region_id) !== -1 ? "selected":""
            };
        });
    }

    getFilterInGroups()
    {
        return this.#meetings.groups.map((group) => {
            return {
                    "name":group.group,
                      "id":group.group_id,
                "selected":this.#includes.groups.indexOf(group.group_id) !== -1 ? "selected":""
            };
        });
    }

    getFilterOutGroups()
    {
        return this.#meetings.groups.map((group) => {
            return {
                    "name":group.group,
                      "id":group.group_id,
                "selected":this.#excludes.groups.indexOf(group.group_id) !== -1 ? "selected":""
            };
        });
    }

    getFilterList()
    {
        let filtersList = [];

        Object.entries(this.#includes).forEach((elem) => {
            elem[1].forEach((filterItem, idx) => filtersList.push(
                {"type": "Include", "key": elem[0], "idx": idx, "item": filterItem}
            ));
        })

        Object.entries(this.#excludes).forEach((elem) => {
            elem[1].forEach((filterItem, idx) => filtersList.push(
                {"type": "Exclude", "key": elem[0], "idx": idx, "item": filterItem}
            ));
        })

        return filtersList;
    }

    get prefix()
    {
        return this.#prefix;
    }

    set prefix(prefix)
    {
        this.#prefix = prefix;
    }

    render()
    {
        if (!this.#meetings.isValid) {
            return "";
        }

        const filtersTemplateEngine = Handlebars.compile(this.#template);

        const filterList = this.getFilterList();

        return filtersTemplateEngine({
                               "uuid"  : this.#uuid,
                         "filterList" : filterList,
                            "prefix"  : this.prefix,
                       "includeTypes" : this.getFilterInTypes(),
                     "includeRegions" : this.getFilterInRegions(),
                   "includeDistricts" : this.getFilterInDistricts(),
                      "includeGroups" : this.getFilterInGroups(),
                       "excludeTypes" : this.getFilterOutTypes(),
                     "excludeRegions" : this.getFilterInRegions(),
                   "excludeDistricts" : this.getFilterOutDistricts(),
                      "excludeGroups" : this.getFilterOutGroups(),
            "excludeAttendanceOption" : this.getFilterOutAttendanceOption(),
            "includeAttendanceOption" : this.getFilterInAttendanceOption(),
        });
    }
}