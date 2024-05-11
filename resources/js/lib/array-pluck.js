// Warn if overriding existing method
if (Array.prototype.pluck) {
    console.warn("Overriding existing Array.prototype.pluck. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
}

Array.prototype.pluck = function (key) {
    return this.map((object) => object[key]);
}

Object.defineProperty(Array.prototype, "pluck", {enumerable: false});