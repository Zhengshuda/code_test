import { Logger } from '@/utils/Logger'
import { Ref, computed, ref, watch, watchEffect } from '@vue/composition-api'
import { DataType, PagenationType, TablePublicProps } from '../types'

const DEFAULT_PAGENATION: PagenationType = {
  totalPage: 1,
  totalData: 0,
  page: 1,
  size: 1,
}

export function usePage(props: TablePublicProps, pageChangeFn: (pageConfig: PagenationType) => void): {
  originPageRef: Ref<PagenationType>
  lastPagenationStep: () => void
  nextPagenationStep: () => void
  setPagenationStep: (pageData: Partial<PagenationType>) => void
} {

  // 分页配置数据
  const originPageRef: Ref<PagenationType> = ref(DEFAULT_PAGENATION)

  // 原始数据
  const originData = computed(() => props.data as DataType[])

  // 向外抛出数据
  watch(originPageRef, () => {
    pageChangeFn(originPageRef.value)
  }, {
    immediate: true,
  })

  watchEffect(() => {
    const currentDataLength = originData.value.length
    const defaultPagenation = props.pagenation ? props.pagenation : DEFAULT_PAGENATION
    const size = defaultPagenation.size || 1
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

  function lastPagenationStep() {
    let page = originPageRef.value.page - 1
    page = page < 1 ? 1 : page
    originPageRef.value = {
      page,
      totalPage: originPageRef.value.totalPage,
      size: originPageRef.value.size,
      totalData: originPageRef.value.totalData,
    }

    Logger.debug('usePage/lastPagenationStep', '点击下一步', originPageRef)
  }

  function nextPagenationStep() {
    let page = originPageRef.value.page + 1
    page = page > originPageRef.value.totalPage ? originPageRef.value.totalPage : page
    originPageRef.value = {
      page,
      totalPage: originPageRef.value.totalPage,
      size: originPageRef.value.size,
      totalData: originPageRef.value.totalData,
    }

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
