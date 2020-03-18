

const data = {
  a: 1,
  b: 'jojo',
  c: {
    d: '1',
    f: 2
  }
}

function observe(data) {
  if(typeof data !== 'object' || data == null) {
    return
  }

  walk(data)
}

function walk(data) {
  const keys = Object.keys(data)
  for(let i = 0; i <= keys.length; i++) {
    let key = keys[i]
    let value = data[key]
    defineReactive(data, key, value)
  }
}

observe(data)

function defineReactive(data, key, value) {
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      value = newValue
      console.log('设置数据')
    }
  })
}
console.log(data.c.d)
data.c.d = 2
console.log(data.c.d)