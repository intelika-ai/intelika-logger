import { consoleColors, PACKAGE_NAME } from '../../config'
import { Options } from '../interfaces/option.interface'
import {
  createOutboundMessageParts,
  OutboundMessagePart,
  stripAnsiCodes
} from './shared/outbound-serializer'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

const MAX_TITLE_LENGTH = 256
const MAX_EMBED_DESCRIPTION_LENGTH = 4096
const MAX_EMBED_TEXT_LENGTH = 6000
const DESCRIPTION_SEPARATOR = '\n'

type DiscordWebhookBody = {
  content: string
  embeds: [
    {
      title: string
      description: string
      color: number
      footer?: { text: string }
    }
  ]
}

type RenderableSegment = {
  prefix: string
  content: string
  suffix: string
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

  if (!options) {
    return console.error(`[${PACKAGE_NAME}] ${consoleColors.red}No options provided!${consoleColors.reset}`)
  }

  if (!options.discordWebhook) {
    return console.error(
      `[${PACKAGE_NAME}] ${consoleColors.red}No Discord webhook provided!${consoleColors.reset}`
    )
  }

  const bodies = buildDiscordWebhookBodies(level, context, color, ...msg)

  void sendDiscordMessages(options.discordWebhook, bodies).catch(console.error)
}

export function buildDiscordWebhookBodies(
  level: LogLevel,
  context: string,
  color: number,
  ...messages: any[]
): DiscordWebhookBody[] {
  const time = Math.floor(Date.now() / 1000)
  const parts = createOutboundMessageParts(messages)
  const segments = parts.flatMap(part => splitSegment(toRenderableSegment(part)))
  const descriptionChunks = packSegments(
    segments.length > 0 ? segments : [toRenderableSegment({ kind: 'text', text: 'No payload provided.' })],
    MAX_EMBED_DESCRIPTION_LENGTH
  )

  return descriptionChunks.map((description, index) => {
    const footerText =
      descriptionChunks.length > 1 ? `Part ${index + 1}/${descriptionChunks.length}` : undefined
    const title = truncate(`[** ${stripAnsiCodes(context)} **]`, MAX_TITLE_LENGTH)
    const timeText = `**Time**: <t:${time}:R>`
    const descriptionLimit = Math.min(
      MAX_EMBED_DESCRIPTION_LENGTH,
      MAX_EMBED_TEXT_LENGTH - title.length - (footerText?.length || 0)
    )
    const payloadLimit = Math.max(0, descriptionLimit - timeText.length - 2)

    return {
      content: truncate(`**${level}**`, 2000),
      embeds: [
        {
          title,
          description: `${truncate(description, payloadLimit)}\n\n${timeText}`,
          color,
          ...(footerText ? { footer: { text: footerText } } : {})
        }
      ]
    }
  })
}

export default discordEmitter

async function sendDiscordMessages(webhook: string, bodies: DiscordWebhookBody[]): Promise<void> {
  for (const body of bodies) {
    await fetch(webhook, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

function toRenderableSegment(part: OutboundMessagePart): RenderableSegment {
  if (part.kind === 'structured') {
    return {
      prefix: '```json\n',
      content: stripAnsiCodes(part.text),
      suffix: '\n```'
    }
  }

  if (part.kind === 'inline') {
    return {
      prefix: '`',
      content: stripAnsiCodes(part.text),
      suffix: '`'
    }
  }

  return {
    prefix: '',
    content: stripAnsiCodes(part.text),
    suffix: ''
  }
}

function splitSegment(segment: RenderableSegment): RenderableSegment[] {
  const renderedLength = segment.prefix.length + segment.content.length + segment.suffix.length
  if (renderedLength <= MAX_EMBED_DESCRIPTION_LENGTH) {
    return [segment]
  }

  const maxContentLength =
    MAX_EMBED_DESCRIPTION_LENGTH - segment.prefix.length - segment.suffix.length

  if (maxContentLength <= 0) {
    return [
      {
        prefix: '',
        content: truncate(segment.content, MAX_EMBED_DESCRIPTION_LENGTH),
        suffix: ''
      }
    ]
  }

  const chunks: RenderableSegment[] = []
  for (let start = 0; start < segment.content.length; start += maxContentLength) {
    chunks.push({
      prefix: segment.prefix,
      content: segment.content.slice(start, start + maxContentLength),
      suffix: segment.suffix
    })
  }

  return chunks
}

function packSegments(segments: RenderableSegment[], maxLength: number): string[] {
  const chunks: string[] = []
  let current = ''

  for (const segment of segments) {
    const rendered = `${segment.prefix}${segment.content}${segment.suffix}`
    const candidate = current.length === 0 ? rendered : `${current}${DESCRIPTION_SEPARATOR}${rendered}`

    if (candidate.length <= maxLength) {
      current = candidate
      continue
    }

    if (current.length > 0) {
      chunks.push(current)
    }

    current = rendered
  }

  if (current.length > 0) {
    chunks.push(current)
  }

  return chunks
}

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : value.slice(0, maxLength)
}
