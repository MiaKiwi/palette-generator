import { RandomIDProvider } from "../idproviders/RandomIDProvider.mjs";
import { Option } from "../options/Option.mjs";
import { OptionsGroup } from "../options/OptionsGroup.mjs";
import { NumberOfSelectedOptionsFieldValidator } from "../validators/NumberOfSelectedOptionsFieldValidator.mjs";
import { Field } from "./Field.mjs";

export class MultiSelectField extends Field {
    /**
     * Creates an instance of the MultiSelectField class
     * @param {Object} params The parameters for the multi-select field
     * @param {Array<Option|OptionsGroup>} params.options The options for the multi-select field
     * @param {Number} params.min The minimum number of selections allowed
     * @param {Number} params.max The maximum number of selections allowed
     */
    constructor({
        options = [],
        min = null,
        max = null,
        ...params
    }) {
        super(params);

        this.options = options;
        this.min = min;
        this.max = max;

        this.attributes.multiple = 'multiple';

        // Add validators
        if (this.min !== null && this.max !== null) this.validators.push(new NumberOfSelectedOptionsFieldValidator(this.min, this.max));

        this.valueType = "Option[]";
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
            Array.from(input.options).forEach(opt => {
                if (this.value.indexOf(opt.value) !== -1) {
                    opt.selected = true;
                }
            });
        } catch (e) {
            console.debug(`Failed to set value for input field "${this.name}":`, e);
        }

        return input;
    }



    updateInputRegionElementInDOM(doc = document) {
        let input = this.getInputRegionElementFromDOM(doc);

        if (input) {
            let selectedValues = this.getValue().map(opt => opt.value);

            Array.from(input.options).map(opt => {
                if (selectedValues.indexOf(opt.value) !== -1) {
                    opt.selected = true;
                } else {
                    opt.selected = false;
                }
            });
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

        let value = input ? Array.from(input.selectedOptions) : this.value;

        let opts = value.map(opt => this.getOptionByValue(opt.value));

        return opts;
    }
}