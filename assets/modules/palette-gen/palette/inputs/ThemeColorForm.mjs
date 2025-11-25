import { CheckboxField } from "../../../formbuilderjs/fields/CheckboxField.mjs";
import { ColorField } from "../../../formbuilderjs/fields/ColorField.mjs";
import { TextField } from "../../../formbuilderjs/fields/TextField.mjs";
import { Form } from "../../../formbuilderjs/forms/Form.mjs";
import ColorValueParser from "../../tools/ColorValueParser.mjs";



export default class ThemeColorForm {
    constructor(themeColor = null) {
        this.themeColor = themeColor;
        this.form = null;
        this.formElement = null;

        this._createForm();
    }



    _createForm() {
        let form = new Form({
            id: 'theme-color-form',
            action: '#',
            method: 'POST',
            fields: [
                new TextField({
                    id: 'theme-color-name',
                    name: 'theme-color-name',
                    label: 'Theme Color Name',
                    helper: 'The name of the theme color',
                    value: this?.themeColor?.main?.name,
                    required: true,
                    attributes: {
                        placeholder: 'Enter theme color name'
                    }
                }),
                new ColorField({
                    id: 'theme-color-value',
                    name: 'theme-color-value',
                    label: 'Theme Color Value',
                    helper: 'The value of the theme color',
                    value: this?.themeColor?.main?.value?.toCssString(),
                    required: true
                }),
                new ColorField({
                    id: 'theme-color-foreground',
                    name: 'theme-color-foreground',
                    label: 'Foreground Color',
                    helper: 'The foreground color for this theme color (optional)',
                    value: this?.themeColor?.main?.fg?.toCssString() || '',
                    required: false
                }),
                new CheckboxField({
                    id: 'theme-color-generate-fg',
                    name: 'theme-color-generate-fg',
                    label: 'Auto-generate Foreground',
                    helper: 'Check to auto-generate a readable foreground color based on the background color',
                    value: true
                }),
                new CheckboxField({
                    id: 'theme-color-generate-variants',
                    name: 'theme-color-generate-variants',
                    label: 'Regenerate Variants',
                    helper: 'Check to regenerate lightness variants based on the main color',
                    value: true
                })
            ]
        });

        this.form = form;
        this.formElement = form.createFormElement();

        let submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Save';
        submitButton.classList.add('form-submit-btn');
        this.formElement.appendChild(submitButton);

        if (this.themeColor !== null) {
            let form = this.form;
            let themeColor = this.themeColor;
            let mainColor = this.themeColor.main;

            // Update color on form submission
            this.formElement.addEventListener('submit', (e) => {
                e.preventDefault();

                let values = form.getValues();

                mainColor.name = values['theme-color-name'];
                mainColor.value = ColorValueParser.parse(values['theme-color-value']);

                if (values['theme-color-generate-fg']) {
                    mainColor.findBestForegroundColor();
                } else {
                    mainColor.fg = values['theme-color-foreground'] ? ColorValueParser.parse(values['theme-color-foreground']) : null;
                }

                if (values['theme-color-generate-variants']) {
                    themeColor.variants = [];

                    themeColor.generateLightnessVariants({
                        start: 0,
                        end: 100,
                        step: 10
                    });
                }

                // Update palette card
                themeColor.theme.palette.updatePaletteCard(true);

                // Dispatch close-dialog event to close the dialog
                this.formElement.dispatchEvent(new Event('close-dialog'));
            });

            let deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('form-delete-btn');
            this.formElement.appendChild(deleteButton);

            // Delete color on delete button click
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault();

                let palette = themeColor.theme.palette;

                themeColor.theme.removeColor(themeColor);

                // Update palette card
                palette.updatePaletteCard(true);

                // Dispatch close-dialog event to close the dialog
                this.formElement.dispatchEvent(new Event('close-dialog'));
            });
        }
    }
}