import { CheckboxField } from "../../../formbuilderjs/fields/CheckboxField.mjs";
import { TextField } from "../../../formbuilderjs/fields/TextField.mjs";
import { Form } from "../../../formbuilderjs/forms/Form.mjs";



export default class PaletteThemeForm {
    constructor(paletteTheme = null) {
        this.paletteTheme = paletteTheme;
        this.form = null;
        this.formElement = null;

        this._createForm();
    }



    _createForm() {
        let form = new Form({
            id: 'palette-theme-form',
            action: '#',
            method: 'POST',
            fields: [
                new TextField({
                    id: 'palette-theme-name',
                    name: 'palette-theme-name',
                    label: 'Theme Name',
                    helper: 'The name of the theme',
                    value: this?.paletteTheme?.name,
                    required: true,
                    attributes: {
                        placeholder: 'Enter theme name'
                    }
                }),
                new CheckboxField({
                    id: 'palette-theme-auto-detect',
                    name: 'palette-theme-auto-detect',
                    label: 'Auto-detect Theme',
                    helper: 'Check to auto-detect the theme based on user preferences',
                    value: this?.paletteTheme?.autoDetect
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

        if (this.paletteTheme !== null) {
            let form = this.form;
            let paletteTheme = this.paletteTheme;

            // Update theme on form submission
            this.formElement.addEventListener('submit', (e) => {
                e.preventDefault();

                let values = form.getValues();

                paletteTheme.name = values['palette-theme-name'];
                paletteTheme.autoDetect = values['palette-theme-auto-detect'];

                // Update palette card
                paletteTheme.palette.updatePaletteCard();

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

                let palette = paletteTheme.palette;

                paletteTheme.palette.removeTheme(paletteTheme);

                // Update palette card
                palette.updatePaletteCard();

                // Dispatch close-dialog event to close the dialog
                this.formElement.dispatchEvent(new Event('close-dialog'));
            });
        }
    }
}