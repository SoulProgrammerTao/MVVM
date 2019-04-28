// 定义一个类。用于创建VUE实例
class Vue {
  constructor (params) {
    params = params || {}
    this.$el = params.el
    this.$data = params.data
    this.$methods = params.methods

    // 监视data中的数据
    new Observer(this)
    // 如果指定了el参数。对el进行解析
    if (this.$el) {
      // compile负责解析模板的内容
      // 需要：模板和数据
    const c =  new Compile (this.$el, this)
    }
  }
}