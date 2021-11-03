/**
 * Created by uedc on 2021/10/11.
 */

import { Logger } from '@/utils/Logger'
import {
  defineComponent,
  inject,
} from '@vue/composition-api'
import { DataType, TableKey, TableKeyInjection } from '../types'
import TableBodyCell from './BodyCell'

export default defineComponent({
  name: 'TableBody',
  setup() {
    const InjectData = inject(TableKey) as TableKeyInjection
    const {
      columnsRef,
      dataRef,
      emitFn,
    } = InjectData

    Logger.debug('Body.tsx/setup', 'Body接收到的变量：', InjectData)

    return () => {
      return (
        <tbody class="table-body">
          {
            dataRef.value.map((item: DataType, index: number) => {
              const isLast = index === dataRef.value.length - 1
              return (
                <tr
                  class="table-body-tr"
                  utid={`table-body-row-${index}`}
                  onClick={() => emitFn('row-click', item)}>
                  {
                    columnsRef.value.map(column => {
                      return (<TableBodyCell
                        column={column}
                        data={item}
                        index={index}
                        isLast={isLast}
                      />)
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
