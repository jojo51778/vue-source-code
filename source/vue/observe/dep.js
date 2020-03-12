let id = 0

class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  addSub(watcher) { //订阅，addSub传入数组中
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
  depend() {
    if(Dep.target) { //防止直接执行depend
      Dep.target.addDep(this)
    }
  }
}

let stack = []
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}
export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}
export default Dep