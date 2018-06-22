<style lang="less" scoped>
.setting {
    position: fixed;
    width: 100%;
    top: 0;
    .titile {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .btnStyle {
        height: 30px;
        width: 80px;
        text-align: center;
        border: 1px solid #1194f6;
        border-radius: 20px;
        margin: 5px;
    }
}
</style>


<template>
    <div class="setting">
        <slide ref="slide" v-if='slideShow' :swiperHeight='2.1' :gotoIndex='gotoIndex' :consoleOption='consoleOption' :photoList='photoList' :option='swiperOption' :initSwiper="initSwiper" @upIndex='updateIndex'></slide>
        <div class="titile">
            <span>幻灯片预览</span>
        </div>
        <div class="line-1px-bottom">
            <cell value='相册' :title='selectedInfo.album.album_name' :styleData='albumStyleData' @onClick="checkPlayModel('album')"></cell>
            <cell value='切换效果' :title='selectedInfo.swipe.text' :styleData='styleData' @onClick="checkPlayModel('swipe')"></cell>
            <cell value='主题音乐' :title='selectedInfo.music.text' :styleData='styleData' @onClick="checkPlayModel('music')"></cell>
            <cell value='播放速度' :title='selectedInfo.speed.text' isLast :styleData='styleData' @onClick="checkPlayModel('speed')"></cell>
        </div>
    </div>
</template>

<script>
import Cell from '../../components/Cell'
import Slide from '../../components/Slide'
import * as JSB from '@uneed/jsbridge-webview'
import default1 from '../../assets/images/default1.jpg'
import default2 from '../../assets/images/default2.jpg'
import default3 from '../../assets/images/default3.jpg'
import { getStringLimited } from '../../assets/js/func'
import { SELECTION_LIST } from '../selection/const'
const DEFAULT_IMGS = [{
            content: default1
        },{
            content: default2
        },{
            content: default3
        }]
export default {
    name: 'setting',
    components: {
        Cell,
        Slide
    },
    data() {
        return {
            gotoIndex: 0,
            testImg: '',
            slideShow: true,
            initSwiper: true,
            consoleOption: {
                showConsole: false,
                albumTitle: '未选择相册',
                albumName: '我是相册名称'
            },
            swiperOption: {
                delay: 5000,
                effect: 'slide',
                pagination: true,
                initialSlide: 1,
                autoplay: true,
            },
            Administrator: true,
            cvs: {
                cvsid: '',
                cvsType: 1,
                cvsRole: 1
            },
            userInfo: {},
            selectedInfo: {
                album: {
                    album_name: '请选择相册',
                    albumid: ''
                },
                music: {
                    text: SELECTION_LIST.music[0].text,
                    value: SELECTION_LIST.music[0].value
                },
                swipe: {
                    text: SELECTION_LIST.swipe[0].text,
                    value: SELECTION_LIST.swipe[0].value
                },
                speed: {
                    text: SELECTION_LIST.speed[0].text,
                    value: SELECTION_LIST.speed[0].value
                }
            },
            photoList: []
        }
    },
    mounted() {
        this.photoList = DEFAULT_IMGS.slice(0)
        this.swiperOption = {
            delay: 5000,
            effect: 'slide',
            pagination: true,
            initialSlide: 1,
            autoplay: true,
        }
        JSB.Audio.on('download', result => {
            console.log('音频下载结束:', result)
        })

        JSB.Nimo.on('g.app', resp => {
            console.log('透传消息接受')
            console.log(resp)
        })

        JSB.nativeEvent.on('page.pause', () => {
            JSB.Audio.stop('effect')
        })

        JSB.nativeEvent.on('page.close', () => {
            JSB.Audio.stop('effect')
        })

        JSB.Chatlet.on('button.click', result => {
            console.log('button.click: ', result)
            if (result.action == 'start') {
                JSB.API.request({
                    url: `chatlet/open/${this.userInfo.uid}`,
                    data: {
                        appid: 'chatlet-slide',
                        type: this.cvs.cvsType,
                        remoteid: this.cvs.cvsid,
                        creatorid: this.userInfo.uid,
                        raw_data: {
                            play_type: this.selectedInfo.swipe.value,
                            speed: this.selectedInfo.speed.value,
                            music: this.selectedInfo.music.value,
                            albuminfos: [
                                {
                                    albumid: this.selectedInfo.album.albumid
                                }
                            ]
                        }
                    }
                })
                .then(resp => {
                    JSB.Audio.stop('effect')
                    JSB.Page.close()
                })
                .catch(err => {
                    console.log(err)
                    JSB.UI.toast('创建小应用失败，请稍后重试')
                })
            }
        })
        this.initPageData()
    },
    computed: {
        styleData() {
            return this.Administrator ? { rightIcon: true, leftWidth: 0.22 } : { rightIcon: false, leftWidth: 0.22 }
        },
        albumStyleData() {
            if (this.Administrator) {
                return this.selectedInfo.album.album_name == '请选择相册'
                    ? { rightIcon: true, fontColor: '#1194f6', leftWidth: 0.22 }
                    : { leftWidth: 0.22, rightIcon: true }
            } else {
                return { leftWidth: 0.22, rightIcon: false }
            }
        }
    },
    destroyed() {
        console.log('destroyed')
        JSB.Audio.stop('effect')
    },
    methods: {
        updateIndex(index){
            console.log('updateIndex: ', index)
        },
        async initPageData() {
            console.log('begin initPageData')
            // userInfo
            let userResp = await JSB.App.getUserInfo()
            this.userInfo = userResp.data
            console.log('userResp: ', userResp)

            // 获取cvs
            let cvsResp = await JSB.Page.getData('cvs')
            this.cvs.cvsid = cvsResp.data.cvsid
            this.cvs.cvsType = parseInt(cvsResp.data.cvsType)
            this.cvs.cvsRole = parseInt(cvsResp.data.cvsRole)
            this.Administrator = !(this.cvs.cvsRole === 0)
            console.log('cvsResp: ', cvsResp)
            // 初始化按钮的样式
            this.setButton('start', '开始', 'disabled')
        },
        checkPlayModel(type) {
            if (!this.Administrator) return
            switch (type) {
                case 'album':
                    this.selectedAlbum()
                    break

                case 'swipe':
                    JSB.Page.navigateForward(
                        {
                            id: 'chatlet-slide',
                            page_name: 'pages/selection.html',
                            data: {
                                selection: {
                                    select_type: 'swipe',
                                    select_value: this.selectedInfo.swipe.value
                                }
                            }
                        },
                        result => {
                            console.log('选择swipe: ', result)
                            if(result.select_type == 'swipe'){
                                    this.selectedInfo.swipe = {
                                    text: result.select_text,
                                    value: result.select_value
                                }
                                let swiperOps = JSON.parse(JSON.stringify(this.swiperOption))
                                swiperOps.effect = this.selectedInfo.swipe.value
                                this.swiperOption = swiperOps
                            }
                        }
                    )
                    break

                case 'music':
                    console.log(type)
                    JSB.Page.navigateForward(
                        {
                            id: 'chatlet-slide',
                            page_name: 'pages/selection.html',
                            data: {
                                selection: {
                                    select_type: 'music',
                                    select_value: this.selectedInfo.music.value
                                }
                            }
                        },
                        result => {
                            // 选中music
                            console.log('选中music返回： ', result)
                            if(result.select_type == 'music'){
                                this.selectedInfo.music = {
                                    text: result.select_text,
                                    value: result.select_value
                                }
                                if(result.select_value == 'quiet'){
                                    JSB.Audio.stop('effect')
                                }else{
                                    JSB.Audio.download(result.select_value).then(result => {
                                        console.log('下载完成', result)
                                        JSB.Audio.play({
                                            url: result.data.url,
                                            loop: true,
                                            seek: 1,
                                            channel: 'effect'
                                        })
                                    })
                                }
                            }
                        }
                    )
                    break

                case 'speed':
                    console.log(type)
                    JSB.Page.navigateForward(
                        {
                            id: 'chatlet-slide',
                            page_name: 'pages/selection.html',
                            data: {
                                selection: {
                                    select_type: 'speed',
                                    select_value: this.selectedInfo.speed.value
                                }
                            }
                        },
                        result => {
                            console.log('点击speed返回: ', result)
                            if(result.select_type == 'speed'){
                                this.selectedInfo.speed = {
                                    text: result.select_text,
                                    value: result.select_value
                                }
                                this.swiperOption.delay = this.selectedInfo.speed.value
                            }
                        }
                    )
                    break
            }
        },
        selectedAlbum() {
            console.log('will go to album')
            JSB.App.openSelectAlbum({
                cvsid: this.cvs.cvsid,
                cvsType: this.cvs.cvsType,
                albumid: this.selectedInfo.album.albumid || ''
            }).then(resp => {
                console.log('album resp: ', resp)
                this.selectedInfo.album = resp.data
                this.selectedInfo.album.album_name = `《${getStringLimited(this.selectedInfo.album.album_name, 8)}》`
                this.consoleOption.albumTitle = ''
                const imgs = resp.data.preview_album.images
                if (imgs && imgs.length && imgs.length > 0) {
                    let photoList = imgs.map(item => {
                        return {
                            content: item.preview_url
                        }
                    })
                    this.photoList.splice(0, this.photoList.length, ...photoList)
                    // this.gotoIndex = 0
                    this.$refs.slide.publicLoadData(photoList, 0)
                }
                if(imgs && imgs.length == 0){
                    console.log('no: ', this.photoList, DEFAULT_IMGS)
                    this.photoList.splice(0, this.photoList.length, ...DEFAULT_IMGS)
                    this.$refs.slide.publicLoadData(DEFAULT_IMGS, 0)
                    this.consoleOption.albumTitle = '无可播放照片'
                }
                this.setButton('start', '开始', 'normal')
            })
        },
        setButton(action, text, style) {
            JSB.Chatlet.button({
                action: action,
                text: text,
                style: style  // normal | disabled | loading
            })
        }
    }
}
</script>


