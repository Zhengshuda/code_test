<template>
  <div class="test-wrap">
    <div class="test-button">
      <button
        v-for="(component, index) in components"
        :key="index"
        :class="{
          active: curIndex === index
        }"
        @click="curIndex = index"
      >
        {{ index }}
      </button>
    </div>
    <component :is="components[curIndex]" />
  </div>
</template>

<script lang="tsx">
import { TestTable } from '../src/table'
import { Ref, defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
  },
  setup() {
    const components: Ref<(() => Promise<any>)[]> = ref([])

    for (let i = 0; i < 13; i++) {
      components.value.push(() => import(`../docs/demo/demo${i + 1}.vue`))
    }

    const curIndex = ref(6)

    return {
      components,
      curIndex,
    }
  },
})
</script>
<style>
.test-wrap {
  width: 600px;
  margin: 100px auto;
}
.test-class {
  width: 100%;
}
.test-button {
  display: flex;
}
.test-button button {
  width: 60px;
  margin: 0 0 10px 20px;
  border: 1px solid black;
}
.test-button button.active {
  background: green;
}
</style>
