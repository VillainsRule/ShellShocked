import variables from '../utils/variables.js';
import settings from '../utils/settings.js';

export async function initGUI() {
    window.setVal = (item) => {
        let values = settings.get();

        if (item === 'aimbot') values.aimbot.enabled = !values.aimbot.enabled;
        else if (item === 'rightmouse') values.aimbot.rightMouse.enabled = !values.aimbot.rightMouse.enabled;
        else if (item === 'esp') values.esp.enabled = !values.esp.enabled;
        else if (item === 'esplines') values.espLines.enabled = !values.espLines.enabled;
        else if (item === 'espboxes') values.espBoxes.enabled = !values.espBoxes.enabled;
        
        settings.set(values);
    };

    let stylesheet = `
        .ss_container {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 50vw;
            height: auto;
            border: var(--ss-border-blue5);
            background-color: var(--ss-blue3);
            z-index: 99999;
            padding: 2vh;
            text-align: center;
            border-radius: var(--ss-space-sm);
            color: var(--ss-white);
        }

        .ss_title {
            font-family: 'Sigmar One';
            font-size: 4vh;
        }

        .ss_description {
            font-size: 2.6vh;
        }

        .ss_divider {
            width: calc(90%);
            margin: 2vh 5%;
        }

        .ss_header {
            font-size: 2.9vh;
            font-family: 'Sigmar One';
        }

        .ss_cheatRow {
            display: flex;
            justify-content: center;
            gap: 5vw;
            margin-top: 1.5vh;
        }

        .ss_cheatName {
            font-size: 2.5vh;
            font-family: 'Sigmar One';
        }

        .ss_brokenCheat {
            color: red;
            cursor: pointer;
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
        <div class="ss_container" id="${variables.get().guiID}">
            <div class="ss_title">ShellShocked</div>
            <div class="ss_description">the most advanced hack for shell shockers.</div>
            <hr class="ss_divider" />
            <div class="ss_header">Cheats</div>
            <div class="ss_cheatRow">
                <div class="ss_cheatName">Aimbot</div>
                <div class="ss_key">key: ${settings.get().aimbot.key.toUpperCase()}</div>
                <label class="switch">
                    <input type="checkbox" checked="${settings.get().aimbot.enabled}" onchange="setVal('aimbot');" id="${variables.get().aimbot}">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="ss_cheatRow">
                <div class="ss_cheatName">Right Mouse Aimbot</div>
                <div class="ss_key">key: ${settings.get().aimbot.rightMouse.key.toUpperCase()}</div>
                <label class="switch">
                    <input type="checkbox" checked="${settings.get().aimbot.rightMouse.enabled}" onchange="setVal('rightmouse');" id="${variables.get().rightmouse}">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="ss_cheatRow">
                <div class="ss_cheatName">ESP</div>
                <div class="ss_key">key: ${settings.get().esp.key.toUpperCase()}</div>
                <label class="switch">
                    <input type="checkbox" checked="${settings.get().esp.enabled}" onchange="setVal('esp');" id="${variables.get().esp}">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="ss_cheatRow">
                <div class="ss_cheatName">ESP Boxes</div>
                <div class="ss_key">key: ${settings.get().espBoxes.key.toUpperCase()}</div>
                <label class="switch">
                    <input type="checkbox" checked="${settings.get().espBoxes.enabled}" onchange="setVal('espboxes');" id="${variables.get().espboxes}">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="ss_cheatRow">
                <div class="ss_cheatName ss_brokenCheat" onclick="alert(\`ESP lines is broken. We're aware of the issue and working to fix it.\`);">ESP Lines</div>
                <div class="ss_key">key: ${settings.get().espLines.key.toUpperCase()}</div>
                <label class="switch">
                    <input type="checkbox" checked="${settings.get().espLines.enabled}" onchange="setVal('esplines');" id="${variables.get().esplines}">
                    <span class="slider round"></span>
                </label>
            </div>
        </div>
    `);
};