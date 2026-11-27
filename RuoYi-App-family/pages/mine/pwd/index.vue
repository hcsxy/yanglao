<template>
  <view class="pwd-page">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>

    <view class="form-card">
      <view class="card-corner tl"></view>
      <view class="card-corner tr"></view>
      <view class="card-corner bl"></view>
      <view class="card-corner br"></view>

      <view class="card-title">
        <view class="title-icon">
          <view class="iconfont icon-password"></view>
        </view>
        <view class="title-text-wrap">
          <text class="card-title-text">修改密码</text>
          <text class="card-title-en">CHANGE PASSWORD</text>
        </view>
      </view>

      <view class="form-body">
        <uni-forms ref="form" :value="user" labelWidth="80px">
          <uni-forms-item name="oldPassword" label="旧密码">
            <uni-easyinput type="password" v-model="user.oldPassword" placeholder="请输入旧密码" placeholderStyle="color:rgba(230,244,255,.35)" />
          </uni-forms-item>
          <uni-forms-item name="newPassword" label="新密码">
            <uni-easyinput type="password" v-model="user.newPassword" placeholder="请输入新密码" placeholderStyle="color:rgba(230,244,255,.35)" />
          </uni-forms-item>
          <uni-forms-item name="confirmPassword" label="确认密码">
            <uni-easyinput type="password" v-model="user.confirmPassword" placeholder="请确认新密码" placeholderStyle="color:rgba(230,244,255,.35)" />
          </uni-forms-item>
        </uni-forms>
      </view>

      <button class="tech-btn submit-btn" @click="submit">提 交</button>

      <view class="pwd-tip">
        <text class="tip-text">密码长度需为 6 - 20 个字符，建议定期更换以保障账号安全</text>
      </view>
    </view>
  </view>
</template>

<script>
  import { updateUserPwd } from "@/api/system/user"

  export default {
    data() {
      return {
        user: {
          oldPassword: undefined,
          newPassword: undefined,
          confirmPassword: undefined
        },
        rules: {
          oldPassword: {
            rules: [{
              required: true,
              errorMessage: '旧密码不能为空'
            }]
          },
          newPassword: {
            rules: [{
                required: true,
                errorMessage: '新密码不能为空',
              },
              {
                minLength: 6,
                maxLength: 20,
                errorMessage: '长度在 6 到 20 个字符'
              }
            ]
          },
          confirmPassword: {
            rules: [{
                required: true,
                errorMessage: '确认密码不能为空'
              }, {
                validateFunction: (rule, value, data) => data.newPassword === value,
                errorMessage: '两次输入的密码不一致'
              }
            ]
          }
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      submit() {
        this.$refs.form.validate().then(res => {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(response => {
            this.$modal.msgSuccess("修改成功")
          })
        })
      }
    }
  }
</script>

<!-- 页面级深色主题：覆盖 uni-forms / uni-easyinput 内置浅色样式 -->
<style lang="scss">
  page {
    background-color: #050d1f;
  }

  .pwd-page {
    .uni-forms-item__label .label-text {
      color: rgba(230, 244, 255, 0.65) !important;
    }

    .uni-forms-item__content {
      background-color: transparent !important;
    }

    .uni-easyinput__content {
      background-color: rgba(255, 255, 255, 0.05) !important;
      border-color: rgba(0, 229, 255, 0.2) !important;
      border-radius: 12rpx !important;
    }

    .uni-easyinput__content-input {
      color: #e6f4ff !important;
    }
  }
</style>

<style lang="scss" scoped>
  $cyan: #00e5ff;
  $text: #e6f4ff;

  .pwd-page {
    position: relative;
    min-height: 100vh;
    padding: 40rpx 24rpx 60rpx 24rpx;
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

  .form-card {
    position: relative;
    border-radius: 20rpx;
    padding: 40rpx 30rpx 50rpx 30rpx;
    background: linear-gradient(150deg, rgba(20, 45, 85, 0.55), rgba(8, 20, 40, 0.65));
    border: 1rpx solid rgba(0, 229, 255, 0.22);
    backdrop-filter: blur(20rpx);
    box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.35), inset 0 0 30rpx rgba(0, 229, 255, 0.04);

    .card-corner {
      position: absolute;
      width: 22rpx;
      height: 22rpx;
      border-color: $cyan;
      border-style: solid;

      &.tl { top: -2rpx; left: -2rpx; border-width: 3rpx 0 0 3rpx; border-radius: 10rpx 0 0 0; }
      &.tr { top: -2rpx; right: -2rpx; border-width: 3rpx 3rpx 0 0; border-radius: 0 10rpx 0 0; }
      &.bl { bottom: -2rpx; left: -2rpx; border-width: 0 0 3rpx 3rpx; border-radius: 0 0 0 10rpx; }
      &.br { bottom: -2rpx; right: -2rpx; border-width: 0 3rpx 3rpx 0; border-radius: 0 0 10rpx 0; }
    }

    .card-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 40rpx;

      .title-icon {
        width: 76rpx;
        height: 76rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx;
        background: rgba(0, 229, 255, 0.08);
        border: 1rpx solid rgba(0, 229, 255, 0.3);

        .iconfont {
          font-size: 40rpx;
          color: $cyan;
          text-shadow: 0 0 14rpx rgba(0, 229, 255, 0.6);
        }
      }

      .card-title-text {
        display: block;
        font-size: 34rpx;
        font-weight: 700;
        color: $text;
        letter-spacing: 2rpx;
        text-shadow: 0 0 16rpx rgba(0, 229, 255, 0.4);
      }

      .card-title-en {
        display: block;
        margin-top: 6rpx;
        font-size: 20rpx;
        letter-spacing: 4rpx;
        color: rgba(0, 229, 255, 0.6);
      }
    }
  }

  .submit-btn {
    margin-top: 30rpx;
    background: linear-gradient(90deg, #00b8d4 0%, #2b7fff 100%);
  }

  .pwd-tip {
    margin-top: 26rpx;
    text-align: center;

    .tip-text {
      font-size: 22rpx;
      color: rgba(230, 244, 255, 0.4);
      line-height: 1.6;
    }
  }
</style>
