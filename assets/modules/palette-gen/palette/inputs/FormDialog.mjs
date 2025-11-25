export default class FormDialog {
    constructor(form, title = 'Form Dialog') {
        this.form = form;
        this.title = title;
    }


    show(container = document.body) {
        // Create dialog elements
        let dialogWrapper = document.createElement('dialog');
        dialogWrapper.classList.add('dialog-wrapper');

        let dialog = document.createElement('div');
        dialog.classList.add('dialog');

        let dialogTitle = document.createElement('h2');
        dialogTitle.textContent = this.title;
        dialog.appendChild(dialogTitle);

        let formElement = this.form.formElement;
        formElement.classList.add('dialog-form');
        dialog.appendChild(formElement);

        formElement.addEventListener('close-dialog', () => {
            dialogWrapper.close();
            dialogWrapper.remove();
        });

        let closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.classList.add('dialog-close-btn');

        closeButton.addEventListener('click', () => {
            dialogWrapper.close();
            dialogWrapper.remove();
        });

        dialog.appendChild(closeButton);
        dialogWrapper.appendChild(dialog);
        container.appendChild(dialogWrapper);

        dialogWrapper.showModal();
    }
}