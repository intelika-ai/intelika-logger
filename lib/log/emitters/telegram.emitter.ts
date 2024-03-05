import { getOptions } from '../options'

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

const telegramEmitter = (level: LogLevel, context: string, ...msg: any[]) => {
  const flags = {
    ERROR: '🛑',
    WARN: '⚠️',
    INFO: 'ℹ️'
  }

  const message = [`${flags[level] || '❔'} **[${context}]**`, serializeMessage(...msg)].join(NEWLINE)
  const options = getOptions()

  if (!options?.telegram) return console.error('No Telegram token provided')

  const { chatId, token } = options.telegram
  fetch(
    `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=Markdown`
  ).catch(console.error)
}

export default telegramEmitter
