import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class DateField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'date';

        this.valueType = Date;
    }
}