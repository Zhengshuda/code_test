<template>
  <div class="test-class">
    <TestTable
      :columns="columns"
      :data="data"
      @column-click="columnClick"
      @row-click="rowClick"
      @cell-click="cellClick"
    >
    </TestTable>
  </div>
</template>

<script lang="tsx">
import { TestTable } from "../../src/table";
import { defineComponent, ref } from "@vue/composition-api";

export default defineComponent({
  name: "App",
  components: {
    TestTable,
  },
  setup() {
    const columns = ref([
      {
        title: "序号",
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
        num: "109",
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

    function columnClick(column: any) {
      console.log(column, 'columnClick');
    }

    function rowClick(row: any) {
      console.log(row, 'rowClick');
    }

    function cellClick(cell: any) {
      console.log(cell, 'cellClick');
    }

    return {
      columns,
      data,
      columnClick,
      rowClick,
      cellClick
    };
  },
});
</script>