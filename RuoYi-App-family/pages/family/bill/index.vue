<template>
  <view class="fam-page">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>
    <view class="bg-orb orb-2"></view>

    <view class="fam-header small">
      <view class="brand-row">
        <text class="brand-name">费用账单</text>
        <text class="brand-sub">BILLING</text>
      </view>
      <view class="hello-row">
        <text class="hello-text">{{ elder ? elder.name + ' · ' + (elder.campusName || '--') : '未绑定老人' }}</text>
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

    <view v-else-if="elder.viewBill !== '1'" class="empty">
      <view>院方未开放费用账单的家属查看权限</view>
      <view class="empty-sub">如需查看或缴费，请联系院区管理员调整授权范围</view>
    </view>

    <block v-else>
      <!-- 账户概览 -->
      <view class="tech-card panel account-card">
        <view class="tech-corner tl"></view>
        <view class="tech-corner tr"></view>
        <view class="tech-corner bl"></view>
        <view class="tech-corner br"></view>
        <view class="acc-label">账户余额（元）</view>
        <view class="acc-balance">
          <text class="cny">￥</text>
          <text class="amount">{{ money(account.balance) }}</text>
        </view>
        <view class="acc-sub">
          <text class="sub-item">押金 {{ money(account.deposit) }} 元</text>
          <text class="sub-item" v-if="Number(account.freezeAmount) > 0">冻结 {{ money(account.freezeAmount) }} 元</text>
          <text class="sub-item">{{ account.status === '1' ? '账户已停用' : '账户正常' }}</text>
        </view>
        <view class="acc-owed" v-if="owedCount > 0">
          <uni-icons type="info-filled" size="16" color="#ff6b8b"></uni-icons>
          <text class="owed-text">欠费 {{ money(owedAmount) }} 元（{{ owedCount }} 期）</text>
          <text class="owed-month" v-if="oldestMonth">最早 {{ oldestMonth }}</text>
        </view>
        <view class="acc-owed ok" v-else>
          <uni-icons type="checkmarkempty" size="16" color="#00ffb3"></uni-icons>
          <text class="owed-text">当前无欠费</text>
        </view>
      </view>

      <view class="btn-row">
        <view class="fam-btn ghost" @click="goAccount">账户流水</view>
        <view class="fam-btn primary" @click="openRecharge">余额充值</view>
      </view>

      <!-- 充值面板 -->
      <view class="tech-card panel" v-if="rechargeVisible">
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">余额充值</text>
          <text class="title-en">RECHARGE</text>
          <text class="title-extra" @click="rechargeVisible = false">收起 ×</text>
        </view>
        <view class="field-row">
          <text class="field-label">充值金额</text>
          <input class="field-input" type="digit" v-model="rechargeForm.amount" placeholder="请输入金额（元）" placeholder-class="ph" />
        </view>
        <view class="quick-amount">
          <text class="qa" v-for="(item, index) in amountOptions" :key="index" @click="rechargeForm.amount = String(item)">{{ item }}</text>
        </view>
        <view class="field-row">
          <text class="field-label">支付方式</text>
          <view class="pay-row">
            <text class="pay" :class="{ on: rechargeForm.payType === item.value }" v-for="(item, index) in payOptions" :key="index"
              @click="rechargeForm.payType = item.value">{{ item.label }}</text>
          </view>
        </view>
        <view class="btn-row inner">
          <view class="fam-btn primary" :class="{ disabled: paying }" @click="doRecharge">{{ paying ? '处理中…' : '确认充值' }}</view>
        </view>
        <view class="tip-content pay-tip">演示环境使用沙箱渠道，下单后可直接模拟支付成功，不产生真实扣款。</view>
      </view>

      <!-- 账单 -->
      <view class="chip-row">
        <view class="chip" :class="{ active: status === item.value }" v-for="(item, index) in statusOptions" :key="index" @click="changeStatus(item.value)">
          {{ item.label }}
        </view>
      </view>

      <view class="tech-card panel">
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">月度账单</text>
          <text class="title-en">MONTHLY BILL</text>
          <text class="title-extra">{{ bills.length }} 期</text>
        </view>
        <view class="bill-item" v-for="(item, index) in bills" :key="index" @click="goDetail(item)">
          <view class="bill-head">
            <view class="head-left">
              <text class="bill-month">{{ item.billMonth }}</text>
              <text class="tag" :class="billStatusTag(item.status)">{{ billStatusText(item.status) }}</text>
            </view>
            <text class="bill-amount" :class="{ owe: Number(item.owedAmount) > 0 }">{{ Number(item.owedAmount) > 0 ? '待缴 ' + money(item.owedAmount) : '已结清' }}</text>
          </view>
          <view class="bill-body">
            <text class="bill-line">账单号 {{ item.billNo }}</text>
            <text class="bill-line">合计 {{ money(item.totalAmount) }}　优惠 {{ money(item.discountAmount) }}　已收 {{ money(item.paidAmount) }}</text>
            <text class="bill-line">{{ item.itemCount || 0 }} 个费用项目{{ item.settleTime ? '　结算于 ' + fmtDateTime(item.settleTime) : '' }}</text>
          </view>
          <view class="bill-action" v-if="Number(item.owedAmount) > 0">
            <text class="action-text" @click.stop="goDetail(item)">查看并缴费 ></text>
          </view>
        </view>
        <view class="empty" v-if="!bills.length">暂无账单记录</view>
      </view>

      <!-- 消费明细 -->
      <view class="tech-card panel">
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">近期消费</text>
          <text class="title-en">CONSUMPTION</text>
          <text class="title-extra">近 90 天 · {{ consumptions.length }} 笔</text>
        </view>
        <view class="list-item" v-for="(item, index) in consumptions" :key="index">
          <view class="item-head">
            <text class="item-title">{{ item.consName || '消费项目' }}</text>
            <text class="bill-amount">{{ money(item.amount) }}</text>
          </view>
          <view class="item-body">
            <view class="line">
              {{ fmtDate(item.consDate) }}　{{ item.quantity || 1 }} × {{ money(item.unitPrice) }} 元
              　{{ settleWayText(item.settleWay) }}
            </view>
            <view class="line muted" v-if="item.billId">已计入 {{ billMonthOf(item.billId) }} 账单</view>
          </view>
        </view>
        <view class="empty" v-if="!consumptions.length">近 90 天无消费记录</view>
      </view>

      <view class="footer-note">如对账单有疑问，请联系院区收费处核对（工作日 08:30-17:30）</view>
    </block>
  </view>
</template>

<script>
  import { listBills, listConsumptions, getAccount, payRecharge, mockPay, getSummary } from '@/api/family/portal'
  import { loadElderList, loadCurrentElder, fmtDate, fmtDateTime, money, BILL_STATUS, BILL_STATUS_TAG, SETTLE_WAY } from '@/utils/family'

  export default {
    data() {
      return {
        elder: null,
        elders: [],
        status: '',
        statusOptions: [
          { value: '', label: '全部' },
          { value: '0', label: '未结算' },
          { value: '1', label: '部分结算' },
          { value: '2', label: '已结算' }
        ],
        bills: [],
        consumptions: [],
        account: {},
        owedAmount: 0,
        owedCount: 0,
        oldestMonth: '',
        rechargeVisible: false,
        paying: false,
        rechargeForm: { amount: '', payType: 'wechat' },
        amountOptions: [500, 1000, 2000, 5000],
        payOptions: [
          { value: 'wechat', label: '微信支付' },
          { value: 'alipay', label: '支付宝' }
        ]
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
      money,
      init(force) {
        return Promise.all([loadElderList(force), loadCurrentElder(force)]).then(res => {
          this.elders = res[0] || []
          this.elder = res[1]
          if (!this.elder || this.elder.viewBill !== '1') return
          return this.loadAll()
        })
      },
      loadAll() {
        if (!this.elder) return Promise.resolve()
        const id = this.elder.elderId
        return Promise.all([
          this.loadBills(),
          listConsumptions(id, {}).then(res => { this.consumptions = res.data || [] }),
          getAccount(id).then(res => { this.account = res.data || {} }),
          getSummary(id).then(res => {
            const data = res.data || {}
            this.owedAmount = data.owedAmount || 0
            this.owedCount = data.owedCount || 0
            this.oldestMonth = data.oldestOwedMonth || ''
          })
        ])
      },
      loadBills() {
        if (!this.elder) return Promise.resolve()
        return listBills(this.elder.elderId, this.status).then(res => {
          this.bills = res.data || []
        })
      },
      changeStatus(value) {
        if (this.status === value) return
        this.status = value
        uni.showLoading({ title: '加载中', icon: 'none' })
        this.loadBills().then(() => uni.hideLoading(), () => uni.hideLoading())
      },
      openRecharge() {
        this.rechargeVisible = true
        this.rechargeForm.amount = ''
      },
      doRecharge() {
        if (this.paying) return
        const amount = Number(this.rechargeForm.amount)
        if (!amount || amount <= 0) {
          this.$modal.msg('请输入正确的充值金额')
          return
        }
        this.paying = true
        payRecharge({ elderId: this.elder.elderId, amount: amount, payType: this.rechargeForm.payType }).then(res => {
          const order = res.data || {}
          this.confirmMock(order)
        }, () => { this.paying = false })
      },
      confirmMock(order) {
        uni.showModal({
          title: '确认支付',
          content: '已生成订单 ' + (order.orderNo || '') + '，金额 ' + money(order.amount) + ' 元。演示环境可直接模拟支付成功。',
          confirmText: '模拟支付',
          cancelText: '稍后处理',
          success: res => {
            if (res.confirm) {
              mockPay(order.payId).then(() => {
                this.$modal.msgSuccess('充值成功')
                this.paying = false
                this.rechargeVisible = false
                this.loadAll()
              }, () => { this.paying = false })
            } else {
              this.paying = false
            }
          },
          fail: () => { this.paying = false }
        })
      },
      billStatusText(v) {
        return BILL_STATUS[v] || '--'
      },
      billStatusTag(v) {
        return BILL_STATUS_TAG[v] || 'tag-gray'
      },
      settleWayText(v) {
        return SETTLE_WAY[v] || '--'
      },
      billMonthOf(billId) {
        const hit = this.bills.find(item => String(item.billId) === String(billId))
        return hit ? hit.billMonth : ('账单 ' + billId)
      },
      goDetail(item) {
        this.$tab.navigateTo('/pages/family/bill/detail?billId=' + item.billId)
      },
      goAccount() {
        this.$tab.navigateTo('/pages/family/bill/account')
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

  /* 账户卡 */
  .account-card {
    padding: 34rpx 30rpx 26rpx 30rpx;
  }

  .acc-label {
    font-size: 24rpx;
    color: rgba(230, 244, 255, 0.55);
    letter-spacing: 2rpx;
  }

  .acc-balance {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    margin-top: 12rpx;
  }

  .acc-balance .cny {
    font-size: 30rpx;
    color: $cyan;
    margin-right: 8rpx;
  }

  .acc-balance .amount {
    font-size: 66rpx;
    font-weight: 700;
    color: $cyan;
    letter-spacing: 2rpx;
    text-shadow: 0 0 22rpx rgba(0, 229, 255, 0.5);
  }

  .acc-sub {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 14rpx;
  }

  .sub-item {
    margin-right: 24rpx;
    font-size: 23rpx;
    color: rgba(230, 244, 255, 0.55);
  }

  .acc-owed {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 22rpx;
    padding: 14rpx 18rpx;
    border-radius: 12rpx;
    background: rgba(255, 107, 139, 0.1);
    border: 1rpx solid rgba(255, 107, 139, 0.35);
  }

  .acc-owed.ok {
    background: rgba(0, 255, 179, 0.08);
    border-color: rgba(0, 255, 179, 0.3);
  }

  .owed-text {
    margin-left: 10rpx;
    font-size: 25rpx;
    color: #ffb3c2;
  }

  .acc-owed.ok .owed-text {
    color: #7dffcf;
  }

  .owed-month {
    margin-left: 18rpx;
    font-size: 22rpx;
    color: rgba(255, 179, 194, 0.7);
  }

  /* 表单 */
  .field-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16rpx 0;
    border-bottom: 1rpx dashed rgba(0, 229, 255, 0.14);
  }

  .field-label {
    width: 160rpx;
    font-size: 26rpx;
    color: rgba(230, 244, 255, 0.6);
  }

  .field-input {
    flex: 1;
    font-size: 30rpx;
    color: $text;
  }

  .ph {
    color: rgba(230, 244, 255, 0.3);
  }

  .quick-amount {
    display: flex;
    flex-direction: row;
    margin: 18rpx 0;
  }

  .qa {
    margin-right: 18rpx;
    padding: 10rpx 26rpx;
    font-size: 24rpx;
    color: rgba(230, 244, 255, 0.7);
    border: 1rpx solid rgba(0, 229, 255, 0.25);
    border-radius: 10rpx;
    background: rgba(0, 229, 255, 0.05);
  }

  .pay-row {
    display: flex;
    flex-direction: row;
    flex: 1;
  }

  .pay {
    margin-right: 18rpx;
    padding: 10rpx 26rpx;
    font-size: 24rpx;
    color: rgba(230, 244, 255, 0.7);
    border: 1rpx solid rgba(0, 229, 255, 0.25);
    border-radius: 10rpx;
  }

  .pay.on {
    color: #041020;
    font-weight: 600;
    background: linear-gradient(135deg, $cyan, #4dabff);
    border-color: transparent;
  }

  .btn-row.inner {
    margin: 24rpx 0 0 0;
  }

  .pay-tip {
    margin-top: 18rpx;
    font-size: 23rpx;
    color: rgba(230, 244, 255, 0.5);
    line-height: 1.7;
  }

  /* 账单 */
  .bill-item {
    padding: 24rpx 0;
    border-bottom: 1rpx dashed rgba(0, 229, 255, 0.14);
  }

  .bill-item:last-child {
    border-bottom: none;
  }

  .bill-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .head-left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .bill-month {
    margin-right: 16rpx;
    font-size: 32rpx;
    font-weight: 700;
    color: $text;
    letter-spacing: 1rpx;
  }

  .bill-amount {
    font-size: 28rpx;
    color: #7dffcf;
  }

  .bill-amount.owe {
    color: #ffb3c2;
  }

  .bill-body {
    margin-top: 12rpx;
  }

  .bill-line {
    display: block;
    margin-top: 6rpx;
    font-size: 24rpx;
    color: rgba(230, 244, 255, 0.58);
  }

  .bill-action {
    margin-top: 14rpx;
    text-align: right;
  }

  .action-text {
    font-size: 25rpx;
    color: $cyan;
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
