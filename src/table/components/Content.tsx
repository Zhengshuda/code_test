/**
 * Created by uedc on 2021/10/11.
 */

import {
    defineComponent,
    inject,
    ref
} from "@vue/composition-api";
import TableHeader from './Header';
import TableBody from './Body';
import { TableBodyRef, TableKey, TableKeyInjection } from "../types";

export default defineComponent({
    name: "TableContent",
    setup(props, { slots }) {
        const InjectData = inject(TableKey) as TableKeyInjection;
        const {
            sortFunction
          } = InjectData;
        const tableBodyRef = ref<TableBodyRef | null>(null);
        return {
            slots,
            tableBodyRef,
            sortFunction
        };
    },

    render() {
        return (
            <table class="table-content">
                <TableHeader ref="tableHeaderRef"></TableHeader>
                <TableBody ref="tableBodyRef"></TableBody>
                {this.slots?.default?.()}
            </table>
        );
    }
});
