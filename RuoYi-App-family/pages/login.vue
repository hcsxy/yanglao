<template>
  <view class="tech-login">
    <!-- 背景装饰：网格 -->
    <view class="bg-grid"></view>
    <!-- 背景装饰：光晕球 -->
    <view class="bg-orb orb-1"></view>
    <view class="bg-orb orb-2"></view>
    <view class="bg-orb orb-3"></view>
    <!-- 背景装饰：扫描线 -->
    <view class="bg-scanline"></view>

    <!-- 顶部标题区 -->
    <view class="header">
      <view class="logo-ring">
        <image class="logo" :src="globalConfig.appInfo.logo" mode="aspectFit"></image>
      </view>
      <text class="main-title">智慧养老家属端</text>
      <text class="sub-title">FAMILY PORTAL · SMART CARE</text>
      <view class="title-line">
        <view class="line-dot"></view>
        <view class="line-bar"></view>
        <view class="line-dot"></view>
      </view>
    </view>

    <!-- 登录卡片 -->
    <view class="login-card">
      <view class="card-corner corner-tl"></view>
      <view class="card-corner corner-tr"></view>
      <view class="card-corner corner-bl"></view>
      <view class="card-corner corner-br"></view>

      <view class="card-title">
        <text class="card-title-text">家属身份验证</text>
        <text class="card-title-en">AUTHENTICATION</text>
      </view>

      <view class="input-item">
        <view class="iconfont icon-user icon"></view>
        <input v-model="loginForm.username" class="input" type="text" placeholder="请输入账号" placeholder-class="input-placeholder" maxlength="30" />
        <view class="input-line"></view>
      </view>

      <view class="input-item">
        <view class="iconfont icon-password icon"></view>
        <input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" placeholder-class="input-placeholder" maxlength="20" />
        <view class="input-line"></view>
      </view>

      <view class="input-item code-item" v-if="captchaEnabled">
        <view class="iconfont icon-code icon"></view>
        <input v-model="loginForm.code" type="number" class="input" placeholder="请输入验证码" placeholder-class="input-placeholder" maxlength="4" />
        <view class="login-code">
          <image :src="codeUrl" @click="getCode" class="login-code-img" mode="aspectFill"></image>
        </view>
        <view class="input-line"></view>
      </view>

      <view class="action-btn">
        <button @click="handleLogin" class="login-btn">
          <text class="btn-text">登 录</text>
          <view class="btn-shine"></view>
        </button>
      </view>

      <view class="reg text-center" v-if="register">
        <text class="text-grey">没有账号？</text>
        <text @click="handleUserRegister" class="text-link">立即注册</text>
      </view>
    </view>

    <!-- 底部协议 -->
    <view class="xieyi">
      <text class="text-grey">登录即代表同意</text>
      <text @click="handleUserAgrement" class="text-link">《用户协议》</text>
      <text @click="handlePrivacy" class="text-link">《隐私协议》</text>
    </view>
  </view>
</template>

<script>
  import { getCodeImg } from '@/api/login'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        codeUrl: "",
        captchaEnabled: true,
        // 用户注册开关
        register: false,
        globalConfig: getApp().globalData.config,
        loginForm: {
          username: "admin",
          password: "admin123",
          code: "",
          uuid: ""
        }
      }
    },
    created() {
      this.getCode()
    },
    onLoad() {
      //#ifdef H5
      if (getToken()) {
        this.$tab.reLaunch('/pages/index')
      }
      //#endif
    },
    methods: {
      // 用户注册
      handleUserRegister() {
        this.$tab.redirectTo(`/pages/register`)
      },
      // 隐私协议
      handlePrivacy() {
        let site = this.globalConfig.appInfo.agreements[0]
        this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
      },
      // 用户协议
      handleUserAgrement() {
        let site = this.globalConfig.appInfo.agreements[1]
        this.$tab.navigateTo(`/pages/common/webview/index?title=${site.title}&url=${site.url}`)
      },
      // 获取图形验证码
      getCode() {
        getCodeImg().then(res => {
          this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
          if (this.captchaEnabled) {
            this.codeUrl = 'data:image/gif;base64,' + res.img
            this.loginForm.uuid = res.uuid
          }
        })
      },
      // 登录方法
      async handleLogin() {
        if (this.loginForm.username === "") {
          this.$modal.msgError("请输入账号")
        } else if (this.loginForm.password === "") {
          this.$modal.msgError("请输入密码")
        } else if (this.loginForm.code === "" && this.captchaEnabled) {
          this.$modal.msgError("请输入验证码")
        } else {
          this.$modal.loading("登录中，请耐心等待...")
          this.pwdLogin()
        }
      },
      // 密码登录
      async pwdLogin() {
        this.$store.dispatch('Login', this.loginForm).then(() => {
          this.$modal.closeLoading()
          this.loginSuccess()
        }).catch(() => {
          if (this.captchaEnabled) {
            this.getCode()
          }
        })
      },
      // 登录成功后，处理函数
      loginSuccess(result) {
        // 设置用户信息
        this.$store.dispatch('GetInfo').then(res => {
          this.$tab.reLaunch('/pages/index')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  $cyan: #00e5ff;
  $blue: #2b7fff;
  $text: #e6f4ff;

  page {
    background-color: #050d1f;
  }

  .tech-login {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    background: linear-gradient(160deg, #050d1f 0%, #0a1a35 45%, #061224 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ---------- 背景装饰 ---------- */
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
    mask-image: radial-gradient(circle at 50% 30%, #000 0%, transparent 75%);
    -webkit-mask-image: radial-gradient(circle at 50% 30%, #000 0%, transparent 75%);
  }

  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60rpx);
    opacity: 0.5;
    animation: float 8s ease-in-out infinite;
  }

  .orb-1 {
    width: 380rpx;
    height: 380rpx;
    top: -100rpx;
    left: -120rpx;
    background: radial-gradient(circle, rgba(0, 229, 255, 0.6), transparent 70%);
  }

  .orb-2 {
    width: 460rpx;
    height: 460rpx;
    top: 30%;
    right: -180rpx;
    background: radial-gradient(circle, rgba(43, 127, 255, 0.5), transparent 70%);
    animation-delay: 2s;
  }

  .orb-3 {
    width: 300rpx;
    height: 300rpx;
    bottom: -80rpx;
    left: 10%;
    background: radial-gradient(circle, rgba(0, 255, 200, 0.35), transparent 70%);
    animation-delay: 4s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-40rpx) scale(1.08); }
  }

  .bg-scanline {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2rpx;
    background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6), transparent);
    animation: scan 6s linear infinite;
  }

  @keyframes scan {
    0% { top: 0; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100vh; opacity: 0; }
  }

  /* ---------- 头部 ---------- */
  .header {
    position: relative;
    margin-top: 140rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo-ring {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14rpx;
      background: conic-gradient(from 0deg, rgba(0, 229, 255, 0.9), rgba(43, 127, 255, 0.1), rgba(0, 229, 255, 0.9));
      animation: spin 6s linear infinite;
      box-shadow: 0 0 40rpx rgba(0, 229, 255, 0.35);

      .logo {
        width: 118rpx;
        height: 118rpx;
        border-radius: 50%;
        background: rgba(6, 18, 36, 0.9);
        animation: spin-reverse 6s linear infinite;
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes spin-reverse {
      from { transform: rotate(0deg); }
      to { transform: rotate(-360deg); }
    }

    .main-title {
      margin-top: 30rpx;
      font-size: 42rpx;
      font-weight: bold;
      letter-spacing: 4rpx;
      color: $text;
      text-shadow: 0 0 20rpx rgba(0, 229, 255, 0.5);
    }

    .sub-title {
      margin-top: 12rpx;
      font-size: 22rpx;
      letter-spacing: 6rpx;
      color: rgba(0, 229, 255, 0.75);
    }

    .title-line {
      margin-top: 24rpx;
      display: flex;
      align-items: center;

      .line-bar {
        width: 260rpx;
        height: 2rpx;
        background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.8), transparent);
      }

      .line-dot {
        width: 10rpx;
        height: 10rpx;
        border-radius: 50%;
        background: $cyan;
        box-shadow: 0 0 12rpx $cyan;
      }
    }
  }

  /* ---------- 登录卡片 ---------- */
  .login-card {
    position: relative;
    width: 86%;
    margin-top: 70rpx;
    padding: 60rpx 50rpx 50rpx;
    border-radius: 24rpx;
    background: linear-gradient(150deg, rgba(20, 45, 85, 0.55), rgba(8, 20, 40, 0.65));
    border: 1rpx solid rgba(0, 229, 255, 0.25);
    backdrop-filter: blur(20rpx);
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.5), inset 0 0 40rpx rgba(0, 229, 255, 0.05);

    .card-corner {
      position: absolute;
      width: 28rpx;
      height: 28rpx;
      border-color: $cyan;
      border-style: solid;
    }

    .corner-tl { top: -2rpx; left: -2rpx; border-width: 3rpx 0 0 3rpx; border-radius: 12rpx 0 0 0; }
    .corner-tr { top: -2rpx; right: -2rpx; border-width: 3rpx 3rpx 0 0; border-radius: 0 12rpx 0 0; }
    .corner-bl { bottom: -2rpx; left: -2rpx; border-width: 0 0 3rpx 3rpx; border-radius: 0 0 0 12rpx; }
    .corner-br { bottom: -2rpx; right: -2rpx; border-width: 0 3rpx 3rpx 0; border-radius: 0 0 12rpx 0; }

    .card-title {
      display: flex;
      align-items: baseline;
      margin-bottom: 50rpx;

      .card-title-text {
        font-size: 34rpx;
        font-weight: bold;
        color: $text;
        letter-spacing: 2rpx;
      }

      .card-title-en {
        margin-left: 16rpx;
        font-size: 20rpx;
        color: rgba(0, 229, 255, 0.6);
        letter-spacing: 4rpx;
      }
    }
  }

  .input-item {
    position: relative;
    display: flex;
    align-items: center;
    height: 92rpx;
    margin-bottom: 40rpx;
    padding: 0 20rpx;
    border-radius: 14rpx;
    background: rgba(255, 255, 255, 0.04);
    border: 1rpx solid rgba(0, 229, 255, 0.12);

    .icon {
      font-size: 40rpx;
      color: rgba(0, 229, 255, 0.8);
      margin-right: 8rpx;
    }

    .input {
      flex: 1;
      height: 100%;
      font-size: 28rpx;
      color: $text;
      text-align: left;
      padding-left: 10rpx;
    }

    .input-line {
      position: absolute;
      left: 20rpx;
      bottom: 0;
      width: 0;
      height: 2rpx;
      background: linear-gradient(90deg, $cyan, $blue);
      transition: width 0.4s ease;
    }

    &:focus-within .input-line,
    .input:focus + .input-line {
      width: calc(100% - 40rpx);
    }
  }

  .input-placeholder {
    color: rgba(230, 244, 255, 0.35);
    font-size: 28rpx;
  }

  .code-item {
    .login-code {
      width: 180rpx;
      height: 64rpx;
      margin-left: 10rpx;
      border-radius: 10rpx;
      overflow: hidden;
      border: 1rpx solid rgba(0, 229, 255, 0.3);

      .login-code-img {
        width: 100%;
        height: 100%;
      }
    }
  }

  /* ---------- 登录按钮 ---------- */
  .action-btn {
    margin-top: 20rpx;
  }

  .login-btn {
    position: relative;
    width: 100%;
    height: 92rpx;
    line-height: 92rpx;
    border-radius: 46rpx;
    border: none;
    overflow: hidden;
    background: linear-gradient(90deg, #00b8d4 0%, #2b7fff 100%);
    box-shadow: 0 10rpx 30rpx rgba(0, 180, 255, 0.4), 0 0 20rpx rgba(0, 229, 255, 0.25);

    &::after {
      border: none;
    }

    .btn-text {
      position: relative;
      z-index: 2;
      font-size: 32rpx;
      font-weight: bold;
      letter-spacing: 10rpx;
      color: #ffffff;
    }

    .btn-shine {
      position: absolute;
      top: 0;
      left: -60%;
      width: 40%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.45), transparent);
      transform: skewX(-20deg);
      animation: shine 2.6s ease-in-out infinite;
    }

    @keyframes shine {
      0% { left: -60%; }
      60%, 100% { left: 130%; }
    }
  }

  .reg {
    margin-top: 28rpx;
    text-align: center;
  }

  /* ---------- 底部协议 ---------- */
  .xieyi {
    position: relative;
    margin-top: auto;
    padding: 50rpx 0 60rpx;
    font-size: 24rpx;
    text-align: center;
  }

  .text-grey {
    color: rgba(230, 244, 255, 0.45);
    font-size: 24rpx;
  }

  .text-link {
    color: $cyan;
    font-size: 24rpx;
    text-shadow: 0 0 10rpx rgba(0, 229, 255, 0.4);
  }
</style>
