import { Logger } from '@/utils/Logger'
import { ComputedRef, computed } from '@vue/composition-api'
import { isBoolean } from 'lodash'
import { MergeTableColumn, SortType, SORT_DIRECTION, TablePublicProps } from '../types'

const DEFAULT_SORT: SortType = {
  direction: SORT_DIRECTION.DEFAULT,
}

export function useColumns(props: TablePublicProps): ComputedRef<MergeTableColumn[]> {
  if (!Array.isArray(props.columns)) {
    Logger.error('useColumns', 'columns只能为数组');
  };
  const useColumns = computed(() => props.columns.map(item => {
    const sort = DEFAULT_SORT

    // 处理sort数据，因为sort可以传true，则这里给sort为true的情况添加默认配置
    if (item.sort) {
      item.sort = isBoolean(item.sort) ? sort : item.sort
    }

    return item
  })) as ComputedRef<MergeTableColumn[]>

  Logger.debug('useColumns', '构造出来的新columns为:', useColumns)

  return useColumns
}
