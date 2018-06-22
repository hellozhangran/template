import Vue from 'vue'
import App from './section.vue'
import Lib from '@/assets/js/common'
// 关闭生产模式下给出的提示
Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')
