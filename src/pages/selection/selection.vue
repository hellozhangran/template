
<template>
    <div class="selection">
        <Group :list='groupList' :select='groupSelect' @changeSelect='changeSelect'></Group>
    </div>
</template>

<script>
import Group from '../../components/Grouper'
import * as JSB from '@uneed/jsbridge-webview'
import { SELECTION_LIST } from './const'

const date = {
    swipe: [{}]
}

export default {
    name: 'selection',
    components: {
        Group
    },
    data() {
        return {
            groupList: [{ text: '', value: '' }],
            groupSelect: '',
            selectedInfo: {
                select_type: '',
                select_value: ''
            }
        }
    },
    mounted() {
        JSB.Page.getData('selection').then(resp => {
            console.log('resp: ', resp.data)
            this.selectedInfo = resp.data
            this.groupList = SELECTION_LIST[this.selectedInfo.select_type].map(item => {
                if(item.value.split(',').length === 2){
                    return {
                        text: item.text,
                        value: item.value.split(',')[0]
                    }
                }else{
                    return item
                }
            })
            console.log('---------： ', this.groupList)
            this.groupSelect = this.selectedInfo.select_value
        })

        JSB.nativeEvent.on('page.pause', () => {
            JSB.Audio.pause('effect')
        })

        JSB.nativeEvent.on('page.close', (resp) => {
            JSB.Audio.stop('effect')
        })
    },
    methods: {
        changeSelect(result) {
            console.log('select: ', result)
            this.groupSelect = result.value
            JSB.Page.setResult({
                select_type: this.selectedInfo.select_type,
                select_text: result.text,
                select_value: result.value
            })
            //如果是音乐选择，则会开启试听
            if(this.selectedInfo.select_type == 'music'){
                let url = result.value
                if(!url)return
                if(url === 'quiet'){
                    JSB.Audio.pause('effect')
                }else{
                    let demoUrl = url.substr(0, url.length - 4) + '_demo.mp3'
                    JSB.Audio.play({
                        url: demoUrl,
                        loop: false,
                        seek: 0,
                        channel: 'effect'
                    })

                }
            }
        }
    }
}
</script>
