/**
 * Created by uedc on 2021/10/11.
 */

import {
  computed,
  defineComponent,
  PropType,
} from "@vue/composition-api";

const DIRECTION = {
  left: 'left',
  right: 'right'
} as Record<string, string>;

const DIRECTION_TEXT = {
  [DIRECTION.left]: '<',
  [DIRECTION.right]: '>'
}

export default defineComponent({
  name: "TablePagenationBtn",
  props: {
    direction: {
      type: String as PropType<string>,
    },
    active: {
      type: Boolean,
      default: false
    },
    cls: {
      type: [Array, String],
    }
  },
  setup(props, { slots, emit }) {
    let direction = DIRECTION[props.direction as string];
    let text = DIRECTION_TEXT[direction];
    let classList = computed(() => Array.isArray(props.cls) ? props.cls : [props.cls]);
    let active = computed(() => props.active);

    return () => (
      <div class={[
        direction ? `table-pagenation-content__${direction}-btn` : '',
        'table-pagenation-content__btn',
        active.value ? 'active' : '',
        ...classList.value
      ]}
      onClick={() => emit('click')}>{slots?.default?.() || text}</div>
    )
  },
});
