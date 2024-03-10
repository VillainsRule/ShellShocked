import config from 'config';

import logger from 'utils/logger.js';
import variables from 'utils/variables.js';

class Patcher {
    keys = {};

    constructor () {};

    create = (key, value) => {
        if (value) this.keys[key] = value[1];
        else logger.error(`Key ${key} could not be found.`);
    };

    interceptRequest = () => {
        let request = XMLHttpRequest;

        unsafeWindow.XMLHttpRequest = class extends request {
            url;

            open(_, url) {
                this.url = url;
                return super.open(...arguments);
            };

            get response() {
                if (this.url.includes('shellshock.js')) {
                    return unsafeWindow[variables.patcher].patch(super.response);
                } else return super.response;
            };
        };
    };

    patch = (response) => {
        let code = response;

        try {
            this.create('babylon', /playerCollisionMesh=(.*?)\./.exec(code));
            this.create('playerList', /\]\.score-(.*?)\[/.exec(code));
            this.create('myPlayer', /"fire":document.pointerLockElement&&([^&]+)&&/.exec(code));
            this.create('scene', /\.engine\.stopRenderLoop\(\),(.*?)=/.exec(code));
            this.create('cullFunction', /showShareLinkPopup.*?\}function (.*?)\(/.exec(code));
            this.create('MeshBuilder', /wedgeCollisionMesh=.*?\.(.*?)\..*?\("",\{size:1\.5\}/.exec(code));
            this.create('CreateBox', /\.([a-zA-Z_$0-9]+)\("[^"]+",{si/.exec(code));
            this.create('CreateLines', /\.([a-zA-Z_$0-9]+)\("",{po/.exec(code));
            this.create('Vector3', /this\.end=new .*?\.(.*?),/.exec(code));
            this.create('actor', /this\.([a-zA-Z_$0-9]+)\.[a-zA-Z_$0-9]+\.position,!/.exec(code));
            this.create('playing', /OPEN&&[a-zA-Z_$0-9]+\.([a-zA-Z_$0-9]+)/.exec(code));
            this.create('yaw', /\*=[a-zA-Z_$0-9]+,[a-zA-Z_$0-9]+\.([a-zA-Z_$0-9]+)=Math\.r/.exec(code));
            this.create('pitch', /\),[a-zA-Z_$0-9]+\.([a-zA-Z_$0-9]+)=Math\.max\(Math\.min/.exec(code));
            this.create('mesh', /getMeshByName\("ammo"\)\.createInstance\(""\),this\.(.*?)\.setEnabled/.exec(code));
            this.create('bodyMesh', /this.shield=0,this\..*?\.(.*?)\.renderOverlay=!1,/.exec(code));
            this.create('filterFunction', /\.length>0&&!(.*?)\(/.exec(code));
            this.create('health', /Dead=function\(\){return this\.(.*?)</.exec(code));
            this.create('leaderboardUpdate', /ActionsPopup\(.*?\)\}\}function (.*?)\(\)/.exec(code));
            this.create('chatMessage', /Enter":var (.*?)=/.exec(code));
            this.create('adHandler', /\.ready\?\((.*?)\./.exec(code));
            this.create('eggGame', /you!"\),(.*?)\(/.exec(code));
        } catch (error) {
            logger.error(`Could not find variables. Error:`);
            console.error(error);
            return code;
        };

        let patches = [
            // Render Helper
            [this.keys.scene + '.render()', `window['${variables.render}'](${this.keys.babylon},${this.keys.playerList},${this.keys.myPlayer});${this.keys.scene}.render()`],
            [`function ${this.keys.cullFunction}`, `function ${this.keys.cullFunction}(){return true;}function oldCull`],

            // Anti AdBlock Block
            [/checkAdBlocker\(\)\{(.*?)\}adBlockerDetected\(\)\{(.*?)\}/, `_cab(){$1}_abd(){$2}checkAdBlocker(){window["${variables.cheatManager}"].enabled("Block Ads") ? false : this._cab()}adBlockerDetected(){window["${variables.cheatManager}"].enabled("Block Ads") ? false : this._abd()}`],
            [/showAdBlockerVideo\(\)\{(.*?)1e4\)\}/, `_sabv(){$11e4)}showAdBlockerVideo(){window["${variables.cheatManager}"].enabled("Block Ads") ? this.afterVideoAdComplete() : this._sabv()}`],
            [/!\[".*?"\]\.includes\(([a-zA-Z])\)/, `(window["${variables.cheatManager}"].enabled("Block Ads") ? false : !["video-ad-skipped","video-ad-completed"].includes($1))`],

            // Event Captures
            [/console.log\("After Game Ready"\)/, `console.log("After Game Ready"),window['${variables.onStart}']()`],
            [/signOut\(\)\.then\(\(function\(\)\{/, `signOut().then((function(){window['${variables.onSignOut}']();`],
            [/vueApp\.killedName=(.*?);/, `vueApp.killedName=$1;window['${variables.onKill}']($1);`],

            // Chat
            [new RegExp(`function ${this.keys.filterFunction}\\((.*?)\\)\{`), `function ${this.keys.filterFunction}($1){if(window['${variables.cheatManager}'].enabled('View Filtered')){return false;};`],
            [/\.value\.trim\(\);/, `.value.trim();${this.keys.chatMessage}=window['${variables.send}'](${this.keys.chatMessage});`],
            [/item"\);(.*?)\.length>4/, `item");$1.length>(window['${variables.cheatManager}'].enabled('Infinite History')?999999:4)`],

            // Misc
            [/=\.3\)\}(.*?)\.innerText=(.*?)\.score,/, `=.3)}$1.innerText=$2.score+\`\${window['${variables.cheatManager}'].enabled('Leaderboard Health')?' | ❤️ '+Math.floor($2.${this.keys.health}):''}\`,`],
            [/\]\.style\.display="none",(.*?)\+\+\}function/, `].style.display='none',$1++}window['${variables.leaderboardUpdate}']=${this.keys.leaderboardUpdate};function`],
            
            // Passive
            [/=null,console(.*?)18px;"\)/, `=null`],
            [/Remaining"\)\)\{/, `Remaining")){if (confirm('You are currently banned from Shell Shockers. Click OK to sign out and remove this ban')) {extern.signOut();}; return;`]
        ];

        patches.forEach(p => {
            let oc = code;
            code = code.replace(p[0], p[1]);
            if (code === oc) logger.error(`Patch ${p[0]} had no effect.`);
        });

        logger.log(`Successfully patched shellshock.js.`);

        return code;
    };
};

const patcher = new Patcher();
unsafeWindow[variables.patcher] = patcher;
if (config.exposeVariables) unsafeWindow.p = patcher;
export default patcher;