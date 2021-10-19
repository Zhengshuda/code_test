<template>
  <div>
    <TestTable :columns="columns" :data="data">
      <span>xxxxxx</span>
    </TestTable>
  </div>
</template>

<script lang="tsx">
import { TestTable } from '../src/table'
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
  },
  setup() {
    const columns = ref([
      {
        key: 'key1',
        name: 'key1'
      },
      {
        key: 'key2',
        name: 'key2',
        render(data) {
          return <h1>{data}</h1>;
        }
      }
    ])

    const data = ref([
      {
        key1: 1,
        key2: 2
      }
    ])

    return { columns, data }
  },
})
</script>
