/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComputedRef, InjectionKey, Ref } from '@vue/composition-api'
import { VNode } from 'vue'
import type { PropOptions, PropType } from 'vue-types/dist/types'
type Prop<T, D = T> = PropOptions<T, D> | PropType<T>
type PublicRequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T]

type InnerRequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } | { default: any } ? K : never
}[keyof T]

type InnerOptionalKeys<T> = Exclude<keyof T, InnerRequiredKeys<T>>

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

// eslint-disable-next-line @typescript-eslint/ban-types
export type IxInnerPropTypes<O> = O extends object
? { [K in InnerRequiredKeys<O>]: InferPropType<O[K]> } & { [K in InnerOptionalKeys<O>]?: InferPropType<O[K]> }
: { [K in string]: any }

// 自定义props声明
export type Align = 'left' | 'right' | 'center';

/**排序方向 */
export const enum SORT_DIRECTION {
  DEFAULT = '',
  ASC = 'ASC',
  DESC = 'DESC'
}
export type SortDirection = typeof SORT_DIRECTION[keyof typeof SORT_DIRECTION];

/**排序配置 */
export type SortType = {
  direction: SortDirection
  sortFn?: SortFnType
};

/**表格每一列的配置 */
export type TableColumn = {
  title?: string
  key: string
  align?: Align
  sort?: SortType
  className?: string
  render?: (data: DataType, index: number) => VNode
  width?: number | string
};

/**表格列的全部声明 */
export type TableColumns = Array<TableColumn>;

/**数据声明 */
export type DataType<T = any> = Record<string, T>;

/**排序类型 */
export type SortFnType<T = any> = (direction: SortDirection, a: T, b: T) => number;

/**分页配置 */
export type PagenationType = {
  /* 页面总数 */
  totalPage: number

  /* 数据总数 */
  totalData: number

  /* 当前页数 */
  page: number

  /* 每页显示的数量 */
  size: number
};

/**空状态渲染函数声明 */
export type EmptyRenderType = () => VNode | VNode;

/**默认分页配置 */
export type DefaultPagenationType = {
  page: number
  size: number
};

/**真实传入表格组件的数据，主要区别在sort，将sort转为一定存在 */
export type MergeTableColumn = {
  title?: string
  key: string
  align?: Align
  sort: SortType | false
  className?: string
  render?: (data: DataType, index: number) => VNode
  width?: number | string
};

/**真实传入表格组件的数据 */
export interface MergeableTableColumn extends TableColumn {
  innerSort: MergeableSortType | false
}

/**真实排序配置 */
export type MergeableSortType = {
  direction: SortDirection
  sortFunction: (sortDirection: SortDirection) => void;
};

export interface TableKeyInjection {
  columnsRef: ComputedRef<MergeableTableColumn[]>
  align: Ref<Align>
  dataRef: Ref<DataType[]>
  originPageRef: Ref<PagenationType>
  contentBorder: Ref<boolean>
  // sortFunction: (e: MouseEvent, column: MergeTableColumn, sortDirection: Ref<SortDirection>) => void
  lastPagenationStep: () => void
  nextPagenationStep: () => void
  setPagenationStep: (pageData: Partial<PagenationType>) => void
  emitFn: ((event: string, ...args: any[]) => void) | ((event: string, ...args: any[]) => void)
}

/**表格声明 */
export interface TableRef<T> {
  'column-click': (column: TableColumn) => void
  'row-click': (row: Record<string, T>) => void
  'cell-click': (data: T) => void
  'page-change': (options: PagenationType) => void
}

// Props 定义在这里
export const tableProps = {

  /** 每一列的配置项 */
  columns: {
    type: Array as PropType<TableColumns>,
    default: [] as TableColumns,
    required: true,
  },

  /** 表格每一行的数据 */
  data: {
    type: Array as PropType<DataType[]>,
    default: [] as DataType[],
  },

  /**配置该表格的对齐方式 */
  align: {
    type: String as PropType<Align>,
    default: '',
  },

  /**配置表格是否有外部边框 */
  border: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  /**分页配置 */
  pagenation: {
    type: Object as PropType<DefaultPagenationType>,
  },

  /**配置表格是否有内部边框 */
  contentBorder: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  /**空状态渲染函数，返回一个VNode */
  emptyRender: {
    type: Object as PropType<EmptyRenderType>,
  },
}

export type TablePublicProps = IxInnerPropTypes<typeof tableProps>

export const TableKey: InjectionKey<TableKeyInjection> = Symbol('Table')
