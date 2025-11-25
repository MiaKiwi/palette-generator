import { MixedArrayField } from "./MixedArrayField.mjs";

export class UniformArrayField extends MixedArrayField {
    /**
     * Creates an instance of the UniformArrayField class
     * @param {Object} params The parameters for the field
     * @param {Class<Field>} params.itemFieldClass The class of the items in the array
     */
    constructor({
        itemFieldClass,
        ...params
    }) {
        params.allowedItemFieldClasses = [itemFieldClass];

        super(params);

        this.itemFieldClass = itemFieldClass;
        this.selectedItemClass = itemFieldClass;
    }



    createItemClassSelector(doc = document) {
        // Check if selector already exists
        if (doc.getElementById(this.getSelectorId()) !== null) throw new Error(`Item class selector with ID "${this.getSelectorId()}" already exists in the document.`);

        let selectorElement = doc.createElement("p");

        selectorElement.id = this.getSelectorId();
        selectorElement.classList.add("uniform-array-field-item-class-selector");
        selectorElement.innerHTML = `Item Type: ${this.getCleanFieldClassName(this.itemFieldClass)}`;

        return selectorElement;
    }
}