import formAwaiter from "./formAwaiter.js";
import { appendUserSort } from './appendUserSort.js';
import { orgernize } from './orgernize.js';
import DragHandler from "./draghandler.js";
export default async function uploadHandler(form) {

    new DragHandler('input[type="file"]', '#preview', '.upload-box', {
        dragover: function (e) {
            e.preventDefault();
            //console.log('dragover');
            this.style.backgroundColor = 'green';
        },
        dragleave: function () {
            //console.log('dragleave');
            this.style.removeProperty('background-color');
        }
    });


    return formAwaiter(form)
        .then(appendUserSort)
        .then(orgernize);
}