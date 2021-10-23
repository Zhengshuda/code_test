<template>
  <div class="test-class">
    <TestTable
      :columns="columns"
      :data="data"
      :empty-render="emptyRender"
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
    const emptyRender = function () {
      return (
        <div>空</div>
      );
    }
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

    const data = ref([]);


    return {
      columns,
      data,
      emptyRender
    };
  },
});
</script>