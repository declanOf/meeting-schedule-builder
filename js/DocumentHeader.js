class DocumentHeader
{
    #configuration;
    #template;
    #keySets;

    constructor(Configuration, template)
    {
        this.#template      = template;
        this.#configuration = Configuration;
        this.#buildTypes();
    }

    #buildTypes()
    {
        const keyTypes = this.#configuration.settings.documentHeader.keyTypes;

        const types = this.#configuration.settings.types;

        this.#keySets = [];

        this.#configuration.settings.documentHeader.keyTypes.forEach((keyType) => {
            const key     = keyType.key;
            const withKey = keyType.withKey;

            const sourceType = types[key];

            let keySet = {
                "symbol"         : sourceType.displaySymbol,
                "description"    : sourceType.description,
                "withSymbol"     : false,
                "withDescription": false
            };

            if (withKey) {
                const withType            = types[withKey];
                keySet["withSymbol"]      = withType.displaySymbol;
                keySet["withDescription"] = withType.description;
            }

            this.#keySets.push(keySet);
        });
    }

    get types()
    {
        return this.#keySets;
    }

    render()
    {
        const headerTemplateEngine = Handlebars.compile(this.#template);

        const date = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return headerTemplateEngine(
            {
                "documentHeader" : this.#configuration.settings.documentHeader,
                "dateString" : date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear(),
                "types": this.types
            });
    }
}