import { Datalist } from "../options/Datalist.mjs";
import { HTMLInputField } from "./HTMLInputField.mjs";

export class HTMLDatalistInputField extends HTMLInputField {
    /**
     * Creates an instance of the HTMLDatalistInputField class
     * @param {Object} params The parameters for the input field
     * @param {Datalist|null} params.datalist The datalist for the input field
     */
    constructor({
        datalist = null,
        ...params
    }) {
        super(params);

        this.datalist = datalist;
        this.attributes.list = this.datalist ? this.datalist.id : null;
    }



    createInputRegionElement(doc = document) {
        let regionElement = super.createInputRegionElement(doc);

        // Append datalist element if available
        if (this.datalist && !doc.getElementById(this.datalist.id)) {
            regionElement.appendChild(this.datalist.dom(doc));
        }

        return regionElement;
    }
}