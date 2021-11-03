
import { Logger } from '@/utils/Logger'
import { ComputedRef, Ref, ref } from '@vue/composition-api'
import { SORT_DIRECTION, SortDirection, SortStateType } from '../types'

export function useSorter(initedState: ComputedRef<SortStateType>): {
  sortStateRef: Ref<SortStateType>
  changeSortState: (key: string, direction: SortDirection) => void
} {
  const sortStateRef: Ref<SortStateType> = ref(initedState.value)

  // 改变排序状态的唯一入口
  function changeSortState(key: string, direction: SortDirection) {
    // 按照[默认、asc、desc]的顺序切换
    const defaultList = [SORT_DIRECTION.DEFAULT, SORT_DIRECTION.ASC, SORT_DIRECTION.DESC]
    const index = defaultList.findIndex(item => item === direction)
    const sortDirection = index + 1 > 2 ? defaultList[0] : defaultList[index + 1]
    sortStateRef.value.direction = sortDirection
    sortStateRef.value.key = key
    Logger.info('use-sorter/changeSortState', '切换后的排序状态为：', sortStateRef.value)
  }

  return {
    sortStateRef,
    changeSortState,
  }
}
