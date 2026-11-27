<template>
  <view class="fam-page">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>
    <view class="bg-orb orb-2"></view>

    <view class="fam-header small">
      <view class="brand-row">
        <text class="brand-name">账户与流水</text>
        <text class="brand-sub">ACCOUNT</text>
      </view>
      <view class="hello-row">
        <text class="hello-text">{{ elder ? elder.name + ' · ' + (elder.campusName || '--') : '未绑定老人' }}</text>
      </view>
      <view class="header-line"></view>
    </view>

    <view v-if="!elder" class="empty">
      <view>当前账号未绑定在院老人</view>
      <view class="empty-sub">请联系院区管理员开通「家属授权」</view>
    </view>

    <view v-else-if="elder.viewBill !== '1'" class="empty">院方未开放费用账户的家属查看权限</view>

    <block v-else>
      <view v-if="!account.exists" class="empty">该老人尚未开设资金账户</view>

      <block v-else>
        <view class="tech-card panel head-card">
          <view class="tech-corner tl"></view>
          <view class="tech-corner br"></view>
          <view class="acc-label">可用余额（元）</view>
          <view class="acc-balance"><text class="cny">￥</text><text class="num">{{ money(account.balance) }}</text></view>
          <view class="acc-cells">
            <view class="cell">
              <text class="cell-value">{{ money(account.deposit) }}</text>
              <text class="cell-label">押金</text>
            </view>
            <view class="cell">
              <text class="cell-value">{{ money(account.freezeAmount) }}</text>
              <text class="cell-label">冻结金额</text>
            </view>
            <view class="cell">
              <text class="cell-value">{{ account.status === '1' ? '已停用' : '正常' }}</text>
              <text class="cell-label">账户状态</text>
            </view>
          </view>
        </view>

        <view class="tech-card panel">
          <view class="panel-title">
            <text class="title-bar"></text>
            <text class="title-text">资金流水</text>
            <text class="title-en">FLOW</text>
            <text class="title-extra">最近 {{ flows.length }} 笔</text>
          </view>
          <view class="list-item" v-for="(item, index) in flows" :key="index">
            <view class="item-head">
              <view class="head-left">
                <text class="item-title">{{ flowTypeText(item.flowType) }}</text>
                <text class="tag tag-gray">{{ payWayText(item.payWay) }}</text>
              </view>
              <text class="flow-amount" :class="item.direction === '1' ? 'in' : 'out'">
                {{ item.direction === '1' ? '+' : '-' }}{{ money(item.amount) }}
              </text>
            </view>
            <view class="item-body">
              <view class="line">{{ fmtDateTime(item.createTime) }}　余额 {{ money(item.afterBalance) }} 元</view>
              <view class="line muted" v-if="item.remark">{{ item.remark }}</view>
            </view>
          </view>
          <view class="empty" v-if="!flows.length">暂无流水记录</view>
        </view>

        <view class="tip-card">
          <view class="tip-content">流水由系统按业务动作自动生成（充值、押金、账单扣费、消费扣费、退费、押金退还、结息），如与院区收费处台账不一致，请联系院区核对。</view>
        </view>
      </block>

      <view class="footer-note">资金账户由院区统一管理，家属端仅可查看</view>
    </block>
  </view>
</template>

<script>
  import { getAccount } from '@/api/family/portal'
  import { loadCurrentElder, fmtDateTime, money, FLOW_TYPE, PAY_WAY } from '@/utils/family'

  export default {
    data() {
      return {
        elder: null,
        account: {},
        flows: []
      }
    },
    onShow() {
      this.load()
    },
    onPullDownRefresh() {
      this.load(true).then(() => uni.stopPullDownRefresh())
    },
    methods: {
      fmtDateTime,
      money,
      load(force) {
        return loadCurrentElder(force).then(elder => {
          this.elder = elder
          if (!elder || elder.viewBill !== '1') return
          return getAccount(elder.elderId).then(res => {
            this.account = res.data || {}
            this.flows = this.account.flows || []
          })
        })
      },
      flowTypeText(v) {
        return FLOW_TYPE[v] || '资金变动'
      },
      payWayText(v) {
        return PAY_WAY[v] || (v || '系统')
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

  .empty-sub {
    margin-top: 12rpx;
    font-size: 24rpx;
    color: rgba(230, 244, 255, 0.3);
  }

  .head-card {
    padding: 34rpx 30rpx 20rpx 30rpx;
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
    margin-top: 10rpx;
  }

  .acc-balance .cny {
    font-size: 30rpx;
    color: $cyan;
    margin-right: 8rpx;
  }

  .acc-balance .num {
    font-size: 66rpx;
    font-weight: 700;
    color: $cyan;
    text-shadow: 0 0 22rpx rgba(0, 229, 255, 0.5);
  }

  .acc-cells {
    display: flex;
    flex-direction: row;
    margin-top: 26rpx;
    padding-top: 20rpx;
    border-top: 1rpx dashed rgba(0, 229, 255, 0.16);
  }

  .cell {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cell-value {
    font-size: 30rpx;
    color: $text;
  }

  .cell-label {
    margin-top: 8rpx;
    font-size: 22rpx;
    color: rgba(230, 244, 255, 0.5);
  }

  .head-left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .head-left .item-title {
    margin-right: 14rpx;
  }

  .flow-amount {
    font-size: 30rpx;
    font-weight: 600;
  }

  .flow-amount.in {
    color: #7dffcf;
  }

  .flow-amount.out {
    color: #ffb3c2;
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
