import Vue from 'vue'
import App from './chatletSlide.vue'
import Lib from '@/assets/js/common'

Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')
