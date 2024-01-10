import { findKeyInObject } from '../utils.js';
import readFileAsync from '../uploadProcess/readFileAsync.js';

// let zip = new JSZip();
// let blob = await (await fetch(modelPath)).blob();
// zip = await zip.loadAsync(blob);
////console.log(zip)
//const res = { rawDataURIs: {}, alpha: true, preserveDrawingBuffer: true };
import ini from 'https://cdn.jsdelivr.net/npm/ini@4.1.1/+esm';
export default class spineModel {
    constructor(name, zipfiles) {
        this.name = name;
        this.rawDataURIs = {};
        this.alpha = true;
        this.preserveDrawingBuffer = true;
        this.atlasUrl = null;
        this.skelUrl = null;
        this.audios = null;
        this.version = 4;
        this.loop = false;
        this.zipFiles = zipfiles;
        this.iniConfig = null;
        this.mipmaps = false;
        this.backgroundColor = "#00000000";
    }
    async loadCheack(fileList) {
        const textureList = this.textures;
        //console.log(textureList)
        if (!textureList) return;
        let inifile = null;
        inifile = this.zipFiles ? findKeyInObject(this.zipFiles, this.name + '.ini') : fileList.find(s => s.name.includes(this.name + '.ini'));
        inifile ??= this.zipFiles ? findKeyInObject(this.zipFiles, 'ini') : fileList.find(s => s.name.includes('ini'));
        this.iniConfig = await (async (f) => {
            if (!f) return;
            let isFromZip = f.async != null;
            const d = isFromZip ? await f.async('text') : await readFileAsync(f, 'text');
            return ini.parse(d);
        })(inifile);
        //console.log(this.zipFiles,fileList)
        await Promise.all(textureList.map(async e => {
            if (!this.rawDataURIs[e]) {
                //console.warn('No texture found');
                const f = this.zipFiles ? findKeyInObject(this.zipFiles, e) : fileList.find(s => s.name.includes(e));
                //console.log(this.zipFiles,e)
                
                let isFromZip = f.async != null;
                this.rawDataURIs[e] = isFromZip ? `data:image/png;base64,${await f.async('base64')}` : await readFileAsync(f, 'base64');
            };
        }));
    }
}
