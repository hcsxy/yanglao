<template>
  <view class="fam-page">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>
    <view class="bg-orb orb-2"></view>

    <view class="fam-header small">
      <view class="brand-row">
        <text class="brand-name">健康动态</text>
        <text class="brand-sub">HEALTH</text>
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

    <view v-else-if="elder.viewHealth !== '1'" class="empty">
      <view>院方未开放健康信息的家属查看权限</view>
      <view class="empty-sub">如需查看，请联系院区管理员调整授权范围</view>
    </view>

    <block v-else>
      <view class="seg-bar">
        <view class="seg-item" :class="{ active: seg === index }" v-for="(item, index) in segs" :key="index" @click="switchSeg(index)">
          {{ item }}
        </view>
      </view>

      <!-- 体征趋势 -->
      <view v-if="seg === 0">
        <view class="chip-row">
          <view class="chip" :class="{ active: days === item }" v-for="(item, index) in dayOptions" :key="index" @click="changeDays(item)">
            近{{ item }}天
          </view>
        </view>
        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">{{ metricName }}</text>
            <text class="title-en">{{ metricUnit }}</text>
            <text class="title-extra">共 {{ vitals.length }} 次</text>
          </view>
          <view class="metric-row">
            <view class="metric" :class="{ on: metric === item.key }" v-for="(item, index) in metrics" :key="index" @click="changeMetric(item.key)">
              {{ item.name }}
            </view>
          </view>
          <view class="chart-cols" v-if="chart.length">
            <view class="chart-col" v-for="(item, index) in chart" :key="index">
              <text class="col-value">{{ item.text }}</text>
              <view class="col-bar" :class="{ empty: !item.value }" :style="{ height: item.height }"></view>
              <text class="col-label">{{ item.label }}</text>
            </view>
          </view>
          <view class="empty" v-else>该时间段暂无体征记录</view>
        </view>
        <view class="tech-card panel" v-if="latest">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">最近一次测量</text>
            <text class="title-en">{{ fmtDate(latest.date) }}</text>
          </view>
          <view class="kpi-grid">
            <view class="kpi-item">
              <view class="kpi-line"><text class="kpi-value">{{ latest.temperature || '--' }}</text><text class="kpi-unit">℃</text></view>
              <text class="kpi-label">体温</text>
            </view>
            <view class="kpi-item">
              <view class="kpi-line"><text class="kpi-value">{{ latest.pulse || '--' }}</text><text class="kpi-unit">次/分</text></view>
              <text class="kpi-label">脉搏</text>
            </view>
            <view class="kpi-item">
              <view class="kpi-line"><text class="kpi-value">{{ latest.breath || '--' }}</text><text class="kpi-unit">次/分</text></view>
              <text class="kpi-label">呼吸</text>
            </view>
            <view class="kpi-item">
              <view class="kpi-line"><text class="kpi-value">{{ latest.bloodPressure || '--' }}</text></view>
              <text class="kpi-label">血压 mmHg</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 健康记录 -->
      <view v-if="seg === 1">
        <view class="chip-row">
          <view class="chip" :class="{ active: recordType === item.value }" v-for="(item, index) in recordTypes" :key="index" @click="changeRecordType(item.value)">
            {{ item.label }}
          </view>
        </view>
        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">健康记录</text>
            <text class="title-en">RECORDS</text>
            <text class="title-extra">近 90 天 · {{ records.length }} 条</text>
          </view>
          <view class="list-item" v-for="(item, index) in records" :key="index">
            <view class="item-head">
              <view class="head-left">
                <text class="tag tag-blue">{{ recordTypeText(item.recordType) }}</text>
                <text class="item-title">{{ fmtDate(item.recordDate) }}</text>
              </view>
              <text class="item-time">{{ item.recorder || item.createBy || '' }}</text>
            </view>
            <view class="vital-line" v-if="item.recordType === '1'">
              <text class="vital">体温 {{ item.temperature || '--' }}℃</text>
              <text class="vital">脉搏 {{ item.pulse || '--' }}</text>
              <text class="vital">呼吸 {{ item.breath || '--' }}</text>
              <text class="vital">血压 {{ item.bloodPressure || '--' }}</text>
            </view>
            <view class="item-body">{{ item.content || '（无记录内容）' }}</view>
          </view>
          <view class="empty" v-if="!records.length">暂无健康记录</view>
        </view>
      </view>

      <!-- 能力评估 -->
      <view v-if="seg === 2">
        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">能力与风险评估</text>
            <text class="title-en">ASSESSMENT</text>
            <text class="title-extra">{{ assessments.length }} 次</text>
          </view>
          <view class="list-item" v-for="(item, index) in assessments" :key="index">
            <view class="item-head">
              <view class="head-left">
                <text class="item-title">{{ fmtDate(item.assessDate) }}</text>
                <text class="tag tag-cyan">{{ assessTypeText(item.assessType) }}</text>
              </view>
              <text class="item-time">{{ item.assessor || '' }}</text>
            </view>
            <view class="item-body">
              <view class="assess-score">
                <text class="score">{{ item.totalScore === null ? '--' : item.totalScore }}</text>
                <text class="score-unit">分</text>
                <text class="level">{{ item.levelResult || '--' }}</text>
              </view>
              <view class="line">评估模板：{{ item.templateName || '--' }}</view>
              <view class="line">护理等级：{{ item.careLevelName || '--' }}</view>
              <view class="line" v-if="item.riskTags">识别风险：{{ item.riskTags }}</view>
              <view class="line" v-if="item.suggestion">照护建议：{{ item.suggestion }}</view>
              <view class="line" v-if="item.nextReviewDate">下次复评：{{ fmtDate(item.nextReviewDate) }}</view>
            </view>
          </view>
          <view class="empty" v-if="!assessments.length">暂无评估记录</view>
        </view>
      </view>

      <!-- 医生巡诊 -->
      <view v-if="seg === 3">
        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">医生巡诊</text>
            <text class="title-en">DOCTOR ROUND</text>
            <text class="title-extra">{{ visits.length }} 次</text>
          </view>
          <view class="list-item" v-for="(item, index) in visits" :key="index">
            <view class="item-head">
              <view class="head-left">
                <text class="item-title">{{ fmtDate(item.visitDate) }}</text>
                <text class="tag tag-green">{{ visitTypeText(item.visitType) }}</text>
              </view>
              <text class="item-time">{{ item.doctorName || '' }}</text>
            </view>
            <view class="item-body">
              <view class="line" v-if="item.complaint">主诉：{{ item.complaint }}</view>
              <view class="line">诊断：{{ item.diagnosis || '--' }}</view>
              <view class="line" v-if="item.treatmentAdvice">处理意见：{{ item.treatmentAdvice }}</view>
              <view class="line" v-if="item.familyNotified === '1'">已通知家属</view>
            </view>
          </view>
          <view class="empty" v-if="!visits.length">暂无巡诊记录</view>
        </view>
      </view>

      <!-- 风险与事件 -->
      <view v-if="seg === 4">
        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">风险标记</text>
            <text class="title-en">RISK TAG</text>
            <text class="title-extra">生效中 {{ activeRisks.length }} 项</text>
          </view>
          <view class="list-item" v-for="(item, index) in risks" :key="index">
            <view class="item-head">
              <view class="head-left">
                <text class="item-title">{{ riskTypeText(item.riskType) }}</text>
                <text class="tag" :class="riskLevelTag(item.riskLevel)">{{ riskLevelText(item.riskLevel) }}</text>
              </view>
              <text class="tag tag-gray">{{ item.status === '0' ? '生效中' : '已解除' }}</text>
            </view>
            <view class="item-body">
              <view class="line">评估日期：{{ fmtDate(item.assessDate) }}</view>
              <view class="line" v-if="item.patrolAdvice">查房建议：{{ item.patrolAdvice }}</view>
              <view class="line" v-if="item.note">防范措施：{{ item.note }}</view>
              <view class="line" v-if="item.status === '1'">解除时间：{{ fmtDate(item.clearTime) }}（{{ item.clearBy || '' }}）</view>
            </view>
          </view>
          <view class="empty" v-if="!risks.length">暂无风险标记</view>
        </view>

        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">不良事件</text>
            <text class="title-en">ADVERSE EVENT</text>
            <text class="title-extra">近 90 天 {{ adverse.length }} 条</text>
          </view>
          <view class="list-item" v-for="(item, index) in adverse" :key="index">
            <view class="item-head">
              <view class="head-left">
                <text class="item-title">{{ adverseTypeText(item.eventType) }}</text>
                <text class="tag" :class="adverseLevelTag(item.eventLevel)">{{ adverseLevelText(item.eventLevel) }}</text>
              </view>
              <text class="tag" :class="adverseStatusTag(item.status)">{{ adverseStatusText(item.status) }}</text>
            </view>
            <view class="item-body">
              <view class="line">{{ fmtDateTime(item.eventTime) }} · {{ item.location || '院内' }}</view>
              <view class="line">{{ item.description || '--' }}</view>
              <view class="line" v-if="item.handleMeasures">处置：{{ item.handleMeasures }}</view>
              <view class="line" v-if="item.handleResult">结果：{{ item.handleResult }}</view>
              <view class="line">上报：{{ item.reporter || '' }} {{ fmtDateTime(item.reportTime) }}</view>
            </view>
          </view>
          <view class="empty" v-if="!adverse.length">近 90 天无不良事件</view>
        </view>
      </view>

      <!-- 健康档案 -->
      <view v-if="seg === 5">
        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">基本档案</text>
            <text class="title-en">PROFILE</text>
          </view>
          <view class="info-row">
            <text class="info-label">姓名 / 性别</text>
            <text class="info-value">{{ profile.name || '--' }} · {{ genderText(profile.gender) }} · {{ profile.age || '--' }} 岁</text>
          </view>
          <view class="info-row">
            <text class="info-label">出生日期</text>
            <text class="info-value">{{ fmtDate(profile.birthday) }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">床位 / 护理等级</text>
            <text class="info-value">{{ profile.bedLabel || '--' }} · {{ profile.careLevelName || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">入住日期</text>
            <text class="info-value">{{ fmtDate(profile.checkInDate) }}（{{ liveText(profile.status) }}）</text>
          </view>
          <view class="info-row">
            <text class="info-label">身份证号</text>
            <text class="info-value">{{ profile.idCard || '--' }}</text>
          </view>
        </view>

        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">健康概况</text>
            <text class="title-en">CONDITION</text>
          </view>
          <view class="chronic-row" v-if="chronicTags.length">
            <text class="tag tag-red" v-for="(item, index) in chronicTags" :key="index">{{ item }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">过敏史</text>
            <text class="info-value">{{ profile.allergy || '无已知过敏' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">既往病史</text>
            <text class="info-value">{{ profile.medicalHistory || '--' }}</text>
          </view>
        </view>

        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">紧急联系人</text>
            <text class="title-en">RELATIVES</text>
            <text class="title-extra">{{ relatives.length }} 位</text>
          </view>
          <view class="list-item" v-for="(item, index) in relatives" :key="index">
            <view class="item-head">
              <view class="head-left">
                <text class="item-title">{{ item.name }}</text>
                <text class="tag tag-cyan">{{ item.relation || '家属' }}</text>
                <text class="tag tag-orange" v-if="item.guardianFlag === '1'">监护人</text>
              </view>
              <text class="item-time" @click="callPhone(item.phone)">{{ item.phone || '--' }}</text>
            </view>
            <view class="item-body">
              <view class="line" v-if="item.address">住址：{{ item.address }}</view>
              <view class="line muted">查看授权：体征 {{ item.healthAuth === '1' ? '开放' : '未开放' }}　账单 {{ item.billAuth === '1' ? '开放' : '未开放' }}　探视 {{ item.visitAuth === '1' ? '开放' : '未开放' }}</view>
            </view>
          </view>
          <view class="empty" v-if="!relatives.length">院区未登记其他联系人</view>
        </view>

        <view class="tip-card">
          <view class="tip-content">档案中的身份证号已脱敏；紧急联系人电话可直接点击拨打（如院区已登记）。</view>
        </view>
      </view>

      <view class="footer-note">健康数据由院区医护录入，最终诊断以医院出具报告为准</view>
    </block>
  </view>
</template>

<script>
  import { listVitals, listHealthRecords, listAssessments, listDoctorVisits, listRisks, listAdverse, getProfile } from '@/api/family/portal'
  import { loadElderList, loadCurrentElder, fmtDate, fmtDateTime, systolic, RECORD_TYPE, ASSESS_TYPE, VISIT_TYPE, RISK_TYPE, RISK_LEVEL, RISK_LEVEL_TAG, ADVERSE_TYPE, ADVERSE_LEVEL, ADVERSE_LEVEL_TAG, ADVERSE_STATUS, ADVERSE_STATUS_TAG, GENDER, LIVE_STATUS, CHRONIC } from '@/utils/family'

  export default {
    data() {
      return {
        elder: null,
        elders: [],
        seg: 0,
        segs: ['体征趋势', '健康记录', '能力评估', '医生巡诊', '风险事件', '健康档案'],
        days: 30,
        dayOptions: [7, 30, 90],
        metric: 'temperature',
        metrics: [
          { key: 'temperature', name: '体温', unit: '℃' },
          { key: 'pulse', name: '脉搏', unit: '次/分' },
          { key: 'breath', name: '呼吸', unit: '次/分' },
          { key: 'systolic', name: '收缩压', unit: 'mmHg' }
        ],
        vitals: [],
        recordType: '',
        recordTypes: [
          { value: '', label: '全部' },
          { value: '1', label: '体征' },
          { value: '2', label: '护理' },
          { value: '3', label: '体检' },
          { value: '4', label: '病历' },
          { value: '5', label: '随访' }
        ],
        records: [],
        assessments: [],
        visits: [],
        risks: [],
        adverse: [],
        profile: {}
      }
    },
    computed: {
      metricName() {
        const hit = this.metrics.find(item => item.key === this.metric)
        return hit ? hit.name : ''
      },
      metricUnit() {
        const hit = this.metrics.find(item => item.key === this.metric)
        return hit ? hit.unit : ''
      },
      latest() {
        return this.vitals.length ? this.vitals[this.vitals.length - 1] : null
      },
      chart() {
        const values = this.vitals.map(item => this.metricValue(item))
        const nums = values.filter(v => v !== null && v !== undefined)
        const lo = nums.length ? Math.min.apply(null, nums) : 0
        const hi = nums.length ? Math.max.apply(null, nums) : 0
        return this.vitals.map((item, index) => {
          const value = values[index]
          let height = '0%'
          if (value !== null && value !== undefined) {
            height = hi === lo ? '70%' : (25 + ((value - lo) / (hi - lo)) * 65).toFixed(1) + '%'
          }
          return {
            label: String(item.date || '').slice(5),
            value: value,
            text: value === null || value === undefined ? '--' : value,
            height: height
          }
        })
      },
      activeRisks() {
        return this.risks.filter(item => item.status === '0')
      },
      chronicTags() {
        const str = String(this.profile.chronicTags || '')
        return str.split(',').filter(v => v).map(v => CHRONIC[v.trim()] || v.trim())
      },
      relatives() {
        return this.profile.relatives || []
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
          if (!this.elder || this.elder.viewHealth !== '1') return
          return this.loadVitals()
        })
      },
      metricValue(item) {
        if (this.metric === 'systolic') return systolic(item.bloodPressure)
        const v = item[this.metric]
        return (v === null || v === undefined || v === '') ? null : v
      },
      loadVitals() {
        if (!this.elder) return Promise.resolve()
        return listVitals(this.elder.elderId, this.days).then(res => {
          this.vitals = res.data || []
        })
      },
      changeDays(days) {
        if (this.days === days) return
        this.days = days
        uni.showLoading({ title: '加载中', icon: 'none' })
        this.loadVitals().then(() => uni.hideLoading(), () => uni.hideLoading())
      },
      changeMetric(key) {
        this.metric = key
      },
      switchSeg(index) {
        if (this.seg === index) return
        this.seg = index
        const loader = [null, this.loadRecords, this.loadAssessments, this.loadVisits, this.loadRiskAdverse, this.loadProfile]
        uni.showLoading({ title: '加载中', icon: 'none' })
        Promise.resolve(loader[index].call(this)).then(() => uni.hideLoading(), () => uni.hideLoading())
      },
      loadRecords() {
        if (!this.elder) return Promise.resolve()
        return listHealthRecords(this.elder.elderId, { recordType: this.recordType }).then(res => {
          this.records = res.data || []
        })
      },
      changeRecordType(value) {
        if (this.recordType === value) return
        this.recordType = value
        uni.showLoading({ title: '加载中', icon: 'none' })
        this.loadRecords().then(() => uni.hideLoading(), () => uni.hideLoading())
      },
      loadAssessments() {
        if (!this.elder) return Promise.resolve()
        return listAssessments(this.elder.elderId).then(res => {
          this.assessments = res.data || []
        })
      },
      loadVisits() {
        if (!this.elder) return Promise.resolve()
        return listDoctorVisits(this.elder.elderId).then(res => {
          this.visits = res.data || []
        })
      },
      loadRiskAdverse() {
        if (!this.elder) return Promise.resolve()
        return Promise.all([listRisks(this.elder.elderId), listAdverse(this.elder.elderId)]).then(res => {
          this.risks = res[0].data || []
          this.adverse = res[1].data || []
        })
      },
      loadProfile() {
        if (!this.elder) return Promise.resolve()
        return getProfile(this.elder.elderId).then(res => {
          this.profile = res.data || {}
        })
      },
      recordTypeText(v) {
        return RECORD_TYPE[v] || '记录'
      },
      assessTypeText(v) {
        return ASSESS_TYPE[v] || '评估'
      },
      visitTypeText(v) {
        return VISIT_TYPE[v] || '巡诊'
      },
      riskTypeText(v) {
        return RISK_TYPE[v] || '风险'
      },
      riskLevelText(v) {
        return RISK_LEVEL[v] || ''
      },
      riskLevelTag(v) {
        return RISK_LEVEL_TAG[v] || 'tag-gray'
      },
      adverseTypeText(v) {
        return ADVERSE_TYPE[v] || '事件'
      },
      adverseLevelText(v) {
        return ADVERSE_LEVEL[v] || ''
      },
      adverseLevelTag(v) {
        return ADVERSE_LEVEL_TAG[v] || 'tag-gray'
      },
      adverseStatusText(v) {
        return ADVERSE_STATUS[v] || ''
      },
      adverseStatusTag(v) {
        return ADVERSE_STATUS_TAG[v] || 'tag-gray'
      },
      genderText(v) {
        return GENDER[v] || '--'
      },
      liveText(v) {
        return LIVE_STATUS[v] || '--'
      },
      callPhone(phone) {
        const num = String(phone || '').replace(/[^0-9+\-]/g, '')
        if (!num) {
          this.$modal.msg('院区未登记该联系人电话')
          return
        }
        uni.makePhoneCall({ phoneNumber: num })
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

  .kpi-line {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }

  .metric-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 20rpx;
  }

  .metric {
    flex: 1;
    text-align: center;
    padding: 14rpx 0;
    margin-right: 14rpx;
    font-size: 25rpx;
    color: rgba(230, 244, 255, 0.6);
    border: 1rpx solid rgba(0, 229, 255, 0.2);
    border-radius: 12rpx;

    &:last-child {
      margin-right: 0;
    }
  }

  .metric.on {
    color: #041020;
    font-weight: 600;
    background: linear-gradient(135deg, $cyan, #4dabff);
    border-color: transparent;
  }

  .head-left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .head-left .item-title {
    margin-right: 14rpx;
  }

  .vital-line {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 12rpx;
  }

  .vital {
    margin: 0 20rpx 8rpx 0;
    font-size: 23rpx;
    color: rgba(0, 229, 255, 0.8);
  }

  .line {
    margin-top: 8rpx;
    font-size: 25rpx;
    color: rgba(230, 244, 255, 0.72);
    line-height: 1.7;
  }

  .assess-score {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    margin-bottom: 10rpx;
  }

  .assess-score .score {
    font-size: 44rpx;
    font-weight: 700;
    color: $cyan;
    text-shadow: 0 0 16rpx rgba(0, 229, 255, 0.45);
  }

  .assess-score .score-unit {
    margin-left: 6rpx;
    font-size: 22rpx;
    color: rgba(230, 244, 255, 0.5);
  }

  .assess-score .level {
    margin-left: 20rpx;
    font-size: 26rpx;
    color: #ffd28a;
  }

  .chronic-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 6rpx;
  }

  .chronic-row .tag {
    margin: 0 14rpx 14rpx 0;
  }

  .line.muted {
    color: rgba(230, 244, 255, 0.4);
  }
</style>
