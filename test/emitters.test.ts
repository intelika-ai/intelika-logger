import { Logger } from '@nestjs/common'
import consoleEmitter from '../lib/log/emitters/console.emitter'
import discordEmitter, { buildDiscordWebhookBodies } from '../lib/log/emitters/discord.emitter'
import {
  compactLogValue,
  createOutboundMessageParts
} from '../lib/log/emitters/shared/outbound-serializer'

const flushPromises = async () => {
  await new Promise(resolve => setImmediate(resolve))
}

describe('Outbound emitters', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('compacts long values while preserving object shape', () => {
    const compacted = compactLogValue({
      short: 'ok',
      long: 'a'.repeat(500),
      headers: {
        authorization: 'secret-token',
        requestId: 'req_123',
        host: 'example.com'
      },
      items: Array.from({ length: 12 }, (_, index) => ({ index, value: `item-${index}` }))
    }) as Record<string, unknown>

    expect(compacted.short).toBe('ok')
    expect(compacted.long).toEqual(expect.stringContaining('[truncated'))
    expect(compacted.headers).toEqual(
      expect.objectContaining({
        authorization: '[Redacted]',
        requestId: 'req_123'
      })
    )
    expect(compacted.items).toEqual(expect.arrayContaining(['[... 4 more items]']))
  })

  it('keeps errors structured and strips ansi codes', () => {
    const error = Object.assign(new Error('\u001b[31mboom\u001b[39m'), {
      responseBody: '\u001b[32m' + 'x'.repeat(800) + '\u001b[39m'
    })

    const parts = createOutboundMessageParts([error])
    expect(parts).toHaveLength(1)
    expect(parts[0].kind).toBe('structured')
    expect(parts[0].text).toContain('"name": "Error"')
    expect(parts[0].text).toContain('"message": "boom"')
    expect(parts[0].text).toContain('"stack": "Error: boom')
    expect(parts[0].text).not.toContain('\u001b[')
    expect(parts[0].text).toContain('[truncated')
  })

  it('keeps console emitter verbose', () => {
    const payload = {
      long: 'x'.repeat(500),
      nested: { keep: true }
    }
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined)

    consoleEmitter('ERROR', 'ConsoleContext', payload)

    expect(errorSpy).toHaveBeenCalledWith(JSON.stringify(payload))
  })

  it('builds a single discord webhook body for small payloads', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1778151894000)

    const bodies = buildDiscordWebhookBodies('ERROR', 'DiscordContext', 0xff0000, {
      ok: true,
      code: 400
    })

    expect(bodies).toHaveLength(1)
    expect(bodies[0].embeds[0].description).toContain('"ok": true')
    expect(bodies[0].embeds[0].description).toContain('**Time**: <t:1778151894:R>')
    expect(bodies[0].embeds[0].footer).toBeUndefined()
    expectDiscordLimits(bodies)
  })

  it('splits oversized discord payloads across multiple webhook messages', () => {
    const largePayload = Object.fromEntries(
      Array.from({ length: 12 }, (_, index) => [`key${index}`, 'x'.repeat(900)])
    )

    const bodies = buildDiscordWebhookBodies(
      'ERROR',
      'DiscordContext',
      0xff0000,
      largePayload,
      largePayload
    )

    expect(bodies.length).toBeGreaterThan(1)
    expect(bodies[0].embeds[0].description).toContain('**Time**: <t:')
    expect(bodies[0].embeds[0].footer?.text).toContain('Part 1/')
    expect(bodies[0].embeds[0].footer?.text).not.toContain('<t:')
    expectDiscordLimits(bodies)
  })

  it('sends one discord request per generated webhook body', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true })
    global.fetch = fetchMock as typeof fetch

    const largePayload = Object.fromEntries(
      Array.from({ length: 12 }, (_, index) => [`key${index}`, 'x'.repeat(900)])
    )

    const expectedBodies = buildDiscordWebhookBodies(
      'ERROR',
      'DiscordContext',
      0xff0000,
      largePayload,
      largePayload
    )

    discordEmitter(
      { discordWebhook: 'https://discord.com/api/webhooks/test/test' },
      'ERROR',
      'DiscordContext',
      largePayload,
      largePayload
    )
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledTimes(expectedBodies.length)
  })
})

function expectDiscordLimits(bodies: ReturnType<typeof buildDiscordWebhookBodies>): void {
  for (const body of bodies) {
    expect(body.content.length).toBeLessThanOrEqual(2000)
    expect(body.embeds).toHaveLength(1)

    const embed = body.embeds[0]
    const embedTextSize =
      embed.title.length + embed.description.length + (embed.footer?.text.length || 0)

    expect(embed.title.length).toBeLessThanOrEqual(256)
    expect(embed.description.length).toBeLessThanOrEqual(4096)
    expect(embedTextSize).toBeLessThanOrEqual(6000)
  }
}
