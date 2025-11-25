import { Field } from "./Field.mjs";

export class HTMLInputField extends Field {
    /**
     * Creates an instance of the HTMLInputField class
     * @param {Object} params The parameters for the input field
     */
    constructor(params) {
        super(params);

        this.htmlInputType = 'text';
        this.htmlValueAttribute = 'value';
        this.htmlTagName = 'input';

        this.valueType = String;
    }



    createInputRegionElement(doc = document) {
        // Check if the input already exists
        if (this.inputRegionElementExists(doc)) throw new Error(`Input region element with ID "${this.getInputRegionId()}" already exists in the document.`);

        let input = doc.createElement(this.htmlTagName);

        for (let [key, value] of Object.entries(this.attributes)) {
            input.setAttribute(key, value);
        }

        if (this.htmlInputType) input.type = this.htmlInputType;
        input.id = this.getInputRegionId();
        input.name = this.name;
        input.classList.add('field-input');

        try {
            input[this.htmlValueAttribute] = this.getValue();
        } catch (e) {
            console.debug(`Failed to set value for input field "${this.name}":`, e);
        }

        return input;
    }



    updateInputRegionElementInDOM(doc = document) {
        let input = this.getInputRegionElementFromDOM(doc);

        if (input) {
            input[this.htmlValueAttribute] = this.getValue();
        }
    }



    getValue() {
        let input = this.getInputRegionElementFromDOM();

        return input ? input[this.htmlValueAttribute] : this.value;
    }
}