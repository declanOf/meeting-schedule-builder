
// Warn if overriding existing method
if (Array.prototype.concatUnique) {
    console.warn("Overriding existing Array.prototype.concatUnique. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.concatUnique = function (array) {
    const uniqueArray = [...new Set(this.concat(array))];

    // alternative:
    // const uniqueArray = this.filter((value, index, array) => array.indexOf(value) === index);

    return uniqueArray;
}

// Hide method from for-in loops
Object.defineProperty(Array.prototype, "concatUnique", {enumerable: false});
