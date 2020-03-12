import {pushTarget, popTarget} from './dep'
let id = 0
class Watcher{ //每次产生的一个watcher都有唯一的标识
  /**
   * 
   * @param {*} vm 当前组件实例
   * @param {*} exprOrFn 表达式或者函数
   * @param {*} cb 回调函数，vm.$watch('msg', cb)
   * @param {*} opts 一些其他参数
   */
  constructor(vm, exprOrFn, cb = () => {}, opts = {}) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    if(typeof exprOrFn === 'function') {
      this.getter = exprOrFn // _update 更新组件
    }
    this.cb = cb
    this.deps = []
    this.depsId = new Set()
    this.opts = opts
    this.id = id++

    this.get() //默认创建
  }
  get() {
    pushTarget(this) //渲染watcher,Dep.target = watcher
    this.getter() //执行传入函数
    popTarget()
  }

  addDep(dep) { //同一个watcher,不应该重复dep, 让watcher dep相互记忆
    let id = dep.id //msg 的dep
    if(!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep) //watcher记住当前的dep
      dep.addSub(this)
    }
  }

  update() {  //异步更新
    queueWatcher(this)
  }
  run() {
    this.get()
  }
}
let has = {}
let queue = []
function flushQueue() {
  queue.forEach(watcher => watcher.run())
  has = {} //恢复正常
  queue = []
}
function queueWatcher(watcher) { //过滤重复watcher
  let id = watcher.id
  if(has[id] == null) {
    has[id] = true
    queue.push(watcher)

    nextTick(flushQueue)
  }
}
let callbacks = []
function flushCallbacks() {
  callbacks.forEach(cb => cb())
}
function nextTick(cb) {
  callbacks.push(cb)

  let timerFunc = () => {
    flushCallbacks()
  }
  // if(Promise) {
  //   return Promise.resolve().then(timerFunc)
  // }
  if(MutationObserver) {
    let observer = new MutationObserver(timerFunc)
    let textNode = document.createTextNode(1)
    observer.observe(textNode, {characterData: true})
    textNode.textContent = 2
    return
  }
  if(setImmediate) {
    return setImmediate(timerFunc)
  }
  setTimeout(timerFunc, 0)
}
// 等待页面更新后再去获取dom元素
//渲染，computed,watch要用
export default Watcher