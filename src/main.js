import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})

console.log('hello this is main.js')
console.log('env: ', process.env.NODE_ENV)
