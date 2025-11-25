import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class URLField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'url';

        this.valueType = URL;
    }
}