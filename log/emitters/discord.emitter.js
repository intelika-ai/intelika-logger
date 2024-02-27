"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("../options");
function stringifyMessage(msg) {
    if (msg.stack)
        return msg.stack;
    if (typeof msg === 'object')
        return JSON.stringify(msg, null, 2);
    return msg.toString();
}
function serializeMessage(...messages) {
    const payload = [];
    const firstMessage = messages.shift();
    payload.push(`\`\`\`json\n${stringifyMessage(firstMessage)}\`\`\``);
    for (const msg of messages) {
        if (msg.stack)
            payload.push(`\`\`\`\n${msg.stack}\`\`\``);
        else if (typeof msg === 'object')
            payload.push(`\`\`\`json\n${JSON.stringify(msg, null, 2)}\`\`\``);
        else if (typeof msg === 'number')
            payload.push('`' + msg + '`');
        else
            payload.push(msg.toString());
    }
    return payload.join('\r\n');
}
const discordEmitter = (level, context, ...msg) => {
    // Send Discord webhook
    const color = {
        ERROR: 0xff0000,
        WARN: 0xffaa00,
        INFO: 0x00ff00,
        DEBUG: 0x0000ff,
        VERBOSE: 0x000000
    }[level];
    // discord webhook
    const body = {
        content: `**${level}**`,
        embeds: [
            {
                title: `[** ${context} **]`,
                description: serializeMessage(...msg),
                color: color
            }
        ]
    };
    const options = (0, options_1.getOptions)();
    if (!(options === null || options === void 0 ? void 0 : options.discordWebhook))
        return console.error('No Discord webhook provided');
    fetch(options.discordWebhook, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(console.error);
};
exports.default = discordEmitter;
//# sourceMappingURL=discord.emitter.js.map