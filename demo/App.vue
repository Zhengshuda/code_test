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
import { TestTable } from "../src/table";
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
    })
    const border = ref(false);
    const columns = ref([
      {
        title: "序号",
        key: "num",
        // sortFn(direction: string, a: number, b: number) {
        //   if (direction === 'ASC') {
        //     return b - a;
        //   }

        //   return a - b;
        // }
      },
      {
        title: "名称",
        key: "name",
      },
      {
        title: "性别",
        key: "sex",
        render(data: any, index: number) {
          const map = {
            0: '女',
            1: '男'
          } as any;
          return (
              <div>{`${map[data.sex]}${index}`}</div>
          );
        },
      },
    ]);

    const data = ref([
          {
            num: "4",
            name: "小黄",
            sex: 0,
          },
          {
            num: "1",
            name: "小绿",
            sex: 1,
          },
          {
            num: "2",
            name: "小蓝",
            sex: 0,
          },
          {
            num: "5",
            name: "小红",
            sex: 0,
          },
          {
            num: "3",
            name: "小黑",
            sex: 0,
          },
        ]);

    function changeData(newData: any) {
      data.value = newData;
    }

    return {
      columns,
      data,
      pagenation,
      border,
      changeData
    };
  },
});
</script>
<style>
.test-class {
  width: 600px;
  margin: 100px auto;
}
.blue {
  color: blue;
}
</style>