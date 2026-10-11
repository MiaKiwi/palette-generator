import CTX from "../../app/CTX.mjs";
import EVT from "../../app/EVT.mjs";
import Button from "../../kwui/components/control/Button.mjs";
import ButtonGroup from "../../kwui/components/control/ButtonGroup.mjs";
import FontawesomeIcon from "../../kwui/components/display/icons/FontawesomeIcon.mjs";
import Card from "../../kwui/components/layout/card/Card.mjs";
import TagComponent from "../../kwui/components/util/TagComponent.mjs";
import StyleRegister from "../../kwui/StyleRegister.mjs";
import Color from "../palette/Color.mjs";
import ThemeColor from "../palette/ThemeColor.mjs";
import ColorValueConverter from "../tools/ColorValueConverter.mjs";
import ColorWheel from "../tools/ColorWheel.mjs";
import ConstrastChecker from "../tools/ContrastChecker.mjs";
import ColorValueInline from "./ColorValueInline.mjs";

export default class ColorSwatch extends Card {
    static _defaultProps = {
        ...super._defaultProps,
        shape: this.shapes.square,
        compact: true,
        color: null,
        editable: true,
        parent: null
    }

    static _rawStylingRules = [
        ...super._rawStylingRules,
        `.card.color-swatch{width:14em;margin-left:auto;margin-right:auto}`,
        `.card.color-swatch .color-preview{position:relative;min-height:8em;padding:var(--padding-sm);display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end}`,
        `.card.color-swatch .color-preview .copy-value{display:none;z-index:100;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:inherit}`,
        `.card.color-swatch .color-preview:hover::before{z-index:99;content:'';position:absolute;top:0;left:0;width:100%;height:100%;backdrop-filter:blur(5px) brightness(.75)}`,
        `.card.color-swatch .color-preview:hover .copy-value{display:inherit}`,
    ];

    static validateProps(props) {
        return super.validateProps(props) && (props.color === null || props.color instanceof Color) && (typeof props.editable === 'boolean') && (props.parent === null || props.parent instanceof ThemeColor);
    }

    render() {
        this.addClass('color-swatch');

        let colorValue = this.props?.color?.value || ColorWheel.black('hex');
        let fgValue = this.props?.color?.fg || ColorWheel.white('hex');
        let colorHexValue = ColorValueConverter.toHex(colorValue).toCssString();
        let fgHexValue = ColorValueConverter.toHex(fgValue).toCssString();

        let contrast = ConstrastChecker.contrastInfo(colorValue, fgValue);
        let contrastScore = null;
        let contrastIcon = 'fa-regular fa-circle-question';
        let contrastScoreColor = 'var(--text)';
        if (contrast.aaNormal && contrast.aaLarge && contrast.aaaNormal && contrast.aaaLarge) {
            contrastScore = 'pass';
            contrastIcon = 'fa-solid fa-star';
            contrastScoreColor = 'var(--positive)';
        } else if (contrast.aaNormal && contrast.aaLarge) {
            contrastScore = 'good';
            contrastIcon = 'fa-solid fa-circle-check';
            contrastScoreColor = 'var(--info)';
        } else if (contrast.aaNormal) {
            contrastScore = 'poor';
            contrastIcon = 'fa-solid fa-circle-exclamation';
            contrastScoreColor = 'var(--warning)';
        } else {
            contrastScore = 'fail';
            contrastIcon = 'fa-solid fa-circle-xmark';
            contrastScoreColor = 'var(--negative)';
        }

        let colorValueText = new ColorValueInline({
            color: colorValue
        });
        let fgValueText = new ColorValueInline({
            color: fgValue
        });

        let valueCopy = colorValueText.clone();
        valueCopy.addClass('copy-value');

        let preview = new TagComponent({
            tagName: 'div'
        }, [
            valueCopy,
            `<div style="line-height:1;font-size:0.75em;opacity:var(--muted-transparency)"><span style="font-weight:bold">Aa</span>&nbsp;<span style="opacity:var(--muted-transparency)">&bull;</span>&nbsp;<span>Aa</span></div>`,
            `<div style="line-height:1;font-size:1em"><span style="font-weight:bold">Aa</span>&nbsp;<span style="opacity:var(--muted-transparency)">&bull;</span>&nbsp;<span>Aa</span></div>`,
            `<div style="line-height:1;font-size:2em"><span style="font-weight:bold">Aa</span>&nbsp;<span style="opacity:var(--muted-transparency)">&bull;</span>&nbsp;<span>Aa</span></div>`

        ], null, null, ['color-preview']).attr('style', `background-color:${colorHexValue};color:${fgHexValue}`);

        this.setChildren([
            preview,
            `<div data-tooltip="Contrast: ${contrastScore} (${contrast.ratio.toFixed(1)}:1)" style="border-top:0.1em solid var(--border);margin-block-start:var(--padding-sm)"><h4 style="margin-block:0;display:inline">${this.props?.color?.name || 'unknown'}</h4>&nbsp;<span style="opacity:var(--muted-transparency)">&bull;</span>&nbsp;<i style="color:${contrastScoreColor}" class="${contrastIcon}"></i></div>`,
            new TagComponent({
                tagName: 'div'
            }, [
                colorValueText,
                fgValueText
            ]).attr('style', 'margin-block-start:var(--padding-lg);display:flex;justify-content:space-between')
        ]);

        if (this.props.editable) {
            let controls = new ButtonGroup({
                orientation: ButtonGroup.orientations.horizontal
            }, [
                new Button({
                    style: Button.styles.empty,
                    shape: Button.shapes.circular
                }, [
                    new FontawesomeIcon({
                        name: 'pen'
                    })
                ]).attr('data-tooltip', 'Edit'),
                new Button({
                    style: Button.styles.empty,
                    shape: Button.shapes.circular,
                    cooldown: 500
                }, [
                    new FontawesomeIcon({
                        name: 'trash'
                    }, [], StyleRegister.themes.negative)
                ]).attr('data-tooltip', 'Delete').listen('click', () => this._deleteFromThemeColor())
            ]).attr('style', 'border-top:0.1em solid var(--border);margin-top:var(--padding-sm);padding-top:var(--padding-sm);width:stretch;justify-content:flex-end');

            this.addChild(controls);
        }

        return super.render();
    }

    _deleteFromThemeColor() {
        if (!(this.props?.parent instanceof ThemeColor)) return;

        // Check if it's the main color
        if (this.props.parent.main === this.props.color) {
            this.props.parent?.theme?.removeColor(this.props.parent);
            EVT.dispatch(EVT.DELETE_COLOR, this.i());
        } else {
            // It's a variant
            this.props.parent.removeVariant(this.props.color);
            EVT.dispatch(EVT.DELETE_VARIANT, this.i());
        }

        this.unmount();
    }
}