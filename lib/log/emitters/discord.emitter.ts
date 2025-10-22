import { consoleColors, PACKAGE_NAME } from '../../config'

import { Options } from '../interfaces/option.interface'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

/**
 * Removes ANSI color codes from a string
 * This ensures Discord webhooks display clean text without shell escape sequences
 */
function stripAnsiCodes(str: string): string {
  // Regex to match ANSI escape sequences (shell color codes)
  return str.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '')
}

/**
 * Converts a message to a string representation
 * Handles stack traces, objects, and primitive values
 */
function stringifyMessage(msg: any) {
  let result: string
  if (msg.stack) result = msg.stack
  else if (typeof msg === 'object') result = JSON.stringify(msg, null, 2)
  else result = msg.toString()
  
  // Strip ANSI color codes before returning
  return stripAnsiCodes(result)
}

/**
 * Serializes multiple messages into a Discord-formatted string
 * Strips ANSI color codes from all messages
 */
function serializeMessage(...messages: any[]) {
  const payload = []
  const firstMessage = messages.shift()
  payload.push(stripAnsiCodes(`\`\`\`json\n${stringifyMessage(firstMessage)}\`\`\``))
  
  // Process remaining messages and strip ANSI codes
  for (const msg of messages) {
    if (msg.stack) {
      payload.push(stripAnsiCodes(`\`\`\`\n${msg.stack}\`\`\``))
    } else if (typeof msg === 'object') {
      payload.push(stripAnsiCodes(`\`\`\`json\n${stripAnsiCodes(JSON.stringify(msg, null, 2))}\`\`\``))
    } else if (typeof msg === 'number') {
      payload.push(stripAnsiCodes('`' + msg + '`'))
    } else {
      payload.push(stripAnsiCodes(msg.toString()))
    }
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
