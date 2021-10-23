<template>
  <div class="test-class">
    <TestTable
      :columns="columns"
      :data="data"
      :pagenation="pagenation"
      @page-change="pageChange"
      @input="dataChange"
    >
    </TestTable>
  </div>
</template>

<script lang="tsx">
/**
 * @file 1. 传入分页参数，在首页点击上一页，无法点击 2.传入分页参数，在末页点击下一页，无法点击
 */
import { TestTable } from "../../src/table";
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  name: "App",
  components: {
    TestTable,
  },
  setup() {
    const pagenation = ref({
      size: 2,
      page: 1
    });
    const columns = ref([
      {
        title: "序号",
        key: "num",
      },
      {
        title: "名称",
        key: "name",
      },
      {
        title: "性别",
        key: "sex",
      },
    ]);

    const data = ref([
      {
        num: "101",
        name: "小明",
        sex: 0,
      },
      {
        num: "10",
        name: "小红",
        sex: 1,
      },
      {
        num: "11",
        name: "cko",
        sex: 0,
      },
    ]);

    function pageChange(options: any) {
      console.log(options, 'pageChange');
    }

    function dataChange(oldData: any, newData: any) {
      console.log('oldData', oldData);
      console.log('newData', newData);
    }


    return {
      columns,
      data,
      pagenation,
      pageChange,
      dataChange,
    };
  },
});
</script>