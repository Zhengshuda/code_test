/**
 * Created by uedc on 2021/10/11.
 */

import { Logger } from '@/utils/Logger'
import {
  ComputedRef,
  PropType,
  computed,
  defineComponent,
  inject,
} from '@vue/composition-api'
import { getPxResult } from '../../utils/StyleFormat'
import { SORT_DIRECTION, SortDirection, TableColumn, TableKey, TableKeyInjection } from '../types'

export default defineComponent({
  name: 'TableHeaderCell',
  props: {
    column: {
      type: Object as PropType<TableColumn>,
      required: true,
    },
  },
  setup(props) {
    const InjectData = inject(TableKey) as TableKeyInjection
    const {
      align,
      contentBorder,
      sortState,
      changeSortState,
      emitFn,
    } = InjectData

    Logger.debug('HeaderCell.tsx/setup', '当前HeaderCell接收到的变量:', {
      props: props,
      inject: InjectData,
    })

    const column = props.column
    const hasSort = computed(() => column.key === sortState.value.key)
    const sortDirection: ComputedRef<SortDirection> = computed(() => {
      if (!hasSort.value) {
        return SORT_DIRECTION.DEFAULT
      }

      return sortState.value.direction
    })

    function headerClick() {
      emitFn('column-click', column)
      // sortFunction(e, column, sortDirection)
      changeSortState(column.key, sortDirection.value)
    }

    const upClassList = computed(() => {
      return {
        'table-thead-th-title__sort__asc': true,
        'active': hasSort && sortDirection.value === SORT_DIRECTION.ASC,
      }
    })
    const downClassList = computed(() => {
      return {
        'table-thead-th-title__sort__desc': true,
        'active': hasSort && sortDirection.value === SORT_DIRECTION.DESC,
      }
    })
    const thClassList = [
      'table-thead-th',
      column.className ? column.className : '',
      column.sort ? 'table-thead-th__sort' : '',
      contentBorder.value ? 'table-thead-th__border' : '',
    ]

    return () => {
      return (
        <th
          class={thClassList}
          key={column.key}
          style={{
            textAlign: column.align || align.value,
            ...column.width && { width: getPxResult(column.width) },
          }}
          utid={`table-header-${column.key}`}
          onClick={headerClick}>
          <div class="table-thead-th-title">
            <span class="table-thead-th-title__text">
              {column.title}
            </span>
            {
              column.sort ? (
                <span class="table-thead-th-title__sort">
                  <span class={upClassList.value}>up</span>
                  <span class={downClassList.value}>down</span>
                </span>) : ''
            }
          </div>
        </th>
      )
    }
  },
})
