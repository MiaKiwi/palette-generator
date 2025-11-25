import { NumberOfFilesValidator } from "../validators/NumberOfFilesValidator.mjs";
import { HTMLInputField } from "./HTMLInputField.mjs";

export class FileField extends HTMLInputField {
    /**
     * Creates an instance of the FileField class
     * @param {Object} params The parameters for the file field
     * @param {String} [params.accept='*'] The accepted file types
     * @param {Boolean} [params.multiple=false] Whether multiple file selection is allowed
     * @param {Number|null} [params.min=null] The minimum number of files that can be selected
     * @param {Number|null} [params.max=null] The maximum number of files that can be selected
     */
    constructor({
        accept = '*',
        multiple = false,
        min = null,
        max = null,
        ...params
    }) {
        super(params);

        this.accept = accept;
        this.multiple = multiple;
        this.min = min;
        this.max = max;

        this.attributes.accept = this.accept;
        if (this.multiple) this.attributes.multiple = 'multiple';
        if (this.min !== null) this.attributes.min = this.min;
        if (this.max !== null) this.attributes.max = this.max;

        if (this.multiple) {
            this.validators.push(new NumberOfFilesValidator(this.min ?? 0, this.max ?? Infinity));
        }

        this.htmlInputType = 'file';
        this.htmlValueAttribute = 'files';

        this.valueType = multiple ? FileList : File;
    }
}