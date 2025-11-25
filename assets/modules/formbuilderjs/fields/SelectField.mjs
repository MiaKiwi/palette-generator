import { RandomIDProvider } from "../idproviders/RandomIDProvider.mjs";
import { Option } from "../options/Option.mjs";
import { OptionsGroup } from "../options/OptionsGroup.mjs";
import { Field } from "./Field.mjs";

export class SelectField extends Field {
    /**
     * Creates an instance of the SelectField class
     * @param {Object} params The parameters for the select field
     * @param {Array<Option|OptionsGroup>} params.options The options for the select field
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

        let input = doc.createElement("select");

        for (let [key, value] of Object.entries(this.attributes)) {
            input.setAttribute(key, value);
        }

        input.id = this.getInputRegionId();
        input.name = this.name;
        input.classList.add('field-input');

        for (let optionOrGroup of this.options) {
            // Check if the option or group is already in the DOM
            if (optionOrGroup.dom(doc)) {
                // If so, clone it to avoid duplication errors
                let cl = optionOrGroup.dom(doc).cloneNode(true);
                cl.id = RandomIDProvider.new();
                input.appendChild(cl);
            } else {
                input.appendChild(optionOrGroup.dom(doc));
            }
        }

        try {
            input.value = this.getValue()?.value || '';
        } catch (e) {
            console.debug(`Failed to set value for input field "${this.name}":`, e);
        }

        return input;
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
        for (let option of this.getOptionsRecursively()) {
            if (option.value == value) {
                return option;
            }
        }

        return null;
    }



    /**
     * Gets all options, including those in groups
     * @returns {Array<Option>} An array of all options
     */
    getOptionsRecursively() {
        let allOptions = [];

        for (let option of this.options) {
            if (option instanceof OptionsGroup) {
                allOptions.push(...option.options);
            } else {
                allOptions.push(option);
            }
        }

        return allOptions;
    }



    getValue() {
        let input = this.getInputRegionElementFromDOM();

        let value = input ? input.value : this.value;

        return this.getOptionByValue(value);
    }
}