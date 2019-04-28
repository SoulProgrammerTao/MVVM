/*
  observer用于给data中所有的数据添加getter和setter，方便我们在获取或者设置data中的数据的时候，实现我们的逻辑
*/
class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }
  /* 核心方法 */
  /* 遍历data中所有的数据，都添加上getter和setter */
  walk(data) {
    if (!data || typeof data !== 'object') {
      return 
    }

    Object.keys(data).forEach(key => {
      // 给data对象的key设置getter和setter
      this.defineReactive (data, key, data[key])
      // 如果data[key]是一个复杂类型，递归walk
      this.walk(data[key])
    })
  }

  // 定义响应式数据（数据劫持）
  defineReactive (obj, key, value) {
    let self = this
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        console.log('你获取了值')
        return value
      },
      set (newValue) {
        console.log('你设置了值')
        value = newValue
        self.walk(newValue)
      }
    })


  }
}