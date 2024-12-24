if (Array.prototype.serialiseToObject) {
    console.warn("Overriding existing Array.prototype.reserialiseForm");
}

/**
 * Convert a flat array into a structured array
 * @param {*} flatArray
 * @returns
 */
Array.prototype.serialiseToObject = function() {
    const flatArray = this;

    var data = {};

    let prevElement = null;

    flatArray.forEach((element) => {
        if (prevElement && prevElement.name === element.name) {
            return;
        }

        let val = element.value;

        if (!val) {
            val = "";
        }

        val = val.replace("\r", "").replace("\n", "<br>");

        if (val === "on" || val === "true") {
            val = true;
        } else if (val === "off" || val === "false") {
            val = false;
        }

        let fullName = element.name;

        if (!fullName) {
            return;
        }

        let fullNameParts = fullName.split('.');

        let prefix = '';

        let stack = data;

        for (let k = 0; k < fullNameParts.length - 1; k++) {
            prefix = fullNameParts[k];

            if (!stack[prefix]) {
                stack[prefix] = {};
            }

            stack = stack[prefix];
        }

        prefix = fullNameParts[fullNameParts.length - 1];

        if (stack[prefix]) {
            stack[prefix] += newVal = stack[prefix] + ',' + val;
        } else {
            stack[prefix] = val;
        }
        prevElement = element;
    });

    return data;
}


// Hide method from for-in loops
Object.defineProperty(Array.prototype, "reserialiseToObject", {enumerable: false});