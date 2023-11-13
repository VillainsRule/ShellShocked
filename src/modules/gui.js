import variables from '../utils/variables.js';
import settings from '../utils/settings.js';

export async function initGUI() {
    let stylesheet = `
        .ssd_container {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 60vw;
            height: auto;
            border: var(--ss-border-blue5);
            background-color: var(--ss-blue3);
            z-index: 99999;
            padding: 2vh;
            text-align: center;
            border-radius: var(--ss-space-sm);
            color: var(--ss-white);
        }

        .ssd_title {
            font-family: 'Sigmar One';
            font-size: 4vh;
        }

        .ssd_description {
            font-size: 2.6vh;
        }

        .ssd_divider {
            width: calc(90%);
            margin: 2vh 5%;
        }

        .ssd_header {
            font-size: 2.9vh;
            font-family: 'Sigmar One';
        }

        .ssd_cheatGrid {
            display: grid;
            grid-gap: 3vw;
            grid-template-columns: minmax(14vw, 3fr) minmax(2vw, 2fr) minmax(15vw, 4fr);
            justify-items: center;
            margin-top: 1.5vh;
            margin-left: 3vw;
            margin-right: 3vw;
        }

        .ssd_cheatName {
            font-size: 2.5vh;
            font-family: 'Sigmar One';
        }

        .ssd_buttons {
            display: flex;
            justify-content: center;
            gap: 5vw;
        }

        .ssd_button {
            border: calc(var(--ss-common-border-width)/2) solid var(--ss-blue5);
            box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) rgb(8,110,141), var(--ss-btn-light-bevel) rgb(0,173,230);
            border-radius: var(--border-radius);
            padding: 6px 20px;
            font-weight: 1000;
            font-size: 2.25vh;
            cursor: pointer;
        }

        .ssd_select {
            border: calc(var(--ss-common-border-width)/2) solid var(--ss-blue5);
            box-shadow: var(--ss-box-shadow-1), var(--ss-btn-dark-bevel) rgb(8,110,141), var(--ss-btn-light-bevel) rgb(0,173,230);
            border-radius: var(--border-radius);
            padding: 6px 20px;
            font-weight: 1000;
            font-size: 2vh;
            cursor: pointer;
            background: var(--ss-blue3);
            color: white;
            font-family: 'Nunito';
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: calc(4vh + 8px);
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 4vh;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #5bc75f;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px #5bc75f;
        }

        input:checked + .slider:before {
            transform: translateX(26px);
        }
    `;

    document.body.insertAdjacentHTML('beforeend', `
        <style>${stylesheet}</style>
        <div class="ssd_container" id="${variables.get().guiID}">
            <div class="ssd_title">ShellShocked</div>
            <div class="ssd_description">the most advanced hack for shell shockers.</div>
            <hr class="ssd_divider" />
            <div class="ssd_header">Cheats</div>
            <div class="ssd_cheatGrid">
                <div class="ssd_cheatName">Aimbot</div>
                <div class="ssd_key">key: ${settings.get().aimbot.key.toUpperCase()}</div>
                <select class="ssd_select" id="${variables.get().aimbot}">
                    <option value="rightMouse">Right Mouse Hold</option>
                    <option value="trackpad">Trackpad</option>
                    <option value="on">Always On</option>
                    <option value="off">Off</option>
                </select>
                <div class="ssd_cheatName">ESP</div>
                <div class="ssd_key">key: ${settings.get().esp.key.toUpperCase()}</div>
                <label class="switch">
                    <input type="checkbox" checked="${settings.get().esp.enabled}" onchange="setVal('esp');" id="${variables.get().esp}">
                    <span class="slider"></span>
                </label>
                <div class="ssd_cheatName">ESP Boxes</div>
                <div class="ssd_key">key: ${settings.get().espBoxes.key.toUpperCase()}</div>
                <label class="switch">
                    <input type="checkbox" checked="${settings.get().espBoxes.enabled}" onchange="setVal('espboxes');" id="${variables.get().espboxes}">
                    <span class="slider"></span>
                </label>
                <div class="ssd_cheatName">ESP Lines</div>
                <div class="ssd_key">key: ${settings.get().espLines.key.toUpperCase()}</div>
                <label class="switch">
                    <input type="checkbox" checked="${settings.get().espLines.enabled}" onchange="setVal('esplines');" id="${variables.get().esplines}">
                    <span class="slider"></span>
                </label>
            </div>
            <hr class="ssd_divider" />
            <div class="ssd_buttons">
                <div class="ssd_button" onclick="document.documentElement.requestFullscreen();">Fullscreen</div>
                <div class="ssd_button" onclick="location.reload();">Reload</div>
            </div>
        </div>
    `);

    document.getElementById(`${variables.get().aimbot}`).value = settings.get().aimbot.enabled;

    document.getElementById(`${variables.get().aimbot}`).onchange = (ev) => {
        let selected = ev.target.options[ev.target.selectedIndex].value;
        let values = settings.get();
        values.aimbot.enabled = selected;
        settings.set(values);
    };

    document.getElementById(`${variables.get().esp}`).onchange = () => {
        let values = settings.get();
        values.esp.enabled = !values.esp.enabled;
        settings.set(values);
    };

    document.getElementById(`${variables.get().esplines}`).onchange = () => {
        let values = settings.get();
        values.espLines.enabled = !values.espLines.enabled;
        settings.set(values);
    };

    document.getElementById(`${variables.get().espboxes}`).onchange = () => {
        let values = settings.get();
        values.espBoxes.enabled = !values.espBoxes.enabled;
        settings.set(values);
    }
};