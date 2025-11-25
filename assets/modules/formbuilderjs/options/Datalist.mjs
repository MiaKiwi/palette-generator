import { Option } from "./Option.mjs";

export class Datalist {
    /**
     * Creates an instance of the Datalist class
     * @param {String} id The ID for the datalist
     * @param {Array<Option>} options The options for the datalist
     */
    constructor(id, options = []) {
        this.id = id;
        this.options = options;
    }



    /**
     * Creates the DOM element for the datalist
     * @param {Document} doc The document object to create the element in
     * @returns {HTMLDataListElement} The created datalist element
     */
    createElement(doc = document) {
        // Check if the datalist already exists
        if (doc.getElementById(this.id)) throw new Error(`Datalist with ID "${this.id}" already exists in the document.`);

        let datalist = doc.createElement('datalist');

        datalist.id = this.id;

        for (let option of this.options) {
            datalist.appendChild(option.dom(doc));
        }

        return datalist;
    }



    /**
     * Gets the DOM element for the datalist, creating it if it doesn't exist
     * @param {Document} doc The document object to create the element in
     * @returns {HTMLDataListElement} The datalist element
     */
    dom(doc = document) {
        return doc.getElementById(this.id) ?? this.createElement(doc);
    }
}