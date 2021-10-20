import {
  mount
} from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep';
import {
  TestTable
} from '../table'

const defaultData = [{
    num: "4",
    name: "小黄",
    sex: 0,
  },
  {
    num: "1",
    name: "小绿",
    sex: 1,
  },
  {
    num: "2",
    name: "小蓝",
    sex: 0,
  },
  {
    num: "5",
    name: "小红",
    sex: 0,
  },
  {
    num: "3",
    name: "小黑",
    sex: 0,
  },
];
const defaultColumns = [{
    title: "序号",
    key: "num",
  },
  {
    title: "名称",
    key: "name",
  },
  {
    title: "性别",
    key: "sex",
  }
]

describe('Table', () => {
  const TableMount = options => mount(TestTable, options)

  test('render', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
    expect(() => {
      wrapper.vm.$forceUpdate()
      wrapper.vm.$destroy()
    }).not.toThrow()
  });

  test('test headerAlign', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        headerAlign: 'right'
      }
    });

    const header = wrapper.find('[utid="table-header-num"]');
    expect(header.element.style['text-align']).toBe('right');

    const body = wrapper.find('[utid="table-body-num-0"]');
    expect(body.element.style['text-align']).toBe('right');
  });

  test('test align', () => {
    let newColumns = cloneDeep(defaultColumns);
    newColumns[0].align = 'left';
    newColumns[1].align = 'center';
    newColumns[2].align = 'right';

    const wrapper = TableMount({
      propsData: {
        columns: newColumns,
        data: defaultData,
      }
    });

    const leftData = wrapper.find('[utid="table-body-num-0"]');
    expect(leftData.element.style['text-align']).toBe('left');

    const centerData = wrapper.find('[utid="table-body-name-0"]');
    expect(centerData.element.style['text-align']).toBe('center');

    const rightData = wrapper.find('[utid="table-body-sex-0"]');
    expect(rightData.element.style['text-align']).toBe('right');
  });

  test('test border', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        border: true
      }
    });

    expect(wrapper.find('.table-wrap-border').exists()).toBeTruthy();
  });

  test('test contentBorder', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        contentBorder: true
      }
    });

    const header = wrapper.findAll('.table-thead-th__border');

    for (let i = 0;i < header.length; i++) {
      if (i === 0 || i === header.length - 1) {
        expect(header.at(0).element.style['border-left']).toBeFalsy();
        return;
      }
      expect(header.at(i).element.style['border-left']).toBeFalsy();
    }

    const body = wrapper.findAll('.table-body-td-border');
    for (let i = 0;i < body.length; i++) {
      if (i === 0 || i === body.length - 1) {
        expect(body.at(0).element.style['border-left']).toBeFalsy();
        return;
      }
      expect(body.at(i).element.style['border-left']).toBeFalsy();
    }
  });

  test('test rowHeight', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        rowHeight: 110
      }
    });

    const body = wrapper.find('[utid="table-body-num-0"]');

    expect(body.element.style['height']).toBe('110px');
    expect(body.element.style['maxHeight']).toBe('110px');
  });

  test('test pagenation', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        pagenation: true
      }
    });

    expect(wrapper.find('.table-pagenation').exists).toBeTruthy();
    expect(wrapper.find('[utid="table-pagenation-last"]').exists).toBeTruthy();
    expect(wrapper.find('[utid="table-pagenation-next"]').exists).toBeTruthy();

    for(let i = 0; i < 5; i++) {
      expect(wrapper.find(`[utid="table-pagenation-${i}"]`).exists).toBeTruthy();
    }
    expect(wrapper.find(`[utid="table-pagenation-5"]`).exists()).toBe(false);
  })
})
