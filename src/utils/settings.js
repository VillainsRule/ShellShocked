class Settings {
    settings;

    constructor() {
        if (localStorage.getItem('settings')) {
            try {
                settings = JSON.parse(localStorage.getItem('settings'));
            } catch (e) {
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
            hitboxes: {
                enabled: true,
                key: 'm'
            },
            aimbot: {
                enabled: true,
                key: 'b',
                rightMouse: {
                    enabled: true,
                    key: 'l'
                }
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
window.st = settings;
export default settings;