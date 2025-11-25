import Color from "../Color.mjs";
import ThemeColor from "../ThemeColor.mjs";



export default class VariantsGenerator {
    /**
     * Generates variants for a given theme color
     * @param {ThemeColor} themeColor The theme color to generate variants for
     * @param {Object} options Additional options for variant generation
     * @returns {Color[]} The generated color variants
     */
    static generate(themeColor, options = {}) {
        throw new Error("Method 'generate' must be implemented in subclass");
    }
}