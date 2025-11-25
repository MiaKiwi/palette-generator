import { HTMLInputField } from "./HTMLInputField.mjs";

export class HiddenField extends HTMLInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'hidden';
    }
}