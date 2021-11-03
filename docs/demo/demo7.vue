<template>
  <div class="test-class">
    <TestTable
      :columns="columns"
      :data="data"
      :pagenation="{
        page: 2,
        size: 10
      }"
    >
    </TestTable>
  </div>
</template>

<script lang="tsx">
import { TestTable } from "../../src/table";
import { defineComponent, onMounted, ref } from "@vue/composition-api";

export default defineComponent({
  name: "Demo7",
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
        align: "right",
      },
      {
        title: "性别",
        key: "sex",
        render(data: 0 | 1) {
          const map = {
            0: '女',
            1: '男'
          }
          return (<div>{map[data]}</div>);
        }
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

    onMounted(() => {
      setTimeout(() => {
        const list = new Array(100).fill(1)

        const newData = list.map((item, index) => {
          return {
            num: index,
            name: (100-index) + 'haha',
            sex: index % 2,
          }
        })

        data.value = newData
      }, 5000);
    })
    return {
      columns,
      data,
    };
  },
});
</script>