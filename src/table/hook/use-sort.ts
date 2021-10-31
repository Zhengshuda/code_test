import { Logger } from '@/utils/Logger'
import { Ref, computed, getCurrentInstance, ref, watchEffect } from '@vue/composition-api'
import { cloneDeep, sortBy } from 'lodash'
import { DataType, MergeTableColumn, SORT_DIRECTION, SortDirection, SortFnType, TablePublicProps } from '../types'

export function useSort(props: TablePublicProps): {
  sortDataRef: Ref<DataType[]>
  sortFunction: (e: MouseEvent, column: MergeTableColumn, sortDirection: Ref<SortDirection>) => void
} {
  // 排序的数据
  const sortDataRef: Ref<DataType[]> = ref(props.data)

  const originData = computed(() => props.data)

  const vm = getCurrentInstance()

  watchEffect(() => {
    if (originData.value) {
      Logger.warn('useSort', '当传入表格的数据变化时，排序数据清空')
      sortDataRef.value = originData.value
    }
  })

  // 排序的函数 todo-jest 单测测试排序功能，检查头部是否变化 数据是否变化
  function sortFunction(e: MouseEvent, column: MergeTableColumn, sortDirection: Ref<SortDirection>) {
    if (!column.sort) {
      return
    }
    Logger.info('useSort/sortFunction', '触发排序函数')
    const defaultList = [SORT_DIRECTION.DEFAULT, SORT_DIRECTION.ASC, SORT_DIRECTION.DESC]
    const index = defaultList.findIndex(item => item === sortDirection.value)
    sortDirection.value = index + 1 > 2 ? defaultList[0] : defaultList[index + 1]
    column.sort.direction = sortDirection.value
    sortData(column.key, sortDirection.value, column.sort?.sortFn)
    vm?.emit('sort', e, column, sortDirection)
  }

  // 对数据进行排序
  function sortData(key: string, sortDirection: SortDirection, sortFn?: SortFnType) {
    Logger.trace('useSort/sortData', '传入sortData的数据为：', {
      key,
      sortDirection,
      sortFn,
    })
    let data = cloneDeep(originData.value)
    if (sortDirection === '') {
      sortDataRef.value = []
    }

    // 如果有排序数据，则保留排序数据，否则使用初始数据
    data = sortDataRef.value.length ? sortDataRef.value : data
    const list: string[] = [SORT_DIRECTION.ASC, SORT_DIRECTION.DESC]
    if (!list.includes(sortDirection)) {
      Logger.info('useSort/sortData', '传入sortData的sortDirection为', sortDirection)
      sortDataRef.value = data
      return
    }

    // 有自定义排序
    if (sortFn) {
      Logger.info('useSort/sortData', `当前key值为${key}的列有自动排序`)
      sortDataRef.value = data.sort((a: DataType, b: DataType) => {
        return sortFn(sortDirection, a[key], b[key])
      })

      return
    }

    // 默认排序
    function defaultSort() {
      Logger.info('useSort/defaultSort', '调用默认排序方法')
      if (sortDirection === SORT_DIRECTION.DESC) {
        data = sortBy(data, item => item[key])
        return data.reverse()
      }

      return sortBy(data, item => item[key])
    }

    sortDataRef.value = defaultSort()
  }

  return {
    sortDataRef,
    sortFunction,
  }
}
