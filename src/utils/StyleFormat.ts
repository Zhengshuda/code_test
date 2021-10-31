import { isNumber, isString } from 'lodash'
import { Logger } from './Logger'

export function getPxResult(data: number | string): string {
  if (isNumber(data)) {
    return data + 'px'
  }

  if (isString(data) && data.indexOf('px') === -1) {
    Logger.error('StyleFormat/getPxResult', `只支持数字和带px的字符串,${data}不符合`);
    return data;
  }

  return data
}
