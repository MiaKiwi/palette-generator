import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class RangeField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'range';

        this.valueType = Number;
    }
}