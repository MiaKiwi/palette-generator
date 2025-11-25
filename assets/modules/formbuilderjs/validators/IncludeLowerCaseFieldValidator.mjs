import { FieldValidator } from "./FieldValidator.mjs";

export class IncludeLowerCaseFieldValidator extends FieldValidator {
    /**
     * Creates an instance of IncludeLowerCaseFieldValidator
     * @param {Number} numberOfLowerCase The minimum number of lowercase letters required
     * @param {String} message The error message to display when validation fails
     */
    constructor(numberOfLowerCase = 1, message = "This field must include at least {min} lowercase letters.") {
        let script = (field) => {
            let value = field.getValue() || "";

            let match = value.match(/[a-z]/g);

            return match !== null && match.length >= this.numberOfLowerCase;
        };

        super(script, message);

        this.numberOfLowerCase = numberOfLowerCase;
    }



    formatMessage(message) {
        return message.replace(/{min}/g, this.numberOfLowerCase);
    }
}