<template>
  <div class="test-class">
    <TestTable :columns="columns" :data="data" :empty-render="emptyRender">
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
        sort: {
          direction: 'ASC'
        }
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
        sort: {
          direction: 'DESC'
        }
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

    const list = new Array(100).fill(1);

    // num: "2",
    //     name: "小蓝",
    //     sex: 0,

    const data = ref(list.map((item, index) => {
      return {
        num: index,
        name: 'haha' + index,
        sex: index % 2
      }
    }));

    function changeData(newData: any) {
      data.value = newData;
    }

    const emptyRender = () =>(
      <h1>
        空
      </h1>
    );

    return {
      columns,
      data,
      pagenation,
      border,
      emptyRender,
      changeData
    };
  },
});
</script>
<style>
.test-class {
  width: 600px;
  margin: 100px auto;
  height: 600px;
}
.blue {
  color: blue;
}
</style>