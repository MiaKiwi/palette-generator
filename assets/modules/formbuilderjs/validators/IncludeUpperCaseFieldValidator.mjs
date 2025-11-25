import { FieldValidator } from "./FieldValidator.mjs";

export class IncludeUpperCaseFieldValidator extends FieldValidator {
    /**
     * Creates an instance of IncludeUpperCaseFieldValidator
     * @param {Number} numberOfUpperCase The minimum number of uppercase letters required
     * @param {String} message The error message to display when validation fails
     */
    constructor(numberOfUpperCase = 1, message = "This field must include at least {min} uppercase letters.") {
        let script = (field) => {
            let value = field.getValue() || "";

            let match = value.match(/[A-Z]/g);

            return match !== null && match.length >= this.numberOfUpperCase;
        };

        super(script, message);

        this.numberOfUpperCase = numberOfUpperCase;
    }



    formatMessage(message) {
        return message.replace(/{min}/g, this.numberOfUpperCase);
    }
}