import variables from '../utils/variables.js';

class Settings {
    settings;

    constructor() {
        if (localStorage.getItem('settings')) {
            try {
                this.settings = JSON.parse(localStorage.getItem('settings'));
            } catch (e) {
                console.error(e);
                this.initial();
            };
        } else this.initial();
    };

    initial() {
        localStorage.removeItem('settings');
        this.settings = {
            esp: {
                enabled: true,
                key: 'v',
            },
            espLines: {
                enabled: true,
                key: 'n'
            },
            espBoxes: {
                enabled: true,
                key: 'm'
            },
            aimbot: {
                enabled: 'rightMouse'
            },
            menuKey: 'h'
        };
        this.sync();
    };

    sync() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
        return this.get();
    };

    get() {
        return this.settings;
    };

    set(settings) {
        this.settings = settings;
        return this.sync();
    };
};

const settings = new Settings();
window[variables.get().settingsID] = settings;
export default settings;