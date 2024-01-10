import SpPopup from "./SpPopup.js";
import bgiContainer from "../../lib/modelClass/bgiContainer.js";
import initializer from "./initializer.js";
import spineModel from "../../lib/modelClass/spineModel.js";

function makePopup(...args) {
    const container = document.createElement("div");
    container.className = 'spine-player-popup';
    const header = document.createElement("div");
    header.className = 'spine-player-popup-title';
    header.textContent = args[0];
    let contentBlock = null;
    if (args[1] == 'list') {
        contentBlock = document.createElement('ul');
        contentBlock.className = 'spine-player-list';

        args[2].map(title => {
            let li = document.createElement('li');
            li.className = `spine-player-list-item selectable`;

            if (title == args[3]) li.classList.add('selected');
            li.innerHTML = `<div class="selectable-circle"></div>
            <div class="selectable-text">${title}</div>`;
            // li.onclick = ev => handler ? handler(ev) : //console.log(li);
            contentBlock.appendChild(li);
        });
    }
    container.append(header, document.createElement('hr'), contentBlock);
    return container;
}

function addTools(handler) {
    const butL = document.querySelector('.spine-player-buttons');
    const spacer = butL.querySelector('.spine-player-button-spacer');
    const render = handler.render[0];
    //remove default logo.
    butL.querySelector('.spine-player-button-icon-spine-logo').remove();
    //togglable PMA Feature.
    spacer.insertAdjacentHTML('afterend', `<button class="spine-player-button spine-player-button-icon-pma" title="toggle PMA">A</button>`);
    document.querySelector('.spine-player-button-icon-pma').addEventListener('click', ev => {
        ev.preventDefault();
        render.togglePMA();
    })

    //Changlable Character Dress.
    spacer.insertAdjacentHTML('afterend', `<button class="spine-player-button spine-player-button-icon-feature" title="another dress"></button>`);

    document.querySelector('.spine-player-button-icon-feature').addEventListener('click', ev => {
        ev.preventDefault();
        const featureButton = document.querySelector('.spine-player-button-icon-feature');
        handler
        let featurePopup = new SpPopup(
            'feature',
            featureButton,
            render,
            render.playerControls,
            /*html*/
            makePopup('select character', 'list', handler.models.map((model) => model.name), handler.model.name).innerHTML
        );
        //popup.addClickListener()
        Array.from(featurePopup.dom.querySelector('.spine-player-list').children).map((e, i) => e.onclick = () => handler.changeChar(i));

        featurePopup.show();
    });


    const sp = render.config?.soundPlayer;
    if (sp) {
        //console.log(render.config.soundPlayer);
        spacer.insertAdjacentHTML('afterend', `<button class="spine-player-button spine-player-button-icon-voices" title="cv voices"><span class="material-symbols-outlined">
        voice_chat
        </span></button>`);

    }
}

function disposeSubRender(render) {
    if (render.stopRendering) render.stopRendering();
    if (render.dispose) render.dispose();
}

async function spRenderHandle() {
    // Dispose existing Spinelayer instance and clear player container
    if (this.render) {
        this.render.forEach(e => {
            disposeSubRender(e);
            e.config.container.innerHTML = "";
        })
        this.render = null;
    };
    const renderList = [this.model];
    if (this.backs && this.backs.length != 0) {
        if (this.backs[0] instanceof spineModel) {
            renderList.push(this.backs[0]);
        } else if (this.backs[0] instanceof bgiContainer) {
            let files = this.backs[0].files;
            let f = Array.isArray(files)?files[0]:Object.values(files)[0];
            let isFromZip = f.async != null;
            const u = URL.createObjectURL(isFromZip?await f.async('blob'):f);
            Object.assign(this.model, {
                backgroundImage: { // Display a background image behind the skeleton
                    url: u,
                    x: 0,
                    y: 0,
                }
            })
        }
    }
    this.soundHandlers = [];
    this.render = await Promise.all(renderList.map((e, i) => initializer.call(this, e, i == 0, this.containers, this.notiHandler, this.audios).then(m => {
        this.soundHandlers.push(m.soundPlayer);
        return m.render
    })));
    addTools(this);
}

export default spRenderHandle;