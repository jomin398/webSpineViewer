import Sortable from 'sortablejs';
export default function reset(data) {
    const form = document.forms[1];
    const [files, chrs, bgis] = [form.querySelector('.files'), form.querySelector('.chrs'), form.querySelector('.bgis')];
    let count = form.querySelector('input[type=number]');
    if (!count) count = (() => {
        let i = document.createElement('input');
        i.name = 'count';
        i.id = 'count';
        i.type = 'number';
        i.value = 0;
        files.insertAdjacentElement('afterend', i);
        return i;
    })();
    chrs.innerHTML = "";
    bgis.innerHTML = "";
    files.append(...data.map((e, i) => {
        const el = document.createElement('li');
        el.className = 'sortItem';
        el.id = i;
        el.innerText = e;
        return el;
    }));

    new Sortable(chrs, {
        group: "name",
        sort: false,
        animation: 150,
        ghostClass: 'sortable-ghost'
    });
    // new Sortable(bgis, {
    //     group: "name",
    //     sort: false,
    //     animation: 150,
    //     ghostClass: 'sortable-ghost'
    // });
    files.addEventListener('change', ev => {
        ev.preventDefault();
        count.value = files.children.length;
    });

    new Sortable(files, {
        group: "name",
        sort: false,
        draggable: ".sortItem",
        animation: 150,
        onRemove: function (ev) {
            ev.preventDefault();
            files.dispatchEvent(new Event('change'));
        },
        ghostClass: 'sortable-ghost'
    });
    files.dispatchEvent(new Event('change'));
};