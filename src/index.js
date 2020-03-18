import Vue from 'vue'

let vm = new Vue({
  el: '#app',
  data() {
    return {msg: 'jojo'}
  },
  render(h){
    return h('p', {id: 'a',}, this.msg)
  }
})

setTimeout(() => {
  vm.msg = 'hello jojo'
},1000)