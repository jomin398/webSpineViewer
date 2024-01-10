import { createElementFromStr } from "../../lib/utils.js";

export default class SpPopup {
    constructor(id, button, player, parent, htmlContent) {
        this.id = id;
        this.button = button;
        this.player = player;
        this.dom = createElementFromStr(`<div class="spine-player-popup spine-player-hidden"></div>`);
        this.dom.innerHTML = htmlContent;
        let s = parent.querySelector('.spine-player-popup');
        if (s) s.remove();
        parent.appendChild(this.dom);
        this.className = "spine-player-button-icon-" + id + "-selected";
    }
    dispose() {
    }
    hide(id) {
        this.dom.remove();
        this.button.classList.remove(this.className);
        if (this.id == id) {
            this.player.popup = null;
            return true;
        }
        return false;
    }
    show(dismissedListener) {
        this.player.popup = this;
        this.button.classList.add(this.className);
        this.dom.classList.remove("spine-player-hidden");
        let dismissed = false;
        let resize = () => {
            if (!dismissed)
                requestAnimationFrame(resize);
            let playerDom = this.player.dom;
            let bottomOffset = Math.abs(playerDom.getBoundingClientRect().bottom - playerDom.getBoundingClientRect().bottom);
            let rightOffset = Math.abs(playerDom.getBoundingClientRect().right - playerDom.getBoundingClientRect().right);
            this.dom.style.maxHeight = playerDom.clientHeight - bottomOffset - rightOffset + "px";
        };
        requestAnimationFrame(resize);
        let justClicked = true;
        let windowClickListener = (event) => {
            if (justClicked || this.player.popup != this) {
                justClicked = false;
                return;
            }
            if (!this.dom.contains(event.target)) {
                this.dom.remove();
                window.removeEventListener("click", windowClickListener);
                if (dismissedListener) dismissedListener();
                this.button.classList.remove(this.className);
                this.player.popup = null;
                dismissed = true;
            }
        };
        if (this.player.addEventListener) { this.player.addEventListener(window, "click", windowClickListener); } else {
            window.addEventListener("click", windowClickListener);
        };
    }
};
