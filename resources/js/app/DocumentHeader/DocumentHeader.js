class DocumentHeader
{
    #configuration;
    #template;
    #keySets;

    constructor(Configuration)
    {
        this.#template      = documentHeaderTemplate;
        this.#configuration = Configuration;
        this.#buildTypes();
    }

    #buildTypes()
    {
        const types = this.#configuration.settings.types;

        this.#keySets = [];

        Object.entries(types).forEach((entry) => {
            const type    = entry[1];

            let keySet = {
                "symbol"         : type.displaySymbol,
                "description"    : type.description,
                "withSymbol"     : null,
                "withDescription": null,
                "header"         : type.showInHeader,
                "rows"           : type.showInColumn
            };

            if (type.withKey) {
                const withType            = types[type.withKey];

                keySet["withSymbol"]      = withType.displaySymbol;

                keySet["withDescription"] = withType.description;
            }

            this.#keySets.push(keySet);
        });
    }

    get types()
    {
        return this.#keySets.filter((elem) => elem.header === true);
    }

    render()
    {
        const headerTemplateEngine = Handlebars.compile(this.#template);

        const date = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return headerTemplateEngine({
            "documentHeader" : this.#configuration.settings.documentHeader,
            "dateString" : date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear(),
            "types": this.types
        });
    }
}