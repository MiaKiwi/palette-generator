import { SubfieldsField } from "../fields/SubfieldsField.mjs";
import { Option } from "../options/Option.mjs";
import { FieldValidator } from "./FieldValidator.mjs";

export class UniqueSubfieldValuesFieldValidator extends FieldValidator {
    /**
     * Creates a validator that checks if the values of subfields are unique
     * @param {String} message The error message to display when validation fails
     */
    constructor(message = "Item values must be unique.") {
        let script = (field) => {
            if (!(field instanceof SubfieldsField)) {
                return true;
            }

            let items = field.getItems();

            let values = items.map(item => item.getTypedValue());

            // Convert Option objects to their values for comparison
            values = values.map(v => {
                if (v instanceof Option) {
                    return String(v.value);
                } else if (typeof v === 'object' && v !== null) {
                    return JSON.stringify(v);
                } else {
                    return String(v);
                }
            });

            let uniqueValues = new Set(values);

            return uniqueValues.size === values.length;
        };

        super(script, message);
    }
}