import { computed } from "@vue/composition-api";
import { TablePublicProps } from "../types";
import { Logger } from "../../util/Logger";

export function useColumns(props: TablePublicProps) {
  Logger.trace('useColumns', 'props is :', props);
  let columns = Array.isArray(props.columns) ? props.columns : [];

  // TODO 下方可能做一些数据处理
  return computed(() => columns);
}