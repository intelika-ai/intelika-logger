
# @intelika/logger

Streamline your app's logging with @Intelika/logger, the ultimate tool for sending logs to Discord, Telegram, and beyond with just one line of code.


## Installation
Use the package manager of your choice to install the package:

npm:
```bash
npm install @intelika/logger
```
yarn:
```bash
yarn add @intelika/logger
```

## Emitters
- [File](./lib/log/emitters/file.emitter.ts)
- [Telegram](./lib/log/emitters/telegram.emitter.ts)
- [Discord Webhook](./lib/log/emitters/discord.emitter.ts)
- [Console](./lib/log/emitters/console.emitter.ts)

## Usage
the package can be used in any JavaScript or TypeScript project. Here are some examples of how to use it in different environments.

> [!NOTE]
> The package is designed to be used with TypeScript, but it can also be used in JavaScript projects.

Nest.js
```typescript
import { Module } from '@nestjs/common';
import { LogModule } from '@intelika/logger';

@Module({
    imports: [
       LogModule.forRoot({
            isGlobal: true,
            discordWebhook:  'https://discord.com/api/webhooks/...' // optional
        }),
    ],
  providers: [],
  exports: [],
})
export class AppModule {}

// cats.service.ts

import { Injectable } from '@nestjs/common';
import { LogService } from '@intelika/logger';

@Injectable()
export class CatsService {
  constructor(private readonly logger: LogService) {}

    findAll(): string {
        this.logger.log(message).context(CatsService.name).into(Emitter.CONSOLE)
        return 'This action returns all cats';
    }

    findOne(id: number): string {
        this.logger.log(message).context("findOne").into(Emitter.DISCORD)
        return `This action returns a #${id} cat`;
    }
}

```


everywhere else
```typescript
import { LogService, Emitter } from '@intelika/logger';

const logger = new LogService('myContext');

// --- OR --- 

// const logger = new LogService({
//   context: 'myContext',
//   discordWebhook: 'https://discord.com/api/webhooks/...'
// })

// const logger = new LogService({
//   telegram: {
//     chatId: '1234567890',
//     token: '1234567890:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
//   },
//   context: 'myContext'
// })

// const logger = new LogService(bootstrap.name)

// Log a message to the console
logger.log('Hello, world!').into(Emitter.CONSOLE);

// Log a warning to Discord
logger.warn('Something might be wrong...').into(Emitter.DISCORD);

// Log an error to Telegram
logger.error('Something went wrong!').into(Emitter.TELEGRAM);
```

> [!TIP]
> ```ts
>  const logger = new LogService({
>   telegram: {
>     chatId: '1234567890',
>     token: '1234567890:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
>   },
>   context: 'myContext'
> })
>```
> you can use the telegram emitter by providing the chatId and the token of your bot.

> [!TIP]
> ```ts
>  const logger = new LogService({
>   discordWebhook: 'https://discord.com/api/webhooks/...',
>   context: 'myContext'
> })
>```
> you can use the discord emitter by providing the webhook url.

> [!TIP]
> ```ts
> const logService = new LogService('TestContext', {
>  file: {
>    path: './logs',
>    includeDateInFilename: true,
>    fileFormat: 'log',
>    messageFormat: 'DATE - LEVEL | CONTEXT | MESSAGE'
>  }
>})
>```
> you can use the file emitter by providing the path of the file, the file format, and the message format.

## Examples
you can find more examples in the [examples](./examples) directory.

## API

### LogService

The main class of the package. Use it to create a new logger.

#### constructor(context: string | OptionsWithContext)

Creates a new logger. The context can be a string or an object with options.

#### log(...msg: any[])

Logs a message with the level 'INFO'.

#### warn(...msg: any[])

Logs a message with the level 'WARN'.

#### error(...msg: any[])

Logs a message with the level 'ERROR'.

### Message

This class is used internally to create a new message.

#### context(context: string)

Sets the context of the message.

#### is(level: LogLevel)

Sets the level of the message.

#### into(emitter: Emitter)

Sends the message to the specified emitter.

## Emitters

The package supports the following emitters:

- CONSOLE: Logs the message to the console.
- DISCORD: Sends the message to a Discord channel.
- TELEGRAM: Sends the message to a Telegram chat.
- FILE: Logs the message to a file.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
