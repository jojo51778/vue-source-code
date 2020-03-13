import Vue from 'vue'

let vm = new Vue({
  el: '#app',
  data(){
    return {
      msg: '123',
      arr: [{a:1},[1],2,3],
      my: {
        name: 'jojo'
      }
    }
  },
  computed: {

  },
  watch: {
    msg(newValue, oldValue) {
      console.log(newValue, oldValue)
    }
  },
})
// vm.msg = vm._data.msg
// 如果新增属性为对象，需要进行观察 observe
// console.log(vm.arr.push({a: 123}),vm.arr[3].a) //不会监控到push，对原生方法进行劫持实现监控
console.log(vm.arr[0]['a'] = 100)
setTimeout(() => {
  // vm.arr[0].a = 100
  // vm.arr.push(4)
  // vm.arr[1].push(2) //要对数组中的数组依赖收集
  // console.log(vm)
  vm.msg = 'jojo 我不做人了'
},1000)
// 什么样的数组会被观测 [0,1,2] observe 不能直接改变索引不能被检测到vm.arr[0] = 2
// [1,2,3].length--  因为数组的长度变化 没有监控

// [{a:1}] // 内部会对数组里的对象进行监控
// [].push / shift unshift 这些方法可以被监控 vm.$set 内部调用的就是数组的splice