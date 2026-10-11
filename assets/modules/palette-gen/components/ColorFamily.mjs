import EVT from "../../app/EVT.mjs";
import Button from "../../kwui/components/control/Button.mjs";
import ButtonGroup from "../../kwui/components/control/ButtonGroup.mjs";
import FontawesomeIcon from "../../kwui/components/display/icons/FontawesomeIcon.mjs";
import Accordion from "../../kwui/components/layout/accordion/Accordion.mjs";
import AccordionSummary from "../../kwui/components/layout/accordion/AccordionSummary.mjs";
import Card from "../../kwui/components/layout/card/Card.mjs";
import TagComponent from "../../kwui/components/util/TagComponent.mjs";
import StyleRegister from "../../kwui/StyleRegister.mjs";
import Color from "../palette/Color.mjs";
import ThemeColor from "../palette/ThemeColor.mjs";
import ColorWheel from "../tools/ColorWheel.mjs";
import ColorSwatch from "./ColorSwatch.mjs";

export default class ColorFamily extends Card {
    static _defaultProps = {
        ...super._defaultProps,
        shape: this.shapes.square,
        borderless: true,
        compact: true,
        color: null,
        editable: true
    }

    static _rawStylingRules = [
        ...super._rawStylingRules,
        `.card.color-family .color-variants{font-size:.75em}`
    ]

    static validateProps(props) {
        return super.validateProps(props) && (props.color === null || props.color instanceof ThemeColor) && (typeof props.editable === 'boolean');
    }

    render() {
        this.addClass('color-family');

        let color = this.props?.color?.main || new Color('unknown', ColorWheel.black());
        let variants = this.props?.color?.variants ?? [];

        this.setChildren([
            new ColorSwatch({
                color: color,
                editable: this.props.editable,
                parent: this.props?.color
            }),
            new Accordion({
                borderless: true
            }, [
                new AccordionSummary({
                    iconLocation: AccordionSummary.iconLocations.left
                }, []).attr('style', 'justify-content:center'),
                new TagComponent({
                    tagName: 'div'
                }, variants?.map(variant => {
                    return new ColorSwatch({
                        color: variant,
                        editable: this.props.editable,
                        parent: this.props?.color
                    })
                })).attr('style', 'display:grid;grid-template-columns:repeat(auto-fit, minmax(14em, 1fr));gap:var(--padding-md)')
            ], null, null, ['color-variants'])
        ]);

        this.addListener(EVT.DELETE_COLOR, () => this.unmount());

        return super.render();
    }
}