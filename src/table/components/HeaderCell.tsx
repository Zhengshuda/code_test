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
  ComputedRef,
  watch,
} from '@vue/composition-api'
import { getPxResult } from '../../utils/StyleFormat'
import { MergeableTableColumn, SORT_DIRECTION, SortDirection, TableKey, TableKeyInjection } from '../types'

export default defineComponent({
  name: 'TableHeaderCell',
  props: {
    column: {
      type: Object as PropType<MergeableTableColumn>,
      required: true,
    },
  },
  setup(props) {
    const InjectData = inject(TableKey) as TableKeyInjection
    const {
      align,
      contentBorder,
      // sortFunction,
      emitFn,
    } = InjectData

    Logger.debug('HeaderCell.tsx/setup', '当前HeaderCell接收到的变量:', {
      props: props,
      inject: InjectData,
    })

    const column = computed(() => {
      console.log('为什么', {...props.column});
      return props.column;
    })
    const sortDirection: ComputedRef<SortDirection> = computed(() => {
      console.log({...props.column}, 'haha');
      return column.value.innerSort ? column.value.innerSort.direction : SORT_DIRECTION.DEFAULT
    });

    function headerClick(e: MouseEvent) {
      emitFn('column-click', column);
      console.log({...column.value});
      if (column.value.innerSort) {
        column.value.innerSort.sortFunction(sortDirection.value);
      }
    }

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
      column.value.className ? column.value.className : '',
      column.value.innerSort ? 'table-thead-th__sort' : '',
      contentBorder.value ? 'table-thead-th__border' : '',
    ]

    return () => {
      return (
        <th
          class={thClassList}
          key={column.value.key}
          style={{
            textAlign: column.value.align || align.value,
            ...column.value.width && { width: getPxResult(column.value.width) },
          }}
          utid={`table-header-${column.value.key}`}
          onClick={e => headerClick(e)}>
          <div class="table-thead-th-title">
            <span class="table-thead-th-title__text">
              {column.value.title}
            </span>
            {
              column.value.innerSort ? (
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
