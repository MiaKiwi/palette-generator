import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class SearchField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'search';
    }
}