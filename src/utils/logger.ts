import c from "chalk"

export const logger = {
  info: (message: string): void => console.info(`[${c.greenBright("INFO")}] ${message}`),
  warn: (message: string): void => console.warn(`[${c.yellowBright("WARN")}] ${message}`),
  error: (message: string): void => console.error(`[${c.redBright("ERR")}] ${message}`)
}
