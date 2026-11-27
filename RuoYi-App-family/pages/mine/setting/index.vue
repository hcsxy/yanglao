<template>
  <view class="setting-container" :style="{height: `${windowHeight}px`}">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>

    <!-- 常规设置 -->
    <view class="section-title">
      <text class="bar"></text>
      <text class="title">常规设置</text>
      <text class="en">GENERAL</text>
    </view>
    <view class="menu-list setting-card">
      <view class="tech-corner tl"></view>
      <view class="tech-corner br"></view>
      <view class="list-cell list-cell-arrow" @click="handleToPwd">
        <view class="menu-item-box">
          <view class="iconfont icon-password menu-icon"></view>
          <view>修改密码</view>
        </view>
      </view>
      <view class="list-cell list-cell-arrow" @click="handleToUpgrade">
        <view class="menu-item-box">
          <view class="iconfont icon-refresh menu-icon"></view>
          <view>检查更新</view>
        </view>
      </view>
      <view class="list-cell list-cell-arrow" @click="handleCleanTmp">
        <view class="menu-item-box">
          <view class="iconfont icon-clean menu-icon"></view>
          <view>清理缓存</view>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" @click="handleLogout">
      <view class="iconfont icon-logout logout-icon"></view>
      <text class="logout-text">退出登录</text>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        windowHeight: uni.getSystemInfoSync().windowHeight
      }
    },
    methods: {
      handleToPwd() {
        this.$tab.navigateTo('/pages/mine/pwd/index')
      },
      handleToUpgrade() {
        this.$modal.showToast('模块建设中~')
      },
      handleCleanTmp() {
        this.$modal.showToast('模块建设中~')
      },
      handleLogout() {
        this.$modal.confirm('确定注销并退出系统吗？').then(() => {
          this.$store.dispatch('LogOut').then(() => {}).finally(()=>{
            this.$tab.reLaunch('/pages/index')
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  $cyan: #00e5ff;
  $text: #e6f4ff;

  page {
    background-color: #050d1f;
  }

  .setting-container {
    position: relative;
    width: 100%;
    padding-top: 20rpx;
    box-sizing: border-box;
    background: linear-gradient(160deg, #050d1f 0%, #0a1a35 45%, #061224 100%);
    overflow: hidden;
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
    mask-image: radial-gradient(circle at 50% 0%, #000 0%, transparent 75%);
    -webkit-mask-image: radial-gradient(circle at 50% 0%, #000 0%, transparent 75%);
  }

  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60rpx);
    opacity: 0.4;
  }

  .orb-1 {
    width: 340rpx;
    height: 340rpx;
    top: -100rpx;
    right: -120rpx;
    background: radial-gradient(circle, rgba(0, 229, 255, 0.5), transparent 70%);
  }

  .section-title {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 30rpx 30rpx 10rpx 30rpx;

    .bar {
      width: 8rpx;
      height: 30rpx;
      border-radius: 4rpx;
      margin-right: 14rpx;
      background: linear-gradient(180deg, $cyan, #2b7fff);
      box-shadow: 0 0 12rpx rgba(0, 229, 255, 0.6);
    }

    .title {
      font-size: 30rpx;
      font-weight: 600;
      color: $text;
      letter-spacing: 2rpx;
    }

    .en {
      margin-left: 14rpx;
      font-size: 20rpx;
      letter-spacing: 3rpx;
      color: rgba(0, 229, 255, 0.55);
    }
  }

  .setting-card {
    position: relative;
    border-radius: 20rpx;
    overflow: hidden;
    background: linear-gradient(150deg, rgba(20, 45, 85, 0.55), rgba(8, 20, 40, 0.65));
    border: 1rpx solid rgba(0, 229, 255, 0.22);
    box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.35), inset 0 0 30rpx rgba(0, 229, 255, 0.04);
    font-size: 28rpx;

    .list-cell {
      background-color: transparent;
      border-radius: 0 !important;
    }

    .tech-corner {
      position: absolute;
      width: 22rpx;
      height: 22rpx;
      border-color: $cyan;
      border-style: solid;
      z-index: 2;

      &.tl { top: -2rpx; left: -2rpx; border-width: 3rpx 0 0 3rpx; border-radius: 10rpx 0 0 0; }
      &.br { bottom: -2rpx; right: -2rpx; border-width: 0 3rpx 3rpx 0; border-radius: 0 0 10rpx 0; }
    }
  }

  .logout-btn {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 60rpx 30rpx 0 30rpx;
    height: 88rpx;
    border-radius: 44rpx;
    background: rgba(255, 77, 79, 0.08);
    border: 1rpx solid rgba(255, 77, 79, 0.45);
    box-shadow: 0 0 20rpx rgba(255, 77, 79, 0.15);

    .logout-icon {
      font-size: 32rpx;
      color: #ff6b6b;
      margin-right: 12rpx;
    }

    .logout-text {
      font-size: 30rpx;
      font-weight: 600;
      letter-spacing: 4rpx;
      color: #ff8a8a;
    }
  }
</style>
