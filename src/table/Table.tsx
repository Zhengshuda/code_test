/**
 * Created by uedc on 2021/10/11.
 */

import {
  computed,
  defineComponent,
  provide,
} from '@vue/composition-api'
import { TableKey, TableKeyInjection, tableProps } from './types'
import TableContent from './components/Content'
import TablePagenation from './components/Pagenation'
import { useData } from './hook/use-data'
import { useColumns } from './hook/use-columns'
import { usePage } from './hook/use-page'
import { Logger } from '@/utils/Logger'
import { isFunction } from 'lodash'
import { useSorter } from './hook/use-sorter'
import { useTableSorter } from './hook/use-table-sorter'

export default defineComponent({
  name: 'Table',
  props: tableProps,
  emits: ['page-change'],
  setup(props, { emit }) {
    Logger.trace('Table.tsx/setup', '传入表格组件的参数', props)

    if (!Array.isArray(props.data)) {
      Logger.warn('useData', '传入的data不能为非数组', props.data)
    }

    // 初始数据
    const originDataRef = computed(() => Array.isArray(props.data) ? props.data : [])

    // 分页数据
    const pagenationRef = computed(() => props.pagenation)

    // 调用useColumns，获取一个新的数组
    const columnsRef = useColumns(props)

    // 获取初始化排序状态
    const initedState = useTableSorter(columnsRef)

    // 调用useSorter，获取排序状态
    const {
      sortStateRef,
      changeSortState,
    } = useSorter(initedState)

    // 调用usePage，获取分页状态
    const {
      originPageRef,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep,
    } = usePage(originDataRef, pagenationRef, emit)

    // 调用useData，获取表格数据
    const {
      dataRef,
    } = useData(
      columnsRef,
      pagenationRef,
      originPageRef,
      sortStateRef,
      originDataRef)

    const privideData: TableKeyInjection = {
      columnsRef: columnsRef,
      align: computed(() => props.align),
      contentBorder: computed(() => props.contentBorder),
      dataRef,
      originPageRef,
      sortState: computed(() => sortStateRef.value),
      changeSortState,
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
                <TablePagenation
                  pageConfig={originPageRef.value}
                  lastPagenationStep={lastPagenationStep}
                  nextPagenationStep={nextPagenationStep}
                  setPagenationStep={setPagenationStep}></TablePagenation>
              </div>
            ) : null
          ) : (
            isFunction(props.emptyRender) ?
              props.emptyRender() :
              props.emptyRender
          )
        }
      </div>
    )
  },
})
