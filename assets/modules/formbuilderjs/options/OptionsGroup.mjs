import { RandomIDProvider } from "../idproviders/RandomIDProvider.mjs";
import { Option } from "./Option.mjs";

export class OptionsGroup {
    /**
     * Creates an instance of the OptionsGroup class
     * @param {Array<Option>} options The options in the group
     * @param {String} label The label for the group
     * @param {Object} attributes The attributes for the group
     */
    constructor(options = [], label = null, attributes = {}) {
        this.options = options;
        this.label = label;
        this.attributes = attributes;

        this.id = attributes.id || RandomIDProvider.new();
    }



    /**
     * Creates the DOM element for the optgroup
     * @param {Document} doc The document object to create the element in
     * @returns {HTMLOptGroupElement} The created optgroup element
     */
    createElement(doc = document) {
        // Check if the optgroup already exists
        if (doc.getElementById(this.id)) throw new Error(`OptionsGroup with ID "${this.id}" already exists in the document.`);

        let optgroup = doc.createElement('optgroup');

        for (let [key, value] of Object.entries(this.attributes)) {
            optgroup.setAttribute(key, value);
        }

        optgroup.id = this.id;
        if (this.label !== null) {
            optgroup.label = this.label;
        }

        for (let option of this.options) {
            optgroup.appendChild(option.dom(doc));
        }

        return optgroup;
    }



    /**
     * Gets the DOM element for the optgroup, creating it if it doesn't exist
     * @param {Document} doc The document object to create the element in
     * @returns {HTMLOptGroupElement} The optgroup element
     */
    dom(doc = document) {
        return doc.getElementById(this.id) ?? this.createElement(doc);
    }
}