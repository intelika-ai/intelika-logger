"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("../options");
const NEWLINE = `

\n
\r

`;
function serializeMessage(...messages) {
    const payload = [];
    for (const msg of messages) {
        if (msg.stack)
            payload.push(`\`${NEWLINE}${msg.stack}\``);
        else if (typeof msg === 'object')
            payload.push(`\`\`\`json${NEWLINE}${JSON.stringify(msg, null, 2)}\`\`\``);
        else if (typeof msg === 'number')
            payload.push('`' + msg + '`');
        else
            payload.push(msg.toString());
    }
    return payload.join(NEWLINE);
}
const telegramEmitter = (level, context, ...msg) => {
    const flags = {
        ERROR: '🛑',
        WARN: '⚠️',
        INFO: 'ℹ️'
    };
    const message = [`${flags[level] || '❔'} **[${context}]**`, serializeMessage(...msg)].join(NEWLINE);
    const options = (0, options_1.getOptions)();
    if (!(options === null || options === void 0 ? void 0 : options.telegram))
        return console.error('No Telegram token provided');
    const { chatId, token } = options.telegram;
    fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=Markdown`).catch(console.error);
};
exports.default = telegramEmitter;
//# sourceMappingURL=telegram.emitter.js.map