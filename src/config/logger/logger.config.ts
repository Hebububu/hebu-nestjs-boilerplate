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

/**
 * 콘솔 로그 포맷터
 *
 * @description
 * 문자열과 객체를 모두 지원하는 커스텀 로그 포맷터입니다.
 * - 문자열: 그대로 출력
 * - 객체: JSON 형식으로 예쁘게 출력 (들여쓰기 2칸)
 */
const consoleLogFormat = winston.format.printf((info) => {
  const level = info.level.toUpperCase();
  const timestamp = info.timestamp as string;
  const message = info.message;
  const context = info.context as string | undefined;
  const ms = info.ms as string | undefined;

  // 객체인 경우 JSON으로 변환, 문자열은 그대로 사용
  let formattedMessage: string;
  if (typeof message === 'object' && message !== null) {
    formattedMessage = JSON.stringify(message, null, 2);
  } else if (typeof message === 'string') {
    formattedMessage = message;
  } else {
    formattedMessage = String(message);
  }

  const contextStr = context ? `[${context}] ` : '';
  const msStr = ms ? ` ${ms}` : '';

  return `[App] ${timestamp} ${level} ${contextStr}${formattedMessage}${msStr}`;
});

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'MM/DD/YYYY, hh:mm:ss A' }),
        winston.format.ms(),
        consoleLogFormat,
        winston.format.colorize({ all: true }),
      ),
    }),
    dailyRotateFileTransport('error'),
    dailyRotateFileTransport('info'),
    dailyRotateFileTransport('debug'),
  ],
};
