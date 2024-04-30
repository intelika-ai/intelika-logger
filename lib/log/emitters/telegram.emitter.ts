import { consoleColors, PACKAGE_NAME } from '../../config'
import { Options } from '../interfaces/option.interface'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

const NEWLINE = `

\n
\r

`

function serializeMessage(...messages: any[]) {
  const payload = []
  for (const msg of messages) {
    if (msg.stack) payload.push(`\`${NEWLINE}${msg.stack}\``)
    else if (typeof msg === 'object')
      payload.push(`\`\`\`json${NEWLINE}${JSON.stringify(msg, null, 2)}\`\`\``)
    else if (typeof msg === 'number') payload.push('`' + msg + '`')
    else payload.push(msg.toString())
  }
  return payload.join(NEWLINE)
}

const telegramEmitter = (options: Options, level: LogLevel, context: string, ...msg: any[]) => {
  const flags = {
    ERROR: '🛑',
    WARN: '⚠️',
    INFO: 'ℹ️'
  }

  const message = [`${flags[level] || '❔'} **[${context}]**`, serializeMessage(...msg)].join(NEWLINE)

  if (!options) {
    return console.warn(`[${PACKAGE_NAME}] ${consoleColors.red}No options provided!${consoleColors.reset}`)
  }

  if (!options?.telegram) {
    return console.warn(
      `[${PACKAGE_NAME}] ${consoleColors.red}No Telegram token provided!${consoleColors.reset}`
    )
  }

  const { chatId, token } = options.telegram
  fetch(
    `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=Markdown`
  ).catch(error => {
    console.error(
      `[${PACKAGE_NAME}] ${consoleColors.red}Failed to send Telegram${consoleColors.reset}`,
      error
    )
  })
}

export default telegramEmitter
