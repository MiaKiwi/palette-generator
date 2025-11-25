import ColorValueParser from "../tools/ColorValueParser.mjs";
import Color from "./Color.mjs";
import ColorForm from "./inputs/ColorForm.mjs";
import FormDialog from "./inputs/FormDialog.mjs";
import ThemeColorForm from "./inputs/ThemeColorForm.mjs";
import PaletteTheme from "./PaletteTheme.mjs";
import LightnessVariantsGenerator from "./variants/LightnessVariantsGenerator.mjs";
import VariantsGenerator from "./variants/VariantsGenerator.mjs";



export default class ThemeColor {
    /**
     * Creates a new ThemeColor instance
     * @param {Color} main The main color of the theme color
     * @param {PaletteTheme|null} theme The theme to associate with the color
     */
    constructor(main, theme = null) {
        this._theme = null;
        this._variants = [];

        this.main = main;
        this.theme = theme;
    }



    set variants(variants) {
        if (!Array.isArray(variants) || variants.some(v => !(v instanceof Color))) throw new Error('Variants must be an array of Color instances');

        this._variants = variants;
    }

    get variants() { return this._variants; }



    /**
     * Sets the parent theme of the palette color
     * @param {PaletteTheme|null} theme The theme to set
     */
    set theme(theme) {
        if (theme !== null && theme instanceof PaletteTheme) {
            // Remove from old theme
            if (this._theme?.hasColor(this)) this._theme.removeColor(this);

            this._theme = theme;

            // Add to new theme
            if (theme && !(theme?.hasColor(this) ?? false)) {
                theme.addColor(this);
            }
        } else {
            // Remove from old theme
            if (this._theme !== null && this._theme.hasColor(this)) this._theme.removeColor(this);

            this._theme = null;
        }
    }

    get theme() { return this._theme; }



    set name(value) { this.main.name = value; }

    get name() { return this.main.name; }



    set value(value) { this.main.value = value; }

    get value() { return this.main.value; }



    /**
     * Generates CSS declaration lines for the theme color
     * @returns {string[]} The CSS declaration lines
     */
    getCssDeclarationLines() {
        let cssLines = [];

        cssLines.push(`/* COLOR '${this.name}' (${this.theme.name}) [${(new Date()).toISOString().split("T")[0]}] */`);

        cssLines.push(this.main.getCssDeclaration());
        if (this.main.fg !== null) cssLines.push(this.main.getFgCssDeclaration());

        for (let variant of this.variants) {
            cssLines.push(variant.getCssDeclaration());
            if (variant.fg !== null) cssLines.push(variant.getFgCssDeclaration());
        }

        return cssLines;
    }



    /**
     * Generates variants for the palette color
     * @param {Class<VariantsGenerator>} variantsGenerator The variant generator class to use
     * @param {Object} options Options to pass to the variant generator
     */
    generateVariants(variantsGenerator, options = {}) {
        let variants = variantsGenerator.generate(this, options);

        this.variants = variants;
    }



    /**
     * Generates lightness variants for the palette color
     * @param {Object} params Options for lightness variant generation
     * @param {Number} params.start The starting lightness percentage (0-100)
     * @param {Number} params.end The ending lightness percentage (0-100)
     * @param {Number} params.step The step size for lightness adjustment
     */
    generateLightnessVariants({
        start = 0,
        end = 100,
        step = 10
    } = {}) {
        this.variants = LightnessVariantsGenerator.generate(this, {
            start,
            end,
            step
        });
    }



    /**
     * Adds a variant to the theme color
     * @param {Color} variant The variant to add
     */
    addVariant(variant) {
        if (!(variant instanceof Color)) throw new Error('Variant must be an instance of Color');

        this._variants.push(variant);
    }
    
    
    
    /**
     * Removes a variant from the theme color
     * @param {Color} variant The variant to remove
     */
    removeVariant(variant) {
        let index = this._variants.indexOf(variant);

        if (index !== -1) {
            this._variants.splice(index, 1);
        }
    }



    /**
     * Creates a ThemeColor instance from a CSS string
     * @param {string} name The name of the color
     * @param {string} cssString The CSS string representing the color
     * @param {PaletteTheme|null} theme The theme to associate with the color
     * @returns {ThemeColor} A new ThemeColor instance
     */
    static fromCssString(name, cssString, theme = null) {
        let value = ColorValueParser.parse(cssString);
        let main = new Color(name, value);

        return new ThemeColor(main, theme);
    }



    /**
     * Converts the ThemeColor instance to a plain object
     * @returns {Object} The plain object representation of the ThemeColor instance
     */
    toObject() {
        return {
            _t: 'ThemeColor',
            _v: 1,
            main: this.main.toObject(),
            variants: this.variants.map(variant => variant.toObject())
        };
    }



    /**
     * Creates a ThemeColor instance from a plain object
     * @param {Object} obj The plain object representation of a ThemeColor
     * @returns {ThemeColor} A new ThemeColor instance
     */
    static fromObject(obj) {
        if (obj._t !== 'ThemeColor') throw new Error('Invalid ThemeColor object');

        // Handle different versions
        switch (obj._v) {
            case 1:
            default:
                return ThemeColor.fromV1Object(obj);
        }
    }



    /**
     * Creates a ThemeColor instance from a plain object (version 1)
     * @param {Object} obj The plain object representation of a ThemeColor (version 1)
     * @returns {ThemeColor} A new ThemeColor instance
     */
    static fromV1Object(obj) {
        if (obj._t !== 'ThemeColor' || obj._v !== 1) throw new Error('Invalid ThemeColor v1 object');

        let main = Color.fromObject(obj.main);

        let themeColor = new ThemeColor(main);

        themeColor.variants = obj.variants.map(v => Color.fromObject(v));

        return themeColor;
    }



    /**
     * Creates a color card HTML element for this theme color
     * @param {boolean} editable Whether the theme color should be editable
     * @returns {HTMLElement} The color card element
     */
    createColorCard(editable = false) {
        let card = document.createElement('div');
        card.classList.add('color-card');

        let mainSwatch = this.main.createSwatchCard();
        mainSwatch.classList.add('main-swatch');
        card.appendChild(mainSwatch);

        // If editable, add edit button to main swatch
        if (editable) {
            let editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.style.color = this.main.fg.toCssString();
            editBtn.textContent = '✎';

            let colorPreview = mainSwatch.querySelector('.color-preview');
            colorPreview.prepend(editBtn);

            let themeColor = this;

            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let dialog = new FormDialog(new ThemeColorForm(themeColor), `Edit Theme Color: ${themeColor.name}`);
                dialog.show();
            });
        }

        let variantsContainer = document.createElement('div');
        variantsContainer.classList.add('variants-container');
        card.appendChild(variantsContainer);

        for (let variant of this.variants) {
            let variantSwatch = variant.createSwatchCard();
            variantSwatch.classList.add('variant-swatch');
            variantsContainer.appendChild(variantSwatch);

            // If editable, add edit button to variant swatch
            if (editable) {
                let editBtn = document.createElement('button');
                editBtn.classList.add('edit-btn');
                editBtn.style.color = variant.fg.toCssString();
                editBtn.textContent = '✎';
                
                let colorPreview = variantSwatch.querySelector('.color-preview');
                colorPreview.prepend(editBtn);

                let themeColor = this;
                let color = variant;

                editBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let dialog = new FormDialog(new ColorForm(color, themeColor), `Edit Color: ${color.name}`);
                    dialog.show();
                });
            }
        }

        return card;
    }
}