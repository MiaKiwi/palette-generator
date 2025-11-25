import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class DateTimeLocalField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'datetime-local';

        this.valueType = Date;
    }
}