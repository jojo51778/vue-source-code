let callbacks = []
function flushCallbacks() {
  callbacks.forEach(cb => cb())
}
export function nextTick(cb) {
  callbacks.push(cb)

  let timerFunc = () => {
    flushCallbacks()
  }
  if(Promise) {
    return Promise.resolve().then(timerFunc)
  }
  if(MutationObserver) {
    let observer = new MutationObserver(timerFunc)
    let textNode = document.createTextNode(1)
    observer.observe(textNode, {characterData: true})
    textNode.textContent = 2
    return
  }
  if(setImmediate) {
    return setImmediate(timerFunc)
  }
  setTimeout(timerFunc, 0)
}