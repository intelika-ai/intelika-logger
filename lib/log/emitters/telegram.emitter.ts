import { consoleColors, PACKAGE_NAME } from '../../config'
import { Options } from '../interfaces/option.interface'
import { createOutboundMessageParts } from './shared/outbound-serializer'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

const NEWLINE = `

\n
\r

`

function serializeMessage(...messages: any[]) {
  const payload = createOutboundMessageParts(messages).map(part => {
    if (part.kind === 'structured') return `\`\`\`json${NEWLINE}${part.text}\`\`\``
    if (part.kind === 'inline') return '`' + part.text + '`'
    return part.text
  })
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
  const searchParams = new URLSearchParams({
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown'
  })

  fetch(`https://api.telegram.org/bot${token}/sendMessage?${searchParams.toString()}`).catch(error => {
    console.error(
      `[${PACKAGE_NAME}] ${consoleColors.red}Failed to send Telegram${consoleColors.reset}`,
      error
    )
  })
}

export default telegramEmitter
