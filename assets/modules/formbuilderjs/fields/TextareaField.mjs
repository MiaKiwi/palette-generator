import { HTMLInputField } from "./HTMLInputField.mjs";

export class TextareaField extends HTMLInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = null;
        this.htmlTagName = 'textarea';
    }
}