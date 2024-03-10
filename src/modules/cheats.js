import config from 'config';
import variables from 'utils/variables.js';

class CheatManager {
    cheats = {};
    settings = {};

    #listeners = [];

    version = '4';
    ignoreSync = false;

    constructor() {
        this.settings = GM_getValue('ssd_settings_' + this.version) || {};
    };

    createCategory = (name, cheats) => this.cheats[name] = !!cheats ? cheats : [];

    createCheat = (name, type, data) => {
        if (!this.settings[name] && type !== 'button')
            this.settings[name] = type === 'check' ? false : type === 'menu' ? data.default : null;

        return {
            name,
            id: variables.createString(),
            type: type || 'check',
            label: type === 'button' ? data.label : null,
            options: type === 'menu' ? data.options : null
        };
    };

    listen = (cheat, callback) => this.#listeners.push({ cheat, callback });
    runListeners = (cheat, data) => this.#listeners.filter(f => f.cheat === cheat).forEach(l => l.callback(data));

    enabled = (cheatName) => this.settings[cheatName];
    options = (cheatName) => Object.values(this.cheats).flat().find((c) => c.name === cheatName).options;

    tick = (cheatName) => {
        this.settings[cheatName] = !this.settings[cheatName];
        this.runListeners(cheatName, !!this.settings[cheatName]);
        if (!this.ignoreSync) this.sync();
    };

    select = (cheatName, newValue) => {
        this.settings[cheatName] = newValue;
        if (!this.ignoreSync) this.sync();
    };

    activate = (cheatName) => this.runListeners(cheatName);

    addCheats() {
        this.createCategory('Combat', [
            this.createCheat('Auto Reload'),
            this.createCheat('Grenade Max')
        ]);

        this.createCategory('Aimbot', [
            this.createCheat('Snap Mode', 'menu', {
                options: ['Right Mouse', 'Trackpad', 'Always On', 'Off'],
                default: 'Off'
            }),
            this.createCheat('One Kill')
        ]);

        this.createCategory('ESP', [
            this.createCheat('Skin ESP'),
            this.createCheat('ESP Boxes'),
            this.createCheat('ESP Lines'),
            this.createCheat('Nametags')
        ]);

        this.createCategory('Chat', [
            this.createCheat('View Filtered'),
            this.createCheat('Bypass Filter'),
            this.createCheat('Infinite History')
        ]);

        this.createCategory('Misc', [
            this.createCheat('Coordinates'),
            this.createCheat('Leaderboard Health'),
            this.createCheat('Block Ads')
        ]);

        if (!GM_getValue('ssd_settings_' + this.version, null)) GM_setValue('ssd_settings_' + this.version, this.settings);

        Object.entries(this.settings).forEach(([cheatName, cheatData]) =>
            (typeof cheatData === 'boolean' && cheatData === true)
                ? this.runListeners(cheatName) : false);
    };

    reset = () => {
        if (confirm('Are you sure you want to wipe all of your cheat configuration? This will reload the page!')) {
            GM_deleteValue('ssd_settings_' + this.version);
            this.ignoreSync = true;
            setTimeout(() => location.reload(), 500);
        };
    };

    sync = () => {
        if (this.ignoreSync) return;

        if (!Object.keys(this.settings).length) this.reset();
        else GM_setValue('ssd_settings_' + this.version, this.settings);
    };
};

const cheatManager = new CheatManager();
unsafeWindow[`${variables.cheatManager}`] = cheatManager;
if (config.exposeVariables) unsafeWindow.c = cheatManager;
export default cheatManager;