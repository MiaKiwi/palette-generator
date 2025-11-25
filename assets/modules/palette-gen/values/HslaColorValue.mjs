import ColorValue from "./ColorValue.mjs";



export default class HslaColorValue extends ColorValue {
    /**
     * Creates a new HSLA color value
     * @param {{h: number, s: number, l: number, a: number}} value The initial color value
     */
    constructor(value = {
        h: number,
        s: number,
        l: number,
        a: number
    }) {
        super(value);
    }



    set h(value) {
        let newValue = { ...this.value, h: value };

        if (!this.constructor.validateValue(newValue)) throw new Error('Invalid color value');

        this.value = newValue;
    }

    get h() { return this.value.h; }



    set s(value) {
        let newValue = { ...this.value, s: value };

        if (!this.constructor.validateValue(newValue)) throw new Error('Invalid color value');

        this.value = newValue;
    }

    get s() { return this.value.s; }



    set l(value) {
        let newValue = { ...this.value, l: value };

        if (!this.constructor.validateValue(newValue)) throw new Error('Invalid color value');

        this.value = newValue;
    }

    get l() { return this.value.l; }



    set a(value) {
        let newValue = { ...this.value, a: value };

        if (!this.constructor.validateValue(newValue)) throw new Error('Invalid color value');

        this.value = newValue;
    }

    get a() { return this.value.a; }



    /**
     * @param {{h: number, s: number, l: number, a: number}} value The color value to validate
     * @returns {boolean} True if the value is valid, false otherwise
     */
    static validateValue(value = {
        h: number,
        s: number,
        l: number,
        a: number
    }) {
        if (typeof value !== 'object' || value === null) return false;

        let { h, s, l, a } = value;

        if (typeof h !== 'number' || h < 0 || h >= 360) return false;
        if (typeof s !== 'number' || s < 0 || s > 100) return false;
        if (typeof l !== 'number' || l < 0 || l > 100) return false;
        if (typeof a !== 'number' || a < 0 || a > 1) return false;

        return true;
    }



    toCssString() {
        let { h, s, l, a } = this.value;
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }



    static fromCssString(cssString) {
        let hslaRegex = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|0?\.\d+|1(\.0)?)\s*\)$/i;
        let match = cssString.match(hslaRegex);

        if (!match) throw new Error('Invalid HSLA CSS string');

        let h = parseInt(match[1], 10);
        let s = parseInt(match[2], 10);
        let l = parseInt(match[3], 10);
        let a = parseFloat(match[4]);

        return new HslaColorValue({ h, s, l, a });
    }
}