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
      this.getter = exprOrFn
    }
    this.cb = cb
    this.opts = opts

    this.get() //默认创建
  }
  get() {
    this.getter()
  }
}
//渲染，computed,watch要用
export default Watcher