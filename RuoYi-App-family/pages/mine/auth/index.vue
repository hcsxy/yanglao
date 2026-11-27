<template>
  <view class="fam-page">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>

    <view class="fam-header small">
      <view class="brand-row">
        <text class="brand-name">查看授权范围</text>
        <text class="brand-sub">PRIVACY SCOPE</text>
      </view>
      <view class="hello-row">
        <text class="hello-text">院方按老人分别设置家属可见范围</text>
      </view>
      <view class="header-line"></view>
    </view>

    <view class="chip-row" v-if="elders.length > 1">
      <view class="chip" :class="{ active: String(item.elderId) === String(elderId) }" v-for="(item, index) in elders" :key="index"
        @click="changeElder(item.elderId)">{{ item.name }}</view>
    </view>

    <view v-if="loading" class="empty">加载中…</view>

    <block v-else>
      <view class="tech-card panel">
        <view class="tech-corner tl"></view>
        <view class="tech-corner br"></view>
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">授权信息</text>
          <text class="title-en">GRANT</text>
        </view>
        <view class="info-row">
          <text class="info-label">老人</text>
          <text class="info-value strong">{{ auth.elderName || '--' }}（{{ auth.relation || '--' }}）</text>
        </view>
        <view class="info-row">
          <text class="info-label">家属</text>
          <text class="info-value">{{ auth.familyName || '--' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">所属院区</text>
          <text class="info-value">{{ auth.campusName || '--' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">授权有效期</text>
          <text class="info-value">{{ auth.expireDate ? fmtDate(auth.expireDate) : '长期有效' }}</text>
        </view>
      </view>

      <view class="tech-card panel">
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">可查看内容</text>
          <text class="title-en">VISIBLE</text>
        </view>
        <view class="scope-item" v-for="(item, index) in scopeList" :key="index">
          <view class="scope-left">
            <view class="scope-icon">
              <uni-icons :type="item.icon" size="24" :color="item.open ? '#00e5ff' : 'rgba(230,244,255,0.35)'"></uni-icons>
            </view>
            <view class="scope-meta">
              <text class="scope-name">{{ item.name }}</text>
              <text class="scope-desc">{{ item.desc }}</text>
            </view>
          </view>
          <text class="tag" :class="item.open ? 'tag-green' : 'tag-gray'">{{ item.open ? '已开放' : '未开放' }}</text>
        </view>
      </view>

      <view class="tip-card">
        <view class="tip-content">
          授权范围由院区管理员在后台「家属授权」中维护；如某项未开放，或有效期已过期，请联系院区办理。
          老人身份证号等敏感信息在家属端一律脱敏展示。
        </view>
      </view>

      <view class="footer-note">隐私保护 · 服务端逐次校验，前端隐藏不作为安全边界</view>
    </block>
  </view>
</template>

<script>
  import { getAuthScope } from '@/api/family/portal'
  import { loadElderList, getCurrentElder, fmtDate } from '@/utils/family'

  export default {
    data() {
      return {
        loading: true,
        elderId: '',
        elders: [],
        auth: {}
      }
    },
    computed: {
      scopeList() {
        return [
          { name: '健康信息', desc: '体征趋势、健康记录、能力评估、医生巡诊、风险与不良事件', icon: 'heart-filled', open: !!this.auth.viewHealth },
          { name: '护理动态', desc: '每日护理任务执行情况、班组交接班摘要、医嘱用药', icon: 'checkbox', open: !!this.auth.viewNursing },
          { name: '费用账单', desc: '月度账单、费用明细、账户余额与资金流水、在线缴费', icon: 'wallet-filled', open: !!this.auth.viewBill },
          { name: '探视信息', desc: '探视预约与到访记录（如院区已开通探视管理）', icon: 'staff', open: !!this.auth.viewVisit }
        ]
      }
    },
    onLoad(options) {
      this.elderId = options.elderId || getCurrentElder()
      this.load()
    },
    methods: {
      fmtDate,
      load() {
        this.loading = true
        return Promise.all([
          loadElderList().then(list => { this.elders = list || [] }),
          this.elderId ? getAuthScope(this.elderId).then(res => { this.auth = res.data || {} }) : Promise.resolve()
        ]).then(() => { this.loading = false }, () => { this.loading = false })
      },
      changeElder(elderId) {
        this.elderId = elderId
        uni.showLoading({ title: '加载中', icon: 'none' })
        getAuthScope(elderId).then(res => {
          this.auth = res.data || {}
          uni.hideLoading()
        }, () => { uni.hideLoading() })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/static/scss/family.scss';

  page {
    background-color: #050d1f;
  }

  .fam-header.small {
    padding: 90rpx 40rpx 30rpx 40rpx;
  }

  .scope-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 22rpx 0;
    border-bottom: 1rpx dashed rgba(0, 229, 255, 0.14);

    &:last-child {
      border-bottom: none;
    }
  }

  .scope-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }

  .scope-icon {
    width: 76rpx;
    height: 76rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 229, 255, 0.06);
    border: 1rpx solid rgba(0, 229, 255, 0.25);
  }

  .scope-meta {
    margin-left: 20rpx;
    flex: 1;
  }

  .scope-name {
    display: block;
    font-size: 29rpx;
    color: $text;
    font-weight: 600;
  }

  .scope-desc {
    display: block;
    margin-top: 8rpx;
    font-size: 23rpx;
    color: rgba(230, 244, 255, 0.55);
    line-height: 1.6;
  }
</style>
