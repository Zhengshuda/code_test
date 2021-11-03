import { isNumber } from 'lodash'

export function getPxResult(data: number | string): string {
  if (isNumber(data)) {
    return data + 'px'
  }

  return data
}
