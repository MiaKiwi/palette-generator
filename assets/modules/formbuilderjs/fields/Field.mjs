import { Caster } from "../casters/Caster.mjs";
import { Form } from "../forms/Form.mjs";
import { RandomIDProvider } from "../idproviders/RandomIDProvider.mjs";

export class Field {
    /**
     * Creates a new Field instance
     * @param {Object} params The parameters for the field
     * @param {String} params.id The unique identifier for the field
     * @param {String} [params.name=null] The name attribute for the field
     * @param {String} [params.label=null] The label text for the field
     * @param {String} [params.helper=null] The helper text for the field
     * @param {Object} [params.attributes={}] Additional attributes for the field
     * @param {Array<FieldValidator>} [params.validators=[]] An array of validator functions for the field
     * @param {Form} [params.form=null] The form to which the field belongs
     * @param {*} [params.value=null] The initial value of the field
     * @param {Caster} [params.caster=Caster] The caster to use for type conversion
     */
    constructor({
        id,
        name = null,
        label = null,
        helper = null,
        attributes = {},
        validators = [],
        form = null,
        value = null,
        required = false,
        caster = Caster
    }) {
        // Check if the field is already in the DOM
        if (document.getElementById(id)) throw new Error(`Field with ID "${id}" already exists.`);

        if (required) attributes.required = 'required';

        this.id = id || RandomIDProvider.new();
        this.name = name || id;
        this.label = label;
        this.helper = helper;
        this.attributes = attributes;
        this.validators = validators;
        this.value = value;
        this.caster = caster;

        if (form) this.addToForm(form);

        this.errors = [];
        this.valueType = String;
    }



    /**
     * Adds the field to the specified form
     * @param {Form} form The form to add the field to
     */
    addToForm(form) {
        form.addField(this);
    }



    /**
     * Gets the ID of the field container element
     * @returns {String} The ID of the field container element
     */
    getFieldContainerId() {
        return `field-${this.id}`;
    }



    /**
     * Gets the ID to be used in the label's "for" attribute
     * @returns {String} The ID of the field
     */
    getIdForLabel() {
        return this.getInputRegionId();
    }



    /**
     * Gets the ID of the label element
     * @returns {String} The ID of the label element
     */
    getLabelId() {
        return `field-${this.id}-label`;
    }



    /**
     * Gets the ID of the helper element
     * @returns {String} The ID of the helper element
     */
    getHelperId() {
        return `field-${this.id}-helper`;
    }



    /**
     * Gets the ID of the input region element
     * @returns {String} The ID of the input region element
     */
    getInputRegionId() {
        return this.id;
    }



    /**
     * Gets the ID of the errors container element
     * @returns {String} The ID of the errors container element
     */
    getErrorsContainerId() {
        return `field-${this.id}-errors`;
    }



    /**
     * Checks if the field element exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the field element exists, false otherwise
     */
    fieldElementExists(doc = document) {
        return (
            this.fieldContainerElementExists(doc) &&
            this.labelElementExists(doc) &&
            this.inputRegionElementExists(doc) &&
            this.helperElementExists(doc) &&
            this.errorsContainerElementExists(doc)
        );
    }


    /**
     * Checks if the field container element exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the field container exists, false otherwise
     */
    fieldContainerElementExists(doc = document) {
        return this.getFieldContainerElementFromDOM(doc) !== null;
    }



    /**
     * Checks if the field element exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the field element exists, false otherwise
     */
    fieldElementExists(doc = document) {
        return this.fieldContainerElementExists(doc);
    }



    /**
     * Checks if the label element exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the label element exists, false otherwise
     */
    labelElementExists(doc = document) {
        return this.getLabelElementFromDOM(doc) !== null;
    }



    /**
     * Checks if the input region element exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the input region element exists, false otherwise
     */
    inputRegionElementExists(doc = document) {
        return this.getInputRegionElementFromDOM(doc) !== null;
    }



    /**
     * Checks if the helper element exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the helper element exists, false otherwise
     */
    helperElementExists(doc = document) {
        return this.getHelperElementFromDOM(doc) !== null;
    }



    /**
     * Checks if the errors container element exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the errors container element exists, false otherwise
     */
    errorsContainerElementExists(doc = document) {
        return this.getErrorsContainerElementFromDOM(doc) !== null;
    }



    /**
     * Creates the field container element for the field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The field container element
     */
    createFieldContainerElement(doc = document) {
        // Check if the field container already exists
        if (this.fieldContainerElementExists(doc)) throw new Error(`Field container with ID "${this.getFieldContainerId()}" already exists.`);

        let fieldContainerElement = doc.createElement('div');

        fieldContainerElement.setAttribute('id', this.getFieldContainerId());
        fieldContainerElement.setAttribute('class', 'field');

        return fieldContainerElement;
    }



    /**
     * Creates the field element for the form
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The field element
     */
    createFieldElement(doc = document) {
        let fieldContainerElement = this.createFieldContainerElement(doc);

        let labelElement = this.createLabelElement(doc);
        fieldContainerElement.appendChild(labelElement);

        let inputRegionElement = this.createInputRegionElement(doc);
        fieldContainerElement.appendChild(inputRegionElement);

        let helperElement = this.createHelperElement(doc);
        fieldContainerElement.appendChild(helperElement);

        let errorsContainerElement = this.createErrorsContainerElement(doc);
        fieldContainerElement.appendChild(errorsContainerElement);

        return fieldContainerElement;
    }



    /**
     * Creates the label element for the field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The label element
     */
    createLabelElement(doc = document) {
        // Check if the label already exists
        if (this.labelElementExists(doc)) throw new Error(`Label with ID "${this.getLabelId()}" already exists.`);

        let labelElement = doc.createElement('label');

        labelElement.setAttribute('id', this.getLabelId());
        labelElement.setAttribute('for', this.getIdForLabel());
        labelElement.setAttribute('class', 'field-label');
        labelElement.innerHTML = this.label || '';

        return labelElement;
    }



    /**
     * Creates the input region element for the field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The input region element
     */
    createInputRegionElement(doc = document) {
        throw new Error('Method "createInputRegionElement" must be implemented in subclasses.');
    }



    /**
     * Creates the helper element for the field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The helper element
     */
    createHelperElement(doc = document) {
        // Check if the helper already exists
        if (this.helperElementExists(doc)) throw new Error(`Helper with ID "${this.getHelperId()}" already exists.`);

        let helperElement = doc.createElement('small');

        helperElement.setAttribute('id', this.getHelperId());
        helperElement.setAttribute('class', 'field-helper');
        helperElement.innerHTML = this.helper || '';

        return helperElement;
    }



    /**
     * Creates the errors container element for the field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The errors container element
     */
    createErrorsContainerElement(doc = document) {
        // Check if the errors container already exists
        if (this.errorsContainerElementExists(doc)) throw new Error(`Errors container with ID "${this.getErrorsContainerId()}" already exists.`);

        let errorsContainerElement = doc.createElement('ul');

        errorsContainerElement.setAttribute('id', this.getErrorsContainerId());
        errorsContainerElement.setAttribute('class', 'field-errors');

        return errorsContainerElement;
    }



    /**
     * Creates the error items for the field
     * @param {Document} doc The document to create the elements in
     * @returns {HTMLElement[]} The error items
     */
    createErrorItems(doc = document) {
        let errorMessages = this.errors;

        let errorItems = errorMessages.map((errorMessage) => {
            let errorItem = doc.createElement('li');

            errorItem.setAttribute('class', 'field-error');
            errorItem.innerHTML = errorMessage;

            return errorItem;
        });

        return errorItems;
    }



    /**
     * Gets the field element from the DOM
     * @param {Document} doc The document to get the element from
     * @returns {HTMLElement|null} The field element or null if it doesn't exist
     */
    getFieldElementFromDOM(doc = document) {
        return this.getFieldContainerElementFromDOM(doc);
    }



    /**
     * Gets the field container element from the DOM
     * @param {Document} doc The document to get the element from
     * @returns {HTMLElement|null} The field container element or null if it doesn't exist
     */
    getFieldContainerElementFromDOM(doc = document) {
        return doc.getElementById(this.getFieldContainerId());
    }



    /**
     * Gets the label element from the DOM
     * @param {Document} doc The document to get the element from
     * @returns {HTMLElement|null} The label element or null if it doesn't exist
     */
    getLabelElementFromDOM(doc = document) {
        return doc.getElementById(this.getLabelId());
    }



    /**
     * Gets the input region element from the DOM
     * @param {Document} doc The document to get the element from
     * @returns {HTMLElement|null} The input region element or null if it doesn't exist
     */
    getInputRegionElementFromDOM(doc = document) {
        return doc.getElementById(this.getInputRegionId());
    }



    /**
     * Gets the helper element from the DOM
     * @param {Document} doc The document to get the element from
     * @returns {HTMLElement|null} The helper element or null if it doesn't exist
     */
    getHelperElementFromDOM(doc = document) {
        return doc.getElementById(this.getHelperId());
    }



    /**
     * Gets the errors container element from the DOM
     * @param {Document} doc The document to get the element from
     * @returns {HTMLElement|null} The errors container element or null if it doesn't exist
     */
    getErrorsContainerElementFromDOM(doc = document) {
        return doc.getElementById(this.getErrorsContainerId());
    }



    /**
     * Gets the error items from the DOM
     * @param {Document} doc The document to get the elements from
     * @returns {HTMLElement[]} The error items
     */
    getErrorItemsFromDOM(doc = document) {
        let errorsContainerElement = this.getErrorsContainerElementFromDOM(doc);

        if (!errorsContainerElement) return [];

        return Array.from(errorsContainerElement.getElementsByClassName('field-error'));
    }



    /**
     * Updates the field element in the DOM
     * @param {Document} doc The document to update the elements in
     */
    updateFieldElementInDOM(doc = document) {
        this.updateLabelElementInDOM(doc);
        this.updateInputRegionElementInDOM(doc);
        this.updateHelperElementInDOM(doc);
        this.updateErrorsInDOM(doc);
    }




    /**
     * Updates the label text in the DOM
     * @param {Document} doc The document to update the elements in
     */
    updateLabelElementInDOM(doc = document) {
        let labelElement = this.getLabelElementFromDOM(doc);

        if (labelElement) {
            labelElement.innerHTML = this.label || '';
        }
    }



    /**
     * Updates the input region element in the DOM
     * @param {Document} doc The document to update the elements in
     */
    updateInputRegionElementInDOM(doc = document) {
        throw new Error('Method "updateInputRegionElementInDOM" must be implemented in subclasses.');
    }




    /**
     * Updates the helper text in the DOM
     * @param {Document} doc The document to update the elements in
     */
    updateHelperElementInDOM(doc = document) {
        let helperElement = this.getHelperElementFromDOM(doc);

        if (helperElement) {
            helperElement.innerHTML = this.helper || '';
        }
    }



    /**
     * Updates the errors in the DOM
     * @param {Document} doc The document to update the elements in
     * @returns {void}
     */
    updateErrorsInDOM(doc = document) {
        let errorsContainerElement = this.getErrorsContainerElementFromDOM(doc);

        if (!errorsContainerElement) return;

        // Clear existing errors
        errorsContainerElement.innerHTML = '';

        let errorItems = this.createErrorItems(doc);

        errorItems.forEach((errorItem) => {
            errorsContainerElement.appendChild(errorItem);
        });
    }



    /**
     * Gets the field container element from the DOM or creates it if it doesn't exist
     * @param {Document} doc The document to get the element from
     * @returns {HTMLElement} The field container element
     */
    dom(doc = document) {
        return this.fieldElementExists(doc) ? this.getFieldElementFromDOM(doc) : this.createFieldElement(doc);
    }



    /**
     * Gets the value of the field
     * @returns {*} The value of the field
     */
    getValue() {
        throw new Error('Method "getValue" must be implemented in subclasses.');
    }



    /**
     * Gets the typed value of the field
     * @returns {*} The typed value of the field
     */
    getTypedValue() {
        return this.caster.cast(this.getValue(), this.valueType);
    }



    /**
     * Checks if the field is valid
     * @returns {Boolean} True if the field is valid, false otherwise
     */
    isValid() {
        let inputRegion = this.getInputRegionElementFromDOM();

        // Clear previous errors
        this.errors = [];

        try {
            inputRegion?.setCustomValidity('');
        } catch (e) {
            console.debug('Could not reset custom validity:', e);
        }

        try {
            // Validate HTML5 constraints
            if (inputRegion && !inputRegion.checkValidity()) {
                this.errors.push(inputRegion.validationMessage);
            }
        } catch (e) {
            console.debug('Could process HTML constraints:', e);
        }

        // Run validators
        this.validators.forEach((validator) => {
            validator.evaluate(this);
        });

        return this.errors.length === 0;
    }



    /**
     * Checks if the field is valid and updates the DOM accordingly
     * @returns {Boolean} True if the field is valid, false otherwise
     */
    validate() {
        let valid = this.isValid();

        this.updateErrorsInDOM();

        return valid;
    }
}