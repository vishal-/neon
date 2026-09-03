// logger.ts

type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel =
  (globalThis as typeof globalThis & { LOG_LEVEL?: LogLevel }).LOG_LEVEL ??
  "info";

const minLevel = LEVELS[configuredLevel] ?? LEVELS.info;

function serializeError(error: unknown) {
  if (!(error instanceof Error)) {
    return error;
  }

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: error.cause,
  };
}

function normalizeContext(context: LogContext) {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    result[key] = value instanceof Error ? serializeError(value) : value;
  }

  return result;
}

function write(
  level: LogLevel,
  message: string,
  context: LogContext = {},
) {
  if (LEVELS[level] < minLevel) {
    return;
  }

  const log = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...normalizeContext(context),
  };

  // Keep each log entry as a single structured JSON object.
  switch (level) {
    case "error":
      console.error(JSON.stringify(log));
      break;
    case "warn":
      console.warn(JSON.stringify(log));
      break;
    case "debug":
      console.debug(JSON.stringify(log));
      break;
    default:
      console.log(JSON.stringify(log));
  }
}

export const logger = {
  debug(message: string, context?: LogContext) {
    write("debug", message, context);
  },

  info(message: string, context?: LogContext) {
    write("info", message, context);
  },

  warn(message: string, context?: LogContext) {
    write("warn", message, context);
  },

  error(message: string, context?: LogContext) {
    write("error", message, context);
  },

  child(context: LogContext) {
    return {
      debug(message: string, additionalContext?: LogContext) {
        write("debug", message, {
          ...context,
          ...additionalContext,
        });
      },

      info(message: string, additionalContext?: LogContext) {
        write("info", message, {
          ...context,
          ...additionalContext,
        });
      },

      warn(message: string, additionalContext?: LogContext) {
        write("warn", message, {
          ...context,
          ...additionalContext,
        });
      },

      error(message: string, additionalContext?: LogContext) {
        write("error", message, {
          ...context,
          ...additionalContext,
        });
      },
    };
  },
};