/**
 * @file 统一日志工具
 */
/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */

const isDev = process.env.NODE_ENV === 'development'

/**
 * 日志包装类
 * @param place 当前报错闻之
 * @param args 当前报错的内容
 * @param console 报错类型
 * @param isProdLog 生产模式下是否打印
 * @returns
 */
const LoggerWrap = (place: string, args: any[], log: any, isProdLog?: boolean) => {
  if (!isDev) {
    isProdLog && log(`[${place}] `, ...args)
    return
  }

  log(`[${place}] `, ...args)
}

export const Logger = {
  info: (place: string, ...args: any[]) => LoggerWrap(place, args, console.info, true),
  warn: (place: string, ...args: any[]) => LoggerWrap(place, args, console.warn),
  error: (place: string, ...args: any[]) => LoggerWrap(place, args, console.error),
  debug: (place: string, ...args: any[]) => LoggerWrap(place, args, console.log),
  trace: (place: string, ...args: any[]) => LoggerWrap(place, args, console.trace),
}
