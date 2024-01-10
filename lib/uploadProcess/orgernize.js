import JSZip from 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm';
import Classify from './Classify.js';
import { audioContainer, spineModel, bgiContainer } from '../modelClass/index.js';
import ini from 'https://cdn.jsdelivr.net/npm/ini@latest/+esm';
const detectAudio = key => ['ogg', 'wav', 'mp3', 'm4a'].some(ext => key.includes(ext));
const detectSpine = str => {
    //console.log(str)
    return ['json', 'skel', 'atlas'].some(ext => str.includes(ext))
};
/** 
 * @param {Object[]} chrs characters
 * @param {number[]?} defPos center node. x,y,z
 * @param {number?} distance a distance to spread from each character.
*/
function chrPositioning(chrs, defPos = [0, 0, 0], distance = 10) {
    //console.log(chrs.length)
    const [posX, posY, posZ] = [defPos[0], defPos[1], defPos[2]];
    if (chrs.length === 2) {
        chrs[0].pos = [posX - distance, posY, posZ];
        chrs[1].pos = [posX + distance, posY, posZ];
    } else if (chrs.length === 3) {
        chrs[0].pos = defPos;
        chrs[1].pos = [posX - distance, posY, posZ];
        chrs[2].pos = [posX + distance, posY, posZ];
    } else if (chrs.length === 4) {
        chrs[0].pos = [posX - distance * 2.5, posY, posZ];
        chrs[1].pos = [posX - distance, posY, posZ];
        chrs[2].pos = [posX + distance, posY, posZ];
        chrs[3].pos = [posX + distance * 2.5, posY, posZ];
    } else if (chrs.length === 5) {
        chrs[0].pos = [posX - distance * 3, posY, posZ];
        chrs[1].pos = [posX - distance * 2, posY, posZ];
        chrs[2].pos = defPos;
        chrs[3].pos = [posX + distance * 2, posY, posZ];
        chrs[4].pos = [posX + distance * 3, posY, posZ];
    } else if (chrs.length === 6) {
        chrs[0].pos = [posX - distance * 3.5, posY, posZ];
        chrs[1].pos = [posX - distance * 2.5, posY, posZ];
        chrs[2].pos = [posX - distance, posY, posZ];
        chrs[3].pos = [posX + distance, posY, posZ];
        chrs[4].pos = [posX + distance * 2.5, posY, posZ];
        chrs[5].pos = [posX + distance * 3.5, posY, posZ];
    } else if (chrs.length > 6) {
        for (let i = 0; i < chrs.length; i++) {
            chrs[i].pos = defPos;
        }
    }
    return chrs;
}

async function iniProc(file) {
    const fileTextReader = async (f) => new Promise(r => {
        const fr = new FileReader();
        fr.readAsText(f)
        fr.onload = () => r(fr.result);
    });
    const getLastFileInfo = (str) => {
        let name = str.includes("/") ? str.split("/").pop() : str;
        let ext = null;
        let lastIndex = name.lastIndexOf(".");
        if (lastIndex !== -1) {
            ext = name.slice(lastIndex);
            name = name.slice(0, lastIndex);
        }
        return { name, ext };
    };
    const config = ini.parse(await fileTextReader(file));


    let b = [];
    let c = [];
    let chrs = Object.keys(config).filter(e => /chr_\d/i.test(e))
        .map(key => config[key]);

    // chrs.map(chr => {
    //     if (chr.model) {
    //         let { name } = getLastFileInfo(chr.model);
    //         let m = new mmdModel(name);
    //         m.chrFile = { u: chr.model };
    //         if (chr.motion) m.modelMotion = chr.motion;
    //         c.push(m)
    //     }
    // })

    /*
    let stgs = Object.keys(config).filter(e => /stg_\d/i.test(e))
        .map(key => config[key]);

    if (stgs.length == 0 && config.stage) {

        let { name } = getLastFileInfo(config.stage.model);
        let m = new mmdModel(name);

        const stagePos = config.stage.pos ? config.stage.pos.split(",").map(Number) : [0, 0, 0];
        const stageRot = config.stage.rot ? config.stage.rot.split(",").map(Number) : [0, 0, 0];
        m.chrFile = { u: config.stage.model, pos: stagePos, rot: stageRot };

        if (config.stage.motion) m.modelMotion = config.stage.motion;


        // if (c && c[0] && c[0] instanceof mmdModel) {
        //     c[0].stagefile = m.chrFile;
        // } else {
        //     b.push(m);
        // }

        stgs.push(m)
    } else if (stgs.length != 0) {
        stgs = stgs.map(o => {
            let { name } = getLastFileInfo(o.model);
            let m = new mmdModel(name);

            const stagePos = o.pos ? o.pos.split(",").map(Number) : [0, 0, 0];
            const stageRot = o.rot ? o.rot.split(",").map(Number) : [0, 0, 0];
            m.chrFile = { u: o, pos: stagePos, rot: stageRot };

            if (o.motion) m.modelMotion = o.motion;
            return o;
        })
    };
    */
    b = b.concat(stgs)
    if (config.audio) {
        //let { name: audioFn, ext } = getLastFileInfo(config.audio);
        b.push(a);
    }

    // if (config.camera && c && c[0] && c[0] instanceof mmdModel) {
    //     c[0].cameraMotion = config.camera;
    // }
    ////console.log( c)
    let result = [];
    let lightOpt = null;
    if (c.length >= 1) {
        c[0].chrFile = c.map(charObj => charObj.chrFile);
        c[0].motions = c.map(charObj => charObj.modelMotion);
        c[0].name = c.map(charObj => charObj.name);
        c.splice(1);
    }

    if (config.autoPosition === '1' || config.autoPosition === null) {
        c[0].chrFile = chrPositioning(c[0].chrFile);
    } else if (config.autoPosition === '0') {
        chrs.map((chr, i) => {
            let posArray = chr.pos ? chr.pos.split(",").map(Number) : [0, 0, 0];
            c[0].chrFile[i].pos = posArray;
        });
    }
    //chrs

    c.forEach(charObj => {
        if (charObj.chrFile !== null)
            result.push(charObj);

    })
    if (config.audioOffset) {
        result[0].audioOffset = parseInt(config.audioOffset) / 1000 ?? 0;
    }
    if (config.light) {
        //console.log(config.light)
        lightOpt = {};
        if (config.light.dpos || config.light.dint) lightOpt.directionalLight = {};
        if (config.light.dpos) lightOpt.directionalLight.pos = config.light.dpos.split(",").map(Number);
        if (config.light.dint) {
            lightOpt.directionalLight.intensity = parseFloat(config.light.dint)
            //console.log(lightOpt.directionalLight.intensity)
        };
        if (config.light.drad) lightOpt.directionalLight.radius = parseFloat(config.light.drad);
        if (config.light.dfar) lightOpt.directionalLight.far = parseFloat(config.light.dfar);
        if (config.light.dquality) lightOpt.directionalLight.quality = parseFloat(config.light.dquality);

        if (config.light.aint || config.light.acolor) lightOpt.ambientLight = {};
        if (config.light.aint) lightOpt.ambientLight.intensity = parseFloat(config.light.aint);
        if (config.light.acolor) lightOpt.ambientLight.color = config.light.acolor;

    }
    return [result, b, lightOpt];
}
//orgernize Data
export async function orgernize(d) {
    //console.log('Upload successful');
    const { chrs, back } = d;
    // const loadList = chrs.concat(back);
    let bgs = [];
    const colect = async (obj, isBackGround) => {
        if (!obj) return;
        let c = {};
        const detectSpineFiles = files => Object.entries(files).some(([key]) => detectSpine(key));
        const fListHandler = async (file, zip, colect) => {
            let isSpine = false; // Spine
            let isAudio = false;
            let iszip = zip && zip.files != null;
            let files = zip?.files ?? { [file.name]: file };
            let hasspine = detectSpineFiles(iszip ? files : (o => Array.from(o).reduce((obj, file) => {
                obj[file.name] = file;
                return obj;
            }, {}))(obj));
            //console.log(hasspine)
            Object.entries(files).map(([key]) => {
                if (detectSpine(key)) {
                    isSpine = true;
                }
                if (detectAudio(key)) isAudio = true;
            });
            //process
            if (!isBackGround) {
                if (hasspine && isSpine) await new Classify().spine(files, colect);
                if (isAudio) await new Classify().audio(files, zip, file.name, colect);
            } else {
                if (hasspine) {
                    await new Classify().spine(files, colect)
                } else if (isAudio) {
                    await new Classify().audio(files, zip, file.name, colect)
                } else await new Classify().bgis(files, zip, file.name, colect);
            }
        };
        await Promise.all(obj.map(async (file) => {
            if (!file) return;
            let iszip = file.type.includes('zip');
            let zip = null;
            if (iszip) zip = await new JSZip().loadAsync(file);
            await fListHandler(file, zip, c);
        }));
        await Promise.all(Object.values(c).map(async (cls) => {
            // //console.log(cls);
            if (cls instanceof spineModel) await cls.loadCheack(!isBackGround ? chrs : back);
            if (cls instanceof bgiContainer) return;
            if (cls instanceof audioContainer) return;
        }));
        return c;
    };

    let c = null, b = null, lightConfig = null;
    // chrs에서 req.ini 파일이 있는지 확인
    const iniFile = Array.from(chrs).find(file => file.name.endsWith('.ini'));
    if (iniFile) {
        [c, b, lightConfig] = await iniProc(iniFile);
        return { chr: c, back: b, lightConfig: lightConfig };
    } else {
        [c, b] = await Promise.all([colect(chrs), colect(back, true)]);
        let result = [];
        for (let [key, data] of Object.entries(c)) {
            if (data instanceof bgiContainer) {
                b = Object.assign({}, b, { [key]: data });
                delete c[key];
            }
        }
        result = c;

        return { chr: result, back: b, lightConfig: lightConfig };
    };
}