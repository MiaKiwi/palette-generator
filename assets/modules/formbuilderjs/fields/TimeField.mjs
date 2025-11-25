import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class TimeField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'time';
    }
}