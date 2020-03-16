import Vue from 'vue'
import {h, render, patch} from '../source/vue/vdom'

let vm = new Vue({
  el: '#app',
  data(){
    return {
      msg: '123',
    }
  },
})
let app = document.getElementById('app')

let oldVnode = h('div',{id:'container'},
    h('li',{style:{background:'red'},key:'a'},'a'),
    h('li',{style:{background:'yellow'},key:'b'},'b'),
    h('li',{style:{background:'blue'},key:'c'},'c'),
    h('li',{style:{background:'pink'},key:'d'},'d'),
);

let newVnode = h('div',{id:'container'},
  h('li',{style:{background:'red'},key:'e'},'e'),
  h('li',{style:{background:'yellow'},key:'f'},'f'),
  h('li',{style:{background:'red'},key:'a'},'a'),
  h('li',{style:{background:'yellow'},key:'b'},'b'),
  h('li',{style:{background:'blue'},key:'c'},'c'),
  h('li',{style:{background:'pink'},key:'d'},'d'),
)
render(oldVnode, app)
setTimeout(() => {
  patch(oldVnode, newVnode)
}, 1000)