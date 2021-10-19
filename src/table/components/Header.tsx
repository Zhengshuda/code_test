/**
 * Created by uedc on 2021/10/11.
 */

 import { computed, defineComponent, ref } from '@vue/composition-api'
 import { VNode } from 'vue';
 
 export default defineComponent({
   name: 'Table',
   props: {
     columns: {
       type: Array,
       default: () => []
     },
   },
   setup(props, { slots }) {
     const list = ref(props.columns);

     return () => {
       return (
         <thead>
           <tr>
             {
               list.value.map(item => {
                 return <td>{item.name}</td>
               })
             }
           </tr>
         </thead>
       )
     }
   },
 })