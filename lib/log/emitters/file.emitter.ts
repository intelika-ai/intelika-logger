import path from 'path'
import { consoleColors, PACKAGE_NAME } from '../../config'
import { Options } from '../interfaces/option.interface'
import { writeFile } from 'fs/promises'
import fs from 'fs'

type LogLevel = 'WARN' | 'INFO' | 'ERROR' | 'info'

const NEWLINE = `\n`
function serializeMessage(...messages: any[]) {
  const payload = []
  const firstMessage = messages.shift()
  payload.push(`${stringifyMessage(firstMessage)}`)
  for (const msg of messages) {
    if (msg.stack) payload.push(`${msg.stack}`)
    else if (typeof msg === 'object') payload.push(`${JSON.stringify(msg, null, 2)}`)
    else if (typeof msg === 'number') payload.push(`${msg}`)
    else payload.push(msg.toString())
  }
  return payload.join(NEWLINE)
}

function stringifyMessage(msg: any) {
  if (msg.stack) return msg.stack
  if (typeof msg === 'object') return JSON.stringify(msg, null, 2)
  return msg.toString()
}

const fileEmitter = async (options: Options, level: LogLevel, context: string, ...msg: any[]) => {
  if (!options) {
    return console.warn(`[${PACKAGE_NAME}] ${consoleColors.red}No options provided!${consoleColors.reset}`)
  }

  if (!options?.file) {
    return console.warn(
      `[${PACKAGE_NAME}] ${consoleColors.red}No file options provided!${consoleColors.reset}`
    )
  }

  if (!options.file.path) {
    return console.warn(`[${PACKAGE_NAME}] ${consoleColors.red}No file path provided!${consoleColors.reset}`)
  }

  const format = options?.file?.messageFormat || 'DATE - LEVEL | CONTEXT | MESSAGE'
  const message = format
    .replace('DATE', new Date().toISOString())
    .replace('LEVEL', level)
    .replace('CONTEXT', context)
    .replace('MESSAGE', serializeMessage(...msg))

  const flag = options.file.flags || 'a'

  const inputPath = path.resolve(options.file.path) // can be file or directory
  const fileFormat = options.file.fileFormat || 'txt'
  if (path.extname(inputPath)) {
    const outputPath = inputPath + `.${fileFormat}`
    await write(outputPath, message, flag)
  } else {
    const filename = options.file.includeDateInFilename
      ? `${new Date().toISOString().split('T')[0]}-${path.basename(inputPath)}.${fileFormat}`
      : path.basename(inputPath)

    try {
      const isExists = await fs.promises.stat(inputPath).catch(() => false)
      if (!isExists) {
        await fs.promises.mkdir(inputPath, { recursive: true })
      }

      const outputPath = path.resolve(inputPath, filename)

      write(outputPath, message, flag)
    } catch (error) {
      return console.warn(
        `[${PACKAGE_NAME}] ${consoleColors.red}Error writing to file!${consoleColors.reset}`,
        error
      )
    }
  }
}

async function write(outputPath: string, message: string, flag: string) {
  try {
    await writeFile(outputPath, message + NEWLINE, { flag })
  } catch (error) {
    return console.warn(
      `[${PACKAGE_NAME}] ${consoleColors.red}Error writing to file!${consoleColors.reset}`,
      error
    )
  }
}

export default fileEmitter
