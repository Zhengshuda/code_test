/**
 * Created by uedc on 2021/10/11.
 */

import {
  computed,
  defineComponent,
  provide,
  watch,
} from '@vue/composition-api'
import { PagenationType, TableKey, TableKeyInjection, tableProps } from './types'
import TableContent from './components/Content'
import TablePagenation from './components/Pagenation'
import { useData } from './hook/use-data'
// import { useSort } from './hook/use-sort'
import { useColumnSort } from './hook/use-sort1'
import { useColumns } from './hook/use-columns'
import { usePage } from './hook/use-page'
import { Logger } from '@/utils/Logger'
import { isFunction } from 'lodash'

export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: ['page-change'],
  setup(props, { emit }) {
    Logger.trace('Table.tsx/setup', '传入表格组件的参数', props)
    const columnsRef = useColumns(props)
    // const {
    //   sortDataRef,
    //   sortFunction,
    // } = useSort(props)
    const {
      sortDataRef,
      newColumns
    } = useColumnSort(columnsRef.value, props.data)

    watch(newColumns,() => {
      console.log('newColumn数据变化', newColumns);
    })
    const {
      originPageRef,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep,
    } = usePage(props, (pageConfig: PagenationType) => emit('page-change', pageConfig))
    const {
      dataRef,
    } = useData(props, originPageRef, sortDataRef)

    const privideData: TableKeyInjection = {
      columnsRef: newColumns,
      align: computed(() => props.align),
      contentBorder: computed(() => props.contentBorder),
      dataRef,
      originPageRef,
      // sortFunction,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep,
      emitFn: emit,
    }

    Logger.debug('Table.tsx/setup', '通过hook后进入组件的变量', privideData)
    provide(TableKey, privideData)

    return () => (
      <div class={{
        'table-wrap': true,
        'table-wrap-border': props.border,
        'table-wrap-border-has-pagenation': props.pagenation,
      }}>
        <TableContent></TableContent>
        {
          props.data.length ? (
            props.pagenation ? (
              <div class="table-pagenation">
                <TablePagenation></TablePagenation>
              </div>
            ) : null
          ): (
            isFunction(props.emptyRender) ? props.emptyRender() : props.emptyRender
          )
        }
      </div>
    )
  },
})
