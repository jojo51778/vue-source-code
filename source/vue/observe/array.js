import { observe } from "./index"

let oldArrayProtoMethods = Array.prototype
// 拷贝一个新的对象
export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
  'push',
  'shift',
  'pop',
  'unshift',
  'reverse',
  'sort',
  'splice'
]
export function observerArray(inserted) { //循环数组每一项进行监测
  for(let i=0; i < inserted.length; i++) {
    observe(inserted[i]) //对数组中的对象进行观察
  }
}
export function dependArray(value) { // 递归搜集数组中的依赖
  for(let i = 0; i < value.length; i++) {
    let currentItem = value[i]
    currentItem.__ob__ && currentItem.__ob__.dep.depend()
    if(Array.isArray(currentItem)) {
      dependArray(currentItem)
    }
  }
}
methods.forEach(method => {
  arrayMethods[method] = function (...args) { //函数劫持 切片编程
    let r = oldArrayProtoMethods[method].apply(this,args)
    let inserted
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.splice(2) // 获取新增内容
        break
      default:
        break
    }
    if(inserted) {
      observerArray(inserted)
    }
    console.log('数组方法')
    this.__ob__.dep.notify() //通知视图更新
    return r
  }
})