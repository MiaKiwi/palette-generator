import Button from "../../kwui/components/control/Button.mjs";
import ButtonGroup from "../../kwui/components/control/ButtonGroup.mjs";
import Heading from "../../kwui/components/core/typo/Heading.mjs";
import Text from "../../kwui/components/core/typo/Text.mjs";
import FontawesomeIcon from "../../kwui/components/display/icons/FontawesomeIcon.mjs";
import Card from "../../kwui/components/layout/card/Card.mjs";
import TagComponent from "../../kwui/components/util/TagComponent.mjs";
import StyleRegister from "../../kwui/StyleRegister.mjs";
import Palette from "../palette/Palette.mjs";
import ThemeBook from "./ThemeBook.mjs";

export default class ColorPalette extends Card {
    static _defaultProps = {
        ...super._defaultProps,
        shape: this.shapes.square,
        borderless: true,
        compact: true,
        palette: null,
        editable: true
    }

    static _rawStylingRules = [
        ...super._rawStylingRules,
    ];

    static validateProps(props) {
        return super.validateProps(props) && (props.palette instanceof Palette) && (typeof props.editable === 'boolean');
    }

    render() {
        this.addClass('color-palette');

        let title = new TagComponent({
            tagName: 'header'
        }, [
            new Heading({
                level: 2,
                align: Text.alignments.center
            }, [
                this.props?.palette?.name || 'unknown'
            ])
        ]);

        this.setChildren([
            title,
            new TagComponent({
                tagName: 'div'
            }, this.props?.palette?.themes?.map(theme => {
                return new ThemeBook({
                    theme: theme,
                    editable: this.props.editable
                })
            })).attr('style', 'display:grid;grid-template-columns:repeat(auto-fit, minmax(20em, 1fr));align-items:start;gap:var(--padding-md)')
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
                ]).attr('data-tooltip', 'Edit')
            ]).attr('style', 'border-bottom:0.1em solid var(--border);margin-bottom:var(--padding-sm);padding-bottom:var(--padding-sm);width:stretch;justify-content:flex-end');

            this.addChild(controls, 0);
        }

        return super.render();
    }
}