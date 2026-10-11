export default class CTX {
    static palette = null;
    static ui = null;
    static options = {
        synchChangesToOtherThemes: true,
        preferredColorOutputFormat: 'hsla'
    }

    static json(pretty = false) {
        let spaces = pretty ? 4 : 0;

        return JSON.stringify(this.palette?.toObject(), null, spaces);
    }

    static css() {
        return this.palette.css();
    }

    static minCSS() {
        return this.palette.minifyCss();
    }
}