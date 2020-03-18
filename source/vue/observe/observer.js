import { observe } from './index'
import { arrayMethods, observerArray, dependArray } from './array'
import Dep from './dep'

export function defineReactive(data, key, value) {


  // value还是对象需要遍历深度观
  let childOb = observe(value)
  console.log(childOb)
  let dep = new Dep() //收集依赖，watcher
  Object.defineProperty(data, key, {
    get() { //只要取值了，就会把当前watcher存入
      if (Dep.target) { //存入的watcher不能重复，会导致多次渲染
        dep.depend() // dep存watcher,watcher存dep
        if(childOb) { //数组的依赖收集
          childOb.dep.depend() //数组收集渲染watcher
          dependArray(value) //收集儿子的依赖
        }
      }
      return value
    },
    set(newValue) {
      if(value === newValue) return
      observe(value) //如果是对象
      value = newValue
      dep.notify()
    }
  })
}

class Observer {
  constructor(data) {
    this.dep = new Dep() //此dep专门为数组用
    // 每个对象 包括数组都有个__ob__属性，是observer实例
    Object.defineProperty(data, '__ob__', {
      get: () => this
    })

    if(Array.isArray(data)) {
      //只能拦截数组的方法，不能拦截数组的某一项
      data.__proto__ = arrayMethods //让数组通过原型链查找的重新写的方法原型
      // 当调用数组方法时，手动通知

      observerArray(data)
    } else {
      // 遍历data
      this.walk(data)
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let value = data[key]
      defineReactive(data, key, value)
    }
  }
}

export default Observer