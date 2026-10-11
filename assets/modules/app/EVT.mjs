export default class EVT {
    static DELETE_VARIANT = 'pg-variant-delete';
    static DELETE_COLOR = 'pg-color-delete';
    static DELETE_THEME = 'pg-theme-delete';

    static UPDATE_VARIANT = 'pg-variant-update';
    static UPDATE_COLOR = 'pg-color-update';
    static UPDATE_THEME = 'pg-theme-update';
    static UPDATE_PALETTE = 'pg-palette-update';

    static CREATE_VARIANT = 'pg-variant-create';
    static CREATE_COLOR = 'pg-color-create';
    static CREATE_THEME = 'pg-theme-create';
    static CREATE_PALETTE = 'pg-palette-create';

    static get list() {
        return Object.fromEntries(Object.entries(this));
    }

    static dispatch(type, target, options) {
        options = {
            bubbles: true,
            cancelable: true,
            ...options
        }

        let event = new CustomEvent(type, options);

        target.dispatchEvent(event);
    }
}