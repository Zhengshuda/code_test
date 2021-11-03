import { ComputedRef, computed } from '@vue/composition-api'
import { SORT_DIRECTION, SortStateType, TableColumns } from '../types'

// 再进行一层数据转换，用于构造传入useSorter的数据，使useSorter后续能被复用起来
export function useTableSorter(columnsRef: ComputedRef<TableColumns>): ComputedRef<SortStateType> {
  // 当前激活状态的排序列
  const activeSort = columnsRef.value.find(column => column.sort?.direction)
  const initedState: ComputedRef<SortStateType> = computed(() => {
    return {
      direction: activeSort?.sort?.direction || SORT_DIRECTION.DEFAULT,
      key: activeSort?.key || '',
    }
  })

  return initedState
}
