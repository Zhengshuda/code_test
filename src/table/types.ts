/* eslint-disable @typescript-eslint/no-explicit-any */

import { InjectionKey, Ref } from '@vue/composition-api'
import { VNode } from 'vue'
import type { PropOptions, PropType } from 'vue-types/dist/types'
type Prop<T, D = T> = PropOptions<T, D> | PropType<T>
type PublicRequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T]

type PublicOptionalKeys<T> = Exclude<keyof T, PublicRequiredKeys<T>>
type InferPropType<T> = T extends null
  ? any // null & true would fail to infer
  : T extends { type: null | true }
    ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? Record<string, any>
      : T extends BooleanConstructor | { type: BooleanConstructor }
        ? boolean
        : T extends Prop<infer V, infer D>
          ? unknown extends V
            ? D
            : V
          : T

// eslint-disable-next-line @typescript-eslint/ban-types
export type IxPublicPropTypes<O> = O extends object
  ? { [K in PublicRequiredKeys<O>]: InferPropType<O[K]> } & { [K in PublicOptionalKeys<O>]?: InferPropType<O[K]> }
  : { [K in string]: any }

// 自定义props声明
export type Align = 'left' | 'right' | 'center';
export type SortDirection = '' | 'asc' | 'desc' | 'ASC' | 'DESC' | undefined;
export type TableColumn = {
  title?: string,
  key: string,
  align?: Align,
  sort?: boolean,
  sortDirection: SortDirection,
  className?: string,
  render?: (data: DataType, index: number) => VNode,
  width?: number | string,
  sortFn?: SortFnType<any>
};
export type TableColumns = Array<TableColumn>;
export type DataType = Record<string, any>;
export type SortFnDirection = 'ASC' | 'DESC';
export type SortFnType<T extends any> = (direction: SortFnDirection, a: T, b: T) => number;
export type PageNationType = {
  /* 页面总数 */
  totalPage: number,

  /* 数据总数 */
  totalData: number,

  /* 当前页数 */
  page: number,

  /* 每页显示的数量 */
  size: number,
};

export interface TableKeyInjection {
  columnsRef: Ref<TableColumns>
  headerAlign: Ref<Align>,
  align: Ref<Align>,
  dataRef: Ref<DataType[]>,
  originData: DataType[],
  rowHeight: Ref<string | number>,
  originPageRef: Ref<PageNationType>,
  sortFunction: (e: MouseEvent, column: TableColumn, sortDirection: Ref<SortDirection>) => void,
  lastPagenationStep: () => void,
  nextPagenationStep: () => void,
  setPagenationStep: (pageData: Partial<PageNationType>) => void
}

export interface TableBodyRef {
  sortData: Function
}

// Props 定义在这里
export const tableProps = {
  columns: {
    type: Array as PropType<TableColumns>,
    default: () => [],
    required: true
  },
  data: {
    type: Array as PropType<DataType[]>,
    default: () => []
  },
  headerAlign: {
    type: String as PropType<Align>,
    default: '',
  },
  align: {
    type: String as PropType<Align>,
    default: '',
  },
  border: {
    type: Boolean,
    default: true
  },
  rowHeight: {
    type: [Number, String],
    default: 40
  },
  pagenation: {
    type: Object as PropType<PageNationType>
  }
}

export type TablePublicProps = IxPublicPropTypes<typeof tableProps>

export const TableKey: InjectionKey<TableKeyInjection> = Symbol('Table')