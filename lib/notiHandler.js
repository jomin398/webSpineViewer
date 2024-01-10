export class notiHandler {
    /**
     * @param {String?} querySelector
     */
    constructor(querySelector) {
        this.elem = document.querySelector(querySelector ?? '.sysNotify');
    }
    notify(logLv = 0, element) {
        // Create the span element for the message
        element.className = "noti animate__animated animate__fadeInUpBig";
        // Set id based on logLv
        switch (logLv) {
            case 0:
                element.id = 'info';
                break;
            case 1:
                element.id = 'warn';
                break;
            case 2:
                element.id = 'error';
                break;
            default:
                console.error('Invalid log level');
                return;
        }

        this.elem.appendChild(element);
    }
    clear() {
        this.elem.innerHTML = '';
    }
}
