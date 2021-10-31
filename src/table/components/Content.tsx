/**
 * Created by uedc on 2021/10/11.
 */

import {
  defineComponent,
} from '@vue/composition-api'
import TableHeader from './Header'
import TableBody from './Body'

export default defineComponent({
  name: 'TableContent',
  setup(props, { slots }) {
    return {
      slots,
    }
  },

  render() {
    return (
      <table class="table-content">
        <TableHeader ref="tableHeaderRef"></TableHeader>
        <TableBody ref="tableBodyRef"></TableBody>
        {this.slots?.default?.()}
      </table>
    )
  },
})
