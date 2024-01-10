import Stats from 'statsjs';
import {
    audioContainer,
    spineModel
} from './lib/modelClass/index.js';

import uploadHandler from "./lib/uploadProcess/uploadHandler.js";
import spRenderHandle from './engines/spine/spRenderHandle.js';
import { notiHandler } from './lib/notiHandler.js';
await new Promise(r => window.onload = () => r(1));

class Renderer {
    constructor(orgernizedObj) {
        this.containers = ['player-container', 'background-container'].map(e => document.querySelector(`#${e}`));
        this.model = null;
        this.render = null;
        this.models = [];
        this.audios = [];
        this.backs = [];
        this.lightConfigs = orgernizedObj.lightConfig ?? null;
        this.soundPlayer = null;
        this.notiHandler = new notiHandler('.sysNotify');
        Object.values(orgernizedObj.chr).map(c => {
            switch (true) {
                case c instanceof audioContainer:
                    this.audios.push(c);
                    break;
                default:
                    this.models.push(c);
                    break;
            }
        });
        this.backs = Object.values(orgernizedObj.back);
        document.forms[1].classList.add('hide');

        this.containers.forEach(e => e.classList.toggle('hide'));
        this.stats = new Stats();
        this.stats.dom.className = "statsjs-container";
        document.body.appendChild(this.stats.dom);

    }
    async changeChar(index) {
        this.notiHandler.clear();
        const modelList = Object.entries(this.models);
        //console.log(modelList.length);
        const [name, data] = modelList[index];  // Assuming 'd' is a globally accessible array
        //console.log(`chosen ${name} at ${index}`);
        this.model = data;
        if (this.model instanceof spineModel) await spRenderHandle.bind(this)();
    }
}

// Usage:
// await uploadHandler(document.forms[0])
window.APP = new Renderer(await uploadHandler(document.forms[0]));
await APP.changeChar(0);