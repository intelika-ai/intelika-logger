import fs from 'fs'
import path from 'path'
import { writeFile } from 'fs/promises'
import { consoleColors, PACKAGE_NAME } from '../../config'
import { Options } from '../interfaces/option.interface'

type LogLevel = 'WARN' | 'INFO' | 'ERROR'

const NEWLINE = `\n`

function serializeMessage(...messages: any[]): string {
  const payload: string[] = []
  const firstMessage = messages.shift()
  payload.push(stringifyMessage(firstMessage))
  for (const msg of messages) {
    if (msg.stack) payload.push(msg.stack)
    else if (typeof msg === 'object') payload.push(JSON.stringify(msg, null, 2))
    else if (typeof msg === 'number') payload.push(msg.toString())
    else payload.push(msg.toString())
  }
  return payload.join(NEWLINE)
}

function stringifyMessage(msg: any): string {
  if (msg.stack) return msg.stack
  if (typeof msg === 'object') return JSON.stringify(msg, null, 2)
  return msg.toString()
}

async function fileEmitter(options: Options, level: LogLevel, context: string, ...msg: any[]): Promise<void> {
  if (!options || !options.file) {
    console.warn(
      `[${PACKAGE_NAME}] ${consoleColors.red}No options provided or file options provided!${consoleColors.reset}`
    )
    return
  }

  if (!options.file.path) {
    console.warn(`[${PACKAGE_NAME}] ${consoleColors.red}No file path provided!${consoleColors.reset}`)
    return
  }

  const format = options.file.messageFormat || 'DATE - LEVEL | CONTEXT | MESSAGE'
  const message = format
    .replace('DATE', new Date().toISOString())
    .replace('LEVEL', level)
    .replace('CONTEXT', context)
    .replace('MESSAGE', serializeMessage(...msg))

  const flag = options.file.flags || 'a'

  const inputPath = path.resolve(options.file.path)
  const fileFormat = options.file.fileFormat || 'txt'

  try {
    const isDirectory = !path.extname(inputPath)
    if (isDirectory) {
      const filename = options.file.includeDateInFilename
        ? `${new Date().toISOString().split('T')[0]}-${path.basename(inputPath)}.${fileFormat}`
        : path.basename(inputPath)

      const outputPath = path.resolve(inputPath, filename)

      const outputDir = path.dirname(outputPath)
      await fs.promises.mkdir(outputDir, { recursive: true })

      await writeFile(outputPath, message + NEWLINE, { flag })
    } else {
      const outputPath = inputPath

      const isExists = await fs.promises.stat(path.dirname(inputPath)).catch(() => false)
      if (!isExists) {
        await fs.promises.mkdir(path.dirname(inputPath), { recursive: true })
      }

      await writeToFile(outputPath, message, flag)
    }
  } catch (error) {
    console.warn(`[${PACKAGE_NAME}] ${consoleColors.red}Error writing to file!${consoleColors.reset}`, error)
  }
}

async function writeToFile(outputPath: string, message: string, flag: string): Promise<void> {
  try {
    await writeFile(outputPath, message + NEWLINE, { flag })
  } catch (error) {
    console.warn(`[${PACKAGE_NAME}] ${consoleColors.red}Error writing to file!${consoleColors.reset}`, error)
  }
}

export default fileEmitter
