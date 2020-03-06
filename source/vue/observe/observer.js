import { observe } from './index'
import { arrayMethods } from './array'
import { observerArray } from './array'

export function defineReactive(data, key, value) {


  // value还是对象需要遍历深度观
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      console.log('获取数据')
      return value
    },
    set(newValue) {
      if(value === newValue) {
        return
      }
      console.log('设置数据')
      value = newValue
    }
  })
}

class Observer {
  constructor(data) {
    if(Array.isArray(data)) {
      //只能拦截数组的方法，不能拦截数组的某一项
      data.__proto__ = arrayMethods //让数组通过原型链查找的重新写的方法原型
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
      defineReactive(data, key, value,)
    }
  }
}

export default Observer