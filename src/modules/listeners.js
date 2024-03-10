import config from 'config';

import cheatManager from 'modules/cheats.js';
import variables from 'utils/variables';

class ListenerManager {
    #mouseDown;
    #trackpadActive;

    constructor () {
        unsafeWindow[variables.onKill] = (player) =>
            (cheatManager.enabled('One Kill')) ? this.#trackpadActive = false : null;
    };

    createListeners = () => {
        const handleMouse = (e) => (e.button === 2) ? (this.#mouseDown = e.type === 'pointerdown' ? true : false) : '';
        const handleTrackpad = (e) => (e.button === 2) ? (this.#trackpadActive = !this.#trackpadActive) : '';

        unsafeWindow.addEventListener('pointerdown', (e) => (handleMouse(e), handleTrackpad(e)));
        unsafeWindow.addEventListener('pointerup', handleMouse);

        unsafeWindow.addEventListener('keyup', (event) => {
            if (document.activeElement?.tagName === 'INPUT') return;

            switch (event.key.toLowerCase()) {
                case 'h':
                    document.querySelector('.ssd_container')?.style?.display === 'none' ?
                        document.querySelector('.ssd_container').style.display = '' :
                        document.querySelector('.ssd_container').style.display = 'none';
                    break;
            };
        });
    };

    mouseDown = () => !!this.#mouseDown;
    trackpadActive = () => !!this.#trackpadActive;
};

const listenerManager = new ListenerManager();
if (config.exposeVariables) unsafeWindow.lm = listenerManager;
export default listenerManager;