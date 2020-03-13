import Observer from './observer'

export default function initState(vm) {
  let opts = vm.$options
  if(opts.data) {
    initData(vm)
  }
  if(opts.computed) {
    initComputed()
  }
  if(opts.watch) {
    initWatch(vm)
  }
}

export function observe(data) {
  if(typeof data !== 'object' || data == null) {
    return //不是对象或者null直接返回
  }

  if(data.__ob__) { //已经被监控过了
    return data.__ob__
  }
  return new Observer(data)
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data  === 'function' ? data.call(vm) : data || {}

  for(let key in data) {
    proxy(vm, '_data', key) //会将vm上的取值赋值代理给vm._data属性
  }

  observe(vm._data)
}

function initComputed() {

}
function createWatcher(vm, key ,handler) {
  // 内部最终也会使用$watcher
  return vm.$watch(key, handler)
}
function initWatch(vm) {
  let watch = vm.$options.watch
  for(let key in watch) {
    let handler = watch[key]
    createWatcher(vm, key, handler)
  }
}