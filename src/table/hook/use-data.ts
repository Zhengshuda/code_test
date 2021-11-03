import { Logger } from '@/utils/Logger'
import { ComputedRef, Ref, computed } from '@vue/composition-api'
import { cloneDeep, sortBy } from 'lodash'
import { DataType, DefaultPagenationType, PagenationType, SORT_DIRECTION, SortStateType, TableColumns } from '../types'

export function useData(
  columnsRef: ComputedRef<TableColumns>,
  pagenationRef: ComputedRef<DefaultPagenationType | undefined>,
  originPageRef: Ref<PagenationType>,
  sortStateRef: Ref<SortStateType>,
  originDataRef: ComputedRef<DataType[]>,
): {
    dataRef: ComputedRef<DataType[]>
} {

  Logger.trace('useData', '传入的数据为：', {
    columnsRef,
    pagenationRef,
    originPageRef,
    sortStateRef,
    originDataRef,
  })

  // 排序数据
  const sortDataRef = computed(() => {
    const { direction, key } = sortStateRef.value

    // 深拷贝原始数据
    const defaultData = cloneDeep(originDataRef.value)

    // 如果direction为空，则使用初始数据
    if (!direction) {
      return defaultData
    }

    // 找到当前排序的列
    const sortColumn = columnsRef.value.find(column => column.key === key)

    const sortFn = sortColumn?.sort?.sortFn
    // 如果列有配置排序规则
    if (!sortFn) {
      // 使用默认排序
      Logger.info('use-data/sortDataRef', `使用默认排序, 排序字段为${key}`)
      const defaultSortData = sortBy(defaultData, item => item[key])
      return direction === SORT_DIRECTION.DESC ? defaultSortData.reverse() : defaultSortData
    }

    Logger.info('use-data/sortDataRef', '使用自定义排序')
    // 自定义排序
    return defaultData.sort((a, b) => {
      return sortFn(direction, a[key], b[key])
    })
  })

  // 排序+分页数据
  const dataRef = computed(() => {
    const {
      page,
      size,
    } = originPageRef.value

    Logger.debug('use-data', `分页的数据为：`, { page, size })

    const base = (page - 1) * size

    const defaultValue = sortDataRef.value.length ? sortDataRef.value : cloneDeep(originDataRef.value)

    Logger.debug('useData', '当传入的数据改变时，触发展示数据变化：', {
      sortDataRef: sortDataRef,
      originPageRef: originPageRef,
      dataRef: dataRef,
    })

    return pagenationRef.value ? defaultValue.slice(base, base + size) : defaultValue
  })

  return {
    dataRef,
  }
}
