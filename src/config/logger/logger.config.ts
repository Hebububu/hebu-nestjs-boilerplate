import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = 'logs';

const dailyRotateFileTransport = (level: string): DailyRotateFile =>
  new DailyRotateFile({
    level,
    dirname: logDir,
    filename: `%DATE%-${level}.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  });

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('App', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    dailyRotateFileTransport('error'),
    dailyRotateFileTransport('info'),
    dailyRotateFileTransport('debug'),
  ],
};
