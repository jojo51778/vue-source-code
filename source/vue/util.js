const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g //匹配双花括号
export const util = {
  getValue(vm, expr) {
    let keys = expr.split('.')
    return keys.reduce((memo, current) => {
      memo = memo[current] //vm.school.name
      return memo
    }, vm)
  },
  compilerText(node, vm) {
    if(!node.expr){
      node.expr = node.textContent; // 给节点增加了一个自定义属性 为了方便后续的更新操作
    }
    node.textContent = node.expr.replace(defaultRE, function(...args) {
      return JSON.stringify(util.getValue(vm, args[1]))
    })
  }
}
export function compiler(node, vm) {
  let childNodes = node.childNodes;
  [...childNodes].forEach(child => {
    if(child.nodeType == 1){ // 1是元素，3是文本
      compiler(child, vm)
    } else if (child.nodeType == 3) {
      
      util.compilerText(child, vm)
    }
  })
}