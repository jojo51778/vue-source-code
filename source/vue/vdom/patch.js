export function render(vnode, container) {
  let el = createElm(vnode)
  container.appendChild(el)
}

function createElm(vnode) {
  let {tag, children, key, props, text} = vnode
  if(typeof tag === 'string') {
    vnode.el = document.createElement(tag) //真实节点
    updateProperties(vnode, )
    children.forEach(child => {
      return render(child, vnode.el) //递归渲染当前孩子列表
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.props || {}
  let el = vnode.el
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  // 下次更新时，根据新的虚拟节点来修改dom元素
  for(let key in oldStyle) {
    if(!newStyle[key]) {
      el.style[key] = ''
    }
  }
  // 下次更新时，
  for (let key in oldProps) {
    if(!newProps[key]) {
      delete el[key] // 新的没有这个属性直接删除
    }
  }
  for(let key in newProps) {
    if(key === 'style') {
      //样式
      for(let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if(key === 'class') {
      el.className = newProps.class
    } else { // 给元素添加属性，值就是对应的值
      el[key] = newProps[key]
    }
  }
}

export function patch(oldVnode, newVnode) {
  // 先比对标签
  if(oldVnode.tag !== newVnode.tag) {
    oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el) 
  }
  // 比较文本，标签一样，可能都是undefined
  if(!oldVnode.tag) {
    if(oldVnode.text !== newVnode.text) {
      oldVnode.el.textContent = newVnode.text
    }
  }
  //标签一样，可能属性不一样
  let el = newVnode.el = oldVnode.el
  updateProperties(newVnode, oldVnode.props) // 做属性比对

  // 比较child
  let oldChildren = oldVnode.children || []
  let newChildren = newVnode.children || []
  // 老的有孩子，新的有孩子
  if (oldChildren.length > 0 && newChildren.length > 0) {
    updateChildren(el, oldChildren, newChildren)
  } else if(oldChildren.length > 0) { // 老的有孩子，新的没孩子
    el.innerHtml = ''
  } else if(newChildren.length > 0) { // 老的没孩子，新的有孩子
    for(let i = 0; i < newChildren.length; i++) {
      let child = newChildren[i]
      el.appendChild(createElm(child)) //将当前新的儿子丢到老的节点即可
    }
  }
}
function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}
function updateChildren(parent, oldChildren, newChildren) {
  // 老节点
  let oldStartIndex = 0
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  // 新的节点
  let newStartIndex = 0
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if(isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode) //新属性更新老的属性
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if(isSameVnode(oldEndVnode, newEndVnode)) { //从后面比较是否一样
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    }
  }
  // 新的还有剩余
  if(newStartIndex <= newEndIndex) {
    for(let i = newStartIndex; i <= newEndIndex; i++ ) {
      let ele = newChildren[newEndIndex+1] == null ? null : newChildren[newEndIndex+1].el //null表示插到后面
      parent.insertBefore(createElm(newChildren[i]), ele)
    }
  }
}