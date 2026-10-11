import NOTIF from "../../app/NOTIF.mjs";
import Button from "../../kwui/components/control/Button.mjs"
import StyleRegister from "../../kwui/StyleRegister.mjs";
import ColorValueConverter from "../tools/ColorValueConverter.mjs";
import ColorWheel from "../tools/ColorWheel.mjs";
import ColorValue from "../values/ColorValue.mjs";

export default class ColorValueInline extends Button {
    static _defaultProps = {
        ...super._defaultProps,
        color: null,
        style: this.styles.empty,
        shape: this.shapes.rounded
    }

    static _rawStylingRules = [
        ...super._rawStylingRules,
        `.btn.color-value-btn{--btn-pad-v:var(--padding-xs);--btn-pad-h:var(--padding-xs);display:inline-flex;gap:var(--btn-pad-v)}`,
        `.btn.color-value-btn .color-preview-inline{display:inline-block;width:1em;height:1em;border-radius:var(--border-radius);vertical-align:middle;box-shadow:var(--box-shadow)}`
    ];

    static validateProps(props) {
        return super.validateProps(props) && (props.color === null || props.color instanceof ColorValue);
    }

    async _copy(value) {
        let btn = this;
        let previousTheme = this.theme;

        this.addClass('active');
        this.addAttribute('disabled', '');
        this.setTheme(StyleRegister.themes.positive);

        await navigator.clipboard.writeText(value).then(async function () {
            btn.addAttribute('data-tooltip', 'Copied!');
            await new Promise(r => setTimeout(r, 1000));
        }, function (err) {
            NOTIF.danger([`Failed to copy color value to clipboard: ${err}`]);
            console.error('Failed to copy color value', err);
        });

        this.removeClass('active');
        this.removeAttribute('disabled');
        this.addAttribute('data-tooltip', 'Click to copy');
        this.setTheme(previousTheme);
    }

    render() {
        this.setTheme(StyleRegister.themes.text);
        this.addClass('color-value-btn', 'top');
        this.addAttribute('data-tooltip', 'Click to copy');

        let colorHexValue = ColorValueConverter.toHex(this.props.color || ColorWheel.black('hex'))?.toCssString()?.toUpperCase();
        let previewSquare = `<div style="background-color:${colorHexValue}" class="color-preview-inline"></div>`;
        this.setChildren([previewSquare, colorHexValue]);

        this.listen('click', () => this._copy(colorHexValue));

        return super.render();
    }
}