<style lang="less" scoped>
.group {
    height: 100%;
    display: flex;
    flex-direction: column;
    .last {
        flex: 1 1 auto;
    }
    .interval {
        height: 5px;
        background: #fafafa;
    }
}
</style>

<template>
    <div class="group">
        <div class="line-1px-all">
            <cell :value='list[0].text' :title='list[0].title' isLast :isSelect='list[0].value == select' @onClick="changeSelect(list[0])"></cell>
        </div>
        <div class="interval"></div>
        <div class="last line-1px-top">
            <cell v-for="(item,index) in list" v-if='item.value != list[0].value' :title='item.title' :key='index' :value='item.text'
                :isSelect='item.value == select' @onClick="changeSelect(item)"></cell>
        </div>
    </div>
</template>

<script>
import Cell from './Cell'

export default {
    name: 'group',
    components: {
        Cell
    },
    props: {
        list: Array,
        select: String
    },
    data() {
        return {}
    },
    methods: {
        changeSelect(value) {
            this.$emit('changeSelect', value)
        }
    }
}
</script>
