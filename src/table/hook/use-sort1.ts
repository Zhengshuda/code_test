import { Logger } from "@/utils/Logger";
import { computed, ref, Ref, watch, watchEffect } from "@vue/composition-api";
import { sortBy } from "lodash";
import { DataType, MergeableTableColumn, SortType, SORT_DIRECTION, SortDirection } from "../types";

function useSort(
  data: Ref<DataType[]>,
  setSortDataRef: (data: DataType[]) => void,
  key: keyof DataType,
  options: MergeableTableColumn['sort']
) {
  if (!options) {
    return;
  }

  const sortFn = options.sortFn;

  const defaultData = computed(() => data.value);

  const defaultDirection = ref(options.direction);

  // 默认排序
  function defaultSort(sortDirection: SortDirection) {
    Logger.info('useSort/defaultSort', '调用默认排序方法')
    if (sortDirection === SORT_DIRECTION.DESC) {
      return sortBy(data.value, item => item[key]).reverse()
    }

    return sortBy(data.value, item => item[key])
  }
  
  const sortFunction = (sortDirection: SortDirection) => {
    const defaultList = [SORT_DIRECTION.DEFAULT, SORT_DIRECTION.ASC, SORT_DIRECTION.DESC]
    const index = defaultList.findIndex(item => item === sortDirection)
    sortDirection = index + 1 > 2 ? defaultList[0] : defaultList[index + 1]
    defaultDirection.value = sortDirection;

    if (sortDirection === SORT_DIRECTION.DEFAULT) {
      setSortDataRef(defaultData.value);
      return;
    }

    if (sortFn) {
      Logger.info('useSort/sortData', `当前key值为${key}的列有自动排序`)
      setSortDataRef(data.value.sort((a: DataType, b: DataType) => {
        return sortFn(sortDirection, a[key], b[key])
      }))
    } else {
      setSortDataRef(defaultSort(sortDirection));
    }
  }

  return {
    direction: defaultDirection,
    sortFunction
  };
}

export function useColumnSort(columnsRef: MergeableTableColumn[], data: DataType[]) {
  const sortDataRef = ref(data);

  function setSortDataRef (data: DataType[]) {
    sortDataRef.value = data;
  }

  let newColumns: Ref<MergeableTableColumn[]> = ref([]);

  watchEffect(() => {
    console.log('执行');
    newColumns.value = columnsRef.map(column => {
      if (column.sort) {
        let { direction, sortFunction } = useSort(
          sortDataRef, setSortDataRef, column.key, column.sort);

        const newDirection = computed(() => direction.value);

        return {
          ...column,
          innerSort: {
            direction: newDirection.value,
            sortFunction
          }
        };
      }

      return {
        ...column,
        innerSort: false
      };
    }) as MergeableTableColumn[];
  })
  return {
    newColumns,
    sortDataRef,
  }
}