import { computed } from "@vue/composition-api";

export function getStylePx(data: number | string) {
    let newData = data;
    if (typeof data === 'number') {
        newData = data + 'px';
    }

    return computed(() => newData);
}