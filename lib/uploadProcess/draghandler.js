export default class DragHandler {
    constructor(fileQuery, previewQuery, continerQuery, options) {
        this.inputFile = document.querySelector(fileQuery);
        this.#preview = document.querySelector(previewQuery);
        this.continer = document.querySelector(continerQuery);
        this.continer.addEventListener('drop', (evt) => this.draghandler(evt));
        if (options && options.dragover) this.continer.addEventListener('dragover', (evt) => options.dragover.call(this.continer, evt));
        this.inputFile.onchange = ev => this.draghandler(ev);

        if (options && options.dragleave) this.continer.addEventListener('dragleave', (evt) => options.dragleave.call(this.continer));
        this.dataTransfer = new DataTransfer();
        //this.continer.addEventListener('dragenter', (evt) =>//console.log('dragenter',evt.target));

    }
    #preview = null;
    /* 박스 안에서 Drag를 Drop했을 때 */

    draghandler(evt) {
        evt.preventDefault();
        //console.log('drop');
        evt.target.style.removeProperty('background-color');
        const files = evt.dataTransfer ? evt.dataTransfer.files : evt.target.files; // FileList object.

        // Add the dropped files to the existing file list
        for (let i = 0, f; f = files[i]; i++) {
            this.dataTransfer.items.add(f);
            const lstItm = document.createElement('p');
            lstItm.id = f.lastModified;
            lstItm.dataset.index = f.lastModified;
            const btn = document.createElement('button');
            btn.innerText = "X";

            //click the delete button.
            btn.addEventListener('click', (ev) => this.deleteItem(ev));

            const fileNameSpan = document.createElement('span');
            fileNameSpan.innerText = f.name;

            const fileSizeSpan = document.createElement('span');
            let Unit = 'KB';

            let fileSize = f.size / 1024; // convert to KB
            if (!fileSize < 1000) { fileSize /= 1024; Unit = 'MB'; };

            fileSizeSpan.innerText = `(${fileSize.toFixed(2)} ${Unit})`;
            lstItm.append(fileNameSpan, fileSizeSpan, btn);
            this.#preview.appendChild(lstItm);
        }

        this.inputFile.files = this.dataTransfer.files;
    }

    deleteItem(ev) {
        ev.preventDefault();
        //enable the delete for finding.
        ev.target.parentElement.classList.toggle('remove');
        //delete methods here.
        const removeTargetId = ev.target.parentElement.dataset.index;
        const removeTarget = document.getElementById(removeTargetId);

        let newItems = new DataTransfer();

        Array.from(this.dataTransfer.files).filter(file => file.lastModified != removeTargetId).forEach(file => {
            newItems.items.add(file);
        });

        this.dataTransfer = newItems;

        this.inputFile.files = this.dataTransfer.files;

        removeTarget.remove();
    }
}