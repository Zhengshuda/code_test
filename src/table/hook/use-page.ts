import { Logger } from '@/utils/Logger'
import { ComputedRef, Ref, ref, watch, watchEffect } from '@vue/composition-api'
import { DataType, DefaultPagenationType, PagenationStepFnType, PagenationType, SetPagenationStepFnType } from '../types'

const DEFAULT_PAGENATION: PagenationType = {
  totalPage: 1,
  totalData: 0,
  page: 1,
  size: 1,
}

export function usePage(
  originDataRef: ComputedRef<DataType>,
  pagenationRef: ComputedRef<DefaultPagenationType | undefined>,
  emitFn: ((event: string, ...args: SafeAny[]) => void) | ((event: string, ...args: SafeAny[]) => void)): {
    originPageRef: Ref<PagenationType>
    lastPagenationStep: PagenationStepFnType
    nextPagenationStep: PagenationStepFnType
    setPagenationStep: SetPagenationStepFnType
} {

  // 分页配置数据
  const originPageRef: Ref<PagenationType> = ref(DEFAULT_PAGENATION)

  // 向外抛出数据
  watch(originPageRef, () => {
    emitFn('page-change', originPageRef.value)
  })

  watchEffect(() => {

    // 数据变化时触发
    const currentDataLength = originDataRef.value.length

    // 分页配置变化时触发
    const defaultPagenation = { ...DEFAULT_PAGENATION, ...pagenationRef.value }
    const size = defaultPagenation.size
    const totalPage = currentDataLength < size ?
      1 :
      Math.floor(currentDataLength / size) + (currentDataLength % size !== 0 ? 1 : 0)

    // 设置的页值过大则选择最大的页值
    if (Number(defaultPagenation.page) > totalPage) {
      defaultPagenation.page = totalPage
    } else if (Number(defaultPagenation.page) < 1) {

      // 过小则选择第一页
      defaultPagenation.page = 1
    }
    originPageRef.value = {
      page: defaultPagenation.page,
      size: defaultPagenation.size,
      totalPage,
      totalData: currentDataLength,
    }

    Logger.debug('usePage', '记录当外部数据改变时触发数据的变化', {
      currentDataLength,
      defaultPagenation,
      size,
      totalPage,
      originPageRef,
    })
  })

  // 跳转到上一页
  function lastPagenationStep() {
    let page = originPageRef.value.page - 1
    page = page < 1 ? 1 : page
    setPagenationStep({
      page,
    })

    Logger.debug('usePage/lastPagenationStep', '点击下一步', originPageRef)
  }

  // 跳转到下一页
  function nextPagenationStep() {
    let page = originPageRef.value.page + 1
    page = page > originPageRef.value.totalPage ? originPageRef.value.totalPage : page
    setPagenationStep({
      page,
    })

    Logger.debug('usePage/nextPagenationStep', '点击上一步', originPageRef)
  }

  function setPagenationStep(pageData: Partial<PagenationType>) {
    // 设置的页值过大则选择最大的页值
    if (Number(pageData.page) > Number(pageData.totalPage)) {
      pageData.page = pageData.totalPage
    }
    originPageRef.value = {
      page: pageData.page || originPageRef.value.page,
      totalPage: pageData.totalPage || originPageRef.value.totalPage,
      size: pageData.size || originPageRef.value.size,
      totalData: pageData.totalData || originPageRef.value.totalData,
    }

    Logger.debug('usePage/setPagenationStep', '跳转到具体页数', originPageRef)
  }

  return {
    originPageRef,
    lastPagenationStep,
    nextPagenationStep,
    setPagenationStep,
  }
}
