<template>
  <div class="test-class">
    <TestTable
      :columns="columns"
      :data="data"
    >
    </TestTable>
  </div>
</template>

<script lang="tsx">
/**
 * @file 传入参数，默认逆向排序。数据逆向排序。
 */
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
        key: "num",
        sort: {
          direction: 'DESC'
        }
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


    return {
      columns,
      data,
    };
  },
});
</script>