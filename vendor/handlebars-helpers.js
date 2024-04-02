Handlebars.registerHelper(
    'ifEquals',
    (arg1, arg2, options) => (arg1 == arg2) ? options.fn(this) : options.inverse(this)
);

Handlebars.registerHelper(
    'ifNotEmptyOrWhitespace',
    function (value, options) {
        return (!value)
            ? options.inverse(this)
            : (value.replace(/\s*/g, '').length > 0
                ? options.fn(this)
                : options.inverse(this))
    }
);

Handlebars.registerHelper(
    'replace',
    function(find, replace, options) {
        return options.fn(this).replace((new RegExp(find, 'g')), replace);
});
