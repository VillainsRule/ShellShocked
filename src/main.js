import settings from './utils/settings.js';
settings.sync();

import { initHook } from './modules/hooker.js';
import { initListeners } from './modules/listeners.js';
import { initHack } from './modules/hack.js';
import { initGUI } from './modules/gui.js';

initHook();
initListeners();
initHack();

window.addEventListener('DOMContentLoaded', () => initGUI());

export default true;