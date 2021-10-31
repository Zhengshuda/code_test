import { computed, ComputedRef, Ref, ref, watch, watchEffect } from "@vue/composition-api";
import { TableColumn } from "docs/types";
import { TableColumns, SortStateType, DIRECTION_TYPE } from "../types";

export function useSort(columnsRef: ComputedRef<TableColumns>) {
  const sortState: Ref<SortStateType> = ref({
    direction: DIRECTION_TYPE.DEFAULT
  });
  const active = computed(() => columnsRef.value.find(column => column.sort));

  watchEffect(() => {
    if (active.value) {
      sortState.value.direction = active.value.sort!.direction;
      sortState.value.key = active.value.key;
      sortState.value.sortFn = active.value.sort?.sortFn;
    } else {
      sortState.value = {
        direction: DIRECTION_TYPE.DEFAULT
      };
    }
  });

  function changeSortState(column: TableColumn) {
    console.log(column);
    const defaultList = [DIRECTION_TYPE.DEFAULT, DIRECTION_TYPE.ASC, DIRECTION_TYPE.DESC];
    const index = defaultList.findIndex(item => item === sortState.value.direction);
    sortState.value.direction = index + 1 > 2 ? defaultList[0] : defaultList[index + 1];
    sortState.value.key = column.key;
    sortState.value.sortFn = column.sort?.sortFn;
  }

  return {
    sortState,
    changeSortState
  }
}