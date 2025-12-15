import Palette from "./palette/Palette.mjs";



export default class ToolBar {
    /**
     * Creates a toolbar option button
     * @param {string} labelText The label text for the option
     * @param {Function} onClick The click event handler for the option
     * @returns {HTMLButtonElement} The created button element
     */
    static _createOption(labelText, onClick) {
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('toolbar-btn');

        let label = document.createElement('span');
        label.classList.add('toolbar-option-label');
        label.textContent = labelText;
        button.appendChild(label);

        button.addEventListener('click', onClick);

        return button;
    }



    static _createToCssOption(palette) {
        let onClick = (e) => {
            e.preventDefault();

            // Create a dialog to show export options
            let wrapper = document.createElement('dialog');
            wrapper.classList.add('dialog-wrapper');

            let dialog = document.createElement('div');
            dialog.classList.add('dialog');

            let title = document.createElement('h2');
            title.textContent = 'Export Palette to CSS';
            dialog.appendChild(title);

            let cssOutputPre = document.createElement('pre');
            let cssOutputCode = document.createElement('code');
            cssOutputCode.dataset.minified = 'true';
            cssOutputPre.appendChild(cssOutputCode);
            cssOutputCode.textContent = palette.minifyCss();
            dialog.appendChild(cssOutputPre);

            let minifyToggle = document.createElement('button');
            minifyToggle.type = 'button';
            minifyToggle.textContent = 'Toggle Minified/Formatted';
            minifyToggle.classList.add('btn');
            minifyToggle.addEventListener('click', () => {
                if (cssOutputCode.dataset.minified === 'true') {
                    cssOutputCode.textContent = palette.css();
                    cssOutputCode.dataset.minified = 'false';
                } else {
                    cssOutputCode.textContent = palette.minifyCss();
                    cssOutputCode.dataset.minified = 'true';
                }
            });
            dialog.appendChild(minifyToggle);

            let copyButton = document.createElement('button');
            copyButton.type = 'button';
            copyButton.textContent = 'Copy to Clipboard';
            copyButton.classList.add('btn');
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(cssOutputCode.textContent);
            });
            dialog.appendChild(copyButton);

            let downloadButton = document.createElement('button');
            downloadButton.type = 'button';
            downloadButton.textContent = 'Download CSS File';
            downloadButton.classList.add('btn');
            downloadButton.addEventListener('click', () => {
                let name = cssOutputCode.dataset.minified === 'true' ? `${palette.name || 'palette'}.min.css` : `${palette.name || 'palette'}.css`;
                let blob = new Blob([cssOutputCode.textContent], { type: 'text/css' });
                let url = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
            dialog.appendChild(downloadButton);

            let closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.textContent = 'Close';
            closeButton.classList.add('dialog-close-btn');
            closeButton.addEventListener('click', () => {
                wrapper.close();
                wrapper.remove();
            });
            dialog.appendChild(closeButton);

            wrapper.appendChild(dialog);
            document.body.appendChild(wrapper);

            wrapper.showModal();
        };

        return this._createOption('Export to CSS', onClick);
    }



    static _createToJsonOption(palette) {
        let onClick = (e) => {
            e.preventDefault();

            // Create a dialog to show export options
            let wrapper = document.createElement('dialog');
            wrapper.classList.add('dialog-wrapper');

            let dialog = document.createElement('div');
            dialog.classList.add('dialog');

            let title = document.createElement('h2');
            title.textContent = 'Export Palette to JSON';
            dialog.appendChild(title);

            let jsonOutputPre = document.createElement('pre');
            let jsonOutputCode = document.createElement('code');
            jsonOutputPre.appendChild(jsonOutputCode);
            jsonOutputCode.textContent = JSON.stringify(palette.toObject(), null, 4);
            dialog.appendChild(jsonOutputPre);

            let copyButton = document.createElement('button');
            copyButton.type = 'button';
            copyButton.textContent = 'Copy to Clipboard';
            copyButton.classList.add('btn');
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(jsonOutputCode.textContent);
            });
            dialog.appendChild(copyButton);

            let downloadButton = document.createElement('button');
            downloadButton.type = 'button';
            downloadButton.textContent = 'Download JSON File';
            downloadButton.classList.add('btn');
            downloadButton.addEventListener('click', () => {
                let name = `${palette.name || 'palette'}.json`;
                let blob = new Blob([jsonOutputCode.textContent], { type: 'application/json' });
                let url = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
            dialog.appendChild(downloadButton);

            let closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.textContent = 'Close';
            closeButton.classList.add('dialog-close-btn');
            closeButton.addEventListener('click', () => {
                wrapper.close();
                wrapper.remove();
            });
            dialog.appendChild(closeButton);

            wrapper.appendChild(dialog);
            document.body.appendChild(wrapper);

            wrapper.showModal();
        };

        return this._createOption('Export to JSON', onClick);
    }



    static _createFromJsonOption(palette) {
        let onClick = (e) => {
            e.preventDefault();

            // Create a dialog to import palette from JSON
            let wrapper = document.createElement('dialog');
            wrapper.classList.add('dialog-wrapper');

            let dialog = document.createElement('div');
            dialog.classList.add('dialog');

            let title = document.createElement('h2');
            title.textContent = 'Import Palette from JSON';
            dialog.appendChild(title);

            let fileInputLabel = document.createElement('label');
            fileInputLabel.textContent = 'Select JSON File: ';
            let fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'application/json';
            fileInputLabel.appendChild(fileInput);
            dialog.appendChild(fileInputLabel);

            let textInputLabel = document.createElement('label');
            textInputLabel.textContent = 'Or Paste JSON Here: ';
            let textInput = document.createElement('textarea');
            textInput.rows = 10;
            textInput.cols = 50;
            textInputLabel.appendChild(textInput);
            dialog.appendChild(textInputLabel);

            let importButton = document.createElement('button');
            importButton.type = 'button';
            importButton.textContent = 'Import Palette';
            importButton.classList.add('btn');

            importButton.addEventListener('click', () => {
                let jsonData = null;

                if (fileInput.files.length > 0) {
                    let file = fileInput.files[0];
                    let reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            jsonData = JSON.parse(event.target.result);
                            let importedPalette = Palette.fromObject(jsonData);

                            // Replace current palette data
                            let oldName = palette.name;
                            palette = importedPalette;
                            palette.updatePaletteCard(true, oldName);
                            alert(`Palette "${palette.name}" imported successfully.`);

                            wrapper.close();
                            wrapper.remove();
                        } catch (err) {
                            alert('Error parsing JSON file: ' + err.message);
                        }
                    };
                    reader.readAsText(file);
                } else if (textInput.value.trim() !== '') {
                    try {
                        jsonData = JSON.parse(textInput.value);
                        let importedPalette = Palette.fromObject(jsonData);
                        // Replace current palette data
                        let oldName = palette.name;
                        palette = importedPalette;
                        palette.updatePaletteCard(true, oldName);
                        alert(`Palette "${palette.name}" imported successfully.`);
                        wrapper.close();
                        wrapper.remove();
                    } catch (err) {
                        alert('Error parsing JSON data: ' + err.message);
                    }
                } else {
                    alert('Please select a JSON file or paste JSON data.');
                }
            });
            dialog.appendChild(importButton);

            let closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.textContent = 'Close';
            closeButton.classList.add('dialog-close-btn');
            closeButton.addEventListener('click', () => {
                wrapper.close();
                wrapper.remove();
            });
            dialog.appendChild(closeButton);

            wrapper.appendChild(dialog);
            document.body.appendChild(wrapper);

            wrapper.showModal();
        };

        return this._createOption('Import from JSON', onClick);
    }



    static _createFromLocalStorageOption(palette) {
        let onClick = (e) => {
            e.preventDefault();

            // Get local storage drafts index
            let draftOptions = [];
            let index = localStorage.getItem(Palette._lsIndexKey());

            if (index) {
                index = JSON.parse(index);

                for (let name of index) {
                    draftOptions.push(name);
                }

                if (draftOptions.length === 0) {
                    alert('No palettes found in local storage.');
                    return;
                }

                // Get the first draft
                let draftData = localStorage.getItem(Palette._lsItemPrefix() + draftOptions[0]);

                if (draftData) {
                    let draftObj = JSON.parse(draftData);
                    let importedPalette = Palette.fromObject(draftObj);

                    // Replace current palette data
                    let oldName = palette.name;
                    palette = importedPalette;
                    palette.updatePaletteCard(true, oldName);
                    alert(`Palette "${palette.name}" imported from local storage.`);
                }
            } else {
                alert('No palettes found in local storage.');
            }
        };

        return this._createOption('Import from Local Storage', onClick);
    }



    /**
     * Creates a toolbar for the given palette
     * @param {Palette} palette 
     * @returns {HTMLDivElement} The created toolbar element
     */
    static create(palette) {
        let toolbar = document.createElement('div');
        toolbar.classList.add('toolbar');

        // --- Export options ---
        // To CSS
        toolbar.appendChild(this._createToCssOption(palette));
        // To JSON
        toolbar.appendChild(this._createToJsonOption(palette));
        // To local storage
        toolbar.appendChild(this._createOption('Export to Local Storage', (e) => {
            e.preventDefault();

            palette.saveToLocalStorage();
            alert(`Palette "${palette.name}" saved to local storage.`);
        }));

        // --- Import options ---
        // From JSON
        toolbar.appendChild(this._createFromJsonOption(palette));
        // From local storage
        toolbar.appendChild(this._createFromLocalStorageOption(palette));

        return toolbar;
    }
}