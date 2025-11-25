import { FieldValidator } from "./FieldValidator.mjs";

export class NumberOfSelectedOptionsFieldValidator extends FieldValidator {
    /**
     * Creates a validator that checks if the number of options selected in a multi-select field is within the specified range
     * @param {Number} min The minimum number of options required
     * @param {Number} max The maximum number of options allowed
     * @param {String} message The error message to display when validation fails
     */
    constructor(min = 0, max = Infinity, message = "Number of options must be between {min} and {max}.") {
        let script = (field) => {
            let options = field.getValue();

            let numberOfOptions = options ? options.length : 0;

            return numberOfOptions >= min && numberOfOptions <= max;
        }

        super(script, message);

        this.min = min;
        this.max = max;
    }



    formatMessage(message) {
        return message.replace(/{min}/g, this.min).replace(/{max}/g, this.max);
    }
}