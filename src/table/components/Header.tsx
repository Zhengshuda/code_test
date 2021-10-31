/**
 * Created by uedc on 2021/10/11.
 */

import { Logger } from '@/utils/Logger'
import {
  defineComponent,
  inject,
} from '@vue/composition-api'
import { TableKey, TableKeyInjection } from '../types'
import TableHeaderCell from './HeaderCell'

export default defineComponent({
  name: 'TableHeader',
  setup() {
    const InjectData = inject(TableKey) as TableKeyInjection
    const {
      columnsRef,
    } = InjectData

    Logger.debug('Header.tsx/setup', 'Header接收到的变量：', InjectData)

    return () => {
      return (
        <thead class="table-thead">
          <tr class="table-thead-tr">
            {
              columnsRef.value.map(column => {
                return (<TableHeaderCell column={column}/>)
              })
            }
          </tr>
        </thead>
      )
    }
  },
})
