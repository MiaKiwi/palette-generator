import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class TelephoneField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'tel';
    }
}