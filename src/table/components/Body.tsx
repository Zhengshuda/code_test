/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent, ref } from '@vue/composition-api'
import { VNode } from 'vue';

export default defineComponent({
  name: 'Table',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { slots }) {
    const list = ref(props.columns);
    const data = ref(props.data);

    const content = ref<VNode[]>([]);

    data.value.forEach(res => {
      content.value.push((
        <tr>
          {
            list.value.map(item => {
              return (<td>{
                item.render ? item.render(res[item.key]) : res[item.key]
              }</td>)
            })
          }
        </tr>
      ));
    });

    return () => {
      return (
        <tbody>
          {
            content.value
          }
        </tbody>
      )
    }
  },
})