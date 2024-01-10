import uploadValidator from './uploadValidator.js';
import reset from './reset.js';

export function appendUserSort(f) {
    const nextForm = document.forms[1];
    const arr = Array.from(f.querySelector('input[type="file"]').files).map(file => file.name);
    const rst = nextForm.querySelector('button[type=reset]');
    f.classList.toggle('hide');
    nextForm.classList.toggle('hide');
    rst.onclick = () => reset(arr);
    rst.dispatchEvent(new Event('click'));
    return new Promise(resolve => {
        window.FormAct = () => { uploadValidator(nextForm, resolve); };
        nextForm.action = 'javascript:FormAct()';
    });
}
