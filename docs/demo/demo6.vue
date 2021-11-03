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
import { TestTable } from "../../src/table";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "App",
  components: {
    TestTable,
  },
  setup() {
     const columns = [
      {
        title: '序号',
        key: 'num',
        sort: true,
      },
      {
        title: '名称',
        key: 'name',
        sort: {
          direction: '',
          sortFn: (direction, a, b) => {
            if (!direction) {
              return 0
            }
            return direction === 'ASC' ? parseFloat(a) - parseFloat(b) : parseFloat(b) - parseFloat(a)
          },
        },
      },
      {
        title: '性别',
        key: 'sex',
      },
    ]
    const list = new Array(100).fill(1)

    const data = list.map((item, index) => {
      return {
        num: index,
        name: (100-index) + 'haha',
        sex: index % 2,
      }
    })


    return {
      columns,
      data,
    };
  },
});
</script>