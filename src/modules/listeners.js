import { guiID, checkIDs } from './gui.js';
import settings from '../utils/settings.js';

let mouseDown = false;
const handleMouse = (e) => (e.button === 2) ? (mouseDown = e.type === 'pointerdown' ? true : false) : ''
window.addEventListener('pointerdown', handleMouse);
window.addEventListener('pointerup', handleMouse);
export const rightMouseDown = () => mouseDown;

export const initListeners = () => window.addEventListener('keyup', function(event) {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

    switch (event.key.toLowerCase()) {
        case settings.get().menuKey:
            document.getElementById(guiID).style.display === 'none' ?
                document.getElementById(guiID).style.display = '' :
                document.getElementById(guiID).style.display = 'none';
            break;
        case settings.get().aimbot.key:
            settings.get().aimbot.enabled = !settings.get().aimbot.enabled;
            document.getElementById(checkIDs.aimbot).checked = settings.get().aimbot.enabled;
            break;
        case settings.get().aimbot.rightMouse.key:
            settings.get().aimbot.rightMouse.enabled = !settings.get().aimbot.rightMouse.enabled;
            document.getElementById(checkIDs.rightmouse).checked = settings.get().aimbot.rightMouse.enabled;
            break;
        case settings.get().esp.key:
            settings.get().esp.enabled = !settings.get().esp.enabled;
            document.getElementById(checkIDs.esp).checked = settings.get().esp.enabled;
            break;
        case settings.get().espLines.key:
            settings.get().espLines.enabled = !settings.get().espLines.enabled;
            document.getElementById(checkIDs.esplines).checked = settings.get().espLines.enabled;
            break;
        case settings.get().hitboxes.key:
            settings.get().hitboxes.enabled = !settings.get().hitboxes.enabled;
            document.getElementById(checkIDs.hitboxes).checked = settings.get().hitboxes.enabled;
            break;
    };
});