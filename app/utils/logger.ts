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
  data?: Record<string, any>
}

// Enable debug mode in development
const DEBUG = process.env.NODE_ENV === 'development'

export class Logger {
  private static formatMessage(message: string, options: LogOptions = {}) {
    const timestamp = new Date().toISOString()
    const module = options.module ? `[${options.module}]` : ''
    return `${timestamp} ${module} ${message}`
  }

  private static formatData(data: any): string {
    try {
      return JSON.stringify(data, null, 2)
    } catch (error) {
      return String(data)
    }
  }

  static debug(message: string, options: LogOptions = {}) {
    if (!DEBUG) return
    const formattedMessage = this.formatMessage(message, { ...options, level: 'debug' })
    console.debug(
      '%c🔍 DEBUG%c %s',
      'color: #6B7280; font-weight: bold',
      'color: inherit',
      formattedMessage,
      options.data ? '\n' + this.formatData(options.data) : ''
    )
  }

  static info(message: string, options: LogOptions = {}) {
    const formattedMessage = this.formatMessage(message, { ...options, level: 'info' })
    console.log(
      '%c✅ INFO%c %s',
      'color: #10B981; font-weight: bold',
      'color: inherit',
      formattedMessage,
      options.data ? '\n' + this.formatData(options.data) : ''
    )
  }

  static warn(message: string, options: LogOptions = {}) {
    const formattedMessage = this.formatMessage(message, { ...options, level: 'warn' })
    console.warn(
      '%c⚠️ WARN%c %s',
      'color: #F59E0B; font-weight: bold',
      'color: inherit',
      formattedMessage,
      options.data ? '\n' + this.formatData(options.data) : ''
    )
  }

  static error(message: string, options: LogOptions = {}) {
    const formattedMessage = this.formatMessage(message, { ...options, level: 'error' })
    console.error(
      '%c❌ ERROR%c %s',
      'color: #EF4444; font-weight: bold',
      'color: inherit',
      formattedMessage,
      options.data ? '\n' + this.formatData(options.data) : ''
    )
  }

  // Auth specific logging
  static auth = {
    debug: (message: string, data?: any) => Logger.debug(message, { module: 'Auth', data }),
    info: (message: string, data?: any) => Logger.info(message, { module: 'Auth', data }),
    warn: (message: string, data?: any) => Logger.warn(message, { module: 'Auth', data }),
    error: (message: string, data?: any) => Logger.error(message, { module: 'Auth', data })
  }

  // Profile specific logging
  static profile = {
    debug: (message: string, data?: any) => Logger.debug(message, { module: 'Profile', data }),
    info: (message: string, data?: any) => Logger.info(message, { module: 'Profile', data }),
    warn: (message: string, data?: any) => Logger.warn(message, { module: 'Profile', data }),
    error: (message: string, data?: any) => Logger.error(message, { module: 'Profile', data })
  }
}

export default Logger; 