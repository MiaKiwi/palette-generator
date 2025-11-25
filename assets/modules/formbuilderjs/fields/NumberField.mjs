import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class NumberField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'number';

        this.valueType = Number;
    }
}