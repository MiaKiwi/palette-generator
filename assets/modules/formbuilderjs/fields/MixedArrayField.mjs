import { SubfieldsField } from "./SubfieldsField.mjs";
import { NumberOfSubFieldsFieldValidator } from "../validators/NumberOfSubFieldsFieldValidator.mjs";
import { UniqueSubfieldValuesFieldValidator } from "../validators/UniqueSubfieldValuesFieldValidator.mjs";
import { SelectField } from "./SelectField.mjs";
import { Option } from "../options/Option.mjs";
import { Field } from "./Field.mjs";
import { TextField } from "./TextField.mjs";

export class MixedArrayField extends SubfieldsField {
    /**
     * Creates an instance of the MixedArrayField class
     * @param {Object} params The parameters for the mixed array field
     * @param {Array<Class<Field>>} [params.allowedItemFieldClasses=[]] The allowed field classes for items in the array
     * @param {Object} [params.itemFieldParams={}] The parameters to use when creating new item fields
     * @param {Number} [params.min=null] The minimum number of items allowed
     * @param {Number} [params.max=null] The maximum number of items allowed
     * @param {Boolean} [params.unique=false] Whether the items in the array must be unique
     */
    constructor({
        allowedItemFieldClasses = [],
        itemFieldParams = {},
        min = null,
        max = null,
        unique = false,
        ...params
    }) {
        super(params);

        this.allowedItemFieldClasses = allowedItemFieldClasses;
        this.itemFieldParams = itemFieldParams;
        this.selectedItemClass = null;
        this.min = min;
        this.max = max;

        // Add validators
        if (this.min !== null || this.max !== null) {
            this.validators.push(new NumberOfSubFieldsFieldValidator(this.min ?? 0, this.max ?? Infinity));
        }
        if (unique) {
            this.validators.push(new UniqueSubfieldValuesFieldValidator());
        }

        // Set values
        if (this.value !== null && Array.isArray(this.value) && this.value.every(v => v instanceof Field)) {
            for (let item of this.value) {
                item.id = item.id || this.getItemId(this.tail);
                item.name = item.name || this.getItemName(this.tail);
                this.items.push(item);
                this.bumpTail();
            }
        }
    }



    /**
     * Gets a user-friendly class name for a field class
     * @param {Class<Field>} fieldClass The field class
     * @returns {String} The cleaned class name
     */
    getCleanFieldClassName(fieldClass) {
        let cleanName = fieldClass?.name || "Unknown";

        if (cleanName.toLowerCase().endsWith("field")) {
            cleanName = cleanName.slice(0, -5);
        }

        return cleanName;
    }



    /**
     * Gets the index of an item in the items array
     * @param {Field} item The item to get the index of
     * @returns {Number} The index of the item, or -1 if not found
     */
    getIndexOfItem(item) {
        return this.items.indexOf(item);
    }



    /**
     * Gets the classes allowed as Option objects
     * @returns {Array<Option>} The allowed classes as Option objects
     */
    getAllowedClassesSelectorOptions() {
        return this.allowedItemFieldClasses.map(cls => {
            let value = cls.name;
            let label = this.getCleanFieldClassName(cls);

            return new Option(value, label);
        });
    }



    /**
     * Gets the ID of the field type selector
     * @returns {String} The ID of the field type selector
     */
    getSelectorId() {
        return `${this.id}-item-class-selector`;
    }



    /**
     * Gets the ID of the field wrapper
     * @returns {String} The ID of the field wrapper
     */
    getWrapperId() {
        return `${this.id}-wrapper`;
    }



    /**
     * Gets the ID of the items container
     * @returns {String} The ID of the items container
     */
    getItemsContainerId() {
        return `${this.id}-items-container`;
    }



    /**
     * Gets the ID of the add button
     * @returns {String} The ID of the add button
     */
    getAddButtonId() {
        return `${this.id}-add-item-button`;
    }



    /**
     * Gets the ID of the controls container for an item
     * @param {Field} item The item field
     * @returns {String} The ID of the controls container for the item
     */
    getItemControlsContainerId(item) {
        return `${item.id}-controls-container`;
    }



    /**
     * Gets the ID of an item wrapper
     * @param {Field} item The item field
     * @returns {String} The ID of the item wrapper
     */
    getItemWrapperId(item) {
        return `${item.id}-wrapper`;
    }



    /**
     * Gets the ID of the up arrow button for an item
     * @param {Field} item  The item field
     * @returns {String} The ID of the up arrow button
     */
    getReorderArrowUpButtonId(item) {
        return `${item.id}-reorder-up-button`;
    }



    /**
     * Gets the ID of the down arrow button for an item
     * @param {Field} item The item field
     * @returns {String} The ID of the down arrow button
     */
    getReorderArrowDownButtonId(item) {
        return `${item.id}-reorder-down-button`;
    }



    /**
     * Gets the ID of the reorder arrows container for an item
     * @param {Field} item The item field
     * @returns {String} The ID of the reorder arrows container
     */
    getReorderArrowsContainerId(item) {
        return `${item.id}-reorder-arrows-container`;
    }



    /**
     * Checks if the field wrapper exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the field wrapper exists, false otherwise
     */
    wrapperExists(doc = document) {
        return doc.getElementById(this.getWrapperId()) !== null;
    }



    /**
     * Checks if the items container exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the items container exists, false otherwise
     */
    itemsContainerExists(doc = document) {
        return doc.getElementById(this.getItemsContainerId()) !== null;
    }



    /**
     * Checks if the add button exists in the DOM
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the add button exists, false otherwise
     */
    addButtonExists(doc = document) {
        return doc.getElementById(this.getAddButtonId()) !== null;
    }



    /**
     * Checks if the reorder arrow up button exists in the DOM
     * @param {Field} item The item field
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the reorder arrow up button exists, false otherwise
     */
    reorderArrowUpButtonExists(item, doc = document) {
        return doc.getElementById(this.getReorderArrowUpButtonId(item)) !== null;
    }



    /**
     * Checks if the reorder arrow down button exists in the DOM
     * @param {Field} item The item field
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the reorder arrow down button exists, false otherwise
     */
    reorderArrowDownButtonExists(item, doc = document) {
        return doc.getElementById(this.getReorderArrowDownButtonId(item)) !== null;
    }



    /**
     * Checks if the reorder arrows container exists in the DOM
     * @param {Field} item The item field
     * @param {Document} doc The document to check in
     * @returns {Boolean} True if the reorder arrows container exists, false otherwise
     */
    reorderArrowsContainerExists(item, doc = document) {
        return doc.getElementById(this.getReorderArrowsContainerId(item)) !== null;
    }



    /**
     * Gets the default field type for new items
     * @returns {Class<Field>} The default field type constructor
     */
    getDefaultFieldType() {
        return this.allowedItemFieldClasses.length > 0 ? this.allowedItemFieldClasses[0] : TextField;
    }



    /**
     * Creates the up arrow button element for an item
     * @param {Field} item The item field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created up arrow button element
     */
    createReorderArrowUpButtonElement(item, doc = document) {
        // Check if button already exists
        if (this.reorderArrowUpButtonExists(item, doc)) throw new Error(`Reorder arrow up button with ID "${this.getReorderArrowUpButtonId(item)}" already exists in the document.`);

        let button = doc.createElement('button');

        button.id = this.getReorderArrowUpButtonId(item);
        button.type = 'button';
        button.classList.add('array-field-item-reorder-up-button');
        button.textContent = '↑';

        button.addEventListener('click', () => {
            this.moveItemUp(item, doc);
        });

        return button;
    }



    /**
     * Creates the down arrow button element for an item
     * @param {Field} item The item field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created down arrow button element
     */
    createReorderArrowDownButtonElement(item, doc = document) {
        // Check if button already exists
        if (this.reorderArrowDownButtonExists(item, doc)) throw new Error(`Reorder arrow down button with ID "${this.getReorderArrowDownButtonId(item)}" already exists in the document.`);

        let button = doc.createElement('button');

        button.id = this.getReorderArrowDownButtonId(item);
        button.type = 'button';
        button.classList.add('array-field-item-reorder-down-button');
        button.textContent = '↓';

        button.addEventListener('click', () => {
            this.moveItemDown(item, doc);
        });

        return button;
    }



    /**
     * Creates the reorder arrows container element for an item
     * @param {Field} item The item field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created reorder arrows container element
     */
    createReorderArrowsContainerElement(item, doc = document) {
        // Check if container already exists
        if (this.reorderArrowsContainerExists(item, doc)) throw new Error(`Reorder arrows container with ID "${this.getReorderArrowsContainerId(item)}" already exists in the document.`);

        let container = doc.createElement('div');

        container.id = this.getReorderArrowsContainerId(item);
        container.classList.add('array-field-item-reorder-arrows-container');

        let upButton = this.createReorderArrowUpButtonElement(item, doc);
        let downButton = this.createReorderArrowDownButtonElement(item, doc);

        container.appendChild(upButton);
        container.appendChild(downButton);

        return container;
    }



    /**
     * Creates the field wrapper element
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created field wrapper element
     */
    createWrapperElement(doc = document) {
        // Check if wrapper already exists
        if (this.wrapperExists(doc)) throw new Error(`Wrapper with ID ${this.getWrapperId()} already exists.`);

        let wrapper = doc.createElement('div');

        wrapper.id = this.getWrapperId();
        wrapper.classList.add('array-field-wrapper');

        return wrapper;
    }



    /**
     * Creates the items container element
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created items container element
     */
    createItemsContainerElement(doc = document) {
        // Check if container already exists
        if (this.itemsContainerExists(doc)) throw new Error(`Container with ID ${this.getItemsContainerId()} already exists.`);

        let container = doc.createElement('div');

        container.id = this.getItemsContainerId();
        container.classList.add('array-field-items-container');

        return container;
    }



    /**
     * Creates the item class selector element
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created item class selector element
     */
    createItemClassSelector(doc = document) {
        // Check if selector already exists
        if (doc.getElementById(this.getSelectorId()) !== null) throw new Error(`Item class selector with ID "${this.getSelectorId()}" already exists in the document.`);

        let selector = new SelectField({
            id: this.getSelectorId(),
            name: `${this.name}-item-class-selector`,
            label: 'Select Item Type',
            options: this.getAllowedClassesSelectorOptions(),
            value: this.getDefaultFieldType().name,
            attributes: { required: true }
        });

        let selectorElement = selector.createFieldElement(doc);
        selectorElement.classList.add('array-field-item-class-selector');

        this.selectedItemClass = this.getDefaultFieldType();

        selectorElement.addEventListener('change', (event) => {
            this.selectedItemClass = this.allowedItemFieldClasses.find(cls => cls.name === event.target.value);
        });

        return selectorElement;
    }



    /**
     * Creates the add button element
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created add button element
     */
    createAddButtonElement(doc = document) {
        // Check if button already exists
        if (this.addButtonExists(doc)) throw new Error(`Add button with ID "${this.getAddButtonId()}" already exists in the document.`);

        let button = doc.createElement('button');

        button.id = this.getAddButtonId();
        button.type = 'button';
        button.classList.add('array-field-add-item-button');
        button.textContent = 'Add Item';

        button.addEventListener('click', () => {
            if (!this.selectedItemClass) {
                console.debug("No item class selected.");
                return;
            }

            this.addItem(this.selectedItemClass, this.itemFieldParams);

            // Append the new item to the DOM
            let itemsContainer = this.getItemsContainerFromDOM(doc);

            let newItem = this.items[this.items.length - 1];
            let itemElement = this.createItemElement(newItem, doc);

            itemsContainer.appendChild(itemElement);

            this.validate();

            this.update(doc);
        });

        return button;
    }



    /**
     * Creates the wrapper element for an item
     * @param {Field} item The item field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created wrapper element
     */
    createItemWrapperElement(item, doc = document) {
        let wrapper = doc.createElement('div');

        wrapper.classList.add('array-field-item-wrapper');
        wrapper.id = this.getItemWrapperId(item);

        return wrapper;
    }



    /**
     * Creates the remove button element for an item
     * @param {Field} item The item field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created button element
     */
    createRemoveButtonElement(item, doc = document) {
        let button = doc.createElement('button');

        button.type = 'button';
        button.classList.add('array-field-item-remove-button');
        button.textContent = 'Remove';

        button.addEventListener('click', () => {
            this.removeItem(item);

            // Remove the item from the DOM
            let itemWrapper = this.getItemWrapperFromDOM(item, doc);

            if (itemWrapper) itemWrapper.remove();

            this.validate();

            this.update(doc);
        });

        return button;
    }



    /**
     * Creates the ordinal position element for an item
     * @param {Field} item The item field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created position element
     */
    createPositionIndicatorElement(item, doc = document) {
        let indicator = doc.createElement('span');

        indicator.classList.add('array-field-item-position-indicator');
        indicator.textContent = `Item ${this.items.indexOf(item) + 1}`;

        return indicator;
    }



    /**
     * Creates the controls element for an item
     * @param {Field} item The item field
     * @param {Document} doc The document to create the element in
     * @returns {HTMLElement} The created controls element
     */
    createItemControlsElement(item, doc = document) {
        let controls = doc.createElement('div');
        controls.id = this.getItemControlsContainerId(item);
        controls.classList.add('array-field-item-controls');

        let reorderArrowsContainer = this.createReorderArrowsContainerElement(item, doc);
        let removeButton = this.createRemoveButtonElement(item, doc);
        let positionIndicator = this.createPositionIndicatorElement(item, doc);

        controls.appendChild(reorderArrowsContainer);
        controls.appendChild(positionIndicator);
        controls.appendChild(removeButton);

        return controls;
    }




    createItemElement(item, doc = document) {
        let itemWrapper = this.createItemWrapperElement(item, doc);
        let controlsElement = this.createItemControlsElement(item, doc);
        let itemElement = item.createFieldElement(doc);

        itemWrapper.appendChild(controlsElement);
        itemWrapper.appendChild(itemElement);

        return itemWrapper;
    }



    createInputRegionElement(doc = document) {
        // Check if input region already exists
        if (this.inputRegionElementExists(doc)) throw new Error(`Input region element with ID "${this.getInputRegionId()}" already exists in the document.`);

        let wrapper = this.createWrapperElement(doc);
        let selector = this.createItemClassSelector(doc);
        let addButton = this.createAddButtonElement(doc);
        let itemsContainer = this.createItemsContainerElement(doc);

        for (let item of this.getItems()) {
            let itemElement = this.createItemElement(item, doc);
            itemsContainer.appendChild(itemElement);
        }

        wrapper.appendChild(selector);
        wrapper.appendChild(addButton);
        wrapper.appendChild(itemsContainer);

        return wrapper;
    }



    /**
     * Gets the item wrapper element from the DOM
     * @param {Field} item The item field
     * @param {Document} doc The document to get the element in
     * @returns {HTMLElement} The wrapper element
     */
    getItemWrapperFromDOM(item, doc = document) {
        return doc.getElementById(this.getItemWrapperId(item));
    }



    /**
     * Gets the items container from the DOM
     * @param {Document} doc The document to get the element in
     * @returns {HTMLElement} The container element
     */
    getItemsContainerFromDOM(doc = document) {
        return doc.getElementById(this.getItemsContainerId());
    }



    /**
     * Gets the add button from the DOM
     * @param {Document} doc The document to get the element in
     * @returns {HTMLElement} The button element
     */
    getAddButtonFromDOM(doc = document) {
        return doc.getElementById(this.getAddButtonId());
    }



    /**
     * Updates the field interface in the DOM
     * @param {Document} doc The document to update in
     */
    update(doc = document) {
        this.updateReorderArrows(doc);
        this.updateControls(doc);
    }



    /**
     * Updates the reordering arrows in the DOM
     * @param {Document} doc The document to update in
     */
    updateReorderArrows(doc = document) {
        for (let item of this.getItems()) {
            let upButton = doc.getElementById(this.getReorderArrowUpButtonId(item));
            let downButton = doc.getElementById(this.getReorderArrowDownButtonId(item));

            if (upButton) {
                // Disable up button if item is first
                upButton.disabled = this.getIndexOfItem(item) === 0;
            }
            if (downButton) {
                // Disable down button if item is last
                downButton.disabled = this.getIndexOfItem(item) === this.getItems().length - 1;
            }
        }
    }



    /**
     * Updates the item controls in the DOM
     * @param {Document} doc The document to update in
     */
    updateControls(doc = document) {
        for (let item of this.getItems()) {
            let controlsContainer = doc.getElementById(this.getItemControlsContainerId(item));

            if (controlsContainer) {
                // Update position indicator
                let positionIndicator = controlsContainer.querySelector('.array-field-item-position-indicator');
                if (positionIndicator) {
                    positionIndicator.textContent = `Item ${this.getIndexOfItem(item) + 1}`;
                }
            }
        }

        // Disable add button if max items reached
        let addButton = this.getAddButtonFromDOM(doc);
        if (addButton) {
            addButton.disabled = (this.max !== null) && (this.getItems().length >= this.max);
        }
    }



    /**
     * Moves an item one index up in the items array and updates the DOM
     * @param {Field} item The item to move up
     * @param {Document} doc The document to update in
     */
    moveItemUp(item, doc = document) {
        let index = this.getIndexOfItem(item);

        if (index > 0) {
            // Swap items
            [this.items[index - 1], this.items[index]] = [this.items[index], this.items[index - 1]];

            // Update the DOM
            let itemsContainer = this.getItemsContainerFromDOM(doc);
            let itemWrapper = this.getItemWrapperFromDOM(item, doc);

            if (itemsContainer && itemWrapper) {
                let previousSibling = itemWrapper.previousElementSibling;
                itemsContainer.insertBefore(itemWrapper, previousSibling);
            }

            this.update(doc);
        }
    }



    /**
     * Moves an item one index down in the items array and updates the DOM
     * @param {Field} item The item to move down
     * @param {Document} doc The document to update in
     */
    moveItemDown(item, doc = document) {
        let index = this.getIndexOfItem(item);

        if (index < this.getItems().length - 1) {
            // Swap items
            [this.items[index + 1], this.items[index]] = [this.items[index], this.items[index + 1]];

            // Update the DOM
            let itemsContainer = this.getItemsContainerFromDOM(doc);
            let itemWrapper = this.getItemWrapperFromDOM(item, doc);

            if (itemsContainer && itemWrapper) {
                let nextSibling = itemWrapper.nextElementSibling.nextElementSibling;
                itemsContainer.insertBefore(itemWrapper, nextSibling);
            }

            this.update(doc);
        }
    }
}