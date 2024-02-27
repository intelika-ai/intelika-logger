export interface MessageLogger {
    log(message: string, optionalParams?: any[]): Promise<void> | void;
    error(message: string, stack?: string, optionalParams?: any[]): Promise<void> | void;
    warn(message: string, stack?: string, optionalParams?: any[]): Promise<void> | void;
    debug(message: string, stack?: string, optionalParams?: any[]): Promise<void> | void;
}
