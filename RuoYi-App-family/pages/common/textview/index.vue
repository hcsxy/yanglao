<template>
  <view class="textview-page">
    <view class="bg-grid"></view>
    <view class="view-card">
      <view class="card-corner tl"></view>
      <view class="card-corner br"></view>
      <view class="view-title">{{ title }}</view>
      <view class="view-divider"></view>
      <text class="view-content">{{ content }}</text>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        title: '',
        content: ''
      }
    },
    onLoad(options) {
      this.title = options.title
      this.content = options.content
      uni.setNavigationBarTitle({
        title: options.title
      })
    }
  }
</script>

<style lang="scss" scoped>
  $cyan: #00e5ff;

  page {
    background-color: #050d1f;
  }

  .textview-page {
    position: relative;
    min-height: 100vh;
    padding: 30rpx 24rpx;
    box-sizing: border-box;
    background: linear-gradient(160deg, #050d1f 0%, #0a1a35 45%, #061224 100%);
  }

  .bg-grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px);
    background-size: 60rpx 60rpx;
    mask-image: radial-gradient(circle at 50% 0%, #000 0%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at 50% 0%, #000 0%, transparent 80%);
  }

  .view-card {
    position: relative;
    border-radius: 20rpx;
    padding: 36rpx 32rpx 46rpx;
    background: linear-gradient(150deg, rgba(20, 45, 85, 0.55), rgba(8, 20, 40, 0.65));
    border: 1rpx solid rgba(0, 229, 255, 0.22);
    box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.35), inset 0 0 30rpx rgba(0, 229, 255, 0.04);

    .card-corner {
      position: absolute;
      width: 22rpx;
      height: 22rpx;
      border-color: $cyan;
      border-style: solid;

      &.tl { top: -2rpx; left: -2rpx; border-width: 3rpx 0 0 3rpx; border-radius: 10rpx 0 0 0; }
      &.br { bottom: -2rpx; right: -2rpx; border-width: 0 3rpx 3rpx 0; border-radius: 0 0 10rpx 0; }
    }
  }

  .view-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #e6f4ff;
    letter-spacing: 1rpx;
    text-shadow: 0 0 16rpx rgba(0, 229, 255, 0.4);
  }

  .view-divider {
    margin: 22rpx 0 26rpx;
    height: 2rpx;
    background: linear-gradient(90deg, rgba(0, 229, 255, 0.7), rgba(43, 127, 255, 0.2), transparent);
  }

  .view-content {
    display: block;
    font-size: 28rpx;
    color: rgba(230, 244, 255, 0.7);
    line-height: 44rpx;
  }
</style>
