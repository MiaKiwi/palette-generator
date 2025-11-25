import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class TextField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'text';
    }
}