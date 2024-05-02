
if (Array.prototype.intersect) {
    console.info("Overriding existing Array.prototype.intersect.");
}

Array.prototype.intersect = function(array) {
    let intersections = [];

    // if the other array is a falsy value, return
    if (!array) {
        return intersections;
    }

    // if the argument is the same array, we can be sure the contents are same as well
    if (array === this) {
        return array;
    }

    for (let i = 0, l = this.length; i < l; i++) {
        for (let ii = 0, ll = array.length; ii < ll; ii++) {
            if (this[i] instanceof Array && array[ii] instanceof Array) {
                // recurse into the nested arrays
                if (this[i].equals(array[ii])) {
                    intersections.push(array[ii]);
                }
            } else if (this[i] == array[ii]) {
                intersections.push(array[ii]);
            }
        }
    }

    return intersections;
}

// Hide method from for-in loops
Object.defineProperty(Array.prototype, "intersect", {enumerable: false});
