import ColorValueConverter from "../tools/ColorValueConverter.mjs";
import ColorValueParser from "../tools/ColorValueParser.mjs";
import ColorWheel from "../tools/ColorWheel.mjs";
import ConstrastChecker from "../tools/ContrastChecker.mjs";
import ColorValue from "../values/ColorValue.mjs";
import ColorForm from "./inputs/ColorForm.mjs";
import FormDialog from "./inputs/FormDialog.mjs";



export default class Color {
    constructor(name, value, fg = null) {
        this.name = name;
        this.value = value;
        this.fg = fg;
    }



    set name(value) {
        // Remove leading double dashes if present
        if (value.startsWith('--')) value = value.slice(2);

        // Make sure name is CSS-compatible
        if (typeof value !== 'string' || !/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value)) {
            throw new Error('Invalid variant name');
        }

        this._name = value;
    }

    get name() { return this._name; }



    set fg(value) {
        if (value !== null && !(value instanceof ColorValue)) throw new Error('Foreground color must be a ColorValue or null');

        this._fg = value;
    }

    get fg() {
        if (this._fg === null) {
            this.findBestForegroundColor();
        }

        return this._fg;
    }



    /**
     * Generates the CSS variable name for this color
     * @returns {string} The CSS variable name
     */
    getCssVariableName() {
        return `--${this.name}`;
    }



    /**
     * Generates the CSS variable name for the foreground color
     * @returns {string} The CSS variable name for the foreground color
     */
    getFgCssVariableName() {
        return `--${this.name}-fg`;
    }



    /**
     * Generates the CSS variable reference for this color
     * @returns {string} The CSS variable reference
     */
    getCssVariableReference() {
        return `var(${this.getCssVariableName()})`;
    }



    /**
     * Generates the CSS variable reference for the foreground color
     * @returns {string} The CSS variable reference for the foreground color
     */
    getFgCssVariableReference() {
        return `var(${this.getFgCssVariableName()})`;
    }



    /**
     * Generates the CSS declaration for this color
     * @returns {string} The CSS declaration
     */
    getCssDeclaration() {
        // Convert value to Hex to make it more compact
        let valueString = ColorValueConverter.toHex(this.value).toCssString();

        return `${this.getCssVariableName()}: ${valueString};`;
    }



    /**
     * Generates the CSS declaration for the foreground color
     * @returns {string} The CSS declaration for the foreground color
     */
    getFgCssDeclaration() {
        // Convert value to Hex to make it more compact
        let valueString = ColorValueConverter.toHex(this.fg).toCssString();

        return `${this.getFgCssVariableName()}: ${valueString};`;
    }



    /**
     * Converts the color value to the Hex format
     */
    toHex() {
        let newValue = ColorValueConverter.toHex(this.value);

        this.value = newValue;
    }



    /**
     * Converts the color value to the RGBA format
     */
    toRgba() {
        let newValue = ColorValueConverter.toRgba(this.value);

        this.value = newValue;
    }



    /**
     * Converts the color value to the HSLA format
     */
    toHsla() {
        let newValue = ColorValueConverter.toHsla(this.value);

        this.value = newValue;
    }



    /**
     * Clones the color
     * @returns {Color} A new Color instance with the same name and value
     */
    clone() {
        return new Color(this.name, this.value);
    }



    /**
     * Finds the best foreground color from the candidates based on contrast
     * @param {ColorValue[]} candidates The candidate colors to choose from
     * @param {boolean} includeComplementary Whether to include the complementary color as a candidate
     * @returns {ColorValue} The color with the best contrast
     */
    findBestForegroundColor(candidates = [
        ColorWheel.black(),
        ColorWheel.white()
    ], includeComplementary = true) {
        if (includeComplementary) candidates.push(ColorWheel.complementary(this.value));

        this.fg = ConstrastChecker.pickBestContrast(this.value, candidates);
    }



    /**
     * Creates a Color instance from a CSS string
     * @param {string} name The name of the color
     * @param {string} cssString The CSS string representing the color
     * @returns {Color} A new Color instance
     */
    static fromCssString(name, cssString) {
        let value = ColorValueParser.parse(cssString);

        return new Color(name, value);
    }



    /**
     * Converts the Color instance to a plain object
     * @returns {Object} The plain object representation of the Color instance
     */
    toObject() {
        return {
            _t: 'Color',
            _v: 1,
            name: this.name,
            value: this.value.toCssString(),
            fg: this?.fg?.toCssString()
        };
    }



    /**
     * Creates a Color instance from a plain object
     * @param {Object} obj The plain object representation of a Color
     * @returns {Color} A new Color instance
     */
    static fromObject(obj) {
        if (obj._t !== 'Color') throw new Error('Invalid Color object');

        // Handle different versions
        switch (obj._v) {
            case 1:
            default:
                return Color.fromV1Object(obj);
        }
    }



    /**
     * Creates a Color instance from a plain object (version 1)
     * @param {Object} obj The plain object representation of a Color (version 1)
     * @returns {Color} A new Color instance
     */
    static fromV1Object(obj) {
        if (obj._t !== 'Color' || obj._v !== 1) throw new Error('Invalid Color v1 object');

        let value = ColorValueParser.parse(obj.value);

        return new Color(obj.name, value, obj.fg ? ColorValueParser.parse(obj.fg) : null);
    }



    /**
     * Creates a swatch card HTML element for this color
     * @returns {HTMLElement} The swatch card element
     */
    createSwatchCard() {
        let swatch = document.createElement('div');
        swatch.classList.add('swatch-card');

        let colorPreview = document.createElement('div');
        colorPreview.classList.add('color-preview');
        colorPreview.style.backgroundColor = this.value.toCssString();
        colorPreview.setAttribute('value', this.value.toCssString());
        colorPreview.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(this.value.toCssString());
                colorPreview.classList.add('copied');
                setTimeout(() => {
                    colorPreview.classList.remove('copied');
                }, 1000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });

        let fgPreview = document.createElement('span');
        fgPreview.classList.add('fg-preview');
        fgPreview.style.color = this.fg.toCssString();
        fgPreview.textContent = 'Aa';
        colorPreview.appendChild(fgPreview);

        let contrast = ConstrastChecker.contrastInfo(this.value, this.fg);
        let contrastInfo = document.createElement('div');
        contrastInfo.classList.add('contrast-info');
        contrastInfo.style.color = this.fg.toCssString();
        colorPreview.appendChild(contrastInfo);

        let contrastRatio = document.createElement('span');
        contrastRatio.classList.add('contrast-ratio');
        contrastRatio.textContent = `${contrast.ratio.toFixed(2)}:1`;
        if (contrast.aaNormal && contrast.aaLarge && contrast.aaaNormal && contrast.aaaLarge) {
            contrastRatio.classList.add('pass');
        } else if (contrast.aaNormal && contrast.aaLarge) {
            contrastRatio.classList.add('good');
        } else if (contrast.aaNormal) {
            contrastRatio.classList.add('poor');
        } else {
            contrastRatio.classList.add('fail');
        }
        contrastInfo.appendChild(contrastRatio);

        let colorName = document.createElement('div');
        colorName.classList.add('color-name');
        colorName.textContent = this.name;

        swatch.appendChild(colorPreview);
        swatch.appendChild(colorName);

        return swatch;
    }
}