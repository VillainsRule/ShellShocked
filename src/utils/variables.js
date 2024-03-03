import config from 'config';

class Variables {
    createString = () => Math.random().toString(36).slice(2);

    constructor() {
        this.render = this.createString();
        this.send = this.createString();

        this.leaderboardUpdate = this.createString();

        this.onStart = this.createString();
        this.onKill = this.createString();
        this.onSignOut = this.createString();

        this.cheatManager = this.createString();
        this.patcher = this.createString();

        this.lineOrigin = this.createString();
        this.lineArray = this.createString();
    };
};

const variables = new Variables();
if (config.exposeVariables) unsafeWindow.v = variables;
export default variables;