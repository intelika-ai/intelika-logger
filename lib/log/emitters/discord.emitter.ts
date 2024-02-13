import { getOptions } from '../log.module'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

function serializeMessage(...messages: any[]) {
  const payload = []
  const firstMessage = messages.shift()
  payload.push(`\`\`\`json\n${JSON.stringify(firstMessage, null, 2)}\`\`\``)
  for (const msg of messages) {
    if (msg.stack) payload.push(`\`\`\`\n${msg.stack}\`\`\``)
    else if (typeof msg === 'object') payload.push(`\`\`\`json\n${JSON.stringify(msg, null, 2)}\`\`\``)
    else if (typeof msg === 'number') payload.push('`' + msg + '`')
    else payload.push(msg.toString())
  }
  return payload.join('\r\n')
}

const discordEmitter = (level: LogLevel, context: string, ...msg: any[]) => {
  // Send Discord webhook
  const color = {
    ERROR: 0xff0000,
    WARN: 0xffaa00,
    INFO: 0x00ff00,
    DEBUG: 0x0000ff,
    VERBOSE: 0x000000
  }[level]

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
  }
  const options = getOptions()
  if (!options?.discordWebhook) return console.error('No Discord webhook provided')

  fetch(options.discordWebhook, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(console.error)
}
export default discordEmitter
