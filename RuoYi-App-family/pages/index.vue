<template>
  <view class="fam-page">
    <!-- 背景装饰 -->
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>
    <view class="bg-orb orb-2"></view>

    <!-- 顶部 -->
    <view class="fam-header">
      <view class="brand-row">
        <text class="brand-name">智慧养老 · 家属端</text>
        <text class="brand-sub">FAMILY PORTAL</text>
      </view>
      <view class="hello-row">
        <text class="hello-text">{{ helloText }}，{{ familyName }}</text>
        <view class="switch-btn" v-if="elders.length > 1" @click="goSelect">
          <uni-icons type="loop" size="16" color="#00e5ff"></uni-icons>
          <text class="switch-text">切换老人</text>
        </view>
      </view>
      <view class="header-line"></view>
    </view>

    <view v-if="loading" class="empty">数据加载中…</view>

    <!-- 未绑定任何老人 -->
    <view v-else-if="!elder" class="empty">
      <view>当前账号未绑定在院老人</view>
      <view class="empty-sub">请联系院区管理员在「家属授权」中开通并绑定</view>
    </view>

    <block v-else>
      <!-- 老人信息卡 -->
      <view class="tech-card panel elder-card">
        <view class="tech-corner tl"></view>
        <view class="tech-corner br"></view>
        <view class="elder-row">
          <view class="elder-avatar">
            <image v-if="elder.photo" class="avatar-img" :src="elder.photo" mode="aspectFill"></image>
            <view v-else class="avatar-txt">{{ elder.name ? elder.name.substring(0, 1) : '—' }}</view>
          </view>
          <view class="elder-main">
            <view class="name-row">
              <text class="elder-name">{{ elder.name }}</text>
              <text class="tag tag-cyan">{{ elder.relation }}</text>
              <text class="tag" :class="liveTag">{{ liveText }}</text>
            </view>
            <view class="elder-sub">{{ genderText }} · {{ elder.age }}岁 · {{ elder.careLevelName || '未评定护理等级' }}</view>
            <view class="elder-sub">{{ elder.bedLabel || '暂未分配床位' }}</view>
          </view>
        </view>
        <view class="info-row">
          <text class="info-label">所在院区</text>
          <text class="info-value">{{ elder.campusName || '--' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">入住日期</text>
          <text class="info-value">{{ fmtDate(elder.checkInDate) }}（在院 {{ liveDays }} 天）</text>
        </view>
        <view class="info-row" v-if="elder.expireDate">
          <text class="info-label">授权有效期</text>
          <text class="info-value">{{ fmtDate(elder.expireDate) }}</text>
        </view>
      </view>

      <!-- 关键指标 -->
      <view class="tech-card panel">
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">今日概览</text>
          <text class="title-en">OVERVIEW</text>
        </view>
        <view class="kpi-grid">
          <view class="kpi-item" v-if="elder.viewNursing === '1'">
            <view class="kpi-line">
              <text class="kpi-value" :class="rateClass">{{ todayRateText }}</text>
              <text class="kpi-unit">%</text>
            </view>
            <text class="kpi-label">今日护理完成</text>
          </view>
          <view class="kpi-item" v-if="elder.viewNursing === '1'">
            <view class="kpi-line">
              <text class="kpi-value">{{ weekDone }}</text>
              <text class="kpi-unit">/ {{ weekTotal }} 项</text>
            </view>
            <text class="kpi-label">近7日已完成</text>
          </view>
          <view class="kpi-item" v-if="elder.viewBill === '1'">
            <view class="kpi-line">
              <text class="kpi-value" :class="owedClass">{{ money(elder.balance) }}</text>
              <text class="kpi-unit">元</text>
            </view>
            <text class="kpi-label">账户余额</text>
          </view>
          <view class="kpi-item" v-if="elder.viewBill === '1'">
            <view class="kpi-line">
              <text class="kpi-value" :class="owedClass">{{ money(elder.owedAmount) }}</text>
              <text class="kpi-unit">元</text>
            </view>
            <text class="kpi-label">待缴费用{{ owedCount > 0 ? '（' + owedCount + ' 期）' : '' }}</text>
          </view>
          <view class="kpi-item" v-if="elder.viewHealth === '1'">
            <view class="kpi-line">
              <text class="kpi-value" :class="riskCount > 0 ? 'danger' : ''">{{ riskCount }}</text>
              <text class="kpi-unit">项</text>
            </view>
            <text class="kpi-label">生效中的风险标记</text>
          </view>
          <view class="kpi-item" v-if="elder.viewHealth === '1'">
            <view class="kpi-line">
              <text class="kpi-value">{{ vitalText }}</text>
            </view>
            <text class="kpi-label">最近体征 {{ vitalDate }}</text>
          </view>
        </view>
      </view>

      <!-- 欠费提醒 -->
      <view class="tip-card warn" v-if="elder.viewBill === '1' && owedCount > 0">
        <view class="tip-title-row">
          <uni-icons type="info-filled" size="18" color="#ffb84d"></uni-icons>
          <text class="tip-title">缴费提醒</text>
        </view>
        <view class="tip-content">
          当前有 {{ owedCount }} 期账单未结清，合计 {{ money(elder.owedAmount) }} 元{{ oldestMonth ? '，最早为 ' + oldestMonth + ' 月' : '' }}。
          可前往「费用」查看明细并缴费。
        </view>
      </view>

      <!-- 健康摘要 -->
      <view class="tech-card panel" v-if="elder.viewHealth === '1'">
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">健康摘要</text>
          <text class="title-en">HEALTH</text>
          <text class="title-extra" @click="go('/pages/family/health/index')">更多 ></text>
        </view>
        <view class="info-row" v-if="summary.latestAssess">
          <text class="info-label">最新能力评估</text>
          <text class="info-value">
            {{ summary.latestAssess.levelResult || '--' }}
            <text v-if="summary.latestAssess.totalScore !== null">（{{ summary.latestAssess.totalScore }} 分）</text>
          </text>
        </view>
        <view class="info-row" v-if="summary.latestAssess">
          <text class="info-label">下次复评</text>
          <text class="info-value">{{ fmtDate(summary.latestAssess.nextReviewDate) }}</text>
        </view>
        <view class="info-row" v-if="summary.lastVisit">
          <text class="info-label">最近巡诊</text>
          <text class="info-value">{{ fmtDate(summary.lastVisit.visitDate) }} · {{ summary.lastVisit.doctorName }}</text>
        </view>
        <view class="info-row" v-if="summary.lastVisit">
          <text class="info-label">诊断意见</text>
          <text class="info-value">{{ summary.lastVisit.diagnosis || '--' }}</text>
        </view>
        <view class="risk-tags" v-if="risks.length">
          <text class="tag" :class="riskTag(item)" v-for="(item, index) in risks" :key="index">
            {{ riskText(item) }}
          </text>
        </view>
        <view class="no-data" v-if="!summary.latestAssess && !summary.lastVisit && !risks.length">暂无健康记录</view>
      </view>

      <!-- 护理摘要 -->
      <view class="tech-card panel" v-if="elder.viewNursing === '1'">
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">护理动态</text>
          <text class="title-en">NURSING</text>
          <text class="title-extra" @click="go('/pages/family/nursing/index')">更多 ></text>
        </view>
        <view class="stat-row">
          <view class="stat-cell">
            <text class="stat-num">{{ today.total || 0 }}</text>
            <text class="stat-label">当日任务</text>
          </view>
          <view class="stat-cell">
            <text class="stat-num green">{{ today.done || 0 }}</text>
            <text class="stat-label">已完成</text>
          </view>
          <view class="stat-cell">
            <text class="stat-num orange">{{ today.pending || 0 }}</text>
            <text class="stat-label">待执行</text>
          </view>
          <view class="stat-cell">
            <text class="stat-num gray">{{ today.cancel || 0 }}</text>
            <text class="stat-label">已取消</text>
          </view>
        </view>
        <view class="progress">
          <view class="progress-inner" :style="{ width: rateWidth }"></view>
        </view>
        <view class="focus-tip" v-if="summary.focusInHandover">
          <uni-icons type="star-filled" size="16" color="#ffb84d"></uni-icons>
          <text class="focus-text">本班交接班记录中把老人列为重点关注对象</text>
        </view>
      </view>

      <!-- 快捷入口 -->
      <view class="tech-card panel">
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">快捷入口</text>
          <text class="title-en">QUICK ACCESS</text>
        </view>
        <view class="quick-grid">
          <view class="quick-item" v-if="elder.viewHealth === '1'" @click="go('/pages/family/health/index')">
            <view class="quick-icon">
              <uni-icons type="heart-filled" size="30" color="#00e5ff"></uni-icons>
            </view>
            <text class="quick-text">健康动态</text>
          </view>
          <view class="quick-item" v-if="elder.viewNursing === '1'" @click="go('/pages/family/nursing/index')">
            <view class="quick-icon">
              <uni-icons type="checkbox" size="30" color="#00ffb3"></uni-icons>
            </view>
            <text class="quick-text">护理执行</text>
          </view>
          <view class="quick-item" v-if="elder.viewBill === '1'" @click="go('/pages/family/bill/index')">
            <view class="quick-icon">
              <uni-icons type="wallet-filled" size="30" color="#4dabff"></uni-icons>
            </view>
            <text class="quick-text">费用账单</text>
          </view>
          <view class="quick-item" @click="goAuth">
            <view class="quick-icon">
              <uni-icons type="auth-filled" size="30" color="#b48cff"></uni-icons>
            </view>
            <text class="quick-text">授权范围</text>
          </view>
        </view>
      </view>

      <view class="footer-note">数据由院区实时同步 · 隐私范围由院方授权控制</view>
    </block>
  </view>
</template>

<script>
  import { getSummary } from '@/api/family/portal'
  import { loadElderList, loadCurrentElder, setCurrentElder, fmtDate, money, GENDER, LIVE_STATUS, LIVE_STATUS_TAG, RISK_TYPE, RISK_LEVEL, RISK_LEVEL_TAG } from '@/utils/family'

  export default {
    data() {
      return {
        loading: true,
        elders: [],
        elder: null,
        summary: {}
      }
    },
    computed: {
      familyName() {
        return this.$store.getters.nickName || this.$store.getters.name || '家属'
      },
      helloText() {
        const h = new Date().getHours()
        if (h < 6) return '夜深了'
        if (h < 12) return '早上好'
        if (h < 14) return '中午好'
        if (h < 18) return '下午好'
        return '晚上好'
      },
      genderText() {
        return GENDER[this.elder && this.elder.gender] || '未知'
      },
      liveText() {
        return LIVE_STATUS[this.summary.liveStatus] || '--'
      },
      liveTag() {
        return LIVE_STATUS_TAG[this.summary.liveStatus] || 'tag-gray'
      },
      liveDays() {
        const start = this.elder && this.elder.checkInDate
        if (!start) return 0
        const t = new Date(String(start).slice(0, 10).replace(/-/g, '/')).getTime()
        if (isNaN(t)) return 0
        return Math.max(0, Math.floor((Date.now() - t) / 86400000))
      },
      today() {
        return this.summary.todayNursing || {}
      },
      week() {
        return this.summary.weekNursing || {}
      },
      weekTotal() {
        return this.week.total || 0
      },
      weekDone() {
        return this.week.done || 0
      },
      todayRateText() {
        const rate = this.today.rate
        return (rate === null || rate === undefined) ? '--' : rate
      },
      rateWidth() {
        const rate = Number(this.today.rate)
        if (isNaN(rate)) return '0%'
        return Math.min(100, Math.max(0, rate)) + '%'
      },
      rateClass() {
        const rate = Number(this.today.rate)
        if (isNaN(rate)) return ''
        return rate >= 80 ? '' : (rate >= 50 ? 'warn' : 'danger')
      },
      risks() {
        return this.summary.risks || []
      },
      riskCount() {
        return this.summary.riskCount || 0
      },
      vitalText() {
        const v = this.summary.lastVital
        if (!v) return '暂无'
        return (v.temperature || '--') + '℃'
      },
      vitalDate() {
        return this.summary.lastVital ? fmtDate(this.summary.lastVital.date) : ''
      },
      owedCount() {
        return this.summary.owedCount || 0
      },
      oldestMonth() {
        return this.summary.oldestOwedMonth || ''
      },
      owedClass() {
        return this.owedCount > 0 ? 'danger' : ''
      }
    },
    onShow() {
      this.load()
    },
    onPullDownRefresh() {
      this.load(true).then(() => uni.stopPullDownRefresh())
    },
    methods: {
      fmtDate,
      money,
      load(force) {
        this.loading = true
        return Promise.all([loadElderList(force), loadCurrentElder(force)]).then(res => {
          this.elders = res[0] || []
          const cur = res[1]
          if (!cur) {
            this.elder = null
            this.summary = {}
            setCurrentElder('')
            this.loading = false
            return
          }
          this.elder = cur
          return getSummary(cur.elderId).then(sum => {
            this.summary = sum.data || {}
            this.loading = false
          })
        }).catch(() => {
          // 接口异常已由 request 统一提示，此处保留已有数据
          this.loading = false
        })
      },
      riskText(item) {
        return (RISK_TYPE[item.riskType] || '风险') + '·' + (RISK_LEVEL[item.riskLevel] || '')
      },
      riskTag(item) {
        return RISK_LEVEL_TAG[item.riskLevel] || 'tag-gray'
      },
      go(url) {
        this.$tab.navigateTo(url)
      },
      goSelect() {
        this.$tab.navigateTo('/pages/family/elder/select')
      },
      goAuth() {
        if (!this.elder) return
        this.$tab.navigateTo('/pages/mine/auth/index?elderId=' + this.elder.elderId)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/static/scss/family.scss';

  page {
    background-color: #050d1f;
  }

  .switch-text {
    margin-left: 8rpx;
    font-size: 24rpx;
  }

  .empty-sub {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: rgba(230, 244, 255, 0.3);
  }

  /* 老人卡 */
  .elder-card {
    padding-bottom: 10rpx;
  }

  .elder-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 20rpx;
    border-bottom: 1rpx dashed rgba(0, 229, 255, 0.16);
  }

  .elder-avatar {
    width: 110rpx;
    height: 110rpx;
    border-radius: 50%;
    padding: 4rpx;
    background: conic-gradient(from 0deg, rgba(0, 229, 255, 0.9), rgba(43, 127, 255, 0.2), rgba(0, 229, 255, 0.9));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-img,
  .avatar-txt {
    width: 102rpx;
    height: 102rpx;
    border-radius: 50%;
    background: rgba(10, 26, 53, 0.95);
  }

  .avatar-txt {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44rpx;
    color: $cyan;
    text-shadow: 0 0 16rpx rgba(0, 229, 255, 0.6);
  }

  .elder-main {
    flex: 1;
    margin-left: 24rpx;
  }

  .name-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .elder-name {
    font-size: 38rpx;
    font-weight: 700;
    color: $text;
    letter-spacing: 2rpx;
    margin-right: 16rpx;
    text-shadow: 0 0 18rpx rgba(0, 229, 255, 0.4);
  }

  .name-row .tag {
    margin-right: 12rpx;
  }

  .elder-sub {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: rgba(230, 244, 255, 0.55);
  }

  .kpi-line {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }

  /* 健康风险标签 */
  .risk-tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 16rpx;
  }

  .risk-tags .tag {
    margin: 0 14rpx 10rpx 0;
  }

  .no-data {
    font-size: 25rpx;
    color: rgba(230, 244, 255, 0.4);
    padding: 10rpx 0;
  }

  /* 护理统计 */
  .stat-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 20rpx;
  }

  .stat-cell {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .stat-num {
      font-size: 36rpx;
      font-weight: 700;
      color: $cyan;
    }

    .stat-num.green {
      color: #00ffb3;
    }

    .stat-num.orange {
      color: #ffb84d;
    }

    .stat-num.gray {
      color: rgba(230, 244, 255, 0.5);
    }

    .stat-label {
      margin-top: 8rpx;
      font-size: 22rpx;
      color: rgba(230, 244, 255, 0.5);
    }
  }

  .focus-tip {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 20rpx;
    padding: 14rpx 18rpx;
    border-radius: 12rpx;
    background: rgba(255, 184, 77, 0.08);
    border: 1rpx solid rgba(255, 184, 77, 0.3);
  }

  .focus-text {
    margin-left: 10rpx;
    font-size: 24rpx;
    color: #ffd28a;
  }

  /* 快捷入口 */
  .quick-grid {
    display: flex;
    flex-direction: row;
  }

  .quick-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10rpx 0 16rpx 0;
  }

  .quick-icon {
    width: 92rpx;
    height: 92rpx;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 229, 255, 0.06);
    border: 1rpx solid rgba(0, 229, 255, 0.25);
    box-shadow: inset 0 0 20rpx rgba(0, 229, 255, 0.1), 0 0 16rpx rgba(0, 229, 255, 0.12);
  }

  .quick-text {
    margin-top: 14rpx;
    font-size: 25rpx;
    color: rgba(230, 244, 255, 0.8);
  }

  .tip-title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 12rpx;
  }

  .tip-title {
    margin-left: 10rpx;
    font-size: 27rpx;
    font-weight: 600;
    color: #ffb84d;
    letter-spacing: 2rpx;
  }
</style>
