<template>
  <view class="edit-page">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>

    <view class="form-card">
      <view class="card-corner tl"></view>
      <view class="card-corner tr"></view>
      <view class="card-corner bl"></view>
      <view class="card-corner br"></view>

      <view class="card-title">
        <text class="card-title-text">编辑资料</text>
        <text class="card-title-en">PROFILE EDIT</text>
      </view>

      <view class="form-body">
        <uni-forms ref="form" :model="user" labelWidth="80px">
          <uni-forms-item label="用户昵称" name="nickName">
            <uni-easyinput v-model="user.nickName" placeholder="请输入昵称" placeholderStyle="color:rgba(230,244,255,.35)" />
          </uni-forms-item>
          <uni-forms-item label="手机号码" name="phonenumber">
            <uni-easyinput v-model="user.phonenumber" placeholder="请输入手机号码" placeholderStyle="color:rgba(230,244,255,.35)" />
          </uni-forms-item>
          <uni-forms-item label="邮箱" name="email">
            <uni-easyinput v-model="user.email" placeholder="请输入邮箱" placeholderStyle="color:rgba(230,244,255,.35)" />
          </uni-forms-item>
          <uni-forms-item label="性别" name="sex" required>
            <uni-data-checkbox v-model="user.sex" :localdata="sexs" />
          </uni-forms-item>
        </uni-forms>
      </view>

      <button class="tech-btn submit-btn" @click="submit">保 存</button>
    </view>
  </view>
</template>

<script>
  import { getUserProfile } from "@/api/system/user"
  import { updateUserProfile } from "@/api/system/user"

  export default {
    data() {
      return {
        user: {
          nickName: "",
          phonenumber: "",
          email: "",
          sex: ""
        },
        sexs: [{
          text: '男',
          value: "0"
        }, {
          text: '女',
          value: "1"
        }],
        rules: {
          nickName: {
            rules: [{
              required: true,
              errorMessage: '用户昵称不能为空'
            }]
          },
          phonenumber: {
            rules: [{
              required: true,
              errorMessage: '手机号码不能为空'
            }, {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              errorMessage: '请输入正确的手机号码'
            }]
          },
          email: {
            rules: [{
              required: true,
              errorMessage: '邮箱地址不能为空'
            }, {
              format: 'email',
              errorMessage: '请输入正确的邮箱地址'
            }]
          }
        }
      }
    },
    onLoad() {
      this.getUser()
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      getUser() {
        getUserProfile().then(response => {
          this.user = response.data
        })
      },
      submit(ref) {
        this.$refs.form.validate().then(res => {
          updateUserProfile(this.user).then(response => {
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

  .edit-page {
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

    .uni-easyinput__content.is-focused {
      border-color: rgba(0, 229, 255, 0.6) !important;
      box-shadow: 0 0 16rpx rgba(0, 229, 255, 0.2);
    }

    .uni-data-checklist .checklist-box {
      color: rgba(230, 244, 255, 0.75) !important;
    }

    .uni-data-checklist .checklist-content .checklist-text {
      color: rgba(230, 244, 255, 0.75);
    }
  }
</style>

<style lang="scss" scoped>
  $cyan: #00e5ff;
  $blue: #2b7fff;
  $text: #e6f4ff;

  .edit-page {
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
      align-items: baseline;
      margin-bottom: 30rpx;

      .card-title-text {
        font-size: 34rpx;
        font-weight: 700;
        color: $text;
        letter-spacing: 2rpx;
        text-shadow: 0 0 16rpx rgba(0, 229, 255, 0.4);
      }

      .card-title-en {
        margin-left: 16rpx;
        font-size: 20rpx;
        letter-spacing: 4rpx;
        color: rgba(0, 229, 255, 0.6);
      }
    }

    .form-body {
      position: relative;
    }
  }

  .submit-btn {
    margin-top: 40rpx;
    background: linear-gradient(90deg, #00b8d4 0%, #2b7fff 100%);
  }
</style>
