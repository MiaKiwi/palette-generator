// Abstract base class for color values
export default class ColorValue {
    /**
     * Creates a new color value
     * @param {*} value The color value
     */
    constructor(value) {
        this.value = value;
    }



    set value(value) {
        if (!this.constructor.validateValue(value)) throw new Error('Invalid color value');

        this._value = value;
    }

    get value() { return this._value; }



    /**
     * Validates the color value
     * @param {*} value The color value to validate
     * @returns {boolean} True if the value is valid, false otherwise
     */
    static validateValue(value) {
        throw new Error("Method 'validateValue' must be implemented in subclass");
    }



    /**
     * Converts the color value to a CSS string
     * @return {string} The CSS string representation of the color value
     */
    toCssString() {
        throw new Error("Method 'toCssString' must be implemented in subclass");
    }



    /**
     * Creates a color value from a CSS string
     * @param {string} cssString The CSS string representation of the color value
     */
    static fromCssString(cssString) {
        throw new Error("Method 'fromCssString' must be implemented in subclass");
    }



    /**
     * Creates a clone of the current color value
     * @returns {ColorValue} A new instance of the color value with the same value
     */
    clone() {
        return new this.constructor(this.value);
    }
}