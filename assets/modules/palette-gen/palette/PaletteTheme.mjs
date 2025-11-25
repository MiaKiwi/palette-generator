import ColorValueParser from "../tools/ColorValueParser.mjs";
import Color from "./Color.mjs";
import FormDialog from "./inputs/FormDialog.mjs";
import PaletteThemeForm from "./inputs/PaletteThemeForm.mjs";
import ThemeColorForm from "./inputs/ThemeColorForm.mjs";
import Palette from "./Palette.mjs";
import ThemeColor from "./ThemeColor.mjs";
import VariantsGenerator from "./variants/VariantsGenerator.mjs";



export default class PaletteTheme {
    /**
     * Creates a new PaletteTheme instance
     * @param {Object} params The parameters for the PaletteTheme
     * @param {string} params.name The name of the theme
     * @param {ThemeColor[]} params.colors The colors in the theme
     * @param {boolean} params.autoDetect Whether to use auto-detect for the theme
     * @param {Palette} params.palette The palette this theme belongs to
     */
    constructor({
        name,
        colors = [],
        autoDetect = false,
        palette = null
    }) {
        this._palette = null;
        this._colors = [];

        this.name = name;
        this.colors = colors;
        this.autoDetect = autoDetect;
        this.palette = palette;
    }



    set colors(colors) {
        if (!Array.isArray(colors) || colors.some(c => !(c instanceof ThemeColor))) throw new Error('Colors must be an array of ThemeColor instances');

        // Remove existing colors from this theme
        for (let color of this._colors) {
            this.removeColor(color);
        }

        // Add new colors to this theme
        for (let color of colors) {
            this.addColor(color);
        }
    }

    get colors() { return this._colors; }



    set palette(palette) {
        // Remove from old palette
        if (this._palette?.hasTheme(this)) this._palette.removeTheme(this);

        this._palette = palette;

        // Add to new palette
        if (palette && !palette.hasTheme(this)) {
            palette.addTheme(this);
        }
    }

    get palette() { return this._palette; }



    /**
     * Checks if the theme has the specified color
     * @param {ThemeColor} color The color to check
     * @returns {boolean} True if the theme has the color, false otherwise
     */
    hasColor(color) {
        return this._colors.includes(color);
    }



    /**
     * Adds a color to the theme
     * @param {ThemeColor} color The color to add
     */
    addColor(color) {
        if (!this.hasColor(color)) {
            this._colors.push(color);
        }

        if (color.theme !== this) {
            color.theme = this;
        }
    }



    /**
     * Removes a color from the theme
     * @param {ThemeColor} color The color to remove
     */
    removeColor(color) {
        let index = this._colors.indexOf(color);

        if (index !== -1) {
            this._colors.splice(index, 1);
        }

        if (color.theme === this) {
            color.theme = null;
        }
    }



    /**
     * Generates CSS declaration lines for the palette theme
     * @returns {string[]} The CSS declaration lines
     */
    getCssDeclarationLines() {
        let cssLines = [];

        cssLines.push(`/* THEME '${this.name}' [${(new Date()).toISOString().split("T")[0]}] */`);

        this.autoDetect ? cssLines.push(`@media (prefers-color-scheme: ${this.name}) {`, ':root {') : cssLines.push(`.theme-${this.name} {`);

        for (let color of this.colors) {
            let colorLines = color.getCssDeclarationLines();
            cssLines.push(...colorLines);
        }

        this.autoDetect ? cssLines.push('}', '}') : cssLines.push('}');

        return cssLines;
    }



    /**
     * Generates variants for all colors in the theme
     * @param {Class<VariantsGenerator>} variantsGenerator The variant generator class to use
     * @param {Object} options Options to pass to the variant generator
     */
    generateVariants(variantsGenerator, options = {}) {
        for (let color of this._colors) {
            color.generateVariants(variantsGenerator, options);
        }
    }



    /**
     * Converts the PaletteTheme instance to a plain object
     * @returns {Object} The plain object representation of the PaletteTheme instance
     */
    toObject() {
        return {
            _t: 'PaletteTheme',
            _v: 1,
            name: this.name,
            colors: this._colors.map(c => c.toObject()),
            autoDetect: this.autoDetect
        };
    }



    /**
     * Creates a PaletteTheme instance from a plain object
     * @param {Object} obj The plain object representation of a PaletteTheme
     * @returns {PaletteTheme} A new PaletteTheme instance
     */
    static fromObject(obj) {
        if (obj._t !== 'PaletteTheme') throw new Error('Invalid PaletteTheme object');

        // Handle different versions
        switch (obj._v) {
            case 1:
            default:
                return PaletteTheme.fromV1Object(obj);
        }
    }



    /**
     * Creates a PaletteTheme instance from a plain object (version 1)
     * @param {Object} obj The plain object representation of a PaletteTheme (version 1)
     * @returns {PaletteTheme} A new PaletteTheme instance
     */
    static fromV1Object(obj) {
        if (obj._t !== 'PaletteTheme' || obj._v !== 1) throw new Error('Invalid PaletteTheme v1 object');

        let theme = new PaletteTheme({
            name: obj.name,
            autoDetect: obj.autoDetect
        });

        for (let colorObj of obj.colors) {
            let color = ThemeColor.fromObject(colorObj);
            theme.addColor(color);
        }

        theme.autoDetect = obj.autoDetect;

        return theme;
    }



    /**
     * Creates a theme card HTML element for this theme
     * @param {boolean} editable Whether the theme card should be editable
     * @returns {HTMLElement} The theme card element
     */
    createThemeCard(editable = false) {
        let card = document.createElement('div');
        card.classList.add('theme-card');

        let title = document.createElement('h2');
        title.classList.add('theme-title');
        title.textContent = this.name;
        card.appendChild(title);

        let colorsContainer = document.createElement('div');
        colorsContainer.classList.add('colors-container');
        card.appendChild(colorsContainer);

        for (let color of this._colors) {
            let colorCard = color.createColorCard(editable);
            colorsContainer.appendChild(colorCard);
        }

        if (editable) {
            // Add edit button
            let editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = '✎';
            title.prepend(editBtn);

            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let dialog = new FormDialog(new PaletteThemeForm(this), `Edit Theme: ${this.name}`);
                dialog.show();
            });

            // Add button to add theme colors
            let addColorBtn = document.createElement('button');
            addColorBtn.classList.add('add-color-btn');
            addColorBtn.textContent = '+ Add Color';
            colorsContainer.prepend(addColorBtn);

            addColorBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let dialog = new FormDialog(new ThemeColorForm(), `Add Theme Color to Theme: ${this.name}`);
                dialog.show();

                dialog.form.formElement.addEventListener('submit', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let values = dialog.form.form.getValues();

                    let newColor = new ThemeColor(new Color(values['theme-color-name'], ColorValueParser.parse(values['theme-color-value'])), this);

                    console.log(newColor);


                    if (values['theme-color-generate-fg']) {
                        newColor.main.findBestForegroundColor();
                    } else {
                        newColor.main.fg = values['theme-color-foreground'] ? ColorValueParser.parse(values['theme-color-foreground']) : null;
                    }

                    if (values['theme-color-generate-variants']) {
                        newColor.variants = [];

                        newColor.generateLightnessVariants({
                            start: 0,
                            end: 100,
                            step: 10
                        });
                    }

                    // Add color to theme
                    this.addColor(newColor);

                    // Update palette card
                    this.palette.updatePaletteCard(editable);

                    // Dispatch close-dialog event to close the dialog
                    dialog.form.formElement.dispatchEvent(new Event('close-dialog'));
                });
            });
        }

        return card;
    }
}