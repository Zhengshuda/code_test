/**
 * @file 统一日志工具
 */

const isDev = process.env.NODE_ENV === 'development';

/**
 * 日志包装类
 * @param place 当前报错闻之 
 * @param args 当前报错的内容
 * @param console 报错类型
 * @param isProdLog 生产模式下是否打印
 * @returns 
 */
const LoggerWrap = (place: string, args: any[], console: any, isProdLog?: boolean) => {
  if (!isDev) {
    isProdLog && console(`[${place}] `, ...args);
    return;
  }

  console(`[${place}] `, ...args);
};

export const Logger = {
  info: (place: string, ...args: any[]) => LoggerWrap(place, args, console.info, true),
  warn: (place: string, ...args: any[]) => LoggerWrap(place, args, console.warn, true),
  error: (place: string, ...args: any[]) => LoggerWrap(place, args, console.error, true),
  debug: (place: string, ...args: any[]) => LoggerWrap(place, args, console.debug),
  trace: (place: string, ...args: any[]) => LoggerWrap(place, args, console.trace),
};