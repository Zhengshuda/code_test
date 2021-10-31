/**
 * Created by uedc on 2021/10/11.
 */

import { Logger } from '@/utils/Logger'
import {
  PropType,
  Ref,
  computed,
  defineComponent,
  inject,
  ref,
} from '@vue/composition-api'
import { getPxResult } from '../../utils/StyleFormat'
import { MergeTableColumn, SORT_DIRECTION, SortDirection, TableKey, TableKeyInjection } from '../types'

export default defineComponent({
  name: 'TableHeaderCell',
  props: {
    column: {
      type: Object as PropType<MergeTableColumn>,
      required: true,
    },
  },
  setup(props) {
    const InjectData = inject(TableKey) as TableKeyInjection
    const {
      align,
      contentBorder,
      sortFunction,
      emitFn,
    } = InjectData

    Logger.debug('HeaderCell.tsx/setup', '当前HeaderCell接收到的变量:', {
      props: props,
      inject: InjectData,
    })

    function headerClick(e: MouseEvent, column: MergeTableColumn, sortDirection: Ref<SortDirection>) {
      emitFn('column-click', column)
      sortFunction(e, column, sortDirection)
    }

    const column = props.column
    const sortDirection: Ref<SortDirection> = ref(SORT_DIRECTION.DEFAULT)
    const upClassList = computed(() => {
      return {
        'table-thead-th-title__sort__asc': true,
        'active': sortDirection.value === SORT_DIRECTION.ASC,
      }
    })
    const downClassList = computed(() => {
      return {
        'table-thead-th-title__sort__desc': true,
        'active': sortDirection.value === SORT_DIRECTION.DESC,
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
          onClick={e => headerClick(e, column, sortDirection)}>
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
