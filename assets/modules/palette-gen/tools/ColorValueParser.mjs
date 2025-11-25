import HexColorValue from "../values/HexColorValue.mjs";
import HslaColorValue from "../values/HslaColorValue.mjs";
import RgbaColorValue from "../values/RgbaColorValue.mjs";



export default class ColorValueParser {
    static parse(cssString) {
        if (cssString.startsWith('rgba')) {
            return RgbaColorValue.fromCssString(cssString);
        } else if (cssString.startsWith('#')) {
            return HexColorValue.fromCssString(cssString);
        } else if (cssString.startsWith('hsla')) {
            return HslaColorValue.fromCssString(cssString);
        } else {
            throw new Error('Unsupported color format');
        }
    }
}