<style lang="less">
.slide {
    width: 100%;
    height: 100%;
    position: relative;
    justify-content: center;
    background: rgb(61, 61, 61);
    #iSlider-wrapper {
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: absolute;
        #iSlider-wrapper ul {
            height: 100%;
            overflow: hidden;
        }
        #iSlider-wrapper li {
            position: absolute;
            height: 100%;
            overflow: hidden;
            display: -webkit-box;
        }
        #iSlider-wrapper li img {
            max-width: 100%;
            max-height: 100%;
        }
    }
    .centerArea {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -30px;
        margin-left: -30px;
        width: 60px;
        height: 60px;
        border-radius: 30px;
        z-index: 1001;
    }
    .shadow {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 23px;
            line-height: 32.5px;
            color: rgb(177, 177, 177);
            img {
                margin-left: 0.05rem;
                height: 20px;
            }
        }
    }
    .console {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .shade {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 55px;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.66), rgba(2, 2, 2, 0));
        }
        .row-start {
            position: relative;
            display: flex;
            justify-content: center;
            color: #fff;
            font-size: 14px;
            line-height: 20px;
            span:nth-child(1) {
                display: flex;
                position: absolute;
                left: 0;
                justify-content: center;
                align-items: center;
                max-width: 115px;
                height: 23px;
                border-radius: 12.2px;
                background: rgba(0, 0, 0, 0.6);
                div {
                    margin: 0 8.5px;
                }
            }
            span:nth-child(2) {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 23px;
                max-width: 100px;
                border-radius: 12.2px;
                background: rgba(0, 0, 0, 0.6);
                div {
                    margin: 0 8.5px;
                }
            }
            span:nth-child(3) {
                position: absolute;
                right: 0;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                height: 23px;
                img {
                    width: 25px;
                }
            }
        }
        .row-end {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            font-size: 14px;
            line-height: 20px;
            span:nth-child(1) {
                display: flex;
                justify-content: center;
                align-items: center;
                max-width: 100px;
                height: 23px;
                border-radius: 12.2px;
                background: rgba(0, 0, 0, 0.6);
                div {
                    margin: 0 11px;
                }
            }
            span:nth-child(2) {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 23px;
                img {
                    width: 30px;
                }
            }
        }
        .row-start-full {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 16px;
            line-height: 22.5px;
            span:nth-child(1) {
                display: flex;
                position: absolute;
                left: 0;
                justify-content: center;
                align-items: center;
                max-width: 115px;
                height: 30px;
                border-radius: 17.5px;
                background: rgba(0, 0, 0, 0.6);
                div {
                    margin: 0 10.5px;
                }
            }
            span:nth-child(2) {
                display: flex;
                justify-content: center;
                align-items: center;
                max-width: 100px;
                height: 30px;
                border-radius: 17.5px;
                background: rgba(0, 0, 0, 0.6);
                div {
                    margin: 0 10.5px;
                }
            }
            span:nth-child(3) {
                position: absolute;
                right: 0;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                height: 30px;
                img {
                    width: 35px;
                }
            }
        }
        .row-end-full {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            img {
                width: 45px;
            }
        }
       
    }
    .meaasge {
        position: absolute;
        left: 20px;
        bottom: 20px;
        width: 45px;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        .msgNum {
            position: absolute;
            color: #fff;
            font-size: 14px;
            line-height: 20px;
        }
        img {
            width: 45px;
        }
    }
    .loading-animation {
        animation: 1s loadrotate infinite;
        animation-timing-function: linear;
    }
    @keyframes loadrotate {
        from {
            transform-origin: center;
            transform: rotateZ(0);
        }
        to {
            transform-origin: center;
            transform: rotateZ(360deg);
        }
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.6s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
}
</style>
<template>
    <div class="slide" :style="{height: swiperHeight ? swiperHeight + 'rem' : ''}">
        <div class="shadow" v-if="consoleOption.albumTitle">
            <span>
                {{consoleOption.albumTitle}}
                <img v-if='consoleOption.albumTitle == "正在加载"' class='loading-animation' src="../assets/images/loading.png">
            </span>
        </div>
        <template v-if="consoleOption.showConsole">
            <transition name="fade">
                <div class="console" v-show="showConsole" :style="{padding:consolePadding}">
                    <div class="shade"></div>
                    <div :class="{'row-start':!consoleOption.fullScreen,'row-start-full':consoleOption.fullScreen}">
                        <span @click="goAlbum">
                            <div class="nowarp">{{consoleOption.albumName}}</div>
                        </span>
                        <span>
                            <div class="nowarp" @click="uploadImg" :style="{color: consoleOption.albumEmpty ? '#1194f6':''}">上传照片</div>
                        </span>
                        <span v-if='consoleOption.isAudio' @click="changeVoice(true)"><img src="./assets/images/audio.png"></span>
                        <span v-else @click="changeVoice(false)"><img src="./assets/images/noaudio.png"></span>
                    </div>
                    <div :class="{'row-end':!consoleOption.fullScreen,'row-end-full':consoleOption.fullScreen}">
                        <span @click="showImg" v-if='!consoleOption.fullScreen' :style="{'visibility': (consoleOption.albumEmpty||currentIsVideo) ? 'hidden' : 'visible'}">
                            <div class="nowarp">查看大图</div>
                        </span>
                        <span v-if='consoleOption.fullScreen' @click="changeScreen"><img class='fullicon' src="./assets/images/nofull.png"></span>
                        <span v-else @click="changeScreen"><img class='fullicon' src="./assets/images/full.png"></span>
                    </div>
                    <!-- 点击区域，如果content_type: video/mp4,则该区域可以点击 -->
                </div>
            </transition>
        </template>
        <div class='meaasge' v-if="consoleOption.fullScreen && consoleOption.unreadMessage" @click="showMsg">
            <span class="msgNum">{{consoleOption.unreadMessage}}</span>
            <img src="./assets/images/message.png">
        </div>
        <div v-show='initSwiper' id="iSlider-wrapper"></div>
        <div class="centerArea" v-if="showClickCenter" @click="clickCenter"></div>
    </div>
</template>

<script>
import '../assets/js/iSlider/iSlider.css'
import '../assets/js/iSlider/iSlider.js'
import '../assets/js/iSlider/iSlider.animate.js'
import logoGray from '../assets/images/logo_gray.png'
import loading from '../assets/images/loading.png'

export default {
    name: 'slide',
    props: {
        gotoIndex: Number,
        option: {
            type: Object,
            default() {
                return {
                    delay: 5000,
                    effect: 'default',
                    initialSlide: 0,
                    pagination: false,
                    autoplay: true
                }
            }
        },
        consoleOption: {
            type: Object,
            default() {
                return {
                    showConsole: false,
                    albumTitle: '',
                    albumName: '',
                    fullScreen: false,
                    unreadMessage: 0,
                    isAudio: true,
                    albumEmpty: false
                }
            }
        },
        photoList: Array,
        initSwiper: Boolean,
        swiperHeight: Number
    },
    data() {
        return {
            iSlider: null,
            list: null,
            slideOption: {},
            timeNow: 0,
            orientation: 0,
            longPress: 0,
            showConsole: true,
            showClickCenter: true,
            reSet: null,
            slideLock: false,
            currentIsVideo: false,
        }
    },
    watch: {
        // showConsole(label){
        //     if(label){
        //         let img = document.querySelector('.islider-active .islider-play-icon')    
        //         if(img){
        //             img.style.opacity = 1
        //         }
        //     }else{
        //         let img = document.querySelector('.islider-active .islider-play-icon')    
        //         if(img){
        //             img.style.opacity = 0.8
        //         }
        //     }
        // },
        gotoIndex(newVal) {
            if (this.iSlider) {
                this.iSlider.slideTo(newVal)
            }
        },
        option: {
            handler(newVal) {
                console.log('--- watch option:', newVal)
                if (this.iSlider) {
                    this.iSlider.destroy()
                }
                this.iSliderInit()
            },
            deep: true
        },
        // 目前应该还不需要deep监听，只会当length改变时才会触发该photoList
        photoList(newList) {
            if (!this.iSlider) return

            console.log('-- watch photoList: ', newList)
            // 如果数据只有一个或者0，则暂定，否则启动
            if (newList.length <= 1) {
                console.log('数据小于等于1，停止播放')
                //此处如果不重载数据，会重复播放之可能被删掉的数据
                this.iSlider.loadData(newList, 0)
                this.pauseSlide()
            } else if (newList.length > 1 && !this.slideLock && !this.iSlider.isAutoplay) {
                console.log('数据多于1张，开始播放: ', this.iSlider.isAutoplay)
                console.log('查看此时的数据情况：', this.photoList)
                this.playSlide()
            }
        }
    },
    computed: {
        consolePadding() {
            if (this.consoleOption.fullScreen) {
                if (window.iPhoneX && this.orientation == 0) {
                    return '35.5px 20.5px 20px 20px'
                } else {
                    return '11.5px 20.5px 20px 20px'
                }
            } else {
                return '10px 13.5px 9px 15px'
            }
        }
    },
    mounted() {
        this.pageInitEvent()
    },
    methods: {
        // 以public开头的是供外部调用的方法
        slidePlayState() {
            return this.iSlider.isAutoplay
        },
        publicPlaySlide() {
            this.slideLock = false
            this.playSlide()
        },
        publicPauseSlide() {
            this.slideLock = true
            this.pauseSlide()
        },
        publicLoadData(newList, index) {
            this.iSlider.loadData(newList, index)
        },
        playSlide() {
            this.iSlider.isAutoplay = true
            this.iSlider.play()
        },
        pauseSlide() {
            this.iSlider.pause()
            this.iSlider.isAutoplay = false
        },
        pageInitEvent() {
            setTimeout(() => {
                this.showConsole = false
            }, 3000)
            const el = document.querySelector('.slide')
            el.addEventListener('touchstart', e => {
                if (e.target.parentElement.tagName == 'SPAN') {
                    return
                }
                if(this.longPress){
                    clearTimeout(this.longPress)
                    this.longPress = null
                }
                this.longPress = setTimeout(this.longPressEvent, 300)
                if (+new Date() - this.timeNow > 200) {
                    if (this.showConsole) {
                        this.showConsole = false
                    } else {
                        this.showConsole = true
                    }
                }
            })
            el.addEventListener('touchmove', e => {
                clearTimeout(this.longPress)
                this.longPress = null
            })
            el.addEventListener('touchend', () => {
                this.timeNow = +new Date()
                clearTimeout(this.reSet)
                clearTimeout(this.longPress)
                this.longPress = null
                if (this.showConsole) {
                    this.reSet = setTimeout(() => {
                        this.showConsole = false
                    }, 5000)
                }
            })
            window.addEventListener('resize', () => {
                this.orientation = window.orientation
            })
        },
        iSliderInit() {
            console.log('iSliderInit: ', this.option.autoplay)
            this.slideOption = {
                dom: document.getElementById('iSlider-wrapper'),
                data: this.photoList,
                defaultImage: logoGray,
                // isDebug: true,
                isOverspread: true,
                isLooping: true, // 循环播放
                animateType: this.option.effect, // normal（滑动）、rotate（旋转）、depth、flow、flip、card、fade（渐显/隐）、zoomout（向外/内缩放）
                isAutoplay: this.photoList.length > 1 ? this.option.autoplay : false,
                duration: this.option.delay - 1200, // 停留时间
                // isVertical: true, // 垂直模式
                animateTime: 1200, // 动画时间
                isTouchable: false, // 禁止手动切换
                // animateEasing: 'ease-in-out',
                initIndex: this.option.initialSlide, // 首屏索引

                onRenderComplete: index => {
                    var current = this.photoList[index]
                    if(current && current.content_type && current.content_type == 'video/mp4'){
                        this.currentIsVideo = true
                    }else{
                        this.currentIsVideo = false
                    }
                },
                onSlideChange: index => {
                    console.log('--------onSlideChange', index)
                    var current = this.photoList[this.iSlider.slideIndex]
                    if(current && current.content_type && current.content_type == 'video/mp4'){
                        this.currentIsVideo = true
                    }else{
                        this.currentIsVideo = false
                    }
                },
                onSlideChanged: index => {
                    console.log('--- 触发onSlideChanged')
                    this.upIndex(index)
                    if (this.option.effect == 'random') {
                        this.iSlider._resetAnimation(this.animateType(index))
                    }
                }
            }
            this.iSlider = new iSlider(this.slideOption)
        },
        animateType(index) {
            switch (index % 5) {
                // case 0:
                //     return 'flip'
                case 0:
                    return 'zoomout'
                case 1:
                    return 'normal'
                case 2:
                    return 'rotate'
                case 3:
                    return 'fade'
                case 4:
                    return 'card'
            }
        },
        longPressEvent() {
            this.longPress = null
            if (this.consoleOption.albumTitle || this.consoleOption.fullScreen) {
                return
            } else {
                this.$emit('longPress', this.photoList[this.iSlider.slideIndex])
            }
        },
        uploadImg() {
            this.$emit('uploadImg')
        },
        changeVoice(bool) {
            this.$emit('changeVoice', bool)
        },
        changeScreen() {
            this.$emit('changeScreen')
        },
        showImg() {
            let current = this.photoList[this.iSlider.slideIndex]
            if(current && current.content_type != 'video/mp4'){
                this.$emit('showImg', current)
            }
        },
        showMsg() {
            this.$emit('showMsg')
        },
        goAlbum() {
            this.$emit('goAlbum')
        },
        upIndex(index) {
            this.$emit('upIndex', index)
        },
        clickCenter(){
            let item = this.photoList[this.iSlider.slideIndex]
            if(item.content_type && item.content_type == 'video/mp4'){
                this.$emit('clickPlay', this.photoList[this.iSlider.slideIndex])
            }
        }
    }
}
</script>
