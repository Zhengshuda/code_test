/**
 * Created by uedc on 2021/10/11.
 */

import {
  computed,
  defineComponent,
  inject,
  ref,
  Ref,
} from "@vue/composition-api";
import { getStylePx } from "../hook/use-style";
import { TableKey, TableKeyInjection, TableColumn, SortDirection } from "../types";

export default defineComponent({
  name: "TableHeader",
  setup(props, { emit }) {
    const InjectData = inject(TableKey) as TableKeyInjection;
    const {
      columnsRef,
      align,
      contentBorder,
      sortFunction
    } = InjectData;

    function headerClick(e: MouseEvent, column: TableColumn, sortDirection: Ref<SortDirection>) {

      // TODO-ZSD 这里做点击表头的事件处理
      if (column.sort) {
        sortFunction(e, column, sortDirection);
      }
      emit('table-header-click', e, column);
    }

    return () => {
      return (
        <thead class="table-thead">
          <tr class="table-thead-tr">
            {
              columnsRef.value.map(column => {
                const sortDirection = ref(column.sortDirection);
                const upClassList = computed(() => {
                  return {
                    'table-thead-th-title__sort__asc': true,
                    'active': sortDirection.value === 'ASC'
                  };
                });
                const downClassList = computed(() => {
                  return {
                    'table-thead-th-title__sort__desc': true,
                    'active': sortDirection.value === 'DESC'
                  };
                });
                const thClassList = [
                  'table-thead-th',
                  column.className ? column.className : '',
                  column.sort ? 'table-thead-th__sort' : '',
                  contentBorder.value ? 'table-thead-th__border': ''
                ];
                return (
                  <th
                    class={thClassList}
                    key={column.key}
                    style={{
                      textAlign: column.align || align.value,
                      ...column.width && { width: getStylePx(column.width).value }
                    }}
                    utid={`table-header-${column.key}`}
                    onClick={(e) => headerClick(e, column, sortDirection)}>
                    <div class="table-thead-th-title">
                      <span class="table-thead-th-title__text">
                        {column.title}
                      </span>
                      {
                        column.sort ? (
                          <span class="table-thead-th-title__sort">
                            <span class={upClassList.value}>up</span>
                            <span class={downClassList.value}>down</span>
                          </span>) : ''
                      }
                    </div>
                  </th>
                );
              })
            }
          </tr>
        </thead>
      )
    }
  },
});
