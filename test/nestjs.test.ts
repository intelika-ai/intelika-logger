import { LogModule, LogService } from '../lib/index'
import { Test } from '@nestjs/testing'
//test logger library in NestJS
describe('NestJS', () => {
  let logService: LogService

  describe('Sync Logger', () => {
    // Test
    beforeAll(async () => {
      const AppModule = await Test.createTestingModule({
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
                discordWebhook: 'https://discord.com/api/webhooks/1234567890/ABCDEFGHIJKLMN'
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
  })
})
