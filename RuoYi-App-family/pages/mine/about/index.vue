<template>
  <view class="about-container">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>

    <view class="header-section">
      <view class="logo-ring">
        <image class="logo-img" src="/static/logo200.png" mode="aspectFit"></image>
      </view>
      <view class="app-name">连锁养老机构管理系统</view>
      <view class="app-en">SMART · CARE · CLOUD SYSTEM</view>
    </view>

    <view class="content-section">
      <view class="menu-list about-card">
        <view class="tech-corner tl"></view>
        <view class="tech-corner br"></view>
        <view class="list-cell list-cell-arrow">
          <view class="menu-item-box">
            <view class="iconfont icon-version menu-icon"></view>
            <view>版本信息</view>
            <view class="text-right">v{{version}}</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow">
          <view class="menu-item-box">
            <view class="iconfont icon-service menu-icon"></view>
            <view>官方邮箱</view>
            <view class="text-right">ruoyi@xx.com</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow">
          <view class="menu-item-box">
            <view class="iconfont icon-share menu-icon"></view>
            <view>服务热线</view>
            <view class="text-right">400-999-9999</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow">
          <view class="menu-item-box">
            <view class="iconfont icon-community menu-icon"></view>
            <view>公司网站</view>
            <view class="text-right">
              <uni-link :href="url" :text="url" showUnderLine="false"></uni-link>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="copyright">
      <view>Copyright &copy; 2025 连锁养老机构管理平台 All Rights Reserved.</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        url: getApp().globalData.config.appInfo.site_url,
        version: getApp().globalData.config.appInfo.version
      }
    }
  }
</script>

<style lang="scss">
  page {
    background-color: #050d1f;
  }

  /* uni-link 组件内部文字浅色化 */
  .about-container .uni-link__text {
    color: rgba(230, 244, 255, 0.7) !important;
  }
</style>

<style lang="scss" scoped>
  $cyan: #00e5ff;
  $text: #e6f4ff;

  .about-container {
    position: relative;
    min-height: 100vh;
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
    opacity: 0.45;
  }

  .orb-1 {
    width: 360rpx;
    height: 360rpx;
    top: -120rpx;
    left: 50%;
    margin-left: -180rpx;
    background: radial-gradient(circle, rgba(0, 229, 255, 0.5), transparent 70%);
  }

  .header-section {
    position: relative;
    display: flex;
    padding: 70rpx 0 40rpx;
    flex-direction: column;
    align-items: center;

    .logo-ring {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      padding: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: conic-gradient(from 0deg, rgba(0, 229, 255, 0.9), rgba(43, 127, 255, 0.15), rgba(0, 229, 255, 0.9));
      box-shadow: 0 0 40rpx rgba(0, 229, 255, 0.3);

      .logo-img {
        width: 144rpx;
        height: 144rpx;
        border-radius: 50%;
        background: rgba(6, 18, 36, 0.95);
      }
    }

    .app-name {
      margin-top: 26rpx;
      font-size: 34rpx;
      font-weight: 700;
      color: $text;
      letter-spacing: 2rpx;
      text-shadow: 0 0 18rpx rgba(0, 229, 255, 0.45);
    }

    .app-en {
      margin-top: 10rpx;
      font-size: 20rpx;
      letter-spacing: 5rpx;
      color: rgba(0, 229, 255, 0.65);
    }
  }

  .content-section {
    position: relative;
  }

  .about-card {
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

    .menu-item-box view {
      color: $text;
    }
  }

  .copyright {
    position: relative;
    margin-top: 60rpx;
    text-align: center;
    line-height: 60rpx;
    font-size: 24rpx;
    color: rgba(230, 244, 255, 0.35);
  }
</style>
