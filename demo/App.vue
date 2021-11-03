<template>
  <div class="test-class">
    <TestTable :columns="columns"
               :data="data"
               :border="true"
               :content-border="true"
               :pagenation="pagenation"
    />
  </div>
</template>

<script lang="tsx">
import { TestTable } from '../src/table'
import { defineComponent, ref } from '@vue/composition-api'
import { DataType } from 'src/table/types'

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
  },
  setup() {
    const border = ref(false)
    const columns = ref([
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
            return direction === 'ASC' ? parseFloat(a) - parseFloat(b) : parseFloat(b) - parseFloat(a)
          },
        },
      },
      {
        title: '性别',
        key: 'sex',
        // sort: {
        //   direction: '',
        //   sortFn(direction: string, a: number, b: number) {
        //     if (direction === 'ASC') {
        //       return b - a;
        //     }

        //     return b - a;
        //   }
        // },
        render(data: DataType, index: number) {
          const map = {
            0: '女',
            1: '男',
          } as Record<number, string>
          return (
            <div>{`${map[data.sex]}${index}`}</div>
          )
        },
      },
    ])

    // const list: unknown[] = new Array(100).fill(1)

    // const data = ref(list.map((item, index) => {
    //   return {
    //     num: index,
    //     name: (100-index) + 'haha',
    //     sex: index % 2,
    //   }
    // }))

    const data = ref([
      {
        num: '4',
        name: '小黄',
        sex: 0,
      },
      {
        num: '1',
        name: '小绿',
        sex: 1,
      },
      {
        num: '2',
        name: '小蓝',
        sex: 0,
      },
      {
        num: '5',
        name: '小红',
        sex: 0,
      },
      {
        num: '3',
        name: '小黑',
        sex: 0,
      },
    ])

    const emptyRender = (
      <h1 style="width:600px; text-align:center">空</h1>
    )

    function Log(title: string) {
      console.log(title)
    }

    const pagenation = ref({
      size: 3,
      page: 1,
    })

    return {
      columns,
      data,
      pagenation,
      border,
      emptyRender,
      Log,
    }
  },
})
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
