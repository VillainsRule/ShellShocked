import cheats from 'modules/cheats.js';
import variables from 'utils/variables.js';

export default () => {
    const inform = (title, body) => document.body.insertAdjacentHTML('beforeend', `
        <div class="popup_window popup_sm roundme_md centered" id="genericPopup" style="">
            <div>
                <button class="roundme_sm popup_close clickme">
                    <i class="fas fa-times text_white fa-2x"></i>
                </button>
                <h3 id="popup_title" class="roundme_sm shadow_blue4 nospace text_white">${title}</h3>
            </div>
            <div class="popup_sm_content">${body}</div>
            <div id="btn_horizontal" class="f_center">
                <button class="ss_button btn_green bevel_green width_sm" onclick="document.querySelector('#genericPopup').remove();">OK</button>
            </div>
        </div>
    `);

    unsafeWindow[variables.send] = (msg) => {
        if (cheats.enabled('Bypass Filter')) {
            let override = '\u202e';
            msg = ([override,].concat(msg.split('').reverse())).join('');
        };

        return msg;
    };

    cheats.listen('Coordinates', (isActive) =>
        [...document.querySelectorAll('.coordinfo')]
            .forEach(e => e.style.display = isActive ? '' : 'none'));

    unsafeWindow[variables.onStart] = () => {
        document.querySelector('#readouts').insertAdjacentHTML('beforeend', `
            <h5 class="coordinfo nospace title" style="display: ${cheats.enabled('Coordinates') ? '' : 'none'};">coords</h5>
            <p id="coords" class="coordinfo name" style="display: ${cheats.enabled('Coordinates') ? '' : 'none'};"></p>
        `);
    };

    unsafeWindow[variables.onSignOut] = () => {
        Object.keys(localStorage).forEach(s => localStorage.removeItem(s));
        document.cookie = '';
        inform(`You've been unbanned!`, `In 15 seconds, the page will reload to confirm your new account being created in the server.`);
        setTimeout(() => location.reload(true), 15000);
    };

    unsafeWindow.WebSocket.prototype._send = WebSocket.prototype.send;
    unsafeWindow.WebSocket.prototype.send = function (data) {
        if (data instanceof String) return this._send(data);
        if (data.byteLength == 0) return this._send(data);

        let arr = new Uint8Array(data);

        if (arr[0] === 27 && cheats.enabled('Grenade Max')) {
            arr[1] = 255;
            return this._send(arr.buffer);
        };

        this._send(data);
    };

    cheats.listen('Leaderboard Health', (enabled) => {
        if (enabled) {
            document.head.insertAdjacentHTML('beforeend', `<style id="ssd_lh">
                .playerSlot--name-score {
                    width: 16vw;
                }
            </style>`);
        } else document.querySelector('#ssd_lh')?.remove();
    });

    cheats.listen('Unban', async () => {
        if (confirm('Are you sure you want to unban yourself? This will also clear your skins, eggs, and log you out of your account.')) {
            unsafeWindow.extern.signOut();
        };
    });
};