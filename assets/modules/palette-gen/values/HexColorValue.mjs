import ColorValue from "./ColorValue.mjs";



export default class HexColorValue extends ColorValue {
    /**
     * Creates a new Hex color value
     * @param {string} value The color value
     */
    constructor(value) {
        super(value);
    }



    /**
     * @param {string} value The color value to validate
     */
    static validateValue(value) {
        if (typeof value !== 'string') return false;

        // Remove leading '#' if present
        if (value.startsWith('#')) value = value.slice(1);

        // Expand shorthand hex
        if (value.length === 3 || value.length === 4) value = value.split('').map(c => c + c).join('');
        if (value.length !== 6 && value.length !== 8) return false;

        // Check if all characters are valid hex digits
        return /^[0-9A-Fa-f]+$/.test(value);
    }



    toCssString() {
        // Ensure leading '#'
        return this.value.startsWith('#') ? this.value : `#${this.value}`;
    }



    static fromCssString(cssString) {
        return new HexColorValue(cssString);
    }
}