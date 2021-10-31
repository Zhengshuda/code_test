import { Logger } from '@/utils/Logger'
import { Ref, computed, ref, watchEffect } from '@vue/composition-api'
import type { DataType, PagenationType, TablePublicProps } from '../types'

export function useData(
  props: TablePublicProps,
  originPageRef: Ref<PagenationType>,
  sortDataRef: Ref<DataType[]>): {
    dataRef: Ref<DataType[]>
  } {

  Logger.trace('useData', '传入的数据为：', {
    props,
    originPageRef,
    sortDataRef,
  })
  // 原始数据
  const originData = computed(() => props.data)

  // 可操作的数据
  const dataRef = ref(sortDataRef.value)

  watchEffect(() => {
    dataRef.value = sortDataRef.value
    const {
      page,
      size,
    } = originPageRef.value

    const base = (page - 1) * size

    const defaultValue = sortDataRef.value.length ? sortDataRef : originData

    dataRef.value = props.pagenation ? defaultValue.value.slice(base, base + size) : defaultValue.value

    Logger.debug('useData', '当传入的数据改变时，触发展示数据变化：', {
      sortDataRef: sortDataRef,
      originPageRef: originPageRef,
      dataRef: dataRef,
    })
  })

  return {
    dataRef,
  }
}
