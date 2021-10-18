<template>
  <div class="test-class">
    <TestTable
      :columns="columns"
      :data="data"
      header-align="left"
      :border="false"
      :row-height="60"
      :pagenation="pagenation"
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
    const columns = ref([
      {
        title: "序号",
        key: "num",
        sort: true,
        sortFn(direction: string, a: number, b: number) {
          if (direction === 'ASC') {
            return b - a;
          }

          return a - b;
        }
      },
      {
        title: "名称",
        key: "name",
      },
      {
        title: "性别",
        key: "sex",
        className: 'blue',
        width: 400,
        height: 20,
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

    function changeData(newData: any) {
      data.value = newData;
    }

    return {
      columns,
      data,
      pagenation,
      changeData
    };
  },

  // mounted () {
  //   setTimeout(() => {
  //     this.changeData([
  //       {
  //       num: "101",
  //       name: "小黄",
  //       sex: 0,
  //     },
  //     {
  //       num: "10",
  //       name: "小绿",
  //       sex: 1,
  //     },
  //     {
  //       num: "11",
  //       name: "小蓝",
  //       sex: 0,
  //     },
  //     ])
  //   }, 2000);
  // }
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