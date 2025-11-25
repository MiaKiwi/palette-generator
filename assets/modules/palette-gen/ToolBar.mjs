import Palette from "./palette/Palette.mjs";



export default class ToolBar {
    /**
     * Creates a new ToolBar instance
     * @param {Object} params The parameters for the ToolBar
     * @param {Palette} params.palette The palette this toolbar is associated with
     * @param {boolean} params.includeExportToJson Whether to include the Export to JSON button
     * @param {boolean} params.includeExportToCss Whether to include the Export to CSS button
     * @param {boolean} params.includeExportToMiniCss Whether to include the Export to Minified CSS button
     * @param {boolean} params.includeSaveToLocal Whether to include the Save to Local Storage button
     * @param {boolean} params.includeLoadFromLocal Whether to include the Load from Local Storage button
     * @param {boolean} params.includeImportFromJson Whether to include the Import from JSON button
     * @param {boolean} params.includeCopyCssToClipboard Whether to include the Copy CSS to Clipboard button
     * @param {boolean} params.includeCopyMiniCssToClipboard Whether to include the Copy Minified CSS to Clipboard button
     * @param {boolean} params.includeCopyJsonToClipboard Whether to include the Copy JSON to Clipboard button
     * 
     */
    constructor({
        palette,
        includeExportToJson = true,
        includeExportToCss = true,
        includeExportToMiniCss = true,
        includeSaveToLocal = true,
        includeLoadFromLocal = true,
        includeImportFromJson = true,
        includeCopyCssToClipboard = true,
        includeCopyMiniCssToClipboard = true,
        includeCopyJsonToClipboard = true
    } = {}) {
        this.palette = palette;
        this.includeExportToJson = includeExportToJson;
        this.includeExportToCss = includeExportToCss;
        this.includeExportToMiniCss = includeExportToMiniCss;
        this.includeSaveToLocal = includeSaveToLocal;
        this.includeLoadFromLocal = includeLoadFromLocal;
        this.includeImportFromJson = includeImportFromJson;
        this.includeCopyCssToClipboard = includeCopyCssToClipboard;
        this.includeCopyMiniCssToClipboard = includeCopyMiniCssToClipboard;
        this.includeCopyJsonToClipboard = includeCopyJsonToClipboard;
    }



    _createExportToJsonButton() {
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('toolbar-btn');
        button.textContent = 'To JSON';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Downlaod palette as JSON file
            let data = this.palette.toObject();
            let json = JSON.stringify(data, null, 4);

            let blob = new Blob([json], { type: 'application/json' });
            let url = URL.createObjectURL(blob);

            let a = document.createElement('a');
            a.href = url;
            a.download = `${this.palette.name}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        return button;
    }



    _createExportToCssButton() {
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('toolbar-btn');
        button.textContent = 'To CSS';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Download palette as CSS file
            let css = this.palette.css();

            let blob = new Blob([css], { type: 'text/css' });
            let url = URL.createObjectURL(blob);

            let a = document.createElement('a');
            a.href = url;
            a.download = `${this.palette.name}.css`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        return button;
    }



    _createSaveToLocalButton() {
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('toolbar-btn');
        button.textContent = 'Save to Local';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.palette.saveToLocalStorage();
        });

        return button;
    }



    _createExportToMiniCssButton() {
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('toolbar-btn');
        button.textContent = 'To Minified CSS';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Download palette as minified CSS file
            let css = this.palette.minifyCss();

            let blob = new Blob([css], { type: 'text/css' });
            let url = URL.createObjectURL(blob);

            let a = document.createElement('a');
            a.href = url;
            a.download = `${this.palette.name}.min.css`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        return button;
    }



    _createCopyCssToClipboardButton() {
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('toolbar-btn');
        button.textContent = 'Copy CSS';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Copy palette CSS to clipboard
            let css = this.palette.css();
            navigator.clipboard.writeText(css).then(() => {
                console.log('CSS copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy CSS: ', err);
            });
        });

        return button;
    }



    _createCopyMiniCssToClipboardButton() {
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('toolbar-btn');
        button.textContent = 'Copy Minified CSS';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Copy palette minified CSS to clipboard
            let css = this.palette.minifyCss();
            navigator.clipboard.writeText(css).then(() => {
                console.log('Minified CSS copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy Minified CSS: ', err);
            });
        });

        return button;
    }



    _createCopyJsonToClipboardButton() {
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('toolbar-btn');
        button.textContent = 'Copy JSON';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Copy palette JSON to clipboard
            let data = this.palette.toObject();
            let json = JSON.stringify(data, null, 4);

            navigator.clipboard.writeText(json).then(() => {
                console.log('JSON copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy JSON: ', err);
            });
        });

        return button;
    }



    createToolBarElement() {
        let toolbar = document.createElement('div');
        toolbar.classList.add('toolbar');

        if (this.includeExportToJson) toolbar.appendChild(this._createExportToJsonButton())
        if (this.includeExportToCss) toolbar.appendChild(this._createExportToCssButton())
        if (this.includeExportToMiniCss) toolbar.appendChild(this._createExportToMiniCssButton())
        if (this.includeSaveToLocal) toolbar.appendChild(this._createSaveToLocalButton())
        // if (this.includeLoadFromLocal) toolbar.appendChild(this._createLoadFromLocalButton())
        // if (this.includeImportFromJson) toolbar.appendChild(this._createImportFromJsonButton())
        if (this.includeCopyCssToClipboard) toolbar.appendChild(this._createCopyCssToClipboardButton())
        if (this.includeCopyMiniCssToClipboard) toolbar.appendChild(this._createCopyMiniCssToClipboardButton())
        if (this.includeCopyJsonToClipboard) toolbar.appendChild(this._createCopyJsonToClipboardButton())

        return toolbar;
    }
}