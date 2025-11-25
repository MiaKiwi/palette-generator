import { RandomIDProvider } from "../idproviders/RandomIDProvider.mjs";

export class Option {
    /**
     * Creates an instance of the Option class
     * @param {*} value The value of the option
     * @param {String} label The label of the option
     * @param {Object} attributes Additional attributes for the option
     */
    constructor(value, label = null, attributes = {}) {
        this.value = value;
        this.label = label !== null ? label : String(value);
        this.attributes = attributes;

        this.id = attributes.id || RandomIDProvider.new();
    }



    /**
     * Creates an HTML element for the option
     * @param {Document} doc The document object to create the element in
     * @returns {HTMLOptionElement} The created option element
     */
    createElement(doc = document) {
        // Check if the option already exists
        if (doc.getElementById(this.id)) throw new Error(`Option with ID "${this.id}" already exists in the document.`);

        let option = doc.createElement('option');

        for (let [key, value] of Object.entries(this.attributes)) {
            option.setAttribute(key, value);
        }

        option.id = this.id;
        option.value = this.value;
        option.innerHTML = this.label;
        option.label = this.label;

        return option;
    }



    /**
     * Gets the DOM element for the option, creating it if it doesn't exist
     * @param {Document} doc The document object to get the element from
     * @returns {HTMLOptionElement} The option element
     */
    dom(doc = document) {
        return doc.getElementById(this.id) ?? this.createElement(doc);
    }



    /**
     * Gets the string representation of the option
     * @returns {String} The label of the option
     */
    toString() {
        return this.label;
    }
}