import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class EmailField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'email';
    }
}