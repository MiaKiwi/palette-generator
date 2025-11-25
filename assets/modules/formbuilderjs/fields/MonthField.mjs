import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class MonthField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'month';

        this.valueType = Date;
    }
}