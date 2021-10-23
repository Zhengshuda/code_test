<template>
  <div class="test-class">
    <TestTable
      :columns="columns"
      :data="data"
      :width="100"
    >
    </TestTable>
  </div>
</template>

<script lang="tsx">
/**
 * @file 输入超长字符串头部且传入该列的宽度，显示省略号
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
        width: 50
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
        num: "1011111134354545433375834765846578465784365784365784357843657843657834657843657345423849032894e423iru293ru32ru9320ur903urf940uf0942uf90324u092908320480329",
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