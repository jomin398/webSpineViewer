export default function uploadValidator(f, callBack) {
    let count = f.querySelector('input[type=number]');

    //console.log(count.value);
    let valid = count.value == 0;
    const [files, chrs, bgis] = [document.forms[0].querySelector('input[type="file"]').files, Array.from(f.querySelector('.chrs').children), Array.from(f.querySelector('.bgis').children)];

    ////console.log(count, count.value, valid);
    if (!valid) {
        count.setCustomValidity(`"files" area is must be empted.`);
        count.reportValidity();
        setTimeout(() => {
            count.setCustomValidity("");
        }, 2000);
    }
    if (valid) callBack({ chrs: chrs.map(e => files[e.id]), back: bgis.map(e => files[e.id]) });
};