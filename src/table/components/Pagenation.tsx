/**
 * Created by uedc on 2021/10/11.
 */

import { Logger } from '@/utils/Logger'
import {
  PropType,
  computed, defineComponent,
} from '@vue/composition-api'
import { PagenationStepFnType, PagenationType, SetPagenationStepFnType } from '../types'
import PageBtn from './PageBtn'

export default defineComponent({
  name: 'Pagenation',

  // 通过props传入，后续可以直接剥离表格使用该组件
  props: {
    pageConfig: {
      type: Object as PropType<PagenationType>,
      required: true,
    },
    lastPagenationStep: {
      type: Function as PropType<PagenationStepFnType>,
      required: true,
    },
    nextPagenationStep: {
      type: Function as PropType<PagenationStepFnType>,
      required: true,
    },
    setPagenationStep: {
      type: Function as PropType<SetPagenationStepFnType>,
      required: true,
    },
  },
  setup(props) {

    Logger.debug('Pagenation.tsx/setup', '当前pagenation接收的参数', props)

    const pageBtns = computed(() => {
      const btns = []
      for (let i = 0; i < props.pageConfig.totalPage; i++) {
        btns.push(
          (<PageBtn
            utid={`table-pagenation-${i}`}
            active={props.pageConfig.page === i + 1}
            on-click={() => props.setPagenationStep({
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
          {`共${props.pageConfig.totalData}条数据`}
        </div>
        <PageBtn
          utid='table-pagenation-last'
          direction='left'
          cls={props.pageConfig.page === 1 ? 'disabled' : ''}
          on-click={() => props.lastPagenationStep()} />
        {pageBtns.value}
        <PageBtn
          utid='table-pagenation-next'
          direction='right'
          cls={props.pageConfig.page === props.pageConfig.totalPage ? 'disabled' : ''}
          on-click={() => props.nextPagenationStep()} />
      </div>
    )
  },
})
