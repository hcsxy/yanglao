<template>
  <view class="info-page">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>

    <!-- 用户概览 -->
    <view class="user-brief">
      <view class="brief-avatar">
        <image v-if="user.avatar" :src="user.avatar" class="brief-avatar-img" mode="aspectFill"></image>
        <view v-else class="brief-avatar-icon">
          <view class="iconfont icon-people"></view>
        </view>
      </view>
      <view class="brief-meta">
        <view class="brief-name">{{ user.nickName }}</view>
        <view class="brief-tags">
          <text class="brief-tag">{{ roleGroup || '未分配角色' }}</text>
          <text class="brief-tag tag-line">{{ postGroup || '未分配岗位' }}</text>
        </view>
      </view>
    </view>

    <!-- 信息列表 -->
    <view class="info-card">
      <view class="card-corner tl"></view>
      <view class="card-corner br"></view>
      <view class="info-row">
        <uni-icons class="row-icon" type="person-filled" size="18" color="#00e5ff"></uni-icons>
        <text class="row-label">昵称</text>
        <text class="row-value">{{ user.nickName }}</text>
      </view>
      <view class="info-row">
        <uni-icons class="row-icon" type="phone-filled" size="18" color="#00e5ff"></uni-icons>
        <text class="row-label">手机号码</text>
        <text class="row-value">{{ user.phonenumber }}</text>
      </view>
      <view class="info-row">
        <uni-icons class="row-icon" type="email-filled" size="18" color="#00e5ff"></uni-icons>
        <text class="row-label">邮箱</text>
        <text class="row-value">{{ user.email }}</text>
      </view>
      <view class="info-row">
        <uni-icons class="row-icon" type="staff-filled" size="18" color="#00e5ff"></uni-icons>
        <text class="row-label">岗位</text>
        <text class="row-value">{{ postGroup }}</text>
      </view>
      <view class="info-row">
        <uni-icons class="row-icon" type="auth-filled" size="18" color="#00e5ff"></uni-icons>
        <text class="row-label">角色</text>
        <text class="row-value">{{ roleGroup }}</text>
      </view>
      <view class="info-row">
        <uni-icons class="row-icon" type="calendar-filled" size="18" color="#00e5ff"></uni-icons>
        <text class="row-label">创建日期</text>
        <text class="row-value">{{ user.createTime }}</text>
      </view>
    </view>
  </view>
</template>

<script>
  import { getUserProfile } from "@/api/system/user"

  export default {
    data() {
      return {
        user: {},
        roleGroup: "",
        postGroup: ""
      }
    },
    onLoad() {
      this.getUser()
    },
    methods: {
      getUser() {
        getUserProfile().then(response => {
          this.user = response.data
          this.roleGroup = response.roleGroup
          this.postGroup = response.postGroup
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

  .info-page {
    position: relative;
    min-height: 100vh;
    padding: 30rpx 24rpx 60rpx 24rpx;
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

  /* ---------- 用户概览 ---------- */
  .user-brief {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 36rpx 30rpx;
    margin-bottom: 30rpx;
    border-radius: 20rpx;
    background: linear-gradient(135deg, rgba(0, 120, 170, 0.5), rgba(43, 127, 255, 0.3));
    border: 1rpx solid rgba(0, 229, 255, 0.35);
    box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.35), 0 0 24rpx rgba(0, 229, 255, 0.1);

    .brief-avatar {
      width: 110rpx;
      height: 110rpx;
      border-radius: 50%;
      padding: 4rpx;
      background: conic-gradient(from 0deg, rgba(0, 229, 255, 0.9), rgba(43, 127, 255, 0.2), rgba(0, 229, 255, 0.9));
      display: flex;
      align-items: center;
      justify-content: center;

      .brief-avatar-img {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
        background: #0a1a35;
      }

      .brief-avatar-icon {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
        background: #0a1a35;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48rpx;
        color: rgba(0, 229, 255, 0.85);
      }
    }

    .brief-meta {
      margin-left: 26rpx;

      .brief-name {
        font-size: 34rpx;
        font-weight: 600;
        color: $text;
        text-shadow: 0 0 16rpx rgba(0, 229, 255, 0.4);
      }

      .brief-tags {
        display: flex;
        flex-direction: row;
        margin-top: 14rpx;

        .brief-tag {
          font-size: 20rpx;
          letter-spacing: 1rpx;
          color: rgba(0, 229, 255, 0.85);
          border: 1rpx solid rgba(0, 229, 255, 0.4);
          border-radius: 6rpx;
          padding: 3rpx 12rpx;
          margin-right: 14rpx;
        }

        .tag-line {
          color: rgba(230, 244, 255, 0.6);
          border-color: rgba(230, 244, 255, 0.25);
        }
      }
    }
  }

  /* ---------- 信息卡片 ---------- */
  .info-card {
    position: relative;
    border-radius: 20rpx;
    padding: 10rpx 0;
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

    .info-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 28rpx 30rpx;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 30rpx;
        right: 30rpx;
        bottom: 0;
        height: 1rpx;
        background: rgba(0, 229, 255, 0.1);
      }

      &:last-child::after {
        display: none;
      }

      .row-icon {
        color: rgba(0, 229, 255, 0.85);
        text-shadow: 0 0 12rpx rgba(0, 229, 255, 0.4);
        margin-right: 18rpx;
      }

      .row-label {
        font-size: 28rpx;
        color: rgba(230, 244, 255, 0.55);
      }

      .row-value {
        flex: 1;
        text-align: right;
        font-size: 28rpx;
        color: $text;
        margin-left: 20rpx;
        word-break: break-all;
      }
    }
  }
</style>
