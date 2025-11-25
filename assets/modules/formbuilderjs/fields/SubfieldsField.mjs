import { SubfieldsFieldValidator } from "../validators/SubfieldsFieldValidator.mjs";
import { Field } from "./Field.mjs";

export class SubfieldsField extends Field {
    /**
     * Creates an instance of the SubfieldsField class
     * @param {Object} params The parameters for the subfields field
     * @param {Boolean} [params.autoValidate=true] Whether to automatically validate sub-fields when they change
     */
    constructor({
        autoValidate = true,
        ...params
    }) {
        super(params);

        this.autoValidate = autoValidate;

        this.items = [];
        this.tail = 0; // Next item index for ID generation

        // Add special validator to spread validity checks to items
        this.validators.push(new SubfieldsFieldValidator());

        this.valueType = "Field[]";
    }



    /**
     * Gets all items (sub-fields) in the field
     * @returns {Array<Field>} Array of sub-fields
     */
    getItems() {
        return this.items;
    }



    /**
     * Removes an item (sub-field) from the field
     * @param {Field} item The sub-field to remove
     */
    removeItem(item) {
        this.items = this.items.filter(i => i !== item);

        // Validate automatically if enabled
        if (this.autoValidate) this.validate();
    }



    /**
     * Gets the ID for an item (sub-field) based on its index
     * @param {Number} [index=this.tail] The index of the item
     * @returns {String} The ID for the item
     */
    getItemId(index = this.tail) {
        return `${this.id}-item-${index}`;
    }



    /**
     * Gets the name for an item (sub-field) based on its index
     * @param {Number} [index=this.tail] The index of the item
     * @returns {String} The name for the item
     */
    getItemName(index = this.tail) {
        return `${this.name}[${index}]`;
    }



    /**
     * Increments the tail index for item ID/name generation
     */
    bumpTail() {
        this.tail++;
    }



    /**
     * Adds a new item (sub-field) to the field
     * @param {Class<Field>} itemFieldClass The class constructor for the sub-field
     * @param {Object} [itemFieldParams={}] The parameters to initialize the sub-field
     * @returns {Field} The created sub-field
     */
    addItem(itemFieldClass, itemFieldParams = {}) {
        let itemField = new itemFieldClass(itemFieldParams);

        // Add an ID if not present
        if (!itemField.id) {
            itemField.id = this.getItemId(this.tail);
        }

        // Add a name if not present
        if (!itemField.name) {
            itemField.name = this.getItemName(this.tail);
        }

        this.items.push(itemField);

        // Validate automatically if enabled
        if (this.autoValidate) this.validate();

        this.bumpTail();

        return itemField;
    }



    /**
     * Creates the HTML element for a single item (sub-field) in the field
     * @param {Field} item The sub-field to create the element for
     * @param {Document} [doc=document] The document to create the element in
     * @returns {HTMLElement} The created sub-field element
     */
    createItemElement(item, doc = document) {
        throw new Error("Method 'createItemElement' must be implemented in subclasses.");
    }



    getValue() {
        return this.items;
    }
}