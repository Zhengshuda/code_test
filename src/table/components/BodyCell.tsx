/**
 * Created by uedc on 2021/10/11.
 */

import { Logger } from '@/utils/Logger'
import {
  PropType,
  defineComponent,
  inject,
} from '@vue/composition-api'
import { getPxResult } from '../../utils/StyleFormat'
import { DataType, TableColumn, TableKey, TableKeyInjection } from '../types'

export default defineComponent({
  name: 'TableBodyCell',
  props: {
    column: {
      type: Object as PropType<TableColumn>,
      required: true,
    },
    data: {
      type: Object as PropType<DataType>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    isLast: {
      type: Boolean,
    },
  },
  setup(props) {
    const InjectData = inject(TableKey) as TableKeyInjection
    const {
      align,
      contentBorder,
      emitFn,
    } = InjectData

    Logger.debug('Body.tsx/setup', 'Body接收到的变量：', InjectData)

    const tdClassList = [
      'table-body-td',
      props.isLast ? 'table-body-td-last' : '',
      contentBorder.value ? 'table-body-td-border' : '',
    ]

    return () => {
      return (
        <td
          utid={`table-body-${props.column.key}-${props.index}`}
          class={tdClassList}
          style={{
            textAlign: props.column.align || align.value,
            ...props.column.width && { width: getPxResult(props.column.width) },
          }}
          onClick={() => emitFn('cell-click', props.data[props.column.key])}>
          <div
            style={{
              ...props.column.width && { width: getPxResult(props.column.width) },
            }}
            class="ellipsis">
            {props.column.render ? props.column.render(props.data, props.index) : props.data[props.column.key]}
          </div>
        </td>
      )
    }
  },
})
