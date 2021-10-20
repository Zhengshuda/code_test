/**
 * Created by uedc on 2021/10/11.
 */

import {
  computed,
  defineComponent, inject
} from "@vue/composition-api";
import { TableKey, TableKeyInjection } from "../types";
import PageBtn from "./PageBtn";

export default defineComponent({
  name: "TablePagenation",
  setup() {
    const InjectData = inject(TableKey) as TableKeyInjection;
    const {
      originPageRef,
      lastPagenationStep,
      nextPagenationStep,
      setPagenationStep
    } = InjectData;

    const pageBtns = computed(() => {
      let btns = [];
      for (let i = 0; i < originPageRef.value.totalPage; i++) {
        btns.push(
          (<PageBtn 
              utid={`table-pagenation-${i}`}
              active={originPageRef.value.page === i + 1}
              onClick={() => setPagenationStep({
                page: i + 1
              })}>{i + 1}</PageBtn>)
        );
      }
      return btns;
    });

    return () => (
      <div class="table-pagenation-content">
        <div class="table-pagenation-content__total">
          {`共${originPageRef.value.totalData}条数据`}
        </div>
        <PageBtn
          utid='table-pagenation-last'
          direction='left'
          cls={originPageRef.value.page === 1 ? 'isFirst' : ''} 
          on-click={lastPagenationStep} />
        {pageBtns.value}
        <PageBtn
          utid='table-pagenation-next'
          direction='right' 
          cls={originPageRef.value.page === originPageRef.value.totalPage ? 'isLast' : ''} 
          on-click={nextPagenationStep} />
      </div>
    );
  },
});
