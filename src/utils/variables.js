const createString = () => btoa(Math.random().toString(32));

class Variables {
    guiID = createString();
    aimbot = createString();
    rightmouse = createString();
    esp = createString();
    esplines = createString();
    espboxes = createString();
    onUpdate = createString();
    settingsID = createString();

    constructor() {};

    get() {
        return this;
    }
};

const variables = new Variables();
export default variables;