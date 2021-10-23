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

export default defineComponent({
	name: "Table",
	props: tableProps,
	setup(props) {
		const {
			columns,
			dataRef,
      originPageRef,
			sortFunction,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep
		} = useData(props);
		provide(TableKey, {
			columnsRef: columns,
			rowHeight: computed(() => props.rowHeight),
			align: computed(() => props.align),
      contentBorder: computed(() => props.contentBorder),
			dataRef,
      originPageRef,
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
			</div>
		);
	},
});
