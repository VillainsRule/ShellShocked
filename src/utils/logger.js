class Logger {
    constructor() { };

    log = (content) => console.log('%c%s', 'color:black;background:#FFD700;padding:2px 6px; border-radius:3px;font-weight:1000;margin-right:5px;', "ShellShocked", content);
    error = (content) => console.log('%c%s', 'color:white;background:red;padding:2px 6px; border-radius:3px;font-weight:1000;margin-right:5px;', "ShellShocked", content);
};

const logger = new Logger();
export default logger;