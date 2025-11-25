import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class ColorField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'color';
    }
}