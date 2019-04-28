/*
  watcher模块负责把compile 
*/
class Watcher {
  // vm：当前vue的实例
  // expr: data 中数据的名字
  // 一旦数据发生变化， 需要调用cb
  constructor (vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb

    // 需要把expr的旧值给储存起来
    this.oldValue = this.getVMValue(vm, expr)

  }

  // 对外暴露的一个方法，这个方法用于更新页面
  update () {
    // 对比expr是否发生改变，如果发生改变，需要调用cb
    let oldValue = this.oldValue
    let newValue = this.getVMValue(this.vm, this.expr)
    if (old !== newValue) {
      this.cb(newValue, oldValue)
    }
  }

  getVMValue (vm, expr) {
    // 获取到data中的数据
    let data = vm.$data
    expr.split('.').forEach(key => {
      data = data[key]
    })
    return data
  }
}