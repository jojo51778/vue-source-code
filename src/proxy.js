const obj = {
  a: {
    name: 'jojo'
  },
  b: [1,2,3]
}

let handler = {
  get(target, key) {
    console.log('获取数据')
    if (typeof target[key] === 'object' && target[key] !=null) {
      return new Proxy(target[key], handler)
    }
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    let oldValue = target[key]
    if(!oldValue) {
      console.log('新增属性')
    } else {
      console.log('设置属性')
    }
    return Reflect.set(target, key, value)
  }
}

let proxy = new Proxy(obj, handler)

proxy.a.name = 'czw'