const { format, createLogger, transports} = require("winston");
require("winston-daily-rotate-file");

/**
 * Logger handles all logs in the application
 */
const logger = createLogger({
  format: format.combine(format.timestamp(), format.simple()),
  colorize: true,
  transports: [
    new transports.File({
      filename: 'logs/server/error.log',
      level: 'error',
      handleExceptions: true
    }),
    new transports.File({
      filename: 'logs/server/all.log',
      level: 'info',
      handleExceptions: true
    }),
    new transports.DailyRotateFile({
      maxFiles: '14d',
      level: 'info',
      dirname: 'logs/server/daily',
      datePattern: 'YYYY-MM-DD',
      filename: '%DATE%.log'
    }),
    new transports.Console({
      level: 'debug',
      json: false,
      handleExceptions: true
    })
  ]
});
  
  module.exports = logger;
