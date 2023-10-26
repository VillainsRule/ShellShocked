import variables from '../utils/variables.js';

export async function initHook() {
    window.XMLHttpRequest = class extends window.XMLHttpRequest {
        open(_, url) {
            if (url.indexOf('shellshock.js') > -1) this.isScript = true;
            return super.open(...arguments);
        };

        get response() {
            if (this.isScript) {
                const code = super.response;

                let babylonVarName,
                    playersVarName,
                    myPlayerVarName,
                    sceneVarName,
                    cullFuncName;

                try {
                    babylonVarName = /this\.origin=new ([a-zA-Z]+)\.Vector3/.exec(code)[1];
                    playersVarName = /([^,]+)=\[\],[^,]+=\[\],{}/.exec(code)[1];
                    myPlayerVarName = /"fire":document.pointerLockElement&&([^&]+)&&/.exec(code)[1];
                    sceneVarName = /createMapCells\(([^,]+),/.exec(code)[1];
                    cullFuncName = /=([a-zA-Z_$]+)\(this\.mesh,\.[0-9]+\)/.exec(code)[1];
                } catch (error) {
                    return code;
                };

                return code
                    .replace(sceneVarName + '.render()', `window['${variables.get().onUpdate}'](${babylonVarName},${playersVarName},${myPlayerVarName});${sceneVarName}.render()`)
                    .replace(`function ${cullFuncName}`, `function ${cullFuncName}(){return true;}function someFunctionWhichWillNeverBeUsedNow`)
                    .replace(/.prototype.setVisible=function\(\w\){/, `.prototype.setVisible=function(eee){this.getChildTransformNodes().forEach(child=>child.setRenderingGroupId&&child.setRenderingGroupId(window['${variables.get().settingsID}'].get().esp.enabled?1:0));`);
            };

            return super.response;
        };
    };
};