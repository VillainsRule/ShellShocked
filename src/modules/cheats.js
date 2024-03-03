import config from 'config';

import logger from 'utils/logger.js';
import variables from 'utils/variables.js';

class CheatManager {
    cheats = {}; // cheat names/values
    settings = {}; // cheat data

    #listeners = []; // listeners array

    version = '3'; // version of cheat save
    ignoreSync = false; // helps to fix sync issues

    constructor() {
        logger.log('Started the Cheat Manager.');

        this.settings = JSON.parse(GM_getValue('ssd_settings_' + this.version, null)) || {};
    };

    createCategory = (name, cheats) => this.cheats[name] = !!cheats ? cheats : [];

    // "name" is the cheat name to the left
    // "type" is "button", "check", or "menu" (default: check)
    // "data" for menus is the options, for buttons is the label, for checks is null
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

    // adds a listener that will be called back if a cheat setting is changed
    listen = (cheat, callback) => this.#listeners.push({ cheat, callback });
    runListeners = (cheat, data) => this.#listeners.filter(f => f.cheat === cheat).forEach(l => l.callback(data));

    // misc helpers
    enabled = (cheatName) => this.settings[cheatName];
    options = (cheatName) => Object.values(this.cheats).flat().find((c) => c.name === cheatName).options;

    // toggle a cheat
    tick = (cheatName) => {
        this.settings[cheatName] = !this.settings[cheatName];
        this.runListeners(cheatName, !!this.settings[cheatName]);
        logger.log(`Ticked ${cheatName}, it's now ${!!this.settings[cheatName] ? 'on' : 'off'}. Ran ${this.#listeners.filter(f => f.cheat === cheatName).length} listeners.`);
        if (!this.ignoreSync) this.sync();
    };

    // select a new value from a cheat menu
    select = (cheatName, newValue) => {
        this.settings[cheatName] = newValue;
        logger.log(`Set menu ${cheatName} to ${newValue}.`);
        if (!this.ignoreSync) this.sync();
    };

    // activate a button cheat
    activate = (cheatName) => {
        this.runListeners(cheatName);
        logger.log(`Activated ${cheatName}. Listeners running!`);
    };

    // creates/imports cheat info
    addCheats() {
        logger.log('Adding cheats...');

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

        if (!GM_getValue('ssd_settings_' + this.version, null)) GM_setValue('ssd_settings_' + this.version, JSON.stringify(this.settings));

        Object.entries(this.settings).forEach(([cheatName, cheatData]) =>
            (typeof cheatData === 'boolean' && cheatData === true)
                ? this.runListeners(cheatName) : false);

        logger.log('Created cheats & updated GM values.');
    };

    // resets cheat info
    reset = () => {
        if (confirm('Are you sure you want to wipe all of your cheat configuration? This will reload the page!')) {
            GM_deleteValue('ssd_settings_' + this.version);
            this.ignoreSync = true;
            setTimeout(() => location.reload(), 500);
        };
    };

    // saves cheat info locally
    sync = () => {
        if (this.ignoreSync) return logger.log(`Ignoring sync.`);

        if (!Object.keys(this.settings).length) this.reset();
        else GM_setValue('ssd_settings_' + this.version, JSON.stringify(this.settings));

        logger.log(`Saved cheat settings to GM values (v${this.version}).`);
    };
};

const cheatManager = new CheatManager();
unsafeWindow[`${variables.cheatManager}`] = cheatManager;
if (config.exposeVariables) unsafeWindow.c = cheatManager;
export default cheatManager;