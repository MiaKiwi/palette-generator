import { FieldValidator } from "./FieldValidator.mjs";

export class SubfieldsFieldValidator extends FieldValidator {
    /**
     * Creates a validator that checks the validity of subfields within a field
     * @param {String} message The error message to display when validation fails
     */
    constructor(message = "One or more items are invalid.") {
        let script = (field) => {
            let items = field.getItems();

            let allValid = true;

            items.forEach(item => {
                allValid = item.validate() && allValid;
            });

            return allValid;
        }

        super(script, message);
    }
}