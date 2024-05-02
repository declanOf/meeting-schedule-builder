/**
 * Get a set of types for a meeting, return the correct output
 * 
 **/

class TypesHelper
{
    getFilteredTypes(configuration, unfilteredTypes)
    {
        const configurationTypes = configuration.settings.types;

        unfilteredTypes.forEach((type) => {
            if (type in this.types) {
                displayTypes.push(configurationTypes[type].displaySymbol);
            }
        });
    }
}