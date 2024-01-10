import { checkFromZip, findKeyInObject, pickRendomFromArr } from './utils.js';

export class soundPlayer {
    constructor(iniConfig, audios, index = 0, bgmId = "bgm", cvId = "cv") {
        //console.log('soundPlayer initialized');
        /** @type {HTMLAudioElement?} */
        this.bgmAudioElem = document.querySelector(`#${bgmId}`);
        if (this.bgmAudioElem) this.bgmAudioElem.loop = true;
        /** @type {HTMLAudioElement?} */
        this.cvAudioElem = document.querySelector(`#${cvId}`);
        this.iniConfig = iniConfig;
        this.audios = audios ? audios[index].audios : null;
        this.modelName = null;
        this.notiHandle = null;
        this.playList = null;
        this.initVoices = null;
        this.bgmPath = null;
    }
    get modelConfig() {
        return this.iniConfig.scene[this.modelName];
    }

    init() {
        if (!this.iniConfig) throw new Error('no iniConfig');

        if (this.iniConfig && this.iniConfig.voiceconfig) {
            this.initVoices = this.iniConfig.voiceconfig.welcome;
        };
        if (this.modelConfig.playList) {
            let arr = Array.isArray(this.modelConfig.playList) ? this.modelConfig.playList : [this.modelConfig.playList];
            let d = Object.values(this.audios).filter(audio =>
                arr.some(query => audio.name.includes(query))
            );
            this.playList = d.map(f => f.name);
        }

        if (this.iniConfig && this.iniConfig.voiceconfig && this.iniConfig.voiceconfig.bgm) {
            let audioName = 'BGM';
            if (Array.isArray(this.iniConfig.voiceconfig.bgm)) {
                audioName = this.iniConfig.voiceconfig.bgm[this.modelConfig.bgm ?? 0];
            } else { audioName = this.iniConfig.voiceconfig.bgm; };
            this.bgmPath = audioName;
        }
    }
    /**
     * @generator
     * @param {String} audioname
     * @param {boolean?} isBgm
     * @returns {HTMLSpanElement} noti Log element as span.
     */
    #audioNoti(audioname, isBgm) {
        let message;
        if (isBgm) {
            message = "Now playing " + audioname + "...";
        } else {
            message = "Playing CharacterVoice " + audioname;
        }
        let afterInit;
        // Create the span element for the message
        var spanElement = document.createElement('span');
        spanElement.innerText = message;
        // If it's not BGM, add a play button for replaying the audio
        if (!isBgm) {
            var playButton = document.createElement('button');
            playButton.innerHTML = `<span class="material-symbols-outlined">replay</span>`;

            playButton.className = 'cv-play';
            playButton.onclick = () => document.querySelector('#cv').play();
            spanElement.appendChild(playButton);
        }

        // this.notiElem.appendChild(spanElement);
        return spanElement;
    }
    /**
     * audio player
     * @param {String} name audio name
     * @param {Number?} type audioElement target number
     * @param {Number?} timeout delayed play in ms.
     */
    async #play(name, type = 0, timeout = 0, seekTime = 0) {
        let audioLabel = name.replace(/\.\w{3}$/g, '');
        let f = findKeyInObject(this.audios, name);
        f = URL.createObjectURL(checkFromZip(f) ? await f.async('blob') : f);
        ////console.log(this.bgmAudioElem, this.cvAudioElem)
        /** @type {HTMLAudioElement?} */
        let audioElm = null;
        switch (type) {
            case 1:
                audioElm = this.cvAudioElem;
                break;

            default:
                audioElm = this.bgmAudioElem;
                break;
        }
        await new Promise(r => {
            setTimeout(() => {
                r(1);
            }, timeout);
        });
        audioElm.src = f;
        if (seekTime)
            audioElm.addEventListener('play', ev => {
                ev.preventDefault();
                ev.target.currentTime = seekTime;
            }, { once: true });
        this.notiHandle.notify(0, this.#audioNoti(audioLabel, type != 1));
    }
    /**
     * handles bgm and welcome voice play when model is initialized.
     */
    async bgmPlay() {
        ////console.log(this.modelConfig)
        if (!this.modelConfig.bgm) throw new Error('Cannot play bgm Due to model setting.');

        if (this.modelConfig.loop == 0) this.bgmAudioElem.loop = false;
        let bgmoffset = this.modelConfig.bgmoffset ? this.modelConfig.bgmoffset / 1000 : 0;
        this.#play(this.bgmPath, null, null, bgmoffset);
        if (this.modelConfig.welcome) {

            this.#play(pickRendomFromArr(this.initVoices), 1, 1000);
        } else if (this.playList) {
            ////console.log(this.playList);
            this.#play(pickRendomFromArr(this.playList), 1, 1000);
        };

    }
}
