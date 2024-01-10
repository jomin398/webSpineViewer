import { soundPlayer } from "soundPlayer.js";
// auto define the version 
function selectversions(avers, mv, pathTemp) {
    const spineVers = {};
    avers.map((e, i, a) => {
        let k = Number(e).toFixed(1);
        let k2 = a[i + 1] ? Number(a[i + 1]).toFixed(1) : 'default';

        spineVers[k2] = pathTemp.replace("{ver}", k);
    })
    let versionPath = spineVers.default;

    for (let version in spineVers) {
        // console.log(model.version,parseFloat(version));
        if (mv <= parseFloat(version)) {
            versionPath = spineVers[version];
            break;
        }
    }
    return versionPath;
}
export default async function initializer(model, isModel, containers, notiHandler, audios) {
    const versionPath = selectversions([3.7, 3.8, 4.0, 4.1, 4.2], model.version, `./{ver}.js`)
    let spine;
    spine = (await import(versionPath)).spine;

    //only for model.
    if (isModel && audios && audios.length != 0) {
        model.soundPlayer = new soundPlayer(model.iniConfig, audios);
        model.soundPlayer.modelName = model.name;
        model.soundPlayer.notiHandle = notiHandler; // Note: this might need to be changed depending on where notiHandler is defined.
        model.soundPlayer.init();
    }

    model.error = (e) => console.error(e);
    // Create custom Spineplayer instance for tracking stats.
    const stats = this.stats;
    class CustomSpineRender extends spine.SpinePlayer {
        #prevPgn = null;
        drawFrame(requestNextFrame = true) {
            // Begin stats tracking
            if (this.config.statsActive) stats.begin();
            // Call the original drawFrame method
            super.drawFrame(requestNextFrame);

            var animationDuration = 1;
            if (this.animationState) animationDuration = this.animationState.getCurrent(0).animation.duration;
            let pgn = Number((this.playTime / animationDuration).toFixed(1));
            if (pgn !== this.#prevPgn) {
                if (pgn == 0) this.onAnimeUpdate();
                this.#prevPgn = pgn;
            }
            // End stats tracking
            if (this.config.statsActive) stats.end();
        }
        onAnimeUpdate(isInit) {
            //console.log('is init:',isInit)
            let as = this.animationState;
            let curani = as ? as.getCurrent(0)?.animation : null;
            //if (curani) console.log('audio is playing', curani.name, this.config.name)
        }
        togglePMA() {
            let pma = this.config.premultipliedAlpha;
            if (!pma) { this.config.premultipliedAlpha = true; } else {
                this.config.premultipliedAlpha = false;
            };
        }
        /**
         * @return {string[]} animation list.
         */
        get allAnimations() {
            return this.skeleton.data.animations.map(e => e.name);
        }
        setScale(scale = 1) {
            this.skeleton.scaleX = scale;
            this.skeleton.scaleY = scale;
        }
    };
    const container = isModel ? containers[0] : containers[1];
    model.render = new CustomSpineRender(container.id, Object.assign(model, { statsActive: isModel ? true : false, container, showControls: isModel ? true : false }));

    if (isModel && model.soundPlayer) await model.soundPlayer.bgmPlay().catch(e => { console.warn(e); });

    return model;
}
