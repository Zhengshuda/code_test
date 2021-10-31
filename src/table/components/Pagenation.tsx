/**
 * Created by uedc on 2021/10/11.
 */

import { Logger } from '@/utils/Logger'
import {
  computed,
  defineComponent, inject,
} from '@vue/composition-api'
import { TableKey, TableKeyInjection } from '../types'
import PageBtn from './PageBtn'

export default defineComponent({
  name: 'TablePagenation',
  setup() {
    const InjectData = inject(TableKey) as TableKeyInjection
    const {
      originPageRef,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep,
    } = InjectData

    Logger.debug('Pagenation.tsx/setup', '当前pagenation接收的参数', {
      originPageRef,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep,
    })

    const pageBtns = computed(() => {
      const btns = []
      for (let i = 0; i < originPageRef.value.totalPage; i++) {
        btns.push(
          (<PageBtn
            utid={`table-pagenation-${i}`}
            active={originPageRef.value.page === i + 1}
            on-click={() => setPagenationStep({
              page: i + 1,
            })}>{i + 1}</PageBtn>),
        )
      }
      return btns
    })

    Logger.debug('Pagenation.tsx/setup', '生成的按钮', pageBtns)

    return () => (
      <div class="table-pagenation-content">
        <div class="table-pagenation-content__total">
          {`共${originPageRef.value.totalData}条数据`}
        </div>
        <PageBtn
          utid='table-pagenation-last'
          direction='left'
          cls={originPageRef.value.page === 1 ? 'disabled' : ''}
          on-click={lastPagenationStep} />
        {pageBtns.value}
        <PageBtn
          utid='table-pagenation-next'
          direction='right'
          cls={originPageRef.value.page === originPageRef.value.totalPage ? 'disabled' : ''}
          on-click={nextPagenationStep} />
      </div>
    )
  },
})
