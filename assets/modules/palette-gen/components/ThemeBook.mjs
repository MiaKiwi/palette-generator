import EVT from "../../app/EVT.mjs";
import Button from "../../kwui/components/control/Button.mjs";
import ButtonGroup from "../../kwui/components/control/ButtonGroup.mjs";
import Heading from "../../kwui/components/core/typo/Heading.mjs";
import Avatar from "../../kwui/components/display/avatar/Avatar.mjs";
import FontawesomeIcon from "../../kwui/components/display/icons/FontawesomeIcon.mjs";
import Accordion from "../../kwui/components/layout/accordion/Accordion.mjs";
import AccordionSummary from "../../kwui/components/layout/accordion/AccordionSummary.mjs";
import Card from "../../kwui/components/layout/card/Card.mjs";
import TagComponent from "../../kwui/components/util/TagComponent.mjs";
import StyleRegister from "../../kwui/StyleRegister.mjs";
import PaletteTheme from "../palette/PaletteTheme.mjs";
import ColorFamily from "./ColorFamily.mjs";

export default class ThemeBook extends Card {
    static _defaultProps = {
        ...super._defaultProps,
        shape: this.shapes.square,
        compact: true,
        theme: null,
        editable: true
    }

    static _rawStylingRules = [
        ...super._rawStylingRules,
    ];

    static validateProps(props) {
        return super.validateProps(props) && (props.theme instanceof PaletteTheme) && (typeof props.editable === 'boolean');
    }

    render() {
        this.addClass('theme-book');

        let title = new TagComponent({
            tagName: 'header'
        }, [
            new Heading({
                level: 3,
                inline: true
            }, [
                this.props?.theme?.name || 'unknown'
            ])
        ]);

        if (this.props?.theme?.isDark() ?? false) {
            title.addChild(
                new Avatar({
                    inline: true
                }, [
                    new FontawesomeIcon({
                        name: 'moon'
                    })
                ]), 0);
        }

        this.setChildren([
            new Accordion({
                borderless: true,
                opened: true
            }, [
                new AccordionSummary({
                    iconLocation: AccordionSummary.iconLocations.right
                }, [
                    title
                ]).attr('style', 'justify-content:center'),
                new TagComponent({
                    tagName: 'div'
                }, this.props?.theme?.colors?.map(color => {
                    return new ColorFamily({
                        color: color,
                        editable: this.props.editable
                    })
                })).attr('style', 'display:grid;grid-template-columns:repeat(auto-fit, minmax(14em, 1fr));gap:var(--padding-md)')
            ])
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
                ]).attr('data-tooltip', 'Delete').listen('click', () => this._deleteFromPalette())
            ]).attr('style', 'border-bottom:0.1em solid var(--border);margin-bottom:var(--padding-sm);padding-bottom:var(--padding-sm);width:stretch;justify-content:flex-end');

            this.addChild(controls, 0);
        }

        return super.render();
    }

    _deleteFromPalette() {
        if (!(this.props?.theme instanceof PaletteTheme)) return;

        this.props.theme?.palette?.removeTheme(this.props.theme);
        EVT.dispatch(EVT.DELETE_THEME, this.i());

        this.unmount();
    }
}