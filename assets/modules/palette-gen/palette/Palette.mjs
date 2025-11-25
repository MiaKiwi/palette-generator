import Color from "./Color.mjs";
import FormDialog from "./inputs/FormDialog.mjs";
import PaletteThemeForm from "./inputs/PaletteThemeForm.mjs";
import PaletteTheme from "./PaletteTheme.mjs";
import ThemeColor from "./ThemeColor.mjs";



export default class Palette {
    constructor(name) {
        this._themes = [];

        this.name = name;

        this.defaultThemeName = 'default';
    }



    static _lsItemPrefix() { return 'palette-draft-'; }

    static _lsIndexKey() { return 'palette-draft-index'; }



    set themes(themes) {
        if (!Array.isArray(themes) || themes.some(t => !(t instanceof PaletteTheme))) throw new Error('Themes must be an array of PaletteTheme instances');

        // Remove existing themes from this palette
        for (let theme of this._themes) {
            this.removeTheme(theme);
        }

        // Add new themes to this palette
        for (let theme of themes) {
            this.addTheme(theme);
        }
    }

    get themes() { return this._themes; }



    /**
     * Gets a theme by name
     * @param {string} name The name of the theme to get
     * @returns {PaletteTheme|null} The found theme or null if not found
     */
    getTheme(name) {
        return this._themes.find(t => t.name === name) || null;
    }



    /**
     * Checks if the palette has the specified theme
     * @param {PaletteTheme} theme The theme to check
     * @returns {boolean} True if the palette has the theme, false otherwise
     */
    hasTheme(theme) {
        return this._themes.includes(theme);
    }



    /**
     * Adds a theme to the palette
     * @param {PaletteTheme} theme The theme to add
     */
    addTheme(theme) {
        if (!this.hasTheme(theme)) {
            this._themes.push(theme);
        }

        if (theme.palette !== this) {
            theme.palette = this;
        }
    }



    /**
     * Removes a theme from the palette
     * @param {PaletteTheme} theme The theme to remove
     */
    removeTheme(theme) {
        let index = this._themes.indexOf(theme);

        if (index !== -1) {
            this._themes.splice(index, 1);
        }

        if (theme.palette === this) {
            theme.palette = null;
        }
    }



    /**
     * Gets a theme by name, or the default theme if not found
     * @param {string} themeName  The name of the theme to get
     * @returns {PaletteTheme} The found theme or the default theme
     */
    getThemeOrDefaultTheme(themeName) {
        // Try to find the theme by name
        let theme = this._themes.find(t => t.name === themeName);

        // If not found, try to find the default theme
        if (!theme) {
            theme = this._themes.find(t => t.name === this.defaultThemeName);
        }

        // If the default theme does not exist, create it
        if (!theme) {
            theme = new PaletteTheme({ name: this.defaultThemeName });
            this.addTheme(theme);
        }

        return theme;
    }



    /**
     * Adds a color to a theme in the palette
     * @param {Color} color The color to add
     * @param {string} themeName The name of the theme to add the color to
     */
    addThemeColor(color, themeName = this.defaultThemeName) {
        let theme = this.getThemeOrDefaultTheme(themeName);

        let themeColor = new ThemeColor(color, theme);

        theme.addColor(themeColor);
    }



    /**
     * Generates CSS declaration lines for the theme color
     * @returns {string[]} The CSS declaration lines
     */
    getCssDeclarationLines() {
        let cssLines = [];

        cssLines.push(`/* PALETTE '${this.name}' [${(new Date()).toISOString().split("T")[0]}] */`);

        for (let theme of this.themes) {
            let themeLines = theme.getCssDeclarationLines();
            cssLines.push(...themeLines);
        }

        return cssLines;
    }



    /**
     * Generates CSS for the palette
     * @returns {string} The generated CSS string
     */
    css() {
        return this.getCssDeclarationLines().join('\n');
    }



    /**
     * Generates minified CSS for the palette
     * @returns {string} The generated minified CSS string
     */
    minifyCss() {
        return this.getCssDeclarationLines().join('');
    }



    /**
     * Generates variants for all colors in the palette
     * @param {Class<VariantsGenerator>} variantsGenerator The variant generator class to use
     * @param {Object} options Options to pass to the variant generator
     */
    generateVariants(variantsGenerator, options = {}) {
        for (let theme of this._themes) {
            theme.generateVariants(variantsGenerator, options);
        }
    }



    /**
     * Converts the palette to a plain object
     * @returns {Object} The plain object representation of the Palette instance
     */
    toObject() {
        return {
            _t: 'Palette',
            _v: 1,
            name: this.name,
            themes: this._themes.map(t => t.toObject())
        };
    }



    /**
     * Creates a Palette instance from a plain object
     * @param {Object} obj The plain object representation of a Palette
     * @returns {Palette} A new Palette instance
     */
    static fromObject(obj) {
        if (obj._t !== 'Palette') throw new Error('Invalid Palette object');

        // Handle different versions
        switch (obj._v) {
            case 1:
            default:
                return Palette.fromV1Object(obj);
        }
    }



    /**
     * Creates a Palette instance from a plain object (version 1)
     * @param {Object} obj The plain object representation of a Palette (version 1)
     * @returns {Palette} A new Palette instance
     */
    static fromV1Object(obj) {
        if (obj._t !== 'Palette' || obj._v !== 1) throw new Error('Invalid Palette v1 object');

        let palette = new Palette(obj.name);

        for (let themeObj of obj.themes) {
            let theme = PaletteTheme.fromObject(themeObj);
            palette.addTheme(theme);
        }

        return palette;
    }



    /**
     * Creates a palette card HTML element for this palette
     * @param {boolean} editable Whether the palette card should be editable
     * @returns {HTMLElement} The palette card element
     */
    createPaletteCard(editable = false) {
        let card = document.createElement('div');
        card.classList.add('palette-card', `palette-card-${this.name.toLowerCase()}`);
        if (editable) card.classList.add('editable');

        let title = document.createElement('h1');
        title.classList.add('palette-title');
        title.textContent = this.name;
        card.appendChild(title);

        if (editable) {
            // Make title editable
            title.contentEditable = 'true';
            title.addEventListener('input', (e) => {
                this.name = title.textContent.trim();
                this.updatePaletteCard(editable);
            });

            // Add button to add new theme
            let addThemeButton = document.createElement('button');
            addThemeButton.classList.add('add-theme-btn');
            addThemeButton.textContent = '+ Add Theme';
            card.appendChild(addThemeButton);

            let palette = this;

            addThemeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let dialog = new FormDialog(new PaletteThemeForm(null), `Add Theme to Palette: ${palette.name}`);
                dialog.show();

                dialog.form.formElement.addEventListener('submit', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    let values = dialog.form.form.getValues();

                    let newTheme = new PaletteTheme({
                        name: values['palette-theme-name'],
                        autoDetect: values['palette-theme-auto-detect'] || false,
                    });

                    // Add theme to palette
                    palette.addTheme(newTheme);

                    // Update palette card
                    palette.updatePaletteCard(editable);

                    // Dispatch close-dialog event to close the dialog
                    dialog.form.formElement.dispatchEvent(new Event('close-dialog'));
                });
            });
        }

        let themesContainer = document.createElement('div');
        themesContainer.classList.add('themes-container');
        card.appendChild(themesContainer);

        for (let theme of this._themes) {
            let themeCard = theme.createThemeCard(editable);
            themesContainer.appendChild(themeCard);
        }

        return card;
    }



    /**
     * Updates the palette card element(s) for this palette
     * @param {boolean} editable Whether the palette card should be editable
     */
    updatePaletteCard(editable = false) {
        let cards = document.querySelectorAll(`.palette-card-${this.name.toLowerCase()}`);

        for (let card of cards) {
            let newCard = this.createPaletteCard(editable);
            card.replaceWith(newCard);
        }
    }



    /**
     * Saves the palette to local storage as a draft
     */
    saveToLocalStorage() {
        // Save palette to local storage
        let key = Palette._lsItemPrefix() + this.name;
        let value = JSON.stringify(this.toObject());

        localStorage.setItem(key, value);

        // Update index
        let index = JSON.parse(localStorage.getItem(Palette._lsIndexKey())) || [];
        if (!index.includes(this.name)) {
            index.push(this.name);
            localStorage.setItem(Palette._lsIndexKey(), JSON.stringify(index));
        }
    }



    /**
     * Removes the palette from local storage
     */
    removeFromLocalStorage() {
        // Remove palette from local storage
        let key = Palette._lsItemPrefix() + this.name;

        localStorage.removeItem(key);

        // Update index
        let index = JSON.parse(localStorage.getItem(Palette._lsIndexKey())) || [];
        index = index.filter(name => name !== this.name);
        localStorage.setItem(Palette._lsIndexKey(), JSON.stringify(index));
    }
}