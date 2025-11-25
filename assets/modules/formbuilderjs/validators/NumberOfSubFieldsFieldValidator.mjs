import { SubfieldsField } from "../fields/SubfieldsField.mjs";
import { FieldValidator } from "./FieldValidator.mjs";

export class NumberOfSubFieldsFieldValidator extends FieldValidator {
    /**
     * Creates a validator that checks if the number of subfields is within the specified range
     * @param {Number} min The minimum number of subfields required
     * @param {Number} max The maximum number of subfields allowed
     * @param {String} message The error message to display when validation fails
     */
    constructor(min = 0, max = Infinity, message = "Number of items must be between {min} and {max}.") {
        let script = (field) => {
            if (!(field instanceof SubfieldsField)) {
                return true;
            }

            let items = field.getItems();

            let numberOfItems = items ? items.length : 0;

            return numberOfItems >= (this.min ?? 0) && numberOfItems <= (this.max ?? Infinity);
        };

        super(script, message);

        this.min = min;
        this.max = max;
    }



    formatMessage(message) {
        return message.replace(/{min}/g, this.min).replace(/{max}/g, this.max);
    }
}