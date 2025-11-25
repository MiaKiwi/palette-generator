import { HTMLDatalistInputField } from "./HTMLDatalistInputField.mjs"

export class WeekField extends HTMLDatalistInputField {
    constructor(params) {
        super(params);

        this.htmlInputType = 'week';
    }
}