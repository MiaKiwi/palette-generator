import ColorValue from "../values/ColorValue.mjs";
import ColorValueConverter from "./ColorValueConverter.mjs";



export default class ConstrastChecker {
    /**
     * Calculates the relative luminance of a color
     * @param {ColorValue} color The color value
     * @returns {number} The relative luminance
     */
    static luminance(color) {
        let rgba = ColorValueConverter.toRgba(color);

        let r = rgba.r / 255;
        let g = rgba.g / 255;
        let b = rgba.b / 255;

        r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }



    /**
     * Calculates the contrast ratio between two colors
     * @param {ColorValue} color1 The first color value
     * @param {ColorValue} color2 The second color value
     * @returns {number} The contrast ratio
     */
    static contrastRatio(color1, color2) {
        let L1 = this.luminance(color1);
        let L2 = this.luminance(color2);

        let lighter = Math.max(L1, L2);
        let darker = Math.min(L1, L2);

        return (lighter + 0.05) / (darker + 0.05);
    }



    /**
     * Checks if the contrast ratio between two colors meets the WCAG AA standard
     * @param {ColorValue} color1 The first color value
     * @param {ColorValue} color2 The second color value
     * @param {boolean} isLargeText Whether the text is large
     * @returns {boolean} True if the contrast ratio meets the WCAG AA standard, false otherwise
     */
    static meetsWcagAa(color1, color2, isLargeText = false) {
        let ratio = this.contrastRatio(color1, color2);

        return isLargeText ? ratio >= 3.0 : ratio >= 4.5;
    }



    /**
     * Checks if the contrast ratio between two colors meets the WCAG AAA standard
     * @param {ColorValue} color1 The first color value
     * @param {ColorValue} color2 The second color value
     * @param {boolean} isLargeText Whether the text is large
     * @returns {boolean} True if the contrast ratio meets the WCAG AAA standard, false otherwise
     */
    static meetsWcagAaa(color1, color2, isLargeText = false) {
        let ratio = this.contrastRatio(color1, color2);

        return isLargeText ? ratio >= 4.5 : ratio >= 7.0;
    }



    /**
     * Picks the color from the options that has the best contrast with the base color
     * @param {ColorValue} baseColor 
     * @param {ColorValue[]} colorOptions 
     * @returns {ColorValue} The color with the best contrast
     */
    static pickBestContrast(baseColor, colorOptions) {
        let bestColor = null;
        let bestRatio = 0;

        for (let color of colorOptions) {
            let ratio = this.contrastRatio(baseColor, color);

            if (ratio > bestRatio) {
                bestRatio = ratio;
                bestColor = color;
            }
        }

        return bestColor;
    }



    /**
     * Returns contrast information between two colors
     * @param {ColorValue} color1 The first color value
     * @param {ColorValue} color2 The second color value
     * @returns {{ratio: number, aaNormal: boolean, aaLarge: boolean, aaaNormal: boolean, aaaLarge: boolean}} The contrast information
     */
    static contrastInfo(color1, color2) {
        let ratio = this.contrastRatio(color1, color2);

        let meetsAaNormal = this.meetsWcagAa(color1, color2, false);
        let meetsAaLarge = this.meetsWcagAa(color1, color2, true);
        let meetsAaaNormal = this.meetsWcagAaa(color1, color2, false);
        let meetsAaaLarge = this.meetsWcagAaa(color1, color2, true);

        return {
            ratio,
            aaNormal: meetsAaNormal,
            aaLarge: meetsAaLarge,
            aaaNormal: meetsAaaNormal,
            aaaLarge: meetsAaaLarge
        };
    }
}