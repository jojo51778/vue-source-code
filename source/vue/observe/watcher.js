import {pushTarget, popTarget} from './dep'
import {nextTick} from './nextTick'
import {util} from '../util'
let id = 0

class Watcher{ //每次产生的一个watcher都有唯一的标识
  /**
   * 
   * @param {*} vm 当前组件实例
   * @param {*} exprOrFn 表达式或者函数
   * @param {*} cb 回调函数，vm.$watch('msg', cb)
   * @param {*} opts 一些其他参数
   */
  // vm ,msg ,() =>{} ,{}
  // vm () =>{}
  constructor(vm, exprOrFn, cb = () => {}, opts = {}) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    if(typeof exprOrFn === 'function') {
      this.getter = exprOrFn // _update 更新组件
    } else {
      this.getter = function() { //将vm对应的表达式提取出来
        return util.getValue(vm, exprOrFn)
      }
    }
    if(opts.user) { //标识，用户自己写的watcher
      this.user = true
    }
    this.lazy = opts.lazy //计算属性true
    this.dirty = this.lazy
    this.cb = cb
    this.deps = []
    this.depsId = new Set()
    this.opts = opts
    this.id = id++
    this.immediate = opts.immediate
    // 创建watcher的时候，将表达式的值取出来（老值）
    // 如果是计算属性，不会默认调用get方法
    this.value = this.lazy ? undefined : this.get() //默认创建一个watcher,调用自身的get方法
    if(this.immediate) {
      this.cb(this.value)
    }
  }
  get() {
    // Dep.target用户自己的watcher
    pushTarget(this) //渲染watcher,Dep.target = watcher
    // 将计算属性watcher存起来
    let value = this.getter.call(this.vm) //执行传入函数
    popTarget()
    
    return value
  }

  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  addDep(dep) { //同一个watcher,不应该重复dep, 让watcher dep相互记忆
    let id = dep.id //msg 的dep
    if(!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep) //watcher记住当前的dep
      dep.addSub(this)
    }
  }
  depend() {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
    }
  }
  update() {  //异步更新
    if(this.lazy) { //如果是计算属性
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  run() {
    let value = this.get()
    if (this.value !== value) {
      this.cb(value, this.value) //新值，老值传进去
    }
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

// 等待页面更新后再去获取dom元素
//渲染，computed,watch要用
export default Watcher