// 专门负责解析模板内容
class Compile {
  constructor (el, vm) {
    // new vue传递的选择器
    this.el = typeof el === 'string' ? document.querySelector(el) : el 
    this.vm = vm // 实例
    // 编译模板
    if (this.el) {
      // 1.把el中所有子节点都放入到内存中，fragment
      let fragment = this.node2fragment(this.el)
      // 2.在内存中编译fragment
      this.compile(fragment)
      // 3.把fragment一次性添加到页面
      this.el.appendChild(fragment)
    }
  }
  // 工具方法

  // 类数组转换成数组
  toArry (likeArray) {
    return [].slice.call(likeArray)
  }
  // nodeType: 节点类型 1：元素节点  3: 文本节点
  isElementNode (node) {
    return node.nodeType === 1
  }
  isTextNode (node) {
    return node.nodeType === 3
  }
  isDirective (attrName) {
    return attrName.startsWith('v-')
  }
  isEventDirective(type) {
    return type.split(':')[0] === 'on'
  }
  // 核心方法

  // DOM树节点放至内存中
  node2fragment (node) {
    let fragment = document.createDocumentFragment()
    // 把el中所有的子节点挨个添加到文档碎片中
    let childNodes = node.childNodes // 不是数组
    this.toArry(childNodes).forEach(node => {
      // 把所有的子节点添加到fragment
      fragment.appendChild(node)
    });
    return fragment

  }
  // 解析元素节点
  compileElement (node) {
    // console.log('11')
    // 1.获取到当前节点下所有的属性
    let attributes = node.attributes
    this.toArry(attributes).forEach(attr => {
    // 2.遍历，解析vue的指令（所以以V-开头的属性）
    let attrName = attr.name
    if (this.isDirective(attrName)) {
      let type = attrName.slice(2)
      let expr = attr.value
      // 解析v-on指令
      if (this.isEventDirective(type)) {
        CompileUtil.eventHandler(node, this.vm, type, expr)
      } else {
        CompileUtil[type] && CompileUtil[type](node, this.vm, expr)
      }
    }

    })
  }
  // 解析文本节点
  compileText (node) {
    let txt = node.textContent
    let reg = /\{\{(.+)\}\}/
    if (reg.test(txt)) {
      let expr = RegExp.$1
      node.textContent = txt.replace(reg, CompileUtil.getVMValue(this.vm, expr))
    }
  }
  
  // 编译文档碎片（内存中）
  compile (fragment) {
    let childNodes = fragment.childNodes
    this.toArry(childNodes).forEach(node => {
      // 编译子节点

      if (this.isElementNode(node)) {
        // 如果是元素， 需要解析指令
        this.compileElement(node)
      }

      if (this.isTextNode(node)) {
        // 如果是文本节点，需要解析插值表达式
        this.compileText(node)
      }
       
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }
}
  
// 解析指令工具
let CompileUtil = {
  text(node, vm, expr) {
    node.textContent = this.getVMValue(vm, expr)
    new Watcher(vm, expr, (newValue, oldValue) => {
      node.textContent = newValue
    })
  },
  html(node, vm, expr) {
    node.innerHTML = this.getVMValue(vm, expr)
  },
  model(node, vm, expr) {
    node.value = this.getVMValue(vm, expr)
  },
  eventHandler (node, vm, type, expr) {
    let eventType = type.split(':')[1]
    let fn = vm.$methods && vm.$methods[expr]
    if (eventType && fn) {
      node.addEventListener(eventType, vm.$methods[expr].bind(vm))
    }
  },
  getVMValue (vm, expr) {
    // 获取到data中的数据
    let data = vm.$data
    expr.split('.').forEach(key => {
      data = data[key]
    })
    return data
  }
}