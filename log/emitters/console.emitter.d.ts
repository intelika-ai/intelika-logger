type LogLevel = 'WARN' | 'INFO' | 'ERROR';
declare const consoleEmitter: (level: LogLevel, context: string, ...msg: any[]) => void;
export default consoleEmitter;
