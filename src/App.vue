<style>

.button{
  color: green
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


</style>

<template>
  <div id="app">
    <img :src="img">
    <h1>{{ msg }}</h1>
    <button class="button" @click="onClick">Button</button>
    <button class="inner">inner</button>
  </div>
</template>

<script>
import './assets/css/common.css'
import icon from './assets/logo.png'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App!',
      img: icon
    }
  },
  methods: {
    onClick(){
      console.log('hello world!')
      console.log('env: ', process.env.NODE_ENV)
      console.log('zhangran: ', ZHANGRAN)
    }
  }
}
</script>


