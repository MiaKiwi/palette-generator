import { Field } from "../fields/Field.mjs";

export class FieldValidator {
    /**
     * @param {Function} script The validation script function
     * @param {String} message The error message to display if validation fails
     */
    constructor(script, message = 'Invalid value.') {
        this.script = script;
        this.message = message;
    }



    /**
     * Formats the validation message by replacing placeholders with provided arguments
     * @param  {String} message The message to format
     * @returns {String} The formatted message
     */
    formatMessage(message) {
        return message;
    }



    /**
     * Evaluates the field against the validation script
     * @param {Field} field The field to validate
     * @param {String} message The error message to display if validation fails
     * @returns {Boolean} True if the field is valid, false otherwise
     */
    evaluate(field, message = null) {
        let dom = field.getInputRegionElementFromDOM();
        let result = this.script(field);

        if (typeof result !== "boolean" || result === false) {
            try {
                dom?.setCustomValidity('invalid');
            }
            catch (e) {
                console.debug(`Failed to set custom validity for field "${field.name}":`, e);
            }

            field.errors.push(this.formatMessage(message !== null ? message : this.message));

            return false;
        }

        return true;
    }
}