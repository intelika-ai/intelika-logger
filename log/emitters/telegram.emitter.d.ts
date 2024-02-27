type LogLevel = 'WARN' | 'INFO' | 'ERROR';
declare const telegramEmitter: (level: LogLevel, context: string, ...msg: any[]) => void;
export default telegramEmitter;
