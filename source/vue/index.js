import initState from './observe'

function Vue(options) {
  this._init(options)
}

Vue.prototype._init = function(options) {
  let vm = this
  vm.$options = options
  //初始化数据
  initState(vm)
}

export default Vue