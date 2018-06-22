import '../css/common.css'
// 移动端点击优化
import FastClick from 'fastclick-fixed'
FastClick.attach(document.body)

// 移动端rem适配
const setRemUnit = () => {
    const width = document.documentElement.clientWidth
    document.documentElement.style.fontSize = width / 3.75 + 'px'
    if (window.orientation === 90 || window.orientation === -90) {
        const height = document.documentElement.clientHeight
        document.documentElement.style.fontSize = height / 3.75 + 'px'
    }
}
window.onload = () => {
    let reSet
    setRemUnit()
    window.addEventListener('resize', () => {
        clearTimeout(reSet)
        reSet = setTimeout(setRemUnit, 300)
    }, false)
    window.addEventListener('pageshow', e => {
        if (e.persisted) {
            clearTimeout(reSet)
            reSet = setTimeout(setRemUnit, 300)
        }
    }, false)
}