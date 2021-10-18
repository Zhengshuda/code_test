/**
 * Created by uedc on 2021/10/11.
 */

import {
	computed,
	defineComponent,
	provide
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
			originData,
			dataRef,
      originPageRef,
			sortFunction,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep
		} = useData(props);
		provide(TableKey, {
			columnsRef: columns,
			headerAlign: computed(() => props.headerAlign), 
			rowHeight: computed(() => props.rowHeight),
			align: computed(() => props.align), 
			dataRef,
			originData: originData.value,
      originPageRef,
			sortFunction,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep
		});

		const classList = {
			"table-wrap": true,
			"table-wrap-border": props.border
		};

		return {
			classList
		};
	},

	render() {
		return (
			<div class={this.classList}>
				<TableContent></TableContent>
				{
					this.pagenation ? (
            <div class="table-pagenation">
              <TablePagenation></TablePagenation>
            </div>
           ) : null
				}
			</div>
		);
	}
});
