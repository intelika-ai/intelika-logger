export type OutboundMessagePart =
  | { kind: 'text'; text: string }
  | { kind: 'inline'; text: string }
  | { kind: 'structured'; text: string }

type CompactState = {
  seen: WeakSet<object>
}

const ANSI_REGEX = /\x1B\[[0-?]*[ -/]*[@-~]/g
const DEFAULT_MAX_DEPTH = 4
const DEFAULT_MAX_STRING_LENGTH = 320
const DEFAULT_MAX_STACK_LENGTH = 1800
const DEFAULT_MAX_ARRAY_ITEMS = 8
const DEFAULT_MAX_OBJECT_ENTRIES = 12

const STRING_LIMITS_BY_KEY: Record<string, number> = {
  stack: DEFAULT_MAX_STACK_LENGTH,
  message: 512,
  responseBody: 512,
  requestBodyValues: 768,
  system: 384,
  text: 384,
  content: 384
}

const ARRAY_LIMITS_BY_KEY: Record<string, number> = {
  messages: 4,
  system: 4,
  results: 5
}

const OBJECT_LIMITS_BY_KEY: Record<string, number> = {
  requestBodyValues: 8,
  responseHeaders: 10,
  headers: 10,
  data: 10
}

const REDACTED_KEY_PATTERN = /(authorization|api[-_]?key|token|secret|password|cookie)/i

export function stripAnsiCodes(str: string): string {
  return str.replace(ANSI_REGEX, '')
}

export function compactLogValue(value: unknown): unknown {
  return compactValue(value, { seen: new WeakSet<object>() })
}

export function createOutboundMessageParts(messages: any[]): OutboundMessagePart[] {
  return messages.map(message => {
    const compacted = compactLogValue(message)

    if (typeof compacted === 'string') {
      return { kind: 'text', text: compacted }
    }

    if (
      typeof compacted === 'number' ||
      typeof compacted === 'boolean' ||
      typeof compacted === 'bigint'
    ) {
      return { kind: 'inline', text: compacted.toString() }
    }

    if (compacted === null) {
      return { kind: 'inline', text: 'null' }
    }

    return {
      kind: 'structured',
      text: JSON.stringify(compacted, null, 2)
    }
  })
}

export function serializeCompactMessages(messages: any[], separator = '\n'): string {
  return createOutboundMessageParts(messages)
    .map(part => part.text)
    .join(separator)
}

function compactValue(value: unknown, state: CompactState, key?: string, depth = 0): unknown {
  if (value === null) return null
  if (value === undefined) return '[undefined]'

  if (typeof value === 'string') {
    return truncateString(stripAnsiCodes(value), getStringLimit(key))
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'bigint') {
    return value.toString()
  }

  if (typeof value === 'symbol') {
    return value.toString()
  }

  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (value instanceof Error) {
    return compactError(value, state, depth)
  }

  if (Array.isArray(value)) {
    return compactArray(value, state, key, depth)
  }

  if (typeof value === 'object') {
    return compactObject(value as Record<string, unknown>, state, key, depth)
  }

  return String(value)
}

function compactError(error: Error, state: CompactState, depth: number): Record<string, unknown> {
  if (state.seen.has(error)) {
    return { name: error.name || 'Error', message: '[Circular]' }
  }

  state.seen.add(error)

  const result: Record<string, unknown> = {
    name: error.name || 'Error',
    message: truncateString(stripAnsiCodes(error.message || ''), getStringLimit('message'))
  }

  if (error.stack) {
    result.stack = truncateString(stripAnsiCodes(error.stack), getStringLimit('stack'))
  }

  if ('cause' in error && error.cause !== undefined) {
    result.cause = compactValue(error.cause, state, 'cause', depth + 1)
  }

  const extraEntries = Object.entries(error).filter(
    ([key]) => !Object.prototype.hasOwnProperty.call(result, key)
  )
  appendEntries(result, extraEntries, state, depth, undefined)

  state.seen.delete(error)
  return result
}

function compactArray(
  value: unknown[],
  state: CompactState,
  key: string | undefined,
  depth: number
): unknown[] | string {
  if (depth >= DEFAULT_MAX_DEPTH) {
    return `[Array(${value.length})]`
  }

  const maxItems = ARRAY_LIMITS_BY_KEY[key || ''] || DEFAULT_MAX_ARRAY_ITEMS
  const compacted = value
    .slice(0, maxItems)
    .map(item => compactValue(item, state, undefined, depth + 1))

  if (value.length > maxItems) {
    compacted.push(`[... ${value.length - maxItems} more items]`)
  }

  return compacted
}

function compactObject(
  value: Record<string, unknown>,
  state: CompactState,
  key: string | undefined,
  depth: number
): Record<string, unknown> | string {
  if (state.seen.has(value)) {
    return '[Circular]'
  }

  if (depth >= DEFAULT_MAX_DEPTH) {
    return `[${getObjectLabel(value)}]`
  }

  state.seen.add(value)
  const result: Record<string, unknown> = {}
  appendEntries(result, Object.entries(value), state, depth, key)
  state.seen.delete(value)

  return result
}

function appendEntries(
  target: Record<string, unknown>,
  entries: [string, unknown][],
  state: CompactState,
  depth: number,
  parentKey: string | undefined
): void {
  const maxEntries = OBJECT_LIMITS_BY_KEY[parentKey || ''] || DEFAULT_MAX_OBJECT_ENTRIES
  const limitedEntries = entries.slice(0, maxEntries)

  for (const [entryKey, entryValue] of limitedEntries) {
    if (REDACTED_KEY_PATTERN.test(entryKey)) {
      target[entryKey] = '[Redacted]'
      continue
    }

    target[entryKey] = compactValue(entryValue, state, entryKey, depth + 1)
  }

  if (entries.length > maxEntries) {
    target.__omittedKeys = `[${entries.length - maxEntries} more keys omitted]`
  }
}

function getObjectLabel(value: Record<string, unknown>): string {
  const constructorName = value.constructor?.name
  return constructorName && constructorName !== 'Object' ? constructorName : 'Object'
}

function getStringLimit(key?: string): number {
  return STRING_LIMITS_BY_KEY[key || ''] || DEFAULT_MAX_STRING_LENGTH
}

function truncateString(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value
  }

  const truncatedCharacters = value.length - maxLength
  return `${value.slice(0, maxLength)}... [truncated ${truncatedCharacters} chars]`
}
