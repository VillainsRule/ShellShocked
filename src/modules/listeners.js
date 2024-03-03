import config from 'config';

import cheatManager from 'modules/cheats.js';

import logger from 'utils/logger.js';
import variables from 'utils/variables';

class ListenerManager {
    // private booleans used for aimbot
    #mouseDown;
    #trackpadActive;

    constructor() {
        logger.log('Started ListenerManager.');

        unsafeWindow[variables.onKill] = (player) => {
            if (cheatManager.enabled('One Kill')) this.#trackpadActive = false;
            logger.log(`Player killed ${player}!`);
        };
    };

    // add initial listeners
    createListeners = () => {
        // mouse handlers
        const handleMouse = (e) => (e.button === 2) ? (this.#mouseDown = e.type === 'pointerdown' ? true : false) : '';
        const handleTrackpad = (e) => (e.button === 2) ? (this.#trackpadActive = !this.#trackpadActive) : '';

        // add mouse events
        unsafeWindow.addEventListener('pointerdown', (e) => (handleMouse(e), handleTrackpad(e)));
        unsafeWindow.addEventListener('pointerup', handleMouse);

        // add GUI event
        unsafeWindow.addEventListener('keyup', (event) => {
            if (document.activeElement?.tagName === 'INPUT') return; // ignore chat/name box/other inputs

            switch (event.key.toLowerCase()) {
                case 'h':
                    document.querySelector('.ssd_container')?.style?.display === 'none' ?
                        document.querySelector('.ssd_container').style.display = '' :
                        document.querySelector('.ssd_container').style.display = 'none';
                    break;
            };
        });
    };

    // functions for aimbot-based things
    mouseDown = () => !!this.#mouseDown;
    trackpadActive = () => !!this.#trackpadActive;
};

const listenerManager = new ListenerManager();
if (config.exposeVariables) unsafeWindow.lm = listenerManager;
export default listenerManager;