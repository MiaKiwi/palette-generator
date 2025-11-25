import { Field } from "../Field.mjs";
import { SubfieldsField } from "../SubfieldsField.mjs";

export class GroupField extends SubfieldsField {
    /**
     * Creates an instance of the GroupField class
     * @param {Object} params The parameters for the group field
     * @param {Array<Class<Field>>} [params.fieldClasses=[]] The classes of the fields in the group
     * @param {Array<Object>} [params.fieldParams=[{}]] The parameters for each field in the group
     */
    constructor({
        fieldClasses = [],
        fieldParams = [{}],
        ...params
    }) {
        super(params);

        this.fieldClasses = fieldClasses;
        this.fieldParams = fieldParams;

        this.items = this.generateFields(this.fieldClasses, this.fieldParams);

        this.valueType = "Object<String, FieldValue>";
    }



    /**
     * Generates field instances based on the provided field classes and parameters.
     * @param {Array<Class<Field>>} fieldClasses The classes of the fields to generate
     * @param {Array<Object>} fieldParams The parameters to use for each field
     * @returns {Array<Field>} The generated field instances
     */
    generateFields(fieldClasses, fieldParams) {
        let fields = [];

        for (let i = 0; i < fieldClasses.length; i++) {
            let FieldClass = fieldClasses[i];
            let params = fieldParams[i] || {};

            // Check if preset values exist for this field
            if (this.value && this.value[i] !== undefined) {
                params.value = this.value[i];
            }

            let field = new FieldClass(params);

            fields.push(field);
        }

        return fields;
    }



    createItemElement(item, doc = document) {
        let field = item.createFieldElement(doc);

        return field;
    }



    createInputRegionElement(doc = document) {
        // Check if the input already exists
        if (this.inputRegionElementExists(doc)) throw new Error(`Input region element with ID "${this.getInputRegionId()}" already exists in the document.`);

        let container = doc.createElement("div");
        container.id = this.getInputRegionId();
        container.classList.add('field-input', 'group-field-input');

        for (let item of this.items) {
            let itemElement = this.createItemElement(item, doc);

            itemElement.classList.add('group-field-item');

            container.appendChild(itemElement);
        }

        return container;
    }
}