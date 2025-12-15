import { TextField } from "../../../formbuilderjs/fields/TextField.mjs";
import { Form } from "../../../formbuilderjs/forms/Form.mjs";



export default class PaletteForm {
    constructor(palette) {
        this.palette = palette;
        this.form = null;
        this.formElement = null;

        this._createForm();
    }



    _createForm() {
        let form = new Form({
            id: 'palette-form',
            action: '#',
            method: 'POST',
            fields: [
                new TextField({
                    id: 'palette-name',
                    name: 'palette-name',
                    label: 'Palette Name',
                    helper: 'The name of the palette',
                    value: this.palette.name,
                    required: true,
                    attributes: {
                        placeholder: 'Enter palette name'
                    }
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

        if (this.palette !== null) {
            let form = this.form;
            let palette = this.palette;

            // Update palette on form submission
            this.formElement.addEventListener('submit', (e) => {
                e.preventDefault();

                let values = form.getValues();
                let oldName = palette.name;

                palette.name = values['palette-name'];

                console.log("Changing palette name to:", palette.name);
                

                // Update palette card
                palette.updatePaletteCard(true, oldName);

                // Dispatch close-dialog event to close the dialog
                this.formElement.dispatchEvent(new Event('close-dialog'));
            });
        } else {
            throw new Error("PaletteForm requires a Palette instance.");
        }
    }
}