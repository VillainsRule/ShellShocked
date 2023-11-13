import variables from '../utils/variables.js';
import settings from '../utils/settings.js';

let mouseDown = false;
let trackpadDown = false;

const handleMouse = (e) => (e.button === 2) ? (mouseDown = e.type === 'pointerdown' ? true : false) : '';
const handleTrackpad = (e) => (e.button === 2) ? (trackpadDown = !trackpadDown) : '';

window.addEventListener('pointerdown', (e) => (handleMouse(e), handleTrackpad(e)));
window.addEventListener('pointerup', handleMouse);

export const rightMouseDown = () => mouseDown;
export const trackpadLock = () => trackpadDown;

export const initListeners = () => window.addEventListener('keyup', function(event) {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

    switch (event.key.toLowerCase()) {
        case settings.get().menuKey:
            if (document.getElementById(variables.get().guiID)) document.getElementById(variables.get().guiID).style.display === 'none' ?
                document.getElementById(variables.get().guiID).style.display = '' :
                document.getElementById(variables.get().guiID).style.display = 'none';
            break;
        case settings.get().esp.key:
            if (!document.getElementById(variables.get().esp)) return;
            settings.get().esp.enabled = !settings.get().esp.enabled;
            document.getElementById(variables.get().esp).checked = settings.get().esp.enabled;
            break;
        case settings.get().espLines.key:
            if (!document.getElementById(variables.get().esplines)) return;
            settings.get().espLines.enabled = !settings.get().espLines.enabled;
            document.getElementById(variables.get().esplines).checked = settings.get().espLines.enabled;
            break;
        case settings.get().espBoxes.key:
            if (!document.getElementById(variables.get().espboxes)) return;
            settings.get().espBoxes.enabled = !settings.get().espBoxes.enabled;
            document.getElementById(variables.get().espboxes).checked = settings.get().espBoxes.enabled;
            break;
    };
});