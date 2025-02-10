import { consoleColors, PACKAGE_NAME } from '../../config'

import { Options } from '../interfaces/option.interface'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

function stringifyMessage(msg: any) {
  if (msg.stack) return msg.stack
  if (typeof msg === 'object') return JSON.stringify(msg, null, 2)
  return msg.toString()
}

function serializeMessage(...messages: any[]) {
  const payload = []
  const firstMessage = messages.shift()
  payload.push(`\`\`\`json\n${stringifyMessage(firstMessage)}\`\`\``)
  for (const msg of messages) {
    if (msg.stack) payload.push(`\`\`\`\n${msg.stack}\`\`\``)
    else if (typeof msg === 'object') payload.push(`\`\`\`json\n${JSON.stringify(msg, null, 2)}\`\`\``)
    else if (typeof msg === 'number') payload.push('`' + msg + '`')
    else payload.push(msg.toString())
  }
  return payload.join('\r\n')
}

const discordEmitter = (options: Options, level: LogLevel, context: string, ...msg: any[]) => {
  // Send Discord webhook
  const color = {
    ERROR: 0xff0000,
    WARN: 0xffaa00,
    INFO: 0x00ff00,
    DEBUG: 0x0000ff,
    VERBOSE: 0x000000
  }[level]

  const time = Math.floor(Date.now() / 1000)
  // discord webhook
  const body = {
    content: `**${level}**`,
    embeds: [
      {
        title: `[** ${context} **]`,
        description: serializeMessage(...msg) + `\n\n**Time**: <t:${time}:R>`,
        color: color
      }
    ]
  }

  if (!options) {
    return console.error(`[${PACKAGE_NAME}] ${consoleColors.red}No options provided!${consoleColors.reset}`)
  }

  if (!options.discordWebhook) {
    return console.error(
      `[${PACKAGE_NAME}] ${consoleColors.red}No Discord webhook provided!${consoleColors.reset}`
    )
  }

  fetch(options.discordWebhook, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(console.error)
}
export default discordEmitter
