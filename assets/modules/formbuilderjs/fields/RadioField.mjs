import { Option } from "../options/Option.mjs";
import { OptionsGroup } from "../options/OptionsGroup.mjs";
import { Field } from "./Field.mjs";

export class RadioField extends Field {
    /**
     * Creates an instance of the RadioField class
     * @param {Object} params The parameters for the radio field
     * @param {Array<Option>} params.options The options for the radio field
     */
    constructor({
        options = [],
        ...params
    }) {
        super(params);

        this.options = options;

        this.valueType = Option;
    }



    createInputRegionElement(doc = document) {
        // Check if the input already exists
        if (this.inputRegionElementExists(doc)) throw new Error(`Input region element with ID "${this.getInputRegionId()}" already exists in the document.`);

        let container = doc.createElement("div");

        for (let [key, value] of Object.entries(this.attributes)) {
            container.setAttribute(key, value);
        }

        container.id = this.getInputRegionId();
        container.classList.add('field-input', 'radio-group');

        for (let option of this.options) {
            let inputId = `${this.getInputRegionId()}_${option.value}`;

            let label = doc.createElement("label");
            label.setAttribute("for", inputId);
            label.classList.add('radio-option');
            label.innerHTML = option.label;

            let input = doc.createElement("input");
            for (let [key, value] of Object.entries(option.attributes)) {
                input.setAttribute(key, value);
            }
            input.type = "radio";
            input.id = inputId;
            input.name = this.name;
            input.value = option.value;
            input.checked = this.value === option.value ? true : false;

            container.appendChild(input);
            container.appendChild(label);
        }

        return container;
    }



    updateInputRegionElementInDOM(doc = document) {
        let input = this.getInputRegionElementFromDOM(doc);

        if (input) {
            input.value = this.getValue()?.value || '';
        }
    }



    /**
     * Gets the option that matches the given value
     * @param {*} value The value to match
     * @returns {Option|null} The matching option or null if not found
     */
    getOptionByValue(value) {
        for (let option of this.options) {
            if (option.value == value) {
                return option;
            }
        }

        return null;
    }



    getValue() {
        let input = this.getInputRegionElementFromDOM();

        let selectedInput = input?.querySelector(`input[name="${this.name}"]:checked`);

        return selectedInput ? this.getOptionByValue(selectedInput.value) : this.value;
    }
}