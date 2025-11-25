import { Field } from "../fields/Field.mjs";
import { Option } from "../options/Option.mjs";

export class Caster {
    /**
     * Casts a value to a specific type
     * @param {*} value The value to cast
     * @param {*} toType The type to cast the value to
     * @returns {*} The casted value
     */
    static cast(value, toType) {
        switch (toType) {
            case Boolean:
                return Boolean(value);

            case Number:
                return Number(value);

            case Date:
                return new Date(value);

            case FileList:
                return value.length > 0 ? value : null;

            case File:
                return value.length > 0 ? value[0] : null;

            case Option:
                return value instanceof Option ? value : null;

            case URL:
                try {
                    return new URL(value);
                } catch {
                    return null;
                }

            case "Option[]":
                return (Array.isArray(value) && value.every(v => v instanceof Option)) ? value : [];

            case "Field[]":
                return (Array.isArray(value) && value.every(v => v instanceof Field)) ? value : [];

            case "Object<String, FieldValue>":
                if (value !== null && Array.isArray(value) && value.every(v => v instanceof Field)) {
                    let obj = {};
                    value.forEach(field => {
                        obj[field.name] = field.getTypedValue();
                    });
                    return obj;
                } else {
                    return {};
                }


            case String:
            default:
                return String(value);
        }
    }
}