<template>
  <view class="help-container">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>

    <view class="help-header">
      <text class="help-title">常见问题</text>
      <text class="help-sub">FAQ CENTER</text>
    </view>

    <view v-for="(item, findex) in list" :key="findex" :title="item.title" class="list-title">
      <view class="text-title">
        <view class="title-icon-box">
          <view :class="item.icon"></view>
        </view>
        <text class="title-text">{{ item.title }}</text>
      </view>
      <view class="childList">
        <view v-for="(child, zindex) in item.childList" :key="zindex" class="question" hover-class="hover"
          @click="handleText(child)">
          <view class="text-item">{{ child.title }}</view>
          <view class="q-arrow iconfont icon-right"></view>
          <view class="line" v-if="zindex !== item.childList.length - 1"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        list: [{
            icon: 'iconfont icon-github',
            title: '系统问题',
            childList: [{
              title: '移动端支持哪些平台？',
              content: '支持 H5、微信小程序、Android / iOS App'
            }, {
              title: '数据从哪里来？',
              content: '全部对接连锁养老机构管理平台后端服务'
            }, {
              title: '忘记密码怎么办？',
              content: '可联系机构管理员在管理后台重置密码'
            }, {
              title: '如何联系技术支持？',
              content: '可通过「我的 - 在线客服」反馈'
            }]
          },
          {
            icon: 'iconfont icon-help',
            title: '其他问题',
            childList: [{
              title: '如何退出登录？',
              content: '请点击[我的] - [应用设置] - [退出登录]即可退出登录',
            }, {
              title: '如何修改用户头像？',
              content: '请点击[我的] - [选择头像] - [点击提交]即可更换用户头像',
            }, {
              title: '如何修改登录密码？',
              content: '请点击[我的] - [应用设置] - [修改密码]即可修改登录密码',
            }]
          }
        ]
      }
    },
    methods: {
      handleText(item) {
        this.$tab.navigateTo(`/pages/common/textview/index?title=${item.title}&content=${item.content}`)
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

  .help-container {
    position: relative;
    min-height: 100vh;
    box-sizing: border-box;
    margin-bottom: 100rpx;
    padding: 30rpx;
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

  .help-header {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    margin-bottom: 40rpx;

    .help-title {
      font-size: 40rpx;
      font-weight: 700;
      color: $text;
      letter-spacing: 2rpx;
      text-shadow: 0 0 18rpx rgba(0, 229, 255, 0.45);
    }

    .help-sub {
      margin-left: 18rpx;
      font-size: 20rpx;
      letter-spacing: 4rpx;
      color: rgba(0, 229, 255, 0.6);
    }
  }

  .list-title {
    position: relative;
    margin-bottom: 40rpx;
  }

  .text-title {
    display: flex;
    flex-direction: row;
    align-items: center;

    .title-icon-box {
      width: 56rpx;
      height: 56rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16rpx;
      background: rgba(0, 229, 255, 0.08);
      border: 1rpx solid rgba(0, 229, 255, 0.3);

      .iconfont {
        font-size: 30rpx;
        color: $cyan;
        text-shadow: 0 0 12rpx rgba(0, 229, 255, 0.5);
      }
    }

    .title-text {
      font-size: 30rpx;
      font-weight: 600;
      color: $text;
      letter-spacing: 1rpx;
    }
  }

  .childList {
    position: relative;
    background: linear-gradient(150deg, rgba(20, 45, 85, 0.55), rgba(8, 20, 40, 0.65));
    border: 1rpx solid rgba(0, 229, 255, 0.2);
    border-radius: 16rpx;
    margin-top: 18rpx;
    box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.3), inset 0 0 30rpx rgba(0, 229, 255, 0.04);
  }

  .question {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4rpx 24rpx;
  }

  .text-item {
    flex: 1;
    font-size: 28rpx;
    color: rgba(230, 244, 255, 0.8);
    padding: 26rpx 0;
  }

  .q-arrow {
    font-size: 24rpx;
    color: rgba(0, 229, 255, 0.6);
  }

  .line {
    position: absolute;
    left: 24rpx;
    right: 24rpx;
    bottom: 0;
    height: 1rpx;
    background: rgba(0, 229, 255, 0.1);
  }

  .hover {
    background: rgba(0, 229, 255, 0.06);
  }
</style>
