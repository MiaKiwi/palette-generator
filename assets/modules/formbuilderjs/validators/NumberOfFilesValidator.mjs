import { FieldValidator } from "./FieldValidator.mjs";

export class NumberOfFilesValidator extends FieldValidator {
    /**
     * Creates a validator that checks if the number of files selected in a file input field is within the specified range
     * @param {Number} min The minimum number of files required
     * @param {Number} max The maximum number of files allowed
     * @param {String} message The error message to display when validation fails
     */
    constructor(min = 0, max = Infinity, message = "Number of files must be between {min} and {max}.") {
        let script = (field) => {
            let files = field.getValue();

            let numberOfFiles = files ? files.length : 0;

            return numberOfFiles >= min && numberOfFiles <= max;
        }

        super(script, message);

        this.min = min;
        this.max = max;
    }



    formatMessage(message) {
        return message.replace(/{min}/g, this.min).replace(/{max}/g, this.max);
    }
}