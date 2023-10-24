import settings from './utils/settings.js';
settings.sync();

import { initHook } from './modules/hooker.js';
import { initGUI } from './modules/gui.js';
import { initListeners } from './modules/listeners.js';
import { initHack } from './modules/hack.js';

initHook();

window.addEventListener('DOMContentLoaded', () => {
    initGUI();
    initListeners();
    initHack();
});

export default true;