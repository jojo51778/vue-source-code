import Observer from './observer'
import Watcher from './watcher'
import Dep from './dep'

export default function initState(vm) {
  let opts = vm.$options
  if(opts.data) {
    initData(vm)
  }
  if(opts.computed) {
    initComputed(vm, opts.computed)
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

function createComputedGetter(vm, key) {
  let watcher = vm._watchersComputed[key] //这个watcher就是定义的计算属性
  return function() { //用户取值是会执行此方法
    if(watcher) {
      if(watcher.dirty) {
        watcher.evaluate()
      }
      if(Dep.target) { //计算属性watcher dep=[firstName.Dep,lastName.Dep]
        watcher.depend()
      }
      return watcher.value
    }
  }
}
// 计算属性 ，默认不执行，等用户取值再执行，会缓存取值的结果
// 如果依赖的值变化了， 会更新dirty属性，再次取值时，可以重新求新值

// watch方法不能再模板例，监控的逻辑都放在watch即可
// 渲染watcher， 用户watcher， 计算属性watcher
function initComputed(vm, computed) {
  //将计算属性配置放到vm上
  let watchers = vm._watchersComputed = Object.create(null)

  for(let key in computed) {
    let userDef = computed[key]
    watchers[key] = new Watcher(vm, userDef, () => {}, {lazy: true})// 计算属性watcher 默认开始方法不执行

    Object.defineProperty(vm, key, {
      get: createComputedGetter(vm, key)
    }) //将属性定义到vm上
  }
}
function createWatcher(vm, key ,handler, opts) {
  // 内部最终也会使用$watcher
  return vm.$watch(key, handler, opts)
}
function initWatch(vm) {
  let watch = vm.$options.watch
  for(let key in watch) {
    let useDef = watch[key]
    let handler = useDef
    if(useDef.handler) {
      handler = useDef.handler
    }
    createWatcher(vm, key, handler, {immediate: useDef.immediate})
  }
}