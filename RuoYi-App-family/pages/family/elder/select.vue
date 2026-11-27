<template>
  <view class="fam-page">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>

    <view class="fam-header">
      <view class="brand-row">
        <text class="brand-name">我的老人</text>
        <text class="brand-sub">SELECT ELDER</text>
      </view>
      <view class="hello-row">
        <text class="hello-text">切换后各模块数据将同步更新</text>
      </view>
      <view class="header-line"></view>
    </view>

    <view v-if="loading" class="empty">加载中…</view>
    <view v-else-if="!elders.length" class="empty">当前账号未绑定在院老人</view>

    <view v-else class="list">
      <view class="tech-card elder-item" :class="{ active: String(item.elderId) === String(currentId) }"
        v-for="(item, index) in elders" :key="index" @click="choose(item)">
        <view class="tech-corner tl"></view>
        <view class="tech-corner br"></view>
        <view class="item-head">
          <view class="name-row">
            <text class="elder-name">{{ item.name }}</text>
            <text class="tag tag-cyan">{{ item.relation }}</text>
            <text class="tag" :class="liveTag(item.status)">{{ liveText(item.status) }}</text>
          </view>
          <view class="check" :class="{ on: String(item.elderId) === String(currentId) }">
            <uni-icons v-if="String(item.elderId) === String(currentId)" type="checkmarkempty" size="18" color="#00e5ff"></uni-icons>
          </view>
        </view>
        <view class="item-body">
          <view class="sub-line">{{ item.campusName || '--' }} · {{ item.bedLabel || '暂未分配床位' }}</view>
          <view class="sub-line">{{ item.careLevelName || '未评定护理等级' }} · 入住 {{ fmtDate(item.checkInDate) }}</view>
          <view class="scope-line">
            <text class="scope" :class="{ dim: item.viewHealth !== '1' }">健康</text>
            <text class="scope" :class="{ dim: item.viewNursing !== '1' }">护理</text>
            <text class="scope" :class="{ dim: item.viewBill !== '1' }">费用</text>
            <text class="scope" :class="{ dim: item.viewVisit !== '1' }">探视</text>
          </view>
        </view>
      </view>

      <view class="tip-card">
        <view class="tip-content">可见范围由院区管理员在「家属授权」中设置，如某项显示为不可见，请联系院区调整。</view>
      </view>
    </view>
  </view>
</template>

<script>
  import { listMyElders } from '@/api/family/portal'
  import { getCurrentElder, setCurrentElder, fmtDate, LIVE_STATUS, LIVE_STATUS_TAG } from '@/utils/family'

  export default {
    data() {
      return {
        loading: true,
        elders: [],
        currentId: getCurrentElder()
      }
    },
    onLoad() {
      this.load()
    },
    methods: {
      fmtDate,
      load() {
        this.loading = true
        listMyElders().then(res => {
          this.elders = res.data || []
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      liveText(status) {
        return LIVE_STATUS[status] || '--'
      },
      liveTag(status) {
        return LIVE_STATUS_TAG[status] || 'tag-gray'
      },
      choose(item) {
        setCurrentElder(item.elderId)
        this.currentId = String(item.elderId)
        this.$modal.msgSuccess('已切换为 ' + item.name)
        setTimeout(() => {
          const pages = getCurrentPages()
          if (pages.length > 1) {
            this.$tab.navigateBack()
          } else {
            this.$tab.switchTab('/pages/index')
          }
        }, 600)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/static/scss/family.scss';

  page {
    background-color: #050d1f;
  }

  .list {
    position: relative;
  }

  .elder-item {
    margin: 20rpx 24rpx;
    padding: 26rpx;
  }

  .elder-item.active {
    border-color: rgba(0, 229, 255, 0.6);
    box-shadow: 0 0 26rpx rgba(0, 229, 255, 0.25), inset 0 0 30rpx rgba(0, 229, 255, 0.06);
  }

  .item-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .name-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .elder-name {
    font-size: 34rpx;
    font-weight: 700;
    color: $text;
    margin-right: 16rpx;
    letter-spacing: 2rpx;
  }

  .name-row .tag {
    margin-right: 12rpx;
  }

  .check {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1rpx solid rgba(0, 229, 255, 0.35);
  }

  .check.on {
    background: rgba(0, 229, 255, 0.12);
    box-shadow: 0 0 16rpx rgba(0, 229, 255, 0.35);
  }

  .sub-line {
    margin-top: 12rpx;
    font-size: 25rpx;
    color: rgba(230, 244, 255, 0.62);
  }

  .scope-line {
    display: flex;
    flex-direction: row;
    margin-top: 18rpx;
  }

  .scope {
    margin-right: 14rpx;
    padding: 4rpx 16rpx;
    font-size: 21rpx;
    color: #7df3ff;
    border: 1rpx solid rgba(0, 229, 255, 0.4);
    border-radius: 6rpx;
    background: rgba(0, 229, 255, 0.08);
  }

  .scope.dim {
    color: rgba(230, 244, 255, 0.3);
    border-color: rgba(230, 244, 255, 0.16);
    background: rgba(230, 244, 255, 0.04);
  }
</style>
