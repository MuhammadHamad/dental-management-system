import { Request, Response } from 'express';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  meta?: any;
}

class Logger {
  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message, meta));
  }

  warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, meta?: any): void {
    console.error(this.formatMessage('error', message, meta));
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  logRequest(req: Request, res: Response, responseTime?: number): void {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      responseTime: responseTime ? `${responseTime}ms` : undefined
    };

    this.info(`${req.method} ${req.originalUrl} - ${res.statusCode}`, logData);
  }
}

export const logger = new Logger();
