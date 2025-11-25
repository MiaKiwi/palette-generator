import { IncludeLowerCaseFieldValidator } from "../validators/IncludeLowerCaseFieldValidator.mjs";
import { IncludeNumberFieldValidator } from "../validators/IncludeNumberFieldValidator.mjs";
import { IncludeSymbolFieldValidator } from "../validators/IncludeSymbolFieldValidator.mjs";
import { IncludeUpperCaseFieldValidator } from "../validators/IncludeUpperCaseFieldValidator.mjs";
import { HTMLInputField } from "./HTMLInputField.mjs";

export class PasswordField extends HTMLInputField {
    /**
     * Creates a new PasswordField instance
     * @param {Object} params The parameters for the password field
     * @param {Number} params.includeNumbers Number of numeric characters to include (0 means none required)
     * @param {Number} params.includeSymbols Number of symbol characters to include (0 means none required)
     * @param {Number} params.includeUppercase Number of uppercase characters to include (0 means none required)
     * @param {Number} params.includeLowercase Number of lowercase characters to include (0 means none required)
     * @param {Array<String>} params.symbols Array of characters that are considered symbols
     * @param {Number} params.min Minimum length of the password
     */
    constructor({
        includeNumbers = 1,
        includeSymbols = 1,
        includeLowercase = 1,
        includeUppercase = 1,
        symbols = '!@#$%^&*()_+{}:"<>?|[];\',./`~-=\\'.split(''),
        min = 8,
        ...params
    }) {
        super(params);

        this.includeNumbers = includeNumbers;
        this.includeSymbols = includeSymbols;
        this.includeLowercase = includeLowercase;
        this.includeUppercase = includeUppercase;
        this.symbols = symbols;
        this.min = min;
        this.attributes.minLength = this.min;

        // Add validators
        if (this.includeLowercase > 0) this.validators.push(new IncludeLowerCaseFieldValidator(this.includeLowercase));
        if (this.includeUppercase > 0) this.validators.push(new IncludeUpperCaseFieldValidator(this.includeUppercase));
        if (this.includeNumbers > 0) this.validators.push(new IncludeNumberFieldValidator(this.includeNumbers));
        if (this.includeSymbols > 0) this.validators.push(new IncludeSymbolFieldValidator(this.includeSymbols, this.symbols));

        this.htmlInputType = 'password';
    }
}