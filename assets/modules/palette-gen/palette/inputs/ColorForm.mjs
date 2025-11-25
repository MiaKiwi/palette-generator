import { CheckboxField } from "../../../formbuilderjs/fields/CheckboxField.mjs";
import { ColorField } from "../../../formbuilderjs/fields/ColorField.mjs";
import { TextField } from "../../../formbuilderjs/fields/TextField.mjs";
import { Form } from "../../../formbuilderjs/forms/Form.mjs";
import ColorValueParser from "../../tools/ColorValueParser.mjs";



export default class ColorForm {
    constructor(color = null, themeColor = null) {
        this.color = color;
        this.themeColor = themeColor;
        this.form = null;
        this.formElement = null;

        this._createForm();
    }



    _createForm() {
        let form = new Form({
            id: 'color-form',
            action: '#',
            method: 'POST',
            fields: [
                new TextField({
                    id: 'color-name',
                    name: 'color-name',
                    label: 'Color Name',
                    helper: 'The name of the color',
                    value: this?.color?.name,
                    required: true,
                    attributes: {
                        placeholder: 'Enter color name'
                    }
                }),
                new ColorField({
                    id: 'color-value',
                    name: 'color-value',
                    label: 'Color Value',
                    helper: 'The value of the color',
                    value: this?.color?.value?.toCssString(),
                    required: true
                }),
                new ColorField({
                    id: 'color-foreground',
                    name: 'color-foreground',
                    label: 'Foreground Color',
                    helper: 'The foreground color for this color (optional)',
                    value: this?.color?.fg?.toCssString() || '',
                    required: false
                }),
                new CheckboxField({
                    id: 'color-generate-fg',
                    name: 'color-generate-fg',
                    label: 'Auto-generate Foreground',
                    helper: 'Check to auto-generate a readable foreground color based on the background color',
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

        if (this.color !== null) {
            let form = this.form;
            let color = this.color;
            let themeColor = this.themeColor;

            // Update color on form submission
            this.formElement.addEventListener('submit', (e) => {
                e.preventDefault();

                let values = form.getValues();

                color.name = values['color-name'];
                color.value = ColorValueParser.parse(values['color-value']);

                if (values['color-generate-fg']) {
                    color.findBestForegroundColor();
                } else {
                    color.fg = values['color-foreground'] ? ColorValueParser.parse(values['color-foreground']) : null;
                }

                // Update palette card
                themeColor.theme.palette.updatePaletteCard();

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

                themeColor.removeVariant(color);

                // Update palette card
                themeColor.theme.palette.updatePaletteCard();

                // Dispatch close-dialog event to close the dialog
                this.formElement.dispatchEvent(new Event('close-dialog'));
            });
        }
    }
}