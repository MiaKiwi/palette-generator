import { HTMLInputField } from "./HTMLInputField.mjs";

export class CheckboxField extends HTMLInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'checkbox';
        this.htmlValueAttribute = 'checked';

        this.valueType = Boolean;
    }
}