import { Field } from "../fields/Field.mjs";

export class Form {
    constructor({
        id,
        action = '#',
        method = 'POST',
        fields = [],
        attributes = {}
    }) {
        this.id = id;
        this.action = action;
        this.method = method;
        this.attributes = attributes;
        this.fields = [];
        for (let field of fields) {
            this.addField(field);
        }
    }



    /**
     * Adds a field to the form
     * @param {*} field The field to add
     */
    addField(field) {
        if (!(this.fields.includes(field))) {
            this.fields.push(field);
        }

        if (field.form !== this) {
            field.form = this;
        }
    }



    /**
     * Removes a field from the form
     * @param {*} field The field to remove
     */
    removeField(field) {
        this.fields = this.fields.filter(f => f !== field);

        if (field.form === this) {
            field.form = null;
        }
    }



    /**
     * Creates a form element
     * @param {Document} doc The document to create the form element in
     * @returns {HTMLFormElement} The form element
     */
    createFormElement(doc = document) {
        let form = doc.createElement("form");

        for (let [key, value] of Object.entries(this.attributes)) {
            form.setAttribute(key, value);
        }

        form.id = this.id;
        form.action = this.action;
        form.method = this.method;
        form.classList.add("form");

        for (let field of this.fields) {
            form.appendChild(field.dom());
        }

        return form;
    }



    /**
     * Checks if the form element exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the form element exists, false otherwise
     */
    formElementExists(doc = document) {
        return this.getFormElementFromDOM(doc) !== null;
    }



    /**
     * Gets the form element from the DOM
     * @param {Document} doc The document to check in
     * @returns {HTMLFormElement|null} The form element if it exists, null otherwise
     */
    getFormElementFromDOM(doc = document) {
        return doc.getElementById(this.id);
    }



    /**
     * Gets the form element from the DOM or creates a new one if it doesn't exist
     * @param {Document} doc The document to check in
     * @returns {HTMLFormElement} The form element
     */
    dom(doc = document) {
        return this.formElementExists(doc) ? this.getFormElementFromDOM(doc) : this.createFormElement(doc);
    }



    /**
     * Gets the values of the form fields
     * @returns {Object} The form field values
     */
    getValues() {
        let values = {};

        for (let field of this.fields) {
            values[field.name] = field.getTypedValue();
        }

        return values;
    }



    /**
     * Gets a summary of the form field values
     * @returns {Object} The form field summary
     */
    getSummary() {
        let summary = {};

        for (let field of this.fields) {
            summary[field.name] = {
                label: field.label,
                value: field.getTypedValue(),
                isValid: field.isValid()
            }
        }

        return summary;
    }



    /**
     * Gets a field by its ID
     * @param {String} fieldId The ID of the field to get
     * @returns {Field|null} The field if found, null otherwise
     */
    getFieldById(fieldId) {
        for (let field of this.fields) {
            if (field.id === fieldId) {
                return field;
            }
        }

        return null;
    }



    /**
     * Checks if the form is valid
     * @returns {Boolean} True if the form is valid, false otherwise
     */
    isValid() {
        for (let field of this.fields) {
            if (!field.isValid()) {
                return false;
            }
        }

        return true;
    }



    /**
     * Validates the form and its fields
     * @returns {Boolean} True if the form and all fields are valid, false otherwise
     */
    validate() {
        let valid = this.isValid();

        for (let field of this.fields) {
            field.validate();
        }

        return valid;
    }



    /**
     * Appends the form to a parent element
     * @param {HTMLElement} parent The parent element to append the form to
     */
    appendIn(parent) {
        // Append the form element to the parent
        parent.appendChild(this.dom());

        // Append the datalists of the fields
        this.fields.forEach(field => {
            if (field?.datalist && !parent.ownerDocument.getElementById(field.datalist.id)) {
                parent.appendChild(field.datalist.dom(parent.ownerDocument));
            }
        })
    }



    /**
     * Gets the values of the form fields as a plain object
     * @returns {Object} The form field values
     */
    toValuesObject() {
        let result = {};

        // Get the values of all first-level fields
        let firstLevelValues = this.getValues();

        for (let [key, value] of Object.entries(firstLevelValues)) {
            if (value instanceof Option) {
                // If the value is an Option, get its value
                result[key] = value.value;
            } else if (Array.isArray(value) && value.every(v => v instanceof Option)) {
                // If the value is an array of Options, get their values
                result[key] = value.map(v => v.value);
            } else if (value instanceof Field) {
                // If the value is a Field, get its typed value
                result[key] = value.getTypedValue();
            } else if (Array.isArray(value) && value.every(v => v instanceof Field)) {
                // If the value is an array of Fields, get their typed values
                result[key] = value.map(v => v.getTypedValue());
            } else {
                // Otherwise, use the value as is
                result[key] = value;
            }
        }

        return result;
    }



    /**
     * Gets the JSON representation of the form values
     * @returns {String} The JSON representation of the form values
     */
    toValuesJSON() {
        return JSON.stringify(this.toValuesObject());
    }
}