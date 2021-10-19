/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, ref } from '@vue/composition-api'
import { TablePublicProps, tableProps } from './types'
import TableHeader from './components/Header';
import TableBody from './components/Body';

export default defineComponent({
  name: 'Table',
  props: tableProps,
  setup(props, { slots }) {

    const columns = ref(props.columns);
    const data = ref(props.data);
    return () => {
      return (
        <div>
          <table border={1}>
            <TableHeader columns={columns.value}></TableHeader>
            <TableBody columns={columns.value}
              data={data.value}></TableBody>
              {slots?.default?.()}
          </table>
        </div>
      )
    }
  },
})
