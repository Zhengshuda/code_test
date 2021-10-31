/**
 * Created by uedc on 2021/10/11.
 */

import { Logger } from '@/utils/Logger'
import {
  defineComponent,
  inject,
} from '@vue/composition-api'
import { getPxResult } from '../../utils/StyleFormat'
import { DataType, TableKey, TableKeyInjection } from '../types'

export default defineComponent({
  name: 'TableBody',
  setup() {
    const InjectData = inject(TableKey) as TableKeyInjection
    const {
      columnsRef,
      align,
      dataRef,
      contentBorder,
      emitFn,
    } = InjectData

    Logger.debug('Body.tsx/setup', 'Body接收到的变量：', InjectData)

    return () => {
      return (
        <tbody class="table-body">
          {
            dataRef.value.map((item: DataType, index: number) => {
              const isLastTd = index === dataRef.value.length - 1
              return (
                <tr class="table-body-tr" onClick={() => emitFn('row-click', item)}>
                  {
                    columnsRef.value.map(column => {
                      const tdClassList = [
                        'table-body-td',
                        isLastTd ? 'table-body-td-last' : '',
                        contentBorder.value ? 'table-body-td-border' : '',
                      ]
                      return (
                        <td
                          utid={`table-body-${column.key}-${index}`}
                          class={tdClassList}
                          style={{
                            textAlign: column.align || align.value,
                            ...column.width && { width: getPxResult(column.width) },
                          }}
                          onClick={() => emitFn('cell-click', item[column.key])}>
                          {column.render ? column.render(item, index) : item[column.key]}
                        </td>
                      )
                    })
                  }
                </ tr>
              )
            })
          }
        </tbody>
      )
    }
  },
})
