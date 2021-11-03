import { Logger } from '@/utils/Logger'
import { ComputedRef, computed } from '@vue/composition-api'
import { TableColumns, TablePublicProps } from '../types'

export function useColumns(props: TablePublicProps): ComputedRef<TableColumns> {
  if (!Array.isArray(props.columns)) {
    Logger.warn('useColumns', 'columns只能为数组')
  }

  // 做容错处理
  const newColumns = computed(() => Array.isArray(props.columns) ? props.columns : [])

  newColumns.value.forEach(column => {
    if (!column.key) {
      Logger.warn('useColumns', `column的key不能为空，此项有误`, column)
    }
  })

  return newColumns
}
