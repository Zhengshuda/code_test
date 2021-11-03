/**
 * Created by uedc on 2021/10/11.
 */

import {
  PropType,
  computed,
  defineComponent,
} from '@vue/composition-api'
import { Align } from '../types'

const DIRECTION = {
  left: 'left',
  right: 'right',
} as Record<string, string>

const DIRECTION_TEXT = {
  [DIRECTION.left]: '<',
  [DIRECTION.right]: '>',
}

export default defineComponent({
  name: 'TablePagenationBtn',
  props: {
    direction: {
      type: String as PropType<Align>,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
    cls: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    const direction = DIRECTION[props.direction]
    const text = DIRECTION_TEXT[direction]
    const classList = computed(() => props.cls)
    const active = computed(() => props.active)

    return () => (
      <div class={[
        direction ? `table-pagenation-content__${direction}-btn` : '',
        'table-pagenation-content__btn',
        active.value ? 'active' : '',
        classList.value,
      ]}
      onClick={() => emit('click')}>{slots?.default?.() || text}</div>
    )
  },
})
