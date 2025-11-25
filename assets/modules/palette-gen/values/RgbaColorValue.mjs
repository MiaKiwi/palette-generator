import ColorValue from "./ColorValue.mjs";



export default class RgbaColorValue extends ColorValue {
    /**
     * Creates a new RGBA color value
     * @param {{r: number, g: number, b: number, a: number}} value The color value
     */
    constructor(value = {
        r: number,
        g: number,
        b: number,
        a: number
    }) {
        super(value);
    }



    set r(value) {
        let newValue = { ...this.value, r: value };

        if (!this.constructor.validateValue(newValue)) throw new Error('Invalid color value');

        this.value = newValue;
    }

    get r() { return this.value.r; }



    set g(value) {
        let newValue = { ...this.value, g: value };

        if (!this.constructor.validateValue(newValue)) throw new Error('Invalid color value');

        this.value = newValue;
    }

    get g() { return this.value.g; }



    set b(value) {
        let newValue = { ...this.value, b: value };

        if (!this.constructor.validateValue(newValue)) throw new Error('Invalid color value');

        this.value = newValue;
    }

    get b() { return this.value.b; }



    set a(value) {
        let newValue = { ...this.value, a: value };

        if (!this.constructor.validateValue(newValue)) throw new Error('Invalid color value');

        this.value = newValue;
    }

    get a() { return this.value.a; }



    /**
     * Validates the RGBA color value
     * @param {{r: number, g: number, b: number, a: number}} value The color value to validate
     * @returns {boolean} True if the value is valid, false otherwise
     */
    static validateValue(value) {
        if (typeof value !== 'object') return false;

        let { r, g, b, a } = value;

        if (
            typeof r !== 'number' || r < 0 || r > 255 ||
            typeof g !== 'number' || g < 0 || g > 255 ||
            typeof b !== 'number' || b < 0 || b > 255 ||
            typeof a !== 'number' || a < 0 || a > 1
        ) {
            return false;
        }

        return true;
    }



    toCssString() {
        let { r, g, b, a } = this.value;

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }



    static fromCssString(cssString) {
        let regex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|0?\.\d+|1(\.0)?)\s*\)$/i;
        let match = cssString.match(regex);

        if (!match) throw new Error('Invalid RGBA CSS string');

        let r = parseInt(match[1], 10);
        let g = parseInt(match[2], 10);
        let b = parseInt(match[3], 10);
        let a = parseFloat(match[4]);

        return new RgbaColorValue({ r, g, b, a });
    }
}