
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
pnpm:
```bash
pnpm add @intelika/logger
```
bun:
```bash
bun add @intelika/logger
```

## Usage
the package can be used in any JavaScript or TypeScript project. Here are some examples of how to use it in different environments.


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
  constructor(private readonly logger: LogService) {
    // or create a new instance of LogService with a context
    this.logger = new LogService(CatsService.name);
  }

    findAll(): string {
        this.logger.log(message).into(Emitter.CONSOLE)
        return 'This action returns all cats';
    }

    findOne(id: number): string {
        this.logger.log(message).context("findOne").into(Emitter.CONSOLE)
        return `This action returns a #${id} cat`;
    }
}

```



```typescript
import { LogService, Emitter } from '@intelika/logger';

const logger = new LogService('myContext');

// Log a message to the console
logger.log('Hello, world!').into(Emitter.CONSOLE);

// Log a warning to Discord
logger.warn('Something might be wrong...').into(Emitter.DISCORD);

// Log an error to Telegram
logger.error('Something went wrong!').into(Emitter.TELEGRAM);
```

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

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
