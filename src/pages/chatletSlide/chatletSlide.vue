<style lang="less">
.slideOuter {
    height: 100%;
    width: 100%;
    position: relative;
    button{
        background: transparent;
        outline: none;
        border: none;
    }
    .modal-reload{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        background-color: #353535;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn-reload {
            color: #efefef;
        }
    }
    .modal-network{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10001;
        background-color: rgba(0,0,0,0.5);
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        .title{
            width: 100%;
            color: white;
            font-size: 15px;
            text-align: center;
            line-height: 20px;
        }
        .btns {
            font-size: 12px;
            margin-top: 20px;
            .btn-cancel {
                color: #efefef;
                width: 80px;
                height: 30px;
                border-radius: 30px;
                border: 1px solid white;
                margin-right: 10px;
            }
            .btn-play {
                color: #efefef;
                width: 80px;
                height: 30px;
                border-radius: 30px;
                background-color: rgb(17,148,246);
                margin-left: 10px;
            }
        }
    }
   
}
</style>

<template>
    <div class="slideOuter">
        <slide ref="slide" :consoleOption='consoleOption' :gotoIndex='gotoIndex' :photoList='photoList' :option='swiperOption' :initSwiper="initSwiper" @uploadImg='clickUploadImg' @changeVoice='clickChangeVoice'
            @changeScreen='clickChangeScreen' @showMsg='clickShowMsg' @goAlbum='clickGoAlbum' @upIndex='updateIndex' @longPress='longPressImage' @showImg='gotoAlbumImage' @clickPlay='playVideo'></slide>

        <div v-if="false" class="modal-reload"><button class="btn-reload" @click="reloadPage">点击重新加载</button></div>
        <div v-if="networkModal" class="modal-network">
            <div class="title">
                <p class="label">当前为移动网络</p>
                <p class="label">继续播放会消耗流量</p>
            </div>
            <div class="btns">
                <button class="btn-cancel" @click="clickPlayCancel">取消</button>
                <button class="btn-play" @click="clickPlaySlide">继续播放</button>
            </div>
        </div>
    </div>
</template>

<script>
import Slide from '../../components/Slide'
import * as JSB from '@uneed/jsbridge-webview'

import default1 from '../../assets/images/default1.jpg'
import default2 from '../../assets/images/default2.jpg'
import default3 from '../../assets/images/default3.jpg'

import logoGray from '../../assets/images/logo_gray.png'

import loading from '../../assets/images/loading.png'

const KEY_PREFIX = 'chatlet_slide_audio_state_'
const NET_KEY_PREFIX = 'chatlet_slide_network_'
const CHATLET_STATUS_PREFIX = 'chatlet_slide_status_'
const PAGE_SIZE = 10
const DEFAULT_IMGS = [{
    content: default1,
},{
    content: default2,
},{
    content: default3
}]

let current_chatlet_has_over = null

export default {
    name: 'chatletSlide',
    components: {
        Slide
    },

    data() {
        return {
            gotoIndex: 0,
            networkModal: false,
            needReload: false,
            initSwiper: false,
            swiperOption: {
                delay: 5000,
                effect: 'slide',
                pagination: false,
                initialSlide: 0,
                autoplay: true
            },
            consoleOption: {
                showConsole: true,
                albumTitle: '正在加载',
                albumName: '相册名称',
                fullScreen: false,
                unreadMessage: 0,
                isAudio: true,
                albumEmpty: false,
            },
            photoList: [],
            photoBackupList: [],
            cvs: {
                cvsid: '',
                cvsType: ''
            },
            chatletInfo: {
                createtime: '',
                music: '',
                play_type: '',
                speed: '',
                albuminfos: [], //{albumid,album_name,photos,total}
                duration: 0,
                audioUrl: '',
            },
            userInfo: {},
            slideStarted: false
        }
    },

    mounted() {
        // 音频状态变更事件
        JSB.Audio.on('state.change', (event) => {/*unused*/})

        JSB.nativeEvent.on('page.pause', () => {
            console.log('page.pause')
            JSB.Audio.pause('background')
        })

        JSB.nativeEvent.on('page.resume', (resp) => {
            console.log('page.resume: ', resp)
            if(this.consoleOption.isAudio){
                this.resumeAudio()
            }
        })

        JSB.nativeEvent.on('page.close', (resp) => {
            console.log('page.close: ', resp)
            JSB.Audio.stop('background')
        })

        JSB.Chatlet.on('view.state', event => {
            console.log('view.state: ', event)
            let isFullScreen = Boolean(event.fullscreen)
            this.consoleOption.fullScreen = isFullScreen
            if (!isFullScreen) {
                this.consoleOption.unreadMessage = 0
            }
        })

        JSB.Nimo.on('g.app', result => {
            console.log('@透传的消息 g.app: ', result)
            let app_event = result.msg_body.app_event
            let typeObj = app_event[ Object.keys(app_event)[0] ][0]
            console.log('typeObj: ', typeObj)
            if(typeObj && typeObj.event_type == 2){
                console.log('type == 2')
                JSB.Chatlet.hidePage()
                setTimeout(() => {
                    JSB.Audio.stop('background')
                    location.reload()
                }, 200)
                return
            }

            if(typeObj && typeObj.event_type == 1){
                this.updateAlbumName(result.msg_body)
                this.updatePhotoBackup()
            }
        })

        JSB.Nimo.on('g.msg', result => {
            console.log('IM普通消息 g.msg: ', result)
            if (this.consoleOption.fullScreen) {
                this.consoleOption.unreadMessage++
            }
        })

        JSB.App.on('network', resp => {
            console.log('network: ', resp)
            let state = resp.state
            if(state == 'cellular'){
                if(state == 'cellular') {
                    console.log('network: cellular')
                    this.showNetworkModal()
                }
            }
        })      

        this.initPageData()

    },

    destroyed(){
        JSB.Audio.stop('background')
    },
    
    methods: {

        // 初始化页面的数据(不是初始化幻灯片数据)
        async initPageData() {
            try {
                let cvsResp = await JSB.Page.getData('cvs')
                console.log('cvsResp: ', cvsResp)
                this.cvs = cvsResp.data
                this.cvs.cvsType = parseInt(cvsResp.data.cvsType)
                
                // settings
                let setResp = await JSB.Chatlet.getSettings({
                    cvsid: this.cvs.cvsid
                })
                console.log('getSettings: ', setResp)
                this.chatletInfo = setResp.data.raw_data
                let album = this.chatletInfo.albuminfos[0]

                this.consoleOption.albumName = album.album_name
                
                let userResp = await JSB.App.getUserInfo()
                this.userInfo = userResp.data
                console.log('userInfo: ', this.userInfo)

                setTimeout(() => {
                    this.checkNetwork()
                    JSB.Page.ready()
                }, 100)
                
                // 这里先把幻灯片用默认图盖住
            } catch (err) {
                JSB.Page.ready()
                JSB.UI.toast('数据请求失败')
                this.needReload = true
                console.error('initPageData error')
                console.error(err)
            }
        },

        beginPlaySlide(){
            // 开始播放幻灯片
            this.getAudioState(this.cvs.cvsid).then(resp => {
                let audioState = resp
                this.consoleOption.isAudio = audioState === 'open' ? true : false
                this.playMusic(this.chatletInfo.music)
            })
            this.initAlbumData()
        },

        gotoAlbumImage(imgInfo){
            console.log('will go to album image:', imgInfo)
            JSB.App.openScheme(`yuni://open/image?preview_url=${imgInfo.preview_url}&thumb_url=${imgInfo.thumb_url}&origin_url=${imgInfo.origin_url}`)
        },

        playVideo(item){
            console.log('PLAY VIDEO: ', item)
            JSB.Video.play({
                url: item.origin_url
            })
        },

        checkNetwork(){
            JSB.App.getNetwork().then(resp => {
                console.log('getNetwork: ', resp)
                let state = resp.data.state
                if(state == 'wifi') {
                    console.log('network: wifi')
                    this.beginPlaySlide()
                }

                if(state == 'cellular') {
                    console.log('network: cellular')
                    this.showNetworkModal()
                }
            })
        },

        async showNetworkModal(){
            let key = NET_KEY_PREFIX + this.cvs.cvsid
            let resp = await JSB.Memory.get(key)
            console.log('showNetwork: ', resp)
            if(resp.data == 'noticed'){
                console.log('已经看过提示了')
                // 已经看过了，而且是按了继续播放，这里直接开始播放幻灯片就好了
                this.beginPlaySlide()
            }else{
                if(this.slideStarted) {
                    this.$refs.slide.publicPauseSlide()
                }
                this.networkModal = true
            }
        },

        clickPlayCancel(){
            console.log('click playCancel ....')
            this.networkModal = false
        },

        clickPlaySlide(){
            console.log('click playSlide ....')
            this.networkModal = false
            if(this.slideStarted) {
                this.$refs.slide.publicPlaySlide()
            }else{
                this.beginPlaySlide()
            }
            this.setMemory()
        },

        setMemory(){
            let key = NET_KEY_PREFIX + this.cvs.cvsid
            console.log('存入Memory: ', key)
            JSB.Memory.set(key, 'noticed')
        },

        stopAudio() {
            JSB.Audio.stop('background')
            this.consoleOption.isAudio = !isAudio
        },

        resumeAudio() {
            let createtime = this.chatletInfo.createtime
            let duration = this.chatletInfo.duration
            let seek = (+Date.now() - parseInt(createtime) * 1000)%duration
            // 判断下是需要resume还是play
            console.log('Audio.play')
            JSB.Audio.play({
                url: this.chatletInfo.audioUrl,
                loop: true,
                seek: seek,
                channel: 'background'
            })
        },

        updateAlbumName(body) {
            // 如何快速判断深层对象内，某个属性是否存在
            let str = JSON.stringify(body)
            if (/album_name/g.test(str)) {
                let name = body.app_metas[0].raw_data.albuminfos[0].album_name
                this.consoleOption.albumName = name
            }
        },


        async initAlbumData(){
            this.initSwiper = true
            let album = this.chatletInfo.albuminfos[0]
            let photoList = []
            for(let i = 0; i < album.total; i++) {
                photoList.push({
                    content: logoGray
                })
            }
            this.photoList = photoList
            this.photoBackupList = Array(album.total)
            let totalImageIndex = this.currentPageIndex(this.chatletInfo.createtime, album.total, this.chatletInfo.speed)
            let currentPageIndex = Math.floor(totalImageIndex/PAGE_SIZE)
            let currentImageIndex = totalImageIndex%PAGE_SIZE
            console.log(`oneAlbumData 图片总数: ${album.total}, 总index: ${totalImageIndex}, 当前页码: ${currentPageIndex}, 当前index: ${currentImageIndex}`)
            let twos = await this.getTwoPage({
                uid: this.userInfo.uid,
                cvsType: this.cvs.cvsType,
                cvsid: this.cvs.cvsid,
                albumid: this.chatletInfo.albuminfos[0].albumid,
                pno: currentPageIndex,
                page_size: PAGE_SIZE,
                total: album.total,
            })
            console.log('Albumlist two: ', twos)
            if (twos.photos.length > 0) {
                // 拿到的数据放入photoList的指定位置
                let bareList = twos.photos.map(item => {
                    item['content'] = item.preview_url || item.thumb_url || ''
                    return item
                })
                this.photoList.splice(currentPageIndex*PAGE_SIZE, bareList.length, ...bareList)
                this.photoBackupList.splice(currentPageIndex*PAGE_SIZE, bareList.length, ...bareList)
                if(twos.firstPagePhotos.length > 0){
                    // 在数组前面添加
                    let preBareList = twos.firstPagePhotos.map(item => {
                        item['content'] = item.preview_url || item.thumb_url || ''
                        return item
                    })
                    this.photoList.splice(0, preBareList.length, ...preBareList)
                    this.photoBackupList.splice(0, preBareList.length, ...preBareList)
                }
                //设置swipe的配置
                
                setTimeout(() => {
                    // 这里是创建iSlider的操作，只有一次
                    Object.assign(this.swiperOption, {
                        initialSlide : totalImageIndex,
                        delay: parseInt(this.chatletInfo.speed),
                        effect: this.chatletInfo.play_type
                        // autoplay: this.photoList.length == 1 ? false : true
                    })
                    this.slideStarted = true
                }, 10)

                console.log('init photoList: ', this.photoList)
                console.log('init photoBackupList: ', this.photoBackupList)
                this.consoleOption.albumTitle = ''
            }else{
                console.log('相册数据为空')
                this.setAlbumEmptyModal(true)
                setTimeout(() => {
                    // 这里是创建iSlider的操作，只有一次
                    Object.assign(this.swiperOption, {
                        initialSlide : 0,
                        delay: parseInt(this.chatletInfo.speed),
                        effect: this.chatletInfo.play_type
                        // autoplay: this.photoList.length == 1 ? false : true
                    })
                    this.slideStarted = true
                }, 10)
            }
        },

        setAlbumEmptyModal(label){
            if(label){
                // 相册为空显示
                this.photoList.splice(0, this.photoList.length, ...DEFAULT_IMGS)
                Object.assign(this.consoleOption, {
                    albumEmpty: true,
                    albumTitle: '无可播放照片'
                })
            } else{
                // this.photoList.splice(0, this.photoList.length, ...DEFAULT_IMGS)
                if(this.consoleOption.albumEmpty){
                    Object.assign(this.consoleOption, {
                        albumTitle: '',
                        albumEmpty: false
                    })
                }
            }
        },

        playMusic(music) {
            console.log('开始加载音乐')
            JSB.Audio.download(music).then(result => {
                console.log('下载完成', result)
                let url = result.data.url
                let duration = result.data.duration
                let createtime = this.chatletInfo.createtime

                this.chatletInfo.duration = duration
                this.chatletInfo.audioUrl = url

                if(!this.consoleOption.isAudio){
                    return
                }

                let seek = (+Date.now() - parseInt(createtime) * 1000)%duration
                console.log('seek:', seek)
                JSB.Audio.play({
                    url: url,
                    loop: true,
                    seek: seek,
                    channel: 'background'
                })
            })
        },

        longPressImage(obj){
            console.log('longpress: ', obj)
            JSB.Chatlet.postEvent({
                event: "onImageSelect",
                data: obj
            })
        },

        reloadPage(){
            this.needReload = false
            this.initPageData()
        },

        clickUploadImg() {
            console.log('upload')
            JSB.App.openScheme(
                `yuni://open/album?path=add&destid=${this.chatletInfo.albuminfos[0].albumid}&gid=${this.cvs.cvsid}`
            )
        },

        clickChangeVoice(isAudio) {
            console.log('voice', isAudio)
            this.consoleOption.isAudio = !isAudio
            if (this.consoleOption.isAudio) {
                console.log('打开声音')
                this.resumeAudio()
                this.setAudioState(this.cvs.cvsid, 'open')
            } else {
                console.log('关掉声音')
                JSB.Audio.pause('background')
                this.setAudioState(this.cvs.cvsid, 'close')
            }
        },

        clickChangeScreen() {
            // console.log('click full screen: ', !this.consoleOption.fullScreen)
            JSB.Chatlet.setFullScreen(!this.consoleOption.fullScreen)
        },

        clickShowMsg() {
            console.log('msg')
            JSB.Chatlet.setFullScreen(false)
        },

        clickGoAlbum() {
            console.log('album')
            JSB.App.openScheme(
                `yuni://open/album?path=home&destid=${this.chatletInfo.albuminfos[0].albumid}&gid=${this.cvs.cvsid}`
            )
        },

        currentPageIndex(createtime, total, pertime) {
            createtime = parseInt(createtime)
            total = parseInt(total)
            pertime = parseInt(pertime)

            let remainder = parseInt(total) || 1
            let span = +Date.now() - createtime * 1000
            let totalPage = Math.ceil(span / pertime)
            let currentPageIndex = totalPage % remainder
            return currentPageIndex
        },

        async updatePhotoBackup() {
            let isOver = this.chatletHasOver()
            console.log('isOver', isOver)
            if(isOver.data == 'over')return

            // 更新一下total然后置空 photoBackupList
            JSB.API.request({
                url: `chatlet/slide/list/${this.userInfo.uid}`,
                data: {
                    appid: 'chatlet-slide',
                    type: this.cvs.cvsType,
                    remoteid: this.cvs.cvsid,
                    albumid: this.chatletInfo.albuminfos[0].albumid,
                    pno: 0,
                    page_size: 1
                }
            }).then(resp => {
                let total = resp.data.total || 0
                this.chatletInfo.albuminfos[0].total = total
                this.photoBackupList = Array(total)   
                if(total == 0){
                    this.setAlbumEmptyModal(true)
                }else{
                    if(!this.$refs.slide.slidePlayState()){
                        console.log('由g.app触发的checkUpdatePhotos')
                        this.checkUpdatePhotos(0)
                    }
                    this.setAlbumEmptyModal(false)
                }
                if(resp.data.chatlet_status && resp.data.chatlet_status == 2){
                    this.setChatletOver()
                }
            })
        },

        updateIndex(index){
            this.checkUpdatePhotos(index)
        },

        async checkUpdatePhotos(index) {
            console.log('checkUpdatePhotos updateIndex: ', index)
            if(this.consoleOption.albumEmpty)return

            let isOver = this.chatletHasOver()
            if(isOver.data == 'over') return

            // 每次都检查一下，下一页是否有数据，如果没有则获取，如果有则不操作
            let album = this.chatletInfo.albuminfos[0]
            let totalImageIndex = this.currentPageIndex(this.chatletInfo.createtime, album.total, this.chatletInfo.speed)
            let currentPageIndex = Math.floor(totalImageIndex/PAGE_SIZE)
            let currentImageIndex = totalImageIndex%PAGE_SIZE

            console.log(`总图数:${album.total} 当前总位置:${totalImageIndex} 当前页:${currentPageIndex} 当前位置:${currentImageIndex}`)

            // 检查当前页是否是尾页，如果是则检查第一页，如果不是则检查下一页
            // 检查下一页是否存在，如果存在检查下currentImageIndex是否为空，如果为空则请求下一页数据
            // 如果有则return

            let nextPageIndex = (totalImageIndex + PAGE_SIZE >= album.total) ? 0 : currentPageIndex + 1
            console.log(`即将判断的页码:${nextPageIndex}`)
            if(!this.photoBackupList[nextPageIndex * PAGE_SIZE + currentImageIndex]){
                // 请求，并赋值
                JSB.API.request({
                    url: `chatlet/slide/list/${this.userInfo.uid}`,
                    data: {
                        appid: 'chatlet-slide',
                        type: this.cvs.cvsType,
                        remoteid: this.cvs.cvsid,
                        albumid: this.chatletInfo.albuminfos[0].albumid,
                        pno: nextPageIndex,
                        page_size: PAGE_SIZE
                    }
                }).then(resp => {
                    console.log('checkUpdatePhotos get AlbumList')
                    let photos = resp.data.photo

                    if(resp.data.chatlet_status && resp.data.chatlet_status == 2) {
                        this.setChatletOver()
                    }

                    if (photos && photos.length > 0) {
                        let bareList = photos.map(item => {
                            item['content'] = item.preview_url || item.thumb_url
                            return item
                        })
                        // 得到的数据先放到photoBackupList
                        // 然后把photoBackupList match 到photoList
                        this.photoBackupList.splice(nextPageIndex * PAGE_SIZE, bareList.length, ...bareList)
                        console.log('新的backuplist: ', this.photoBackupList)
                        // 如果length不一样，则更正photoList.lenght
                        if(this.photoBackupList.length != this.photoList.length){
                            let photoList = [...this.photoList]
                            photoList.length = this.photoBackupList.length
                            photoList.splice(nextPageIndex * PAGE_SIZE, bareList.length, ...bareList)
                            // 检查下如果photoList中有空的，赋个默认值
                            photoList = photoList.map(item => {
                                if(typeof item === 'undefined'){
                                    return {
                                        content: logoGray
                                    }
                                }else{
                                    return item
                                }
                            })
                            // 全替换
                            this.photoList.splice(0, this.photoList.length, ...photoList)
                            
                            this.gotoIndex = totalImageIndex
                            console.log('更新photoList长度', this.photoList)
                        }else{
                            this.photoList.splice(nextPageIndex * PAGE_SIZE, bareList.length, ...bareList)
                            console.log('新photoList: ', this.photoList)
                        }
                    }
                })
            }else{
                console.log('不需要判断的了，直接继续播放吧')
            }  
        },

        async chatletHasOver(){
            console.log('current_chatlet_has_over: ', current_chatlet_has_over)
            let key = CHATLET_STATUS_PREFIX + this.cvs.cvsid + '_' + this.chatletInfo.createtime
            // 第一次调用走memory
            // 后面的都走current_chatlet_has_over
            if(!current_chatlet_has_over){
                var res = await JSB.Memory.get(key)
                current_chatlet_has_over = res
                return res
            }else{
                return current_chatlet_has_over
            }
        },

        setChatletOver(){
            let key = CHATLET_STATUS_PREFIX + this.cvs.cvsid + '_' + this.chatletInfo.createtime
            JSB.Memory.set(key, 'over')
            current_chatlet_has_over = {data: 'over'}
        },

        setAudioState(cvsid, type){
            //type: 'open'|'close'
            let key = KEY_PREFIX + cvsid + '_' + this.chatletInfo.createtime
            JSB.KVDB.set(key, type)
        },

        async getAudioState(cvsid){
            let key = KEY_PREFIX + cvsid + '_' + this.chatletInfo.createtime
            let resp = await JSB.KVDB.get(key)
            return resp.data || 'close'
        },

        /**
        * 
        */
        async getTwoPage(params){
            let isOver = this.chatletHasOver()
            if(isOver.data == 'over') return

            // 如果两页数据是连续的则放在photos中。
            // 如果当前页是尾页，第二页则取首页，尾页放于photos，首页放于firstPagePhotos
            let twoPages = {
                photos: [],
                firstPagePhotos: []
            }

            let one = await this.clientRequest({
                url: `chatlet/slide/list/${params.uid}`,
                data: {
                    appid: 'chatlet-slide',
                    type: params.cvsType,
                    remoteid: params.cvsid,
                    albumid: params.albumid,
                    pno: params.pno,
                    page_size: params.page_size
                }
            })
            let onePhotos = one.data.photo || []
            twoPages.photos = onePhotos
            console.log('getTwoPage:one: ', JSON.parse(JSON.stringify(one)))
            // 好接下来判断是否要请求第二页？第二页是哪一页
            // 如果总页数只有一页，则返回
            // 如果总页数>=2页，has_more == true，第二页是下一页
            // 如果总页数>=2页，has_more == false，第二页是首页
            if(one.data.total <= params.page_size){
                console.log('getTwoPage 没有第二页了，直接返回')
                return twoPages
            }

            let nextPno, nextIsFirst;
            if(one.data.has_more){
                nextPno = params.pno + 1
                nextIsFirst = false
            }else{
                nextPno = 0
                nextIsFirst = true
            }

            if(one.data.chatlet_status && one.data.chatlet_status == 2){
                this.setChatletOver()
                return
            }

            let two = await this.clientRequest({
                url: `chatlet/slide/list/${params.uid}`,
                data: {
                    appid: 'chatlet-slide',
                    type: params.cvsType,
                    remoteid: params.cvsid,
                    albumid: params.albumid,
                    pno: nextPno,
                    page_size: params.page_size
                }
            })
            console.log('getTwoPage: two: ', two)
            if(two.data.chatlet_status && one.data.chatlet_status == 2){
                this.setChatletOver()
                return
            }

            let twoPhotos = two.data.photo
            if(twoPhotos && twoPhotos.length > 0 && !nextIsFirst){
                twoPages.photos =  onePhotos.concat(twoPhotos)
                return twoPages
            }else if(twoPhotos && twoPhotos.length > 0 && nextIsFirst){
                twoPages.firstPagePhotos = twoPhotos
                return twoPages
            }else{
                twoPages.photos = onePhotos
                return twoPages
            }
        },

        clientRequest(params){
            return JSB.API.request({
                url: params.url,
                data: params.data
            })
        }
    }
}

</script>
