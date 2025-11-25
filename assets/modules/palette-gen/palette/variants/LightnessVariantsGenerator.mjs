import ColorValueConverter from "../../tools/ColorValueConverter.mjs";
import Color from "../Color.mjs";
import VariantsGenerator from "./VariantsGenerator.mjs";



export default class LightnessVariantsGenerator extends VariantsGenerator {
    /**
     * Generates lightness variants for a given theme color
     * @param {ThemeColor} themeColor The theme color to generate variants for
     * @param {Object} options Additional options for variant generation
     * @param {Number} options.start The starting lightness percentage (0-100)
     * @param {Number} options.end The ending lightness percentage (0-100)
     * @param {Number} options.step The step size for lightness adjustment
     * @returns {Color[]} The generated color variants
     */
    static generate(themeColor, options = {
        start: 0,
        end: 100,
        step: 10
    }) {
        let main = themeColor.main;
        let themeName = themeColor?.theme?.name || 'light';
        let isDark = themeName.toLowerCase().startsWith('dark-') || themeName.toLowerCase() === 'dark';

        // Convert the main color to HSLA
        let hslaValue = ColorValueConverter.toHsla(main.value);

        let variants = [];

        for (let lightness = options.start; lightness <= options.end; lightness += options.step) {
            // If theme is dark, invert lightness
            let lightnessLabel = (isDark ? 100 - lightness : lightness).toString();

            let variantName = `${main.name}-${lightnessLabel}`;

            let variantValue = hslaValue.clone();
            variantValue.l = lightness;

            let variant = new Color(variantName, variantValue);

            variants.push(variant);
        }

        // Reverse variants for dark themes to have darkest first
        if (isDark) {
            variants.reverse();
        }

        return variants;
    }
}