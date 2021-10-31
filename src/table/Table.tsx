/**
 * Created by uedc on 2021/10/11.
 */

import {
	computed,
	defineComponent,
	provide,
} from "@vue/composition-api";
import { TableKey, tableProps } from "./types";
import TableContent from './components/Content';
import TablePagenation from './components/Pagenation';
import { useData } from "./hook/use-data";
import { useColumns } from "./hook/use-column";
import { useSort } from "./hook/use-sort";

export default defineComponent({
	name: "Table",
	props: tableProps,
	setup(props) {
		const columnsRef = useColumns(props);
		const {
			dataRef,
      originPageRef,
			sortFunction,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep
		} = useData(props);
		const {sortState, changeSortState} = useSort(columnsRef);
		
		provide(TableKey, {
			columnsRef,
			sortState,
			rowHeight: computed(() => props.rowHeight),
			align: computed(() => props.align),
      contentBorder: computed(() => props.contentBorder),
			dataRef,
      originPageRef,
			changeSortState,
			sortFunction,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep
		});

		return () => (
			<div class={{
        "table-wrap": true,
        "table-wrap-border": props.border,
        "table-wrap-border-has-pagenation": props.pagenation
      }}>
				<TableContent></TableContent>
				{
					props.pagenation ? (
            <div class="table-pagenation">
              <TablePagenation></TablePagenation>
            </div>
           ) : null
				}
				{
					!props.data.length && props.emptyRender?.()
				}
			</div>
		);
	},
});
