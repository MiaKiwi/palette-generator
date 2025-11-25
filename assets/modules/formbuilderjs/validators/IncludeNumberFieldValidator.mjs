import { FieldValidator } from "./FieldValidator.mjs";

export class IncludeNumberFieldValidator extends FieldValidator {
    /**
     * Creates an instance of IncludeNumberFieldValidator
     * @param {Number} numberOfNumbers The minimum number of numeric characters required
     * @param {String} message The error message to display when validation fails
     */
    constructor(numberOfNumbers = 1, message = "This field must include at least {min} numeric characters.") {
        let script = (field) => {
            let value = field.getValue() || "";

            let match = value.match(/[0-9]/g);

            return match !== null && match.length >= this.numberOfNumbers;
        };

        super(script, message);

        this.numberOfNumbers = numberOfNumbers;
    }



    formatMessage(message) {
        return message.replace(/{min}/g, this.numberOfNumbers);
    }
}