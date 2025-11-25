import ColorValue from "../values/ColorValue.mjs";
import HexColorValue from "../values/HexColorValue.mjs";
import HslaColorValue from "../values/HslaColorValue.mjs";
import RgbaColorValue from "../values/RgbaColorValue.mjs";



export default class ColorValueConverter {
    /**
     * Converts any color value to a Hex color value
     * @param {ColorValue} colorValue The color value to convert
     * @returns {HexColorValue} The converted Hex color value
     */
    static toHex(colorValue) {
        if (colorValue instanceof HexColorValue) {
            return colorValue;
        } else if (colorValue instanceof RgbaColorValue) {
            return this.rgbaToHex(colorValue);
        } else if (colorValue instanceof HslaColorValue) {
            return this.hslaToHex(colorValue);
        } else {
            throw new Error('Unsupported color value type');
        }
    }



    /**
     * Converts a Hex color value to an RGBA color value
     * @param {HexColorValue} hexColorValue The Hex color value to convert
     * @returns {RgbaColorValue} The converted RGBA color value
     */
    static hexToRgba(hexColorValue) {
        let hex = hexColorValue.value;

        // Remove leading '#' if present
        if (hex.startsWith('#')) hex = hex.slice(1);

        // Expand shorthand hex
        if (hex.length === 3 || hex.length === 4) hex = hex.split('').map(c => c + c).join('');

        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);
        let a = 1;

        if (hex.length === 8) {
            a = parseInt(hex.slice(6, 8), 16) / 255;
        }

        return new RgbaColorValue({
            r: r,
            g: g,
            b: b,
            a: a
        });
    }



    /**
     * Converts a Hex color value to an HSLA color value
     * @param {HexColorValue} hexColorValue The Hex color value to convert
     * @returns {HslaColorValue} The converted HSLA color value
     */
    static hexToHsla(hexColorValue) {
        let rgbaColorValue = this.hexToRgba(hexColorValue);

        return this.rgbaToHsla(rgbaColorValue);
    }



    /**
     * Converts any color value to an RGBA color value
     * @param {ColorValue} colorValue The color value to convert
     * @returns {RgbaColorValue} The converted RGBA color value
     */
    static toRgba(colorValue) {
        if (colorValue instanceof RgbaColorValue) {
            return colorValue;
        } else if (colorValue instanceof HexColorValue) {
            return this.hexToRgba(colorValue);
        } else if (colorValue instanceof HslaColorValue) {
            return this.hslaToRgba(colorValue);
        } else {
            throw new Error('Unsupported color value type');
        }
    }



    /**
     * Converts an RGBA color value to a Hex color value
     * @param {RgbaColorValue} rgbaColorValue The RGBA color value to convert
     * @returns {HexColorValue} The converted Hex color value
     */
    static rgbaToHex(rgbaColorValue) {
        let { r, g, b, a } = rgbaColorValue.value;

        let rHex = r.toString(16).padStart(2, '0');
        let gHex = g.toString(16).padStart(2, '0');
        let bHex = b.toString(16).padStart(2, '0');
        let aHex = Math.round(a * 255).toString(16).padStart(2, '0');

        return new HexColorValue(`#${rHex}${gHex}${bHex}${aHex}`);
    }



    /**
     * Converts an RGBA color value to an HSLA color value
     * @param {RgbaColorValue} rgbaColorValue The RGBA color value to convert
     * @returns {HslaColorValue} The converted HSLA color value
     */
    static rgbaToHsla(rgbaColorValue) {
        let { r, g, b, a } = rgbaColorValue.value;

        r /= 255;
        g /= 255;
        b /= 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return new HslaColorValue({
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
            a: a
        });
    }



    /**
     * Converts any color value to an HSLA color value
     * @param {ColorValue} colorValue The color value to convert
     * @returns {HslaColorValue} The converted HSLA color value
     */
    static toHsla(colorValue) {
        if (colorValue instanceof HslaColorValue) {
            return colorValue;
        } else if (colorValue instanceof HexColorValue) {
            return this.hexToHsla(colorValue);
        } else if (colorValue instanceof RgbaColorValue) {
            return this.rgbaToHsla(colorValue);
        } else {
            throw new Error('Unsupported color value type');
        }
    }



    /**
     * Converts an HSLA color value to a Hex color value
     * @param {HslaColorValue} hslaColorValue The HSLA color value to convert
     * @returns {HexColorValue} The converted Hex color value
     */
    static hslaToHex(hslaColorValue) {
        let rgbaColorValue = this.hslaToRgba(hslaColorValue);

        return this.rgbaToHex(rgbaColorValue);
    }



    /**
     * Converts an HSLA color value to an RGBA color value
     * @param {HslaColorValue} hslaColorValue The HSLA color value to convert
     * @returns {RgbaColorValue} The converted RGBA color value
     */
    static hslaToRgba(hslaColorValue) {
        let { h, s, l, a } = hslaColorValue.value;

        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l * 255; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;

            r = hue2rgb(p, q, h / 360 + 1 / 3) * 255;
            g = hue2rgb(p, q, h / 360) * 255;
            b = hue2rgb(p, q, h / 360 - 1 / 3) * 255;
        }

        return new RgbaColorValue({
            r: Math.round(r),
            g: Math.round(g),
            b: Math.round(b),
            a: a
        });
    }



    /**
     * Converts a color value to the specified format
     * @param {ColorValue} colorValue The color value to convert
     * @param {string} format The target color format ('hex', 'rgba', 'hsla')
     * @returns {ColorValue} The converted color value
     */
    static to(colorValue, format) {
        switch (format.toLowerCase()) {
            case 'hex':
                return this.toHex(colorValue);

            case 'rgba':
                return this.toRgba(colorValue);

            case 'hsla':
                return this.toHsla(colorValue);

            default:
                throw new Error('Unsupported color format');
        }
    }
}