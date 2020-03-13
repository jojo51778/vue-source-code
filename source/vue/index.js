import initState from './observe'
import Watcher from './observe/watcher'
import {compiler, util} from './util'

function Vue(options) {
  this._init(options)
}

Vue.prototype._init = function(options) {
  let vm = this
  vm.$options = options
  //初始化数据 data computed watch
  initState(vm)

  if(vm.$options.el) {
    vm.$mount()
  }
}
function query(el) {
  if(typeof el === 'string') {
    return document.querySelector(el)
  }
  return el
}

Vue.prototype._update = function() {
  console.log('更新')
  // 用户传入的数据去更新视图
  let vm = this
  let el = vm.$el
  // 循环这个四元数，将里面内容转为数据
  let node = document.createDocumentFragment() //文档碎片
  let firstChild
  while(firstChild = el.firstChild) {
    node.appendChild(firstChild)
  }

  compiler(node, vm)
  el.appendChild(node)
}
Vue.prototype.$mount = function() {
  let vm = this
  let el = vm.$options.el
  el = vm.$el =  query(el) //获取挂在节点 ,vm.$el是挂载的一个元素

  // 渲染用watcher, 默认执行get方法
  // vue2.0组件级别更新
  let updateComponent = () => { //更新组件，渲染逻辑
    vm._update() //更新组件
  }

  new Watcher(vm, updateComponent) //渲染watcher，默认调用updateComponent
}
Vue.prototype.$watch = function(expr, handler, opts) {
  let vm = this
  new Watcher(vm, expr, handler, {user: true, ...opts}) //用户自己定义的watch
}
// 默认创建一个渲染watcher ，默认执行


// pushTarget(this) //渲染watcher,Dep.target = watcher
// this.getter() //执行传入函数。 触发 addSub(watcher)
// popTarget()

// notify 通知， 调用set方法
export default Vue