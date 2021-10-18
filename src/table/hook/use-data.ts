import { computed, ComputedRef, Ref, ref, watch, nextTick } from "@vue/composition-api";
import { cloneDeep, sortBy } from "lodash";
import type { TablePublicProps, DataType, SortDirection, SortFnType, SortFnDirection, TableColumns, TableColumn, PageNationType } from "../types";

const DEFAULT_PAGENATION: PageNationType = {
    totalPage: 1,
    totalData: 0,
    page: 1,
    size: 1
};

function getColumns(props: TablePublicProps): TableColumns {
    // 这里面可以对每一列做特殊处理，此处暂不作处理
    if (Array.isArray(props.columns)) {
        return props.columns.map(item => {
            return {
                ...item,
                ...item.sort ? {
                    sortDirection: item.sortDirection || ''
                } : {}
            };
        });
    }
    return [];
}

export function useData(props: TablePublicProps): {
    originData: ComputedRef<DataType[]>,
    dataRef: Ref<DataType[]>,
    sortFunction: (e: MouseEvent, column: TableColumn, sortDirection: Ref<SortDirection>) => void
    columns: Ref<TableColumns>,
    originPageRef: Ref<PageNationType>,
    lastPagenationStep: () => void,
    nextPagenationStep: () => void,
    setPagenationStep: (pageData: Partial<PageNationType>) => void
} {
    // 原始数据
    const originData = computed(() => props.data as DataType[]);

    // 可操作的数据
    const dataRef = ref(props.data as DataType[]);

    // 分页数据
    const originPageRef = ref(structurePageData());

    // 排序的数据
    const sortDataRef = ref([] as DataType[]);

    // todo-jest 单测测试值的变化
    watch(originData, () => {
        sortDataRef.value = [];
        originPageRef.value = structurePageData();
        if (props.pagenation) {
            setPageData();
            return;
        }
        dataRef.value = originData.value;
    });

    watch(sortDataRef, () => {
        setPageData();
    }, {
        deep: true
    });

    watch(originPageRef, () => {
        setPageData();
    }, {
        deep: true
    });
    // 首次手动调用
    setPageData();

    // 每一列的配置
    const columns = ref(getColumns(props));

    // 排序的函数 todo-jest 单测测试排序功能，检查头部是否变化 数据是否变化
    function sortFunction(e: MouseEvent, column: TableColumn, sortDirection: Ref<SortDirection>) {
        const defaultList = ['', 'ASC', 'DESC'] as const;
        const index = defaultList.findIndex(item => item === sortDirection.value);
        sortDirection.value = index + 1 > 2 ? defaultList[0] : defaultList[index + 1];
        column.sortDirection = sortDirection.value;
        sortData(column.key, sortDirection.value, column.sortFn);
        sortDataRef.value = dataRef.value;
    }

    // 对数据进行排序
    function sortData(key: string, sortDirection: SortDirection, sortFn?: SortFnType<any>) {
        let direction = sortDirection?.toUpperCase() ?? '';
        let data = cloneDeep(originData.value);
        if (direction === '') {
            sortDataRef.value = [];
        }
        data = sortDataRef.value.length ? sortDataRef.value : data;
        const list = ['ASC', 'DESC'];
        if (!list.includes(direction)) {
            dataRef.value = data;
            return;
        }
        if (sortFn) {
            dataRef.value = data.sort((a: DataType, b: DataType) => {
                return sortFn(direction as SortFnDirection, a[key], b[key]);
            });

            return;
        }

        // 默认排序
        function defaultSort() {
            if (direction === 'DESC') {
                data = sortBy(data, item => item[key]);
                return data.reverse();
            }

            return sortBy(data, item => item[key]);
        }

        dataRef.value = defaultSort();
    }

    // 对数据进行分页
    function structurePageData () {
        if (!props.pagenation) {
            return DEFAULT_PAGENATION;
        }

        const currentDataLength = originData.value.length;
        const defaultPagenation = props.pagenation ?? DEFAULT_PAGENATION;
        const size = defaultPagenation.size || 1;
        const totalPage = currentDataLength < size ? 
            1 :
            Math.floor(currentDataLength / size) + currentDataLength % size;

        const pageData = {
            page: defaultPagenation.page,
            size: defaultPagenation.size,
            totalPage,
            totalData: currentDataLength,
        };

        return pageData;
    }

    function setPageData() {
        if (!props.pagenation) {
            return;
        }
        const {
            page,
            size
        } = originPageRef.value;

        const base = (page - 1) * size;

        let defaultValue = sortDataRef.value.length ? sortDataRef : originData;

        dataRef.value = defaultValue.value.slice(base, base + size);
    }

    function lastPagenationStep() {
        let page = originPageRef.value.page - 1;
        page = page < 1 ? 1 : page;
        originPageRef.value = {
            page,
            totalPage: originPageRef.value.totalPage,
            size: originPageRef.value.size,
            totalData: originPageRef.value.totalData
        };
    }

    function nextPagenationStep() {
        let page = originPageRef.value.page + 1;
        page = page > originPageRef.value.totalPage ? originPageRef.value.totalPage : page;
        originPageRef.value = {
            page,
            totalPage: originPageRef.value.totalPage,
            size: originPageRef.value.size,
            totalData: originPageRef.value.totalData
        };
    }

    function setPagenationStep(pageData: Partial<PageNationType>) {
        originPageRef.value = {
            page: pageData.page || originPageRef.value.page,
            totalPage: pageData.totalPage || originPageRef.value.totalPage,
            size: pageData.size || originPageRef.value.size,
            totalData: pageData.totalData || originPageRef.value.totalData
        };
    }

    return {
        originData,
        dataRef,
        columns,
        originPageRef,
        sortFunction,
        lastPagenationStep,
        nextPagenationStep,
        setPagenationStep
    };
}