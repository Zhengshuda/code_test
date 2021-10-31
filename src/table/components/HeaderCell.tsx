/**
 * Created by uedc on 2021/10/11.
 */

 import {
  computed,
  defineComponent,
  inject,
  PropType,
} from "@vue/composition-api";
import { getStylePx } from "../hook/use-style";
import { TableKey, TableKeyInjection, DIRECTION_TYPE, TableColumn } from "../types";

export default defineComponent({
  name: "TableHeaderCell",
  props: {
    column: {
      type: Object as PropType<TableColumn>,
      required: true
    }
  },
  setup(props) {
    const InjectData = inject(TableKey) as TableKeyInjection;
    const {
      align,
      contentBorder,
      sortState,
      changeSortState,
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
      const column = props.column;
      let sortDirection = computed(() => column.key === sortState.value.key ? sortState.value.direction : null);
      const upClassList = computed(() => {
        return {
          'table-thead-th-title__sort__asc': true,
          'active': sortDirection.value === DIRECTION_TYPE.ASC
        };
      });
      const downClassList = computed(() => {
        return {
          'table-thead-th-title__sort__desc': true,
          'active': sortDirection.value === DIRECTION_TYPE.DESC
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
            onClick={(e) => changeSortState(column)}
            >
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
    }
  },
});
