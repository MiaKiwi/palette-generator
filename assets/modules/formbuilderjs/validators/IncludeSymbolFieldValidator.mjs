import { FieldValidator } from "./FieldValidator.mjs";

export class IncludeSymbolFieldValidator extends FieldValidator {
    /**
     * Creates an instance of IncludeSymbolFieldValidator
     * @param {Number} numberOfSymbols The minimum number of symbols required
     * @param {Array<String>} symbols An array of symbols to include
     * @param {String} message The error message to display when validation fails
     */
    constructor(numberOfSymbols = 1, symbols = '!@#$%^&*()_+{}:"<>?|[];\',./`~-=\\'.split(''), message = "This field must include at least {min} symbols: <kbd>{symbols}</kbd>.") {
        let script = (field) => {
            let value = field.getValue() || "";

            let match = value.split('').filter(char => symbols.includes(char));

            return match !== null && match.length >= this.numberOfSymbols;
        };

        super(script, message);

        this.numberOfSymbols = numberOfSymbols;
        this.symbols = symbols;
    }



    formatMessage(message) {
        return message.replace(/{min}/g, this.numberOfSymbols).replace(/{symbols}/g, this.symbols.join(''));
    }
}