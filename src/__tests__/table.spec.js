import { nextTick } from '@vue/composition-api'
import {
  mount,
} from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'
import {
  TestTable,
} from '../table'

const defaultData = [{
  num: '4',
  name: '小黄',
  sex: 0,
},
{
  num: '1',
  name: '小绿',
  sex: 1,
},
{
  num: '2',
  name: '小蓝',
  sex: 0,
},
{
  num: '5',
  name: '小红',
  sex: 0,
},
{
  num: '3',
  name: '小黑',
  sex: 0,
},
]
const defaultColumns = [{
  title: '序号',
  key: 'num',
},
{
  title: '名称',
  key: 'name',
},
{
  title: '性别',
  key: 'sex',
},
]

describe('Table', () => {
  const TableMount = options => mount(TestTable, options)

  test('render', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        pagenation: {
          page: 1,
          size: 1,
        },
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
    expect(() => {
      wrapper.vm.$forceUpdate()
      wrapper.vm.$destroy()
    }).not.toThrow()
  })

  test('test align', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        align: 'right',
      },
    })

    const headerList = defaultColumns.map(item => {
      return `[utid="table-header-${item.key}"]`
    })

    headerList.forEach(key => {
      const header = wrapper.find(key)
      expect(header.element.style['text-align']).toBe('right')
    })

    const bodyList = defaultColumns.reduce((target, cur) => {
      defaultData.forEach((item, index) => {
        target.push(`[utid="table-body-${cur.key}-${index}"]`)
      })

      return target
    }, [])

    bodyList.forEach(key => {
      const body = wrapper.find(key)
      expect(body.element.style['text-align']).toBe('right')
    })
  })

  test('test column align', () => {
    let newColumns = cloneDeep(defaultColumns);
    newColumns[0].align = 'left';
    const wrapper = TableMount({
      propsData: {
        columns: newColumns,
        data: defaultData,
        align: 'right',
      },
    })

    const header = wrapper.find(`[utid="table-header-${newColumns[0].key}"]`)
    expect(header.element.style['text-align']).toBe('left')

    const target = [];
    defaultData.forEach((item, index) => {
      target.push(`[utid="table-body-${newColumns[0].key}-${index}"]`)
    });

    target.forEach(key => {
      const body = wrapper.find(key)
      expect(body.element.style['text-align']).toBe('left')
    })
  })

  test('test border', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        border: true,
      },
    })

    expect(wrapper.find('.table-wrap-border').exists()).toBeTruthy()
  })

  test('test contentBorder', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        contentBorder: true,
      },
    })

    const header = wrapper.findAll('.table-thead-th__border')

    for (let i = 0;i < header.length; i++) {
      if (i === 0 || i === header.length - 1) {
        expect(header.at(0).element.style['border-left']).toBeFalsy()
        return
      }
      expect(header.at(i).element.style['border-left']).toBeFalsy()
    }

    const body = wrapper.findAll('.table-body-td-border')
    for (let i = 0;i < body.length; i++) {
      if (i === 0 || i === body.length - 1) {
        expect(body.at(0).element.style['border-left']).toBeFalsy()
        return
      }
      expect(body.at(i).element.style['border-left']).toBeFalsy()
    }
  })

  test('test emptyRender', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: [],
        emprtRender: () => (<h1 class="soda-empty">空</h1>),
      },
    })

    expect(wrapper.find('.soda-empty').exists).toBeTruthy()
  })

  test('test column className', () => {
    let newColumns = cloneDeep(defaultColumns);
    newColumns[0].className = 'soda-test';
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: newColumns,
      },
    })

    expect(wrapper.find('.soda-test').exists).toBeTruthy()
  })

  test('test pagenation', async () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        pagenation: {
          page: 1,
          size: 1,
        },
      },
    })

    expect(wrapper.find('.table-pagenation').exists).toBeTruthy()
    expect(wrapper.find('[utid="table-pagenation-last"]').exists).toBeTruthy()
    expect(wrapper.find('[utid="table-pagenation-next"]').exists).toBeTruthy()

    for(let i = 0; i < defaultData.length; i++) {
      const pagebtn = wrapper.find(`[utid="table-pagenation-${i}"]`)
      expect(pagebtn.exists).toBeTruthy()
    }
    expect(wrapper.find(`[utid="table-pagenation-${defaultData.length}"]`).exists()).toBe(false)
  })

  test('测试分页按钮的点击', async () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        pagenation: {
          page: 1,
          size: 1,
        },
      },
    })

    for(let i = 1; i < defaultData.length; i++) {
      const pagebtn = wrapper.find(`[utid="table-pagenation-${i}"]`)
      expect(pagebtn.element.className.indexOf('active') !== -1).toBe(false)
      await pagebtn.trigger('click')
      expect(pagebtn.element.className.indexOf('active') !== -1).toBe(true)
    }
  })

  test('测试分页上一步按钮在对应的状态下是否置灰', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        pagenation: {
          page: 1,
          size: 1,
        },
      },
    })

    const first = wrapper.find('[utid="table-pagenation-last"]')
    const classList = first.element.className
    expect(classList.indexOf('disabled') !== -1).toBe(true)
  })

  test('测试分页下一步按钮在对应的状态下是否置灰', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        pagenation: {
          page: 1,
          size: defaultData.length,
        },
      },
    })

    const end = wrapper.find('[utid="table-pagenation-next"]')
    const classList = end.element.className
    expect(classList.indexOf('disabled') !== -1).toBe(true)
  })

  test('测试分页超出页数时是否自动切到最后一个', async () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        pagenation: {
          page: defaultData.length + 1,
          size: 1,
        },
      },
    })

    const end = wrapper.find(`[utid="table-pagenation-${defaultData.length - 1}"]`)
    const classList = end.element.className
    expect(classList.indexOf('active') !== -1).toBe(true)
  })

  test('测试分页超出页数时是否自动切到第一个', () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        pagenation: {
          page: -1,
          size: 1,
        },
      },
    })

    const first = wrapper.find(`[utid="table-pagenation-0"]`)
    const classList = first.element.className
    expect(classList.indexOf('active') !== -1).toBe(true)
  })

  test('测试分页下一页按钮功能', async () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        pagenation: {
          page: 1,
          size: 1,
        },
      },
    })

    let count = 0

    for await (const item of defaultData) {
      item
      const index = count++
      const btn = wrapper.find(`[utid="table-pagenation-next"]`)
      await btn.trigger('click')
      if (index !== defaultData.length - 1) {
        const active = wrapper.find(`[utid="table-pagenation-${index + 1}"]`)
        const classList = active.element.className
        expect(classList.indexOf('active') !== -1).toBe(true)
      }
    }
  })

  test('测试分页上一页按钮功能', async () => {
    const wrapper = TableMount({
      propsData: {
        columns: defaultColumns,
        data: defaultData,
        pagenation: {
          page: defaultData.length,
          size: 1,
        },
      },
    })

    let count = defaultData.length - 1

    for await (const item of defaultData) {
      item
      const index = count--
      const btn = wrapper.find(`[utid="table-pagenation-last"]`)
      await btn.trigger('click')
      if (index !== 0) {
        const active = wrapper.find(`[utid="table-pagenation-${index - 1}"]`)
        const classList = active.element.className
        expect(classList.indexOf('active') !== -1).toBe(true)
      }
    }
  })

  test('测试列的宽度调整', async () => {
    const newColumns = cloneDeep(defaultColumns)
    newColumns[0].width = 300
    newColumns[1].width = '100px'
    newColumns[2].width = '20%'
    const wrapper = TableMount({
      propsData: {
        columns: newColumns,
        data: defaultData,
      },
    })

    const ele0 = wrapper.find(`[utid="table-header-${newColumns[0].key}"]`)
    expect(ele0.element.style['width']).toBe('300px')
    defaultData.forEach((item, index) => {
      const ele = wrapper.find(`[utid="table-body-${newColumns[0].key}-${index}"]`)
      expect(ele.element.style['width']).toBe('300px')
    })

    const ele1 = wrapper.find(`[utid="table-header-${newColumns[1].key}"]`)
    expect(ele1.element.style['width']).toBe('100px')
    defaultData.forEach((item, index) => {
      const ele = wrapper.find(`[utid="table-body-${newColumns[1].key}-${index}"]`)
      expect(ele.element.style['width']).toBe('100px')
    })

    const ele2 = wrapper.find(`[utid="table-header-${newColumns[2].key}"]`)
    expect(ele2.element.style['width']).toBe('20%')
    defaultData.forEach((item, index) => {
      const ele = wrapper.find(`[utid="table-body-${newColumns[2].key}-${index}"]`)
      expect(ele.element.style['width']).toBe('20%')
    })
  })

  test('test sort', async () => {
    const newColumns = cloneDeep(defaultColumns)
    newColumns[0].sort = true
    const wrapper = TableMount({
      propsData: {
        columns: newColumns,
        data: defaultData,
      },
    })

    const sortColumn = wrapper.find(`[utid="table-header-${newColumns[0].key}"]`)
    expect(sortColumn.find('.table-thead-th-title__sort__asc').exists).toBeTruthy()
    expect(sortColumn.find('.table-thead-th-title__sort__desc').exists).toBeTruthy()
    expect(sortColumn.find('.table-thead-th__sort').exists).toBeTruthy()
  })

  test('测试点击排序', async () => {
    const newColumns = cloneDeep(defaultColumns)
    newColumns[0].sort = true
    const wrapper = TableMount({
      propsData: {
        columns: newColumns,
        data: defaultData,
      },
    })

    const sortColumn = wrapper.find(`[utid="table-header-${newColumns[0].key}"]`)
    await sortColumn.trigger('click')
    await nextTick()
    const ascList = []

    defaultData.forEach((item, index) => {
      const row = wrapper.find(`[utid="table-body-${newColumns[0].key}-${index}"]`)
      ascList.push(row)
    })

    for(let i = 0;i < ascList.length; i++) {
      if (i !== ascList.length - 1) {
        const cur = ascList[i].element.innerHTML
        const next = ascList[i + 1].element.innerHTML
        expect(cur <= next).toBe(true)
      }
    }

    await sortColumn.trigger('click')
    await nextTick()
    const descList = []

    for(let i = 0;i < descList.length; i++) {
      if (i !== descList.length - 1) {
        const cur = descList[i].element.innerHTML
        const next = descList[i + 1].element.innerHTML
        expect(cur >= next).toBe(true)
      }
    }

    await sortColumn.trigger('click')
    await nextTick()
    const list = []

    for(let i = 0;i < list.length; i++) {
      const cur = list[i].element.innerHTML
      expect(cur === defaultData[i][newColumns[0].key]).toBe(true)
    }
  })

  test('测试自定义排序规则', async () => {
    const columns = [
      {
        title: '序号',
        key: 'num',
        sort: true,
      },
      {
        title: '名称',
        key: 'name',
        sort: {
          direction: '',
          sortFn: (direction, a, b) => {
            if (!direction) {
              return 0;
            }
            return direction === 'ASC' ? parseFloat(a) - parseFloat(b) : parseFloat(b) - parseFloat(a)
          },
        },
      },
      {
        title: '性别',
        key: 'sex',
      },
    ]
    const list = new Array(100).fill(1)

    const data = list.map((item, index) => {
      return {
        num: index,
        name: (100-index) + 'haha',
        sex: index % 2,
      }
    })
    const wrapper = TableMount({
      propsData: {
        columns: columns,
        data: data,
      },
    })

    const sortColumn = wrapper.find(`[utid="table-header-name"]`)
    await sortColumn.trigger('click')
    await nextTick()

    const ascList = []

    defaultData.forEach((item, index) => {
      const row = wrapper.find(`[utid="table-body-name-${index}"]`)
      ascList.push(row)
    })

    for(let i = 0;i < ascList.length; i++) {
      if (i !== ascList.length - 1) {
        const cur = ascList[i].element.innerHTML
        const next = ascList[i + 1].element.innerHTML
        expect(parseFloat(cur) <= parseFloat(next)).toBe(true)
      }
    }

    await sortColumn.trigger('click')
    await nextTick()

    const descList = []

    defaultData.forEach((item, index) => {
      const row = wrapper.find(`[utid="table-body-name-${index}"]`)
      descList.push(row)
    })

    for(let i = 0;i < descList.length; i++) {
      if (i !== descList.length - 1) {
        const cur = descList[i].element.innerHTML
        const next = descList[i + 1].element.innerHTML
        expect(parseFloat(cur) >= parseFloat(next)).toBe(true)
      }
    }
  })

  test('测试列的渲染函数', () => {
    let newColumns = cloneDeep(defaultColumns);
    const map = {
      0: '女',
      1: '男',
    }
    newColumns[2].render = (data, index) => {
      return (
        <div>{`${map[data.sex]}${index}`}</div>
      )
    }
    const wrapper = TableMount({
      propsData: {
        columns: newColumns,
        data: defaultData,
      },
    })

    defaultColumns.forEach((item, index) => {
      // `table-body-${column.key}-${index}`
      let ele = wrapper.find(`[utid="table-body-${newColumns[2].key}-${index}"]`);
      expect(ele.element.innerHTML === `${map[item.sex]}${index}`);
    });
  })

  test('异常测试', () => {
      try {
        const wrapper = TableMount({
          propsData: {
            columns: 1,
            data: defaultData,
          },
        })
      } catch(e) {
        expect(!!e).toBeTruthy()
      } finally {

      } 
  })
})
