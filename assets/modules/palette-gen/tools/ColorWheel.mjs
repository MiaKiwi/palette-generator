import ColorValue from "../values/ColorValue.mjs";
import ColorValueConverter from "./ColorValueConverter.mjs";
import HexColorValue from "../values/HexColorValue.mjs";
import RgbaColorValue from "../values/RgbaColorValue.mjs";



export default class ColorWheel {
    /**
     * Returns the pure red color in the specified format
     * @param {string} format The color format ('hex', 'rgba', 'hsla')
     * @returns {ColorValue} The red color in the specified format
     */
    static red(format = 'hex') {
        let value = HexColorValue.fromCssString('#FF0000');

        return ColorValueConverter.to(value, format);
    }



    /**
     * Returns the pure green color in the specified format
     * @param {string} format The color format ('hex', 'rgba', 'hsla')
     * @returns {ColorValue} The green color in the specified format
     */
    static green(format = 'hex') {
        let value = HexColorValue.fromCssString('#00FF00');

        return ColorValueConverter.to(value, format);
    }



    /**
     * Returns the pure blue color in the specified format
     * @param {string} format The color format ('hex', 'rgba', 'hsla')
     * @returns {ColorValue} The blue color in the specified format
     */
    static blue(format = 'hex') {
        let value = HexColorValue.fromCssString('#0000FF');

        return ColorValueConverter.to(value, format);
    }



    /**
     * Returns the white color in the specified format
     * @param {string} format The color format ('hex', 'rgba', 'hsla')
     * @returns {ColorValue} The white color in the specified format
     */
    static white(format = 'hex') {
        let value = HexColorValue.fromCssString('#FFFFFF');

        return ColorValueConverter.to(value, format);
    }



    /**
     * Returns the black color in the specified format
     * @param {string} format The color format ('hex', 'rgba', 'hsla')
     * @returns {ColorValue} The black color in the specified format
     */
    static black(format = 'hex') {
        let value = HexColorValue.fromCssString('#000000');

        return ColorValueConverter.to(value, format);
    }



    /**
     * Returns the yellow color in the specified format
     * @param {string} format The color format ('hex', 'rgba', 'hsla')
     * @returns {ColorValue} The yellow color in the specified format
     */
    static yellow(format = 'hex') {
        let value = HexColorValue.fromCssString('#FFFF00');

        return ColorValueConverter.to(value, format);
    }



    /**
     * Returns the orange color in the specified format
     * @param {string} format The color format ('hex', 'rgba', 'hsla')
     * @returns {ColorValue} The orange color in the specified format
     */
    static orange(format = 'hex') {
        let value = HexColorValue.fromCssString('#FFA500');

        return ColorValueConverter.to(value, format);
    }



    /**
     * Returns the indigo color in the specified format
     * @param {string} format The color format ('hex', 'rgba', 'hsla')
     * @returns {ColorValue} The indigo color in the specified format
     */
    static indigo(format = 'hex') {
        let value = HexColorValue.fromCssString('#4B369D');

        return ColorValueConverter.to(value, format);
    }



    /**
     * Returns the violet color in the specified format
     * @param {string} format The color format ('hex', 'rgba', 'hsla')
     * @returns {ColorValue} The violet color in the specified format
     */
    static violet(format = 'hex') {
        let value = HexColorValue.fromCssString('#70369D');

        return ColorValueConverter.to(value, format);
    }



    /**
     * Returns the complementary color of the given color value
     * @param {ColorValue} colorValue The original color value
     * @returns {ColorValue} The complementary color value
     */
    static complementary(colorValue) {
        if (!(colorValue instanceof ColorValue)) throw new Error('Invalid ColorValue instance');

        let clone = colorValue.clone();

        // Convert to RGBA
        let rgbaValue = ColorValueConverter.toRgba(clone).value;

        // Get complementary RGB values
        let compR = 255 - rgbaValue.r;
        let compG = 255 - rgbaValue.g;
        let compB = 255 - rgbaValue.b;

        return new RgbaColorValue({
            r: compR,
            g: compG,
            b: compB,
            a: rgbaValue.a
        });
    }
}