<template>
  <view class="fam-page">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>
    <view class="bg-orb orb-2"></view>

    <view class="fam-header small">
      <view class="brand-row">
        <text class="brand-name">护理动态</text>
        <text class="brand-sub">NURSING</text>
      </view>
      <view class="hello-row">
        <text class="hello-text">{{ elder ? elder.name + ' · ' + (elder.careLevelName || '护理等级未评定') : '未绑定老人' }}</text>
        <view class="switch-btn" v-if="elders.length > 1" @click="goSelect">
          <uni-icons type="loop" size="16" color="#00e5ff"></uni-icons>
          <text class="switch-text">切换</text>
        </view>
      </view>
      <view class="header-line"></view>
    </view>

    <view v-if="!elder" class="empty">
      <view>当前账号未绑定在院老人</view>
      <view class="empty-sub">请联系院区管理员开通「家属授权」</view>
    </view>

    <view v-else-if="elder.viewNursing !== '1'" class="empty">
      <view>院方未开放护理信息的家属查看权限</view>
      <view class="empty-sub">如需查看，请联系院区管理员调整授权范围</view>
    </view>

    <block v-else>
      <view class="seg-bar">
        <view class="seg-item" :class="{ active: seg === index }" v-for="(item, index) in segs" :key="index" @click="switchSeg(index)">
          {{ item }}
        </view>
      </view>

      <!-- 执行看板 -->
      <view v-if="seg === 0">
        <view class="date-bar">
          <view class="date-btn" @click="shiftDate(-1)">
            <uni-icons type="left" size="16" color="#00e5ff"></uni-icons>
          </view>
          <view class="date-text">
            <text class="date-main">{{ taskDate }}</text>
            <text class="date-sub">{{ dateHint }}</text>
          </view>
          <view class="date-btn" :class="{ disabled: isToday }" @click="shiftDate(1)">
            <uni-icons type="right" size="16" :color="isToday ? 'rgba(230,244,255,0.3)' : '#00e5ff'"></uni-icons>
          </view>
        </view>

        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">完成进度</text>
            <text class="title-en">PROGRESS</text>
            <text class="title-extra">{{ rateText }}</text>
          </view>
          <view class="stat-row">
            <view class="stat-cell">
              <text class="stat-num">{{ stat.total || 0 }}</text>
              <text class="stat-label">任务总数</text>
            </view>
            <view class="stat-cell">
              <text class="stat-num green">{{ stat.done || 0 }}</text>
              <text class="stat-label">已执行</text>
            </view>
            <view class="stat-cell">
              <text class="stat-num orange">{{ stat.pending || 0 }}</text>
              <text class="stat-label">待执行</text>
            </view>
            <view class="stat-cell">
              <text class="stat-num gray">{{ stat.cancel || 0 }}</text>
              <text class="stat-label">已取消</text>
            </view>
          </view>
          <view class="progress">
            <view class="progress-inner" :style="{ width: rateWidth }"></view>
          </view>
        </view>

        <block v-for="(group, gi) in groups" :key="'g' + gi">
          <view class="tech-card panel">
            <view class="panel-title">
              <text class="title-bar"></text>
              <text class="title-text">{{ group.slot }}</text>
              <text class="title-en">{{ group.slotEn }}</text>
              <text class="title-extra">{{ group.done }} / {{ group.tasks.length }} 已完成</text>
            </view>
            <view class="list-item" v-for="(task, ti) in group.tasks" :key="ti">
              <view class="item-head">
                <text class="item-title">{{ task.itemName || '护理项目' }}</text>
                <text class="tag" :class="taskStatusTag(task.status)">{{ taskStatusText(task.status) }}</text>
              </view>
              <view class="item-body" v-if="task.status === '1'">
                <view class="line">执行人：{{ task.execBy || '护理员' }}　{{ fmtDateTime(task.execTime) }}</view>
                <view class="line" v-if="task.execDesc">执行记录：{{ task.execDesc }}</view>
              </view>
              <view class="item-body" v-else>
                <view class="line muted">尚未执行，完成后将同步到此列表</view>
              </view>
            </view>
          </view>
        </block>

        <view class="empty" v-if="!tasks.length">当日暂无护理任务安排</view>

        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">近 7 日完成趋势</text>
            <text class="title-en">TREND</text>
          </view>
          <view class="chart-cols" v-if="trendBars.length">
            <view class="chart-col" v-for="(item, index) in trendBars" :key="index">
              <text class="col-value">{{ item.text }}</text>
              <view class="col-bar" :class="{ empty: !item.total }" :style="{ height: item.height }"></view>
              <text class="col-label">{{ item.label }}</text>
            </view>
          </view>
          <view class="empty" v-else>暂无趋势数据</view>
        </view>
      </view>

      <!-- 交接班 -->
      <view v-if="seg === 1">
        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">班组交接班摘要</text>
            <text class="title-en">HANDOVER</text>
            <text class="title-extra">近 30 天 · {{ handovers.length }} 条</text>
          </view>
          <view class="list-item" v-for="(item, index) in handovers" :key="index">
            <view class="item-head">
              <view class="head-left">
                <text class="item-title">{{ fmtDate(item.handoverDate) }}</text>
                <text class="tag tag-blue">{{ item.shift }}</text>
                <text class="tag tag-orange" v-if="item.focusMe">重点关注</text>
              </view>
              <text class="item-time">{{ item.status === '1' ? '已接班' : '待确认' }}</text>
            </view>
            <view class="item-body">
              <view class="line">交班：{{ item.fromBy || '--' }}　接班：{{ item.toBy || '--' }}</view>
              <view class="line" v-if="item.content">本班概况：{{ item.content }}</view>
              <view class="line" v-if="item.pendingItems">待办：{{ item.pendingItems }}</view>
              <view class="line" v-if="item.focusElders">重点老人：{{ item.focusElders }}</view>
            </view>
          </view>
          <view class="empty" v-if="!handovers.length">近 30 天暂无交接班记录</view>
        </view>
        <view class="tip-card">
          <view class="tip-content">交接班摘要来自院区护理班组内部记录，已隐去与老人无关的运营细节；若本班把老人列为重点关注，会在此处高亮提示。</view>
        </view>
      </view>

      <!-- 医嘱 -->
      <view v-if="seg === 2">
        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">医嘱与用药</text>
            <text class="title-en">MEDICAL ORDER</text>
            <text class="title-extra">{{ orders.length }} 条</text>
          </view>
          <view class="list-item" v-for="(item, index) in orders" :key="index">
            <view class="item-head">
              <view class="head-left">
                <text class="item-title">{{ item.orderContent || item.drugName || '医嘱' }}</text>
                <text class="tag tag-cyan">{{ orderTypeText(item.orderType) }}</text>
              </view>
              <text class="tag" :class="orderStatusTag(item.status)">{{ orderStatusText(item.status) }}</text>
            </view>
            <view class="item-body">
              <view class="line" v-if="item.drugName">用药：{{ item.drugName }}</view>
              <view class="line">
                用法：{{ item.usageMethod || '遵医嘱' }}
                <text v-if="item.freq">　{{ freqText(item.freq) }}</text>
              </view>
              <view class="line">起止：{{ fmtDate(item.startDate) }} ~ {{ item.endDate ? fmtDate(item.endDate) : '长期' }}</view>
              <view class="line">开立医师：{{ item.doctorName || '--' }}</view>
            </view>
          </view>
          <view class="empty" v-if="!orders.length">暂无医嘱记录</view>
        </view>
        <view class="tip-card warn">
          <view class="tip-content">用药请严格以院区医护现场执行与医师书面医嘱为准，本页面仅供家属了解，不作为用药依据。</view>
        </view>
      </view>

      <view class="footer-note">护理执行由院内护理员打卡记录，实时同步至家属端</view>
    </block>
  </view>
</template>

<script>
  import { getNursingDaily, getNursingTrend, listHandovers, listMedicalOrders } from '@/api/family/portal'
  import { loadElderList, loadCurrentElder, fmtDate, fmtDateTime, dayString, TIME_SLOTS, TASK_STATUS, TASK_STATUS_TAG, ORDER_TYPE, ORDER_STATUS, ORDER_STATUS_TAG, FREQ } from '@/utils/family'

  const SLOT_EN = { '晨间': 'MORNING', '午间': 'NOON', '晚间': 'EVENING', '临睡前': 'NIGHT' }

  export default {
    data() {
      return {
        elder: null,
        elders: [],
        seg: 0,
        segs: ['执行看板', '交接班', '医嘱用药'],
        taskDate: dayString(0),
        stat: {},
        tasks: [],
        trend: [],
        handovers: [],
        orders: []
      }
    },
    computed: {
      isToday() {
        return this.taskDate >= dayString(0)
      },
      dateHint() {
        if (this.taskDate === dayString(0)) return '今天'
        if (this.taskDate === dayString(-1)) return '昨天'
        if (this.taskDate === dayString(-2)) return '前天'
        return ''
      },
      rateText() {
        const rate = this.stat.rate
        return (rate === null || rate === undefined) ? '暂无任务' : '完成率 ' + rate + '%'
      },
      rateWidth() {
        const rate = Number(this.stat.rate)
        if (isNaN(rate)) return '0%'
        return Math.min(100, Math.max(0, rate)) + '%'
      },
      groups() {
        const result = []
        TIME_SLOTS.forEach(slot => {
          const list = this.tasks.filter(item => item.timeSlot === slot)
          if (list.length) {
            result.push({
              slot: slot,
              slotEn: SLOT_EN[slot] || 'SLOT',
              done: list.filter(item => item.status === '1').length,
              tasks: list
            })
          }
        })
        const other = this.tasks.filter(item => TIME_SLOTS.indexOf(item.timeSlot) === -1)
        if (other.length) {
          result.push({ slot: '其他时段', slotEn: 'OTHER', done: other.filter(item => item.status === '1').length, tasks: other })
        }
        return result
      },
      trendBars() {
        const max = Math.max.apply(null, this.trend.map(item => item.total || 0).concat([0]))
        return this.trend.map(item => {
          const total = item.total || 0
          const done = item.done || 0
          return {
            total: total,
            label: String(item.date || '').slice(5),
            text: total ? done + '/' + total : '--',
            height: (total === 0 || max === 0) ? '0%' : ((done / max) * 90 + 5).toFixed(1) + '%'
          }
        })
      }
    },
    onShow() {
      this.init()
    },
    onPullDownRefresh() {
      this.init(true).then(() => uni.stopPullDownRefresh())
    },
    methods: {
      fmtDate,
      fmtDateTime,
      init(force) {
        return Promise.all([loadElderList(force), loadCurrentElder(force)]).then(res => {
          this.elders = res[0] || []
          this.elder = res[1]
          if (!this.elder || this.elder.viewNursing !== '1') return
          return Promise.all([this.loadDaily(), this.loadTrend()])
        })
      },
      loadDaily() {
        if (!this.elder) return Promise.resolve()
        return getNursingDaily(this.elder.elderId, this.taskDate).then(res => {
          const data = res.data || {}
          this.taskDate = data.taskDate || this.taskDate
          this.stat = data.stat || {}
          this.tasks = data.tasks || []
        })
      },
      shiftDate(offset) {
        if (offset > 0 && this.isToday) {
          this.$modal.msg('已显示最新日期')
          return
        }
        const d = new Date(String(this.taskDate).replace(/-/g, '/'))
        d.setDate(d.getDate() + offset)
        const m = ('0' + (d.getMonth() + 1)).slice(-2)
        const day = ('0' + d.getDate()).slice(-2)
        this.taskDate = d.getFullYear() + '-' + m + '-' + day
        uni.showLoading({ title: '加载中', icon: 'none' })
        this.loadDaily().then(() => uni.hideLoading(), () => uni.hideLoading())
      },
      switchSeg(index) {
        if (this.seg === index) return
        this.seg = index
        const loader = [this.loadDaily, this.loadHandovers, this.loadOrders]
        uni.showLoading({ title: '加载中', icon: 'none' })
        Promise.resolve(loader[index].call(this)).then(() => uni.hideLoading(), () => uni.hideLoading())
      },
      loadTrend() {
        if (!this.elder) return Promise.resolve()
        return getNursingTrend(this.elder.elderId, 7).then(res => {
          this.trend = res.data || []
        })
      },
      loadHandovers() {
        if (!this.elder) return Promise.resolve()
        return listHandovers(this.elder.elderId, 8).then(res => {
          this.handovers = res.data || []
        })
      },
      loadOrders() {
        if (!this.elder) return Promise.resolve()
        return listMedicalOrders(this.elder.elderId).then(res => {
          this.orders = res.data || []
        })
      },
      taskStatusText(v) {
        return TASK_STATUS[v] || '--'
      },
      taskStatusTag(v) {
        return TASK_STATUS_TAG[v] || 'tag-gray'
      },
      orderTypeText(v) {
        return ORDER_TYPE[v] || '医嘱'
      },
      orderStatusText(v) {
        return ORDER_STATUS[v] || '--'
      },
      orderStatusTag(v) {
        return ORDER_STATUS_TAG[v] || 'tag-gray'
      },
      freqText(v) {
        return FREQ[v] || v || '--'
      },
      goSelect() {
        this.$tab.navigateTo('/pages/family/elder/select')
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

  .switch-text {
    margin-left: 8rpx;
    font-size: 22rpx;
  }

  .empty-sub {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: rgba(230, 244, 255, 0.3);
  }

  /* 日期切换 */
  .date-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 24rpx 24rpx 0 24rpx;
    padding: 16rpx 0;
    border-radius: 16rpx;
    background: rgba(8, 20, 40, 0.7);
    border: 1rpx solid rgba(0, 229, 255, 0.2);
  }

  .date-btn {
    width: 70rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .date-btn.disabled {
    opacity: 0.4;
  }

  .date-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 260rpx;
  }

  .date-main {
    font-size: 30rpx;
    color: $text;
    letter-spacing: 2rpx;
  }

  .date-sub {
    margin-top: 4rpx;
    font-size: 22rpx;
    color: rgba(0, 229, 255, 0.7);
  }

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

  .head-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    padding-right: 16rpx;
  }

  .head-left .item-title {
    margin-right: 14rpx;
  }

  .head-left .tag {
    margin-right: 10rpx;
  }

  .line {
    margin-top: 8rpx;
    font-size: 25rpx;
    color: rgba(230, 244, 255, 0.72);
    line-height: 1.7;
  }

  .line.muted {
    color: rgba(230, 244, 255, 0.4);
  }
</style>
