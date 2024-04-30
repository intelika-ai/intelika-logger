import consoleEmitter from '../lib/log/emitters/console.emitter'
import { LogModule, LogService } from '../lib/index'
import { Test, TestingModule } from '@nestjs/testing'

//test logger library in NestJS
describe('NestJS', () => {
  let logService: LogService
  let AppModule: TestingModule
  describe('Sync Logger', () => {
    // Test
    beforeAll(async () => {
      AppModule = await Test.createTestingModule({
        imports: [
          LogModule.forRoot({
            isGlobal: true,
            discordWebhook: 'https://discord.com/api/webhooks/1234567890/ABCDEFGHIJKLMN'
          })
        ],
        providers: []
      }).compile()

      logService = AppModule.get(LogService)
    })

    it('should be defined', () => {
      expect(logService).toBeDefined()
    })
  })

  describe('Async Logger', () => {
    // Test

    beforeAll(async () => {
      const AppModule = await Test.createTestingModule({
        imports: [
          LogModule.forRootAsync({
            isGlobal: true,
            useFactory: () => {
              return {
                discordWebhook: 'xxx'
              }
            }
          })
        ],
        providers: []
      }).compile()

      logService = AppModule.get(LogService)
    })

    it('should be defined', () => {
      expect(logService).toBeDefined()
    })

    it('should log a message with the INFO severity level', () => {
      const message = logService.log('This is an info message')
      expect(message['level']).toBe('INFO')
    })

    it('should log a message with the WARN severity level', () => {
      const message = logService.warn('This is a warning message')
      expect(message['level']).toBe('WARN')
    })

    it('should log a message with the ERROR severity level', () => {
      const message = logService.error('This is an error message')
      expect(message['level']).toBe('ERROR')
    })
  })

  describe('build module', () => {
    it('should build module', async () => {
      const module = LogModule.forRoot({
        isGlobal: true,
        discordWebhook: 'https://discord.com/api/webhooks/1234567890/ABCDEFGHIJKLMN'
      })
      expect(module).toBeDefined()
    })

    it('should build module async', async () => {
      const module = LogModule.forRootAsync({
        isGlobal: true,
        useFactory: () => {
          return {
            discordWebhook: 'xxx'
          }
        }
      })
      expect(module).toBeDefined()
    })

    it('should build module async with inject', async () => {
      const module = LogModule.forRootAsync({
        isGlobal: true,
        useFactory: () => {
          return {
            discordWebhook: 'xxx'
          }
        },
        inject: []
      })
      expect(module).toBeDefined()
    })

    it('nest module should be defined', async () => {
      const module = await Test.createTestingModule({
        imports: [
          LogModule.forRoot({
            isGlobal: true,
            discordWebhook: 'https://discord.com/api/webhooks/1234567890/ABCDEFGHIJKLMN'
          })
        ],
        providers: []
      }).compile()

      expect(module).toBeDefined()
    })
    it('nest module async should be defined', async () => {
      const module = await Test.createTestingModule({
        imports: [
          LogModule.forRootAsync({
            isGlobal: true,
            useFactory: () => {
              return {
                discordWebhook: 'xxx'
              }
            }
          })
        ],
        providers: []
      }).compile()

      expect(module).toBeDefined()
    })

    it('should be defined', () => {
      expect(consoleEmitter).toBeDefined()
    })
  })
})
