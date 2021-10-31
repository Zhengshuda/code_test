/**
 * Created by uedc on 2021/10/11.
 */

import {
  computed,
  defineComponent,
  inject,
} from "@vue/composition-api";
import { getStylePx } from "../hook/use-style";
import { TableKey, TableKeyInjection, DIRECTION_TYPE, TableColumns } from "../types";
import TableHeaderCell from './HeaderCell';

export default defineComponent({
  name: "TableHeader",
  setup(props, { emit }) {
    const InjectData = inject(TableKey) as TableKeyInjection;
    const {
      columnsRef,
      align,
      contentBorder,
      sortState,
      changeSortState,
      sortFunction
    } = InjectData;

    // function headerClick(e: MouseEvent, column: TableColumns) {

    //   column.innerSort.value.changeSortState();
    //   // // TODO-ZSD 这里做点击表头的事件处理
    //   // if (column.sort) {
    //   //   sortFunction(e, column, sortDirection);
    //   // }
    //   // emit('table-header-click', e, column);
    // }

    return () => {
      return (
        <thead class="table-thead">
          <tr class="table-thead-tr">
            {
              columnsRef.value.map(column => {
                return (
                  <TableHeaderCell column={column} />
                )
              })
            }
          </tr>
        </thead>
      )
    }
  },
});
