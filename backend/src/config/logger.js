// ========================================
// LOGGER PROFISSIONAL
// ========================================

import { LOG_LEVELS } from '../constants.js';

const logLevel = process.env.LOG_LEVEL || LOG_LEVELS.INFO;

const LOG_PRIORITY = {
  [LOG_LEVELS.DEBUG]: 0,
  [LOG_LEVELS.INFO]: 1,
  [LOG_LEVELS.WARN]: 2,
  [LOG_LEVELS.ERROR]: 3
};

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message, meta = {}) => {
  const timestamp = getTimestamp();
  const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaStr}`;
};

const getColor = level => {
  switch (level) {
  case LOG_LEVELS.ERROR:
    return COLORS.red;
  case LOG_LEVELS.WARN:
    return COLORS.yellow;
  case LOG_LEVELS.INFO:
    return COLORS.green;
  case LOG_LEVELS.DEBUG:
    return COLORS.blue;
  default:
    return COLORS.reset;
  }
};

class Logger {
  shouldLog(level) {
    return LOG_PRIORITY[level] >= LOG_PRIORITY[logLevel];
  }

  log(level, message, meta = {}) {
    if (!this.shouldLog(level)) {
      return;
    }

    const color = getColor(level);
    const formatted = formatMessage(level, message, meta);
    // eslint-disable-next-line no-console
    console.log(`${color}${formatted}${COLORS.reset}`);
  }

  debug(message, meta = {}) {
    this.log(LOG_LEVELS.DEBUG, message, meta);
  }

  info(message, meta = {}) {
    this.log(LOG_LEVELS.INFO, message, meta);
  }

  warn(message, meta = {}) {
    this.log(LOG_LEVELS.WARN, message, meta);
  }

  error(message, meta = {}) {
    this.log(LOG_LEVELS.ERROR, message, meta);
  }
}

export default new Logger();
