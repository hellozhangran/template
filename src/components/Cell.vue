<style lang="less" scoped>
.cell {
    width: 100%;
    height: 43px;
    display: flex;
    align-items: center;
    user-select: none;
    &:active{
        background: #eee;
    }
    .left {
        display: flex;
        align-items: center;
        img {
            width: 15px;
            height: 12px;
            margin-left: 0.15rem;
        }
    }
    .right {
        flex: 1 1 auto;
        padding-right: 0.165rem;
        height: 100%;
        display: flex;
        align-items: center;
        line-height: 20px;
        span:nth-child(1) {
            flex: 0 1 auto;
            font-size: 17px;
        }
        span:nth-child(2) {
            flex: 1 1 auto;
            display: flex;
            justify-content: flex-end;
            font-size: 14px;
            color: #ababab;
        }
        span:nth-child(3) {
            flex: 0 1 21.5px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            img {
                height: 11.5px;
            }
        }
    }
}
</style>

<template>
    <div class="cell" @click="onClick">
        <div class="left" :style="{'flexBasis': styleData.leftWidth + 'rem'}">
            <img v-if="isSelect" src="./assets/images/fit.png">
        </div>
        <div class="right line-1px-bottom" :style="{'borderImageSlice': isLast ? '0' :''}">
            <span>{{value}}</span>
            <span :style="{'color': styleData.fontColor}">{{title}}</span>
            <span v-if='styleData.rightIcon'><img src="./assets/images/right.png"></span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'cell',
    props: {
        value: String,
        title: String,
        isLast: Boolean,
        isSelect: Boolean,
        styleData: {
            type: Object,
            default: () => ({
                leftWidth: 0.45,
                fontColor: '',
                rightIcon: false
            })
        }
    },
    data() {
        return {
            locking: false,
            timeOut: null
        }
    },
    methods:{
        onClick() {
            if (!this.locking) {
                this.locking = true
                this.$emit('onClick')
                setTimeout(() => {
                    this.locking = false
                }, 500);
            }
        }
    }
}
</script>