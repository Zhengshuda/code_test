/**
 * Created by uedc on 2021/10/11.
 */

import {
  defineComponent,
  inject,
} from "@vue/composition-api";
import { VNode } from "vue";
import { getStylePx } from "../hook/use-style";
import { TableKey, TableKeyInjection, DataType } from "../types";

export default defineComponent({
  name: "TableBody",
  setup() {
    const InjectData = inject(TableKey) as TableKeyInjection;
    const {
      columnsRef,
      align,
      headerAlign,
      dataRef,
      rowHeight,
      contentBorder,
    } = InjectData;

    function renderColumns() {
      let columns: VNode[] = [];
      dataRef.value.forEach((item: DataType, index: number) => {
        const isLastTd = index === dataRef.value.length - 1;
        columns.push(
          <tr class="table-body-tr">
            {columnsRef.value.map(column => {
              const tdClassList = [
                'table-body-td',
                isLastTd ? 'table-body-td-last' : '',
                contentBorder.value ? 'table-body-td-border' : ''
              ];
              return (<td
                class={tdClassList}
                style={{
                  textAlign: column.align || align.value || headerAlign.value,
                  ...column.width && {width: getStylePx(column.width).value},
                  height: getStylePx(rowHeight.value).value,
                  maxHeight: getStylePx(rowHeight.value).value,
                }}>
                {column.render ? column.render(item, index) : item[column.key]}
              </td>
              )
            }
            )}
          </ tr>
        );
      });

      return columns;
    }

    return {
      renderColumns
    }
  },

  render() {
    return (
      <tbody class="table-body">
        {this.renderColumns()}
      </tbody>
    );
  }
});
