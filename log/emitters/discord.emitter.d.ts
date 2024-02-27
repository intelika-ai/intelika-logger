type LogLevel = 'WARN' | 'INFO' | 'ERROR';
declare const discordEmitter: (level: LogLevel, context: string, ...msg: any[]) => void;
export default discordEmitter;
