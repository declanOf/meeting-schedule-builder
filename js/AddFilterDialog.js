class AddFilterDialog
{
    // Add type: exclude or include based on filter
    // list types of filters: attendance option, district, types, name string
    // allow entry of district, type, name, or attendance option

    #configuration;

    constructor()
    {
        this.#configuration = new Configuration();
    }

    render()
    {
        const addFilterDialogEngine = Handlebars.compile(addFilterDialogTemplate);

        const types = Object.entries(this.#configuration.settings.types);
        let showTypes = [];

        types.forEach((entry) => {
            showTypes.push({
                "key": entry[0],
                "displaySymbol": entry[1].displaySymbol.length > 0 ? entry[1].displaySymbol : `<i>${entry[0]}</i>`,
                "description": entry[1].description.length > 0 ? entry[1].description : `<i>No description</i>`
            });
        });

        let data = {
            types: showTypes
        };

        return addFilterDialogEngine(data);
    }
}
