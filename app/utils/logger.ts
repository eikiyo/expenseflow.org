/**
 * LOGGING UTILITY
 * 
 * Provides consistent logging across the application.
 * Helps track auth flow, profile operations, and errors.
 * 
 * Dependencies: None
 * Used by: Auth provider, profile hooks, and other components
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogOptions {
  level?: LogLevel
  module?: string
  meta?: Record<string, any>
  message?: string
  data?: Record<string, any>
}

export class Logger {
  private static formatMessage(message: string, options: LogOptions = {}) {
    const { level = 'info', module = '', meta, data } = options;
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` meta=${JSON.stringify(meta)}` : '';
    const dataStr = data ? ` data=${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}]${module ? ` [${module}]` : ''} ${message}${metaStr}${dataStr}`;
  }

  static debug(message: string, options: LogOptions = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage(message, { ...options, level: 'debug' }));
    }
  }

  static info(message: string, options: LogOptions = {}) {
    console.info(this.formatMessage(message, { ...options, level: 'info' }));
  }

  static warn(message: string, options: LogOptions = {}) {
    console.warn(this.formatMessage(message, { ...options, level: 'warn' }));
  }

  static error(message: string, options: LogOptions = {}) {
    console.error(this.formatMessage(message, { ...options, level: 'error' }));
  }

  static auth = {
    debug: (message: string, options: LogOptions = {}) => {
      Logger.debug(message, { ...options, module: 'auth' });
    },
    info: (message: string, options: LogOptions = {}) => {
      Logger.info(message, { ...options, module: 'auth' });
    },
    warn: (message: string, options: LogOptions = {}) => {
      Logger.warn(message, { ...options, module: 'auth' });
    },
    error: (message: string, options: LogOptions = {}) => {
      Logger.error(message, { ...options, module: 'auth' });
    }
  };

  static db = {
    debug: (message: string, options: LogOptions = {}) => {
      Logger.debug(message, { ...options, module: 'db' });
    },
    info: (message: string, options: LogOptions = {}) => {
      Logger.info(message, { ...options, module: 'db' });
    },
    warn: (message: string, options: LogOptions = {}) => {
      Logger.warn(message, { ...options, module: 'db' });
    },
    error: (message: string, options: LogOptions = {}) => {
      Logger.error(message, { ...options, module: 'db' });
    }
  };
}

export default Logger; 