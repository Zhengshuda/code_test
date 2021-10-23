/**
 * Created by uedc on 2021/10/11.
 */

import {
  defineComponent,
  inject,
} from "@vue/composition-api";
import { getStylePx } from "../hook/use-style";
import { TableKey, TableKeyInjection, DataType } from "../types";

export default defineComponent({
  name: "TableBody",
  setup() {
    const InjectData = inject(TableKey) as TableKeyInjection;
    const {
      columnsRef,
      align,
      dataRef,
      rowHeight,
      contentBorder,
    } = InjectData;

    return () => {
      return (
        <tbody class="table-body">
          {
            dataRef.value.map((item: DataType, index: number) => {
              const isLastTd = index === dataRef.value.length - 1;
              return (
                <tr class="table-body-tr">
                  {
                    columnsRef.value.map(column => {
                      const tdClassList = [
                        'table-body-td',
                        isLastTd ? 'table-body-td-last' : '',
                        contentBorder.value ? 'table-body-td-border' : ''
                      ];
                      return (<td
                        utid={`table-body-${column.key}-${index}`}
                        class={tdClassList}
                        style={{
                          textAlign: column.align || align.value,
                          ...column.width && { width: getStylePx(column.width).value },
                          height: getStylePx(rowHeight.value).value,
                          maxHeight: getStylePx(rowHeight.value).value,
                        }}>
                        {column.render ? column.render(item, index) : item[column.key]}
                      </td>
                      )
                    })
                  }
                </ tr>
              )
            })
          }
        </tbody>
      );
    };
  },
});
