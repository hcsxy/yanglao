<template>
  <view class="fam-page">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>

    <view class="fam-header small">
      <view class="brand-row">
        <text class="brand-name">账单明细</text>
        <text class="brand-sub">BILL DETAIL</text>
      </view>
      <view class="hello-row">
        <text class="hello-text">{{ bill.billNo || '--' }}</text>
      </view>
      <view class="header-line"></view>
    </view>

    <view v-if="loading" class="empty">加载中…</view>

    <block v-else-if="bill.billId">
      <!-- 账单概要 -->
      <view class="tech-card panel head-card">
        <view class="tech-corner tl"></view>
        <view class="tech-corner br"></view>
        <view class="head-row">
          <text class="bill-month">{{ bill.billMonth }}</text>
          <text class="tag" :class="billStatusTag(bill.status)">{{ billStatusText(bill.status) }}</text>
        </view>
        <view class="owed-box" v-if="Number(bill.owedAmount) > 0">
          <text class="owed-label">待缴金额（元）</text>
          <view class="owed-amount"><text class="cny">￥</text><text class="num">{{ money(bill.owedAmount) }}</text></view>
        </view>
        <view class="paid-box" v-else>
          <uni-icons type="checkmarkempty" size="22" color="#00ffb3"></uni-icons>
          <text class="paid-text">本账单已结清</text>
        </view>
        <view class="info-row">
          <text class="info-label">账单合计</text>
          <text class="info-value">{{ money(bill.totalAmount) }} 元</text>
        </view>
        <view class="info-row">
          <text class="info-label">优惠减免</text>
          <text class="info-value">- {{ money(bill.discountAmount) }} 元</text>
        </view>
        <view class="info-row">
          <text class="info-label">已收金额</text>
          <text class="info-value">{{ money(bill.paidAmount) }} 元</text>
        </view>
        <view class="info-row">
          <text class="info-label">老人 / 院区</text>
          <text class="info-value">{{ bill.elderName || '--' }} · {{ bill.campusName || '--' }}</text>
        </view>
        <view class="info-row" v-if="bill.settleTime">
          <text class="info-label">结算时间</text>
          <text class="info-value">{{ fmtDateTime(bill.settleTime) }}</text>
        </view>
      </view>

      <!-- 费用项目 -->
      <view class="tech-card panel">
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">费用项目</text>
          <text class="title-en">ITEMS</text>
          <text class="title-extra">{{ items.length }} 项</text>
        </view>
        <view class="table-head">
          <text class="th name">项目</text>
          <text class="th period">计费周期</text>
          <text class="th num">数量</text>
          <text class="th num">单价</text>
          <text class="th money">金额</text>
        </view>
        <view class="table-row" v-for="(item, index) in items" :key="index">
          <text class="td name">{{ item.subjectName || '费用项目' }}</text>
          <text class="td period">{{ item.periodDesc || '--' }}</text>
          <text class="td num">{{ item.days === null ? '--' : item.days }}</text>
          <text class="td num">{{ money(item.unitPrice) }}</text>
          <text class="td money">{{ money(item.amount) }}</text>
        </view>
        <view class="table-total">
          <text class="total-label">合计</text>
          <text class="total-value">{{ money(itemsAmount) }} 元</text>
        </view>
        <view class="empty" v-if="!items.length">本账单暂无明细项目</view>
      </view>

      <!-- 缴费 -->
      <view class="tech-card panel" v-if="Number(bill.owedAmount) > 0">
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">在线缴费</text>
          <text class="title-en">PAYMENT</text>
        </view>
        <view class="field-row">
          <text class="field-label">缴费金额</text>
          <input class="field-input" type="digit" v-model="payForm.amount" placeholder="默认全额" placeholder-class="ph" />
          <text class="unit">元</text>
        </view>
        <view class="quick-amount">
          <text class="qa" @click="payForm.amount = String(bill.owedAmount)">全额 {{ money(bill.owedAmount) }}</text>
          <text class="qa" @click="payForm.amount = ''">自定义</text>
        </view>
        <view class="field-row">
          <text class="field-label">支付方式</text>
          <view class="pay-row">
            <text class="pay" :class="{ on: payForm.payType === item.value }" v-for="(item, index) in payOptions" :key="index"
              @click="payForm.payType = item.value">{{ item.label }}</text>
          </view>
        </view>
        <view class="field-row" v-if="balance !== null">
          <text class="info-label">账户余额</text>
          <text class="info-value">{{ money(balance) }} 元（余额缴费请联系院区收费处办理）</text>
        </view>
        <view class="btn-row inner">
          <view class="fam-btn primary" :class="{ disabled: paying }" @click="doPay">{{ paying ? '处理中…' : '确认缴费' }}</view>
        </view>
        <view class="tip-content pay-tip">演示环境使用沙箱支付渠道，下单后可直接模拟支付成功，不产生真实扣款；正式环境将跳转微信/支付宝完成付款。</view>
      </view>

      <view class="footer-note">如对明细有疑问，请携带账单号联系院区收费处</view>
    </block>

    <view v-else class="empty">未找到账单信息</view>
  </view>
</template>

<script>
  import { getBill, getAccount, payBill, mockPay } from '@/api/family/portal'
  import { loadCurrentElder, fmtDateTime, money, BILL_STATUS, BILL_STATUS_TAG } from '@/utils/family'

  export default {
    data() {
      return {
        billId: '',
        loading: true,
        paying: false,
        bill: {},
        balance: null,
        payForm: { amount: '', payType: 'wechat' },
        payOptions: [
          { value: 'wechat', label: '微信支付' },
          { value: 'alipay', label: '支付宝' }
        ]
      }
    },
    computed: {
      items() {
        return this.bill.items || []
      },
      itemsAmount() {
        let sum = 0
        this.items.forEach(item => { sum += Number(item.amount || 0) })
        return sum
      }
    },
    onLoad(options) {
      this.billId = options.billId || ''
      this.load()
    },
    onPullDownRefresh() {
      this.load().then(() => uni.stopPullDownRefresh())
    },
    methods: {
      fmtDateTime,
      money,
      load() {
        if (!this.billId) {
          this.loading = false
          return Promise.resolve()
        }
        this.loading = true
        return getBill(this.billId).then(res => {
          this.bill = res.data || {}
          if (!this.payForm.amount) this.payForm.amount = String(this.bill.owedAmount || '')
          this.loading = false
          return loadCurrentElder().then(elder => {
            if (!elder || elder.viewBill !== '1') return
            return getAccount(elder.elderId).then(r => { this.balance = (r.data || {}).balance })
          })
        }, () => { this.loading = false })
      },
      billStatusText(v) {
        return BILL_STATUS[v] || '--'
      },
      billStatusTag(v) {
        return BILL_STATUS_TAG[v] || 'tag-gray'
      },
      doPay() {
        if (this.paying) return
        const owed = Number(this.bill.owedAmount || 0)
        const amount = Number(this.payForm.amount || 0)
        if (!amount || amount <= 0) {
          this.$modal.msg('请输入缴费金额')
          return
        }
        if (amount > owed) {
          this.$modal.msg('缴费金额不能大于待缴金额 ' + money(owed) + ' 元')
          return
        }
        this.paying = true
        payBill({ bizId: this.billId, amount: amount, payType: this.payForm.payType }).then(res => {
          this.confirmMock(res.data || {})
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
                this.$modal.msgSuccess('缴费成功')
                this.paying = false
                this.payForm.amount = ''
                this.load()
              }, () => { this.paying = false })
            } else {
              this.paying = false
            }
          },
          fail: () => { this.paying = false }
        })
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

  .head-card {
    padding-bottom: 10rpx;
  }

  .head-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20rpx;
  }

  .bill-month {
    margin-right: 16rpx;
    font-size: 40rpx;
    font-weight: 700;
    color: $text;
    letter-spacing: 2rpx;
  }

  .owed-box {
    padding: 24rpx;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    background: rgba(255, 107, 139, 0.1);
    border: 1rpx solid rgba(255, 107, 139, 0.32);
  }

  .owed-label {
    font-size: 24rpx;
    color: rgba(255, 179, 194, 0.8);
  }

  .owed-amount {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    margin-top: 8rpx;
  }

  .owed-amount .cny {
    font-size: 30rpx;
    color: #ffb3c2;
    margin-right: 6rpx;
  }

  .owed-amount .num {
    font-size: 60rpx;
    font-weight: 700;
    color: #ffb3c2;
    text-shadow: 0 0 20rpx rgba(255, 107, 139, 0.45);
  }

  .paid-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 24rpx;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    background: rgba(0, 255, 179, 0.08);
    border: 1rpx solid rgba(0, 255, 179, 0.3);
  }

  .paid-text {
    margin-left: 12rpx;
    font-size: 28rpx;
    color: #7dffcf;
  }

  /* 明细表 */
  .table-head,
  .table-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16rpx 0;
  }

  .table-head {
    border-bottom: 1rpx solid rgba(0, 229, 255, 0.25);
  }

  .table-row {
    border-bottom: 1rpx dashed rgba(0, 229, 255, 0.12);
  }

  .th {
    font-size: 23rpx;
    color: rgba(0, 229, 255, 0.8);
  }

  .td {
    font-size: 25rpx;
    color: rgba(230, 244, 255, 0.78);
  }

  .name {
    flex: 3;
  }

  .period {
    flex: 2.2;
  }

  .num {
    flex: 1.2;
    text-align: right;
  }

  .money,
  .th.money {
    flex: 1.6;
    text-align: right;
    color: #ffd28a;
  }

  .table-total {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 20rpx 0 6rpx 0;
  }

  .total-label {
    font-size: 25rpx;
    color: rgba(230, 244, 255, 0.6);
    margin-right: 16rpx;
  }

  .total-value {
    font-size: 30rpx;
    font-weight: 700;
    color: $cyan;
  }

  /* 缴费表单 */
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

  .unit {
    font-size: 24rpx;
    color: rgba(230, 244, 255, 0.5);
    margin-left: 10rpx;
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
</style>
