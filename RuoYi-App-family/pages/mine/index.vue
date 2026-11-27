<template>
  <view class="mine-container" :style="{ height: windowHeight + 'px' }">
    <view class="bg-grid"></view>
    <view class="bg-orb orb-1"></view>
    <view class="bg-orb orb-2"></view>

    <!-- 顶部家属信息 -->
    <view class="header-section">
      <view class="header-inner">
        <view class="avatar-wrap">
          <view class="avatar-ring">
            <view v-if="!avatar" class="avatar-placeholder">
              <view class="iconfont icon-people icon"></view>
            </view>
            <image v-if="avatar" :src="avatar" class="avatar-img" mode="aspectFill"></image>
          </view>
          <view class="online-dot"></view>
        </view>
        <view class="user-meta">
          <view class="u_name">{{ displayName }}</view>
          <view class="u_role">
            <text class="role-tag">FAMILY</text>
            <text class="role-line"></text>
            <text class="role-text">家属端 · 已授权 {{ elders.length }} 位老人</text>
          </view>
        </view>
      </view>
      <view class="header-glow-line"></view>
    </view>

    <view class="content-section">
      <!-- 我的老人 -->
      <view class="tech-card elder-panel">
        <view class="tech-corner tl"></view>
        <view class="tech-corner br"></view>
        <view class="panel-title">
          <text class="title-bar"></text>
          <text class="title-text">我的老人</text>
          <text class="title-en">MY ELDERS</text>
          <text class="title-extra" @click="goSelect">切换 ></text>
        </view>
        <view class="elder-item" v-for="(item, index) in elders" :key="index" @click="goElder(item)">
          <view class="elder-avatar">
            <text class="avatar-char">{{ item.name ? item.name.substring(0, 1) : '—' }}</text>
          </view>
          <view class="elder-main">
            <view class="elder-name-row">
              <text class="elder-name">{{ item.name }}</text>
              <text class="tag tag-cyan">{{ item.relation }}</text>
              <text class="tag" :class="item.status === '1' ? 'tag-green' : 'tag-gray'">{{ liveText(item.status) }}</text>
            </view>
            <view class="elder-sub">{{ item.campusName || '--' }} · {{ item.bedLabel || '未分配床位' }}</view>
            <view class="elder-scope">
              <text class="scope" :class="{ dim: item.viewHealth !== '1' }">健康</text>
              <text class="scope" :class="{ dim: item.viewNursing !== '1' }">护理</text>
              <text class="scope" :class="{ dim: item.viewBill !== '1' }">费用</text>
              <text class="scope" :class="{ dim: item.viewVisit !== '1' }">探视</text>
            </view>
          </view>
          <view class="elder-owed" v-if="item.viewBill === '1' && Number(item.owedAmount) > 0">
            <text class="owed-num">{{ money(item.owedAmount) }}</text>
            <text class="owed-label">待缴(元)</text>
          </view>
        </view>
        <view class="empty" v-if="!elders.length">当前账号未绑定在院老人</view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-list tech-card">
        <view class="tech-corner tl"></view>
        <view class="tech-corner br"></view>
        <view class="list-cell list-cell-arrow" @click="goAuth">
          <view class="menu-item-box">
            <view class="iconfont icon-auth menu-icon"></view>
            <view>查看授权范围</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleToInfo">
          <view class="menu-item-box">
            <view class="iconfont icon-user menu-icon"></view>
            <view>个人信息</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleToPwd">
          <view class="menu-item-box">
            <view class="iconfont icon-password menu-icon"></view>
            <view>修改密码</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleHelp">
          <view class="menu-item-box">
            <view class="iconfont icon-help menu-icon"></view>
            <view>常见问题</view>
          </view>
        </view>
        <view class="list-cell list-cell-arrow" @click="handleAbout">
          <view class="menu-item-box">
            <view class="iconfont icon-aixin menu-icon"></view>
            <view>关于我们</view>
          </view>
        </view>
      </view>

      <view class="logout-btn" @click="doLogout">退出登录</view>
      <view class="footer-note">家属端 · 数据可见范围由院区管理员授权</view>
    </view>
  </view>
</template>

<script>
  import { loadElderList, setCurrentElder, clearElderCache, money, LIVE_STATUS } from '@/utils/family'

  export default {
    data() {
      return {
        elders: [],
        currentId: ''
      }
    },
    computed: {
      name() {
        return this.$store.getters.name
      },
      displayName() {
        return this.$store.getters.nickName || this.$store.getters.name || '家属'
      },
      avatar() {
        return this.$store.getters.avatar
      },
      windowHeight() {
        return uni.getSystemInfoSync().windowHeight - 50
      }
    },
    onShow() {
      this.load()
    },
    methods: {
      money,
      load() {
        return loadElderList().then(list => {
          this.elders = list || []
          this.currentId = ''
        })
      },
      liveText(status) {
        return LIVE_STATUS[status] || '--'
      },
      goSelect() {
        this.$tab.navigateTo('/pages/family/elder/select')
      },
      goElder(item) {
        setCurrentElder(item.elderId)
        this.$tab.switchTab('/pages/index')
      },
      goAuth() {
        if (!this.elders.length) {
          this.$modal.msg('当前账号未绑定在院老人')
          return
        }
        const cur = this.elders[0]
        this.$tab.navigateTo('/pages/mine/auth/index?elderId=' + cur.elderId)
      },
      handleToInfo() {
        this.$tab.navigateTo('/pages/mine/info/index')
      },
      handleToPwd() {
        this.$tab.navigateTo('/pages/mine/pwd/index')
      },
      handleHelp() {
        this.$tab.navigateTo('/pages/mine/help/index')
      },
      handleAbout() {
        this.$tab.navigateTo('/pages/mine/about/index')
      },
      doLogout() {
        this.$modal.confirm('确认退出当前家属账号？', '系统提示').then(() => {
          clearElderCache()
          this.$store.dispatch('LogOut').then(() => {
            this.$tab.reLaunch('/pages/login')
          })
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

  .mine-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(160deg, #050d1f 0%, #0a1a35 45%, #061224 100%);
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
    mask-image: radial-gradient(circle at 50% 0%, #000 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(circle at 50% 0%, #000 0%, transparent 70%);
  }

  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60rpx);
    opacity: 0.45;
    animation: float 8s ease-in-out infinite;
  }

  .orb-1 {
    width: 360rpx;
    height: 360rpx;
    top: -120rpx;
    right: -100rpx;
    background: radial-gradient(circle, rgba(0, 229, 255, 0.55), transparent 70%);
  }

  .orb-2 {
    width: 300rpx;
    height: 300rpx;
    top: 180rpx;
    left: -140rpx;
    background: radial-gradient(circle, rgba(43, 127, 255, 0.5), transparent 70%);
    animation-delay: 3s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30rpx) scale(1.06); }
  }

  /* ---------- 头部 ---------- */
  .header-section {
    position: relative;
    padding: 60rpx 40rpx 40rpx 40rpx;

    .header-inner {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .avatar-wrap {
      position: relative;
      width: 130rpx;
      height: 130rpx;

      .avatar-ring {
        width: 130rpx;
        height: 130rpx;
        border-radius: 50%;
        padding: 6rpx;
        background: conic-gradient(from 0deg, rgba(0, 229, 255, 0.9), rgba(43, 127, 255, 0.15), rgba(0, 229, 255, 0.9));
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 30rpx rgba(0, 229, 255, 0.35);
      }

      .avatar-img {
        width: 114rpx;
        height: 114rpx;
        border-radius: 50%;
        background: #0a1a35;
      }

      .avatar-placeholder {
        width: 114rpx;
        height: 114rpx;
        border-radius: 50%;
        background: rgba(10, 26, 53, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
          font-size: 56rpx;
          color: rgba(0, 229, 255, 0.8);
        }
      }

      .online-dot {
        position: absolute;
        right: 12rpx;
        bottom: 14rpx;
        width: 20rpx;
        height: 20rpx;
        border-radius: 50%;
        background: #00ffb3;
        border: 4rpx solid #0a1a35;
        box-shadow: 0 0 14rpx rgba(0, 255, 179, 0.8);
        animation: pulse 2s ease-in-out infinite;
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .user-meta {
      margin-left: 30rpx;
      flex: 1;

      .u_name {
        font-size: 38rpx;
        font-weight: 700;
        color: $text;
        letter-spacing: 2rpx;
        text-shadow: 0 0 16rpx rgba(0, 229, 255, 0.45);
      }

      .u_role {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 16rpx;

        .role-tag {
          font-size: 20rpx;
          letter-spacing: 3rpx;
          color: rgba(0, 229, 255, 0.85);
          border: 1rpx solid rgba(0, 229, 255, 0.4);
          border-radius: 6rpx;
          padding: 2rpx 10rpx;
        }

        .role-line {
          width: 30rpx;
          height: 1rpx;
          margin: 0 14rpx;
          background: rgba(0, 229, 255, 0.4);
        }

        .role-text {
          font-size: 24rpx;
          color: rgba(230, 244, 255, 0.6);
        }
      }
    }

    .header-glow-line {
      margin-top: 36rpx;
      height: 2rpx;
      background: linear-gradient(90deg, rgba(0, 229, 255, 0.8), rgba(43, 127, 255, 0.3), transparent);
    }
  }

  /* ---------- 内容区 ---------- */
  .content-section {
    position: relative;
    padding: 0 24rpx;

    .tech-card {
      background: linear-gradient(150deg, rgba(20, 45, 85, 0.55), rgba(8, 20, 40, 0.65));
      border: 1rpx solid rgba(0, 229, 255, 0.22);
      border-radius: 20rpx;
      backdrop-filter: blur(20rpx);
      box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.35), inset 0 0 30rpx rgba(0, 229, 255, 0.04);
    }

    .tech-corner {
      position: absolute;
      width: 22rpx;
      height: 22rpx;
      border-color: $cyan;
      border-style: solid;

      &.tl { top: -2rpx; left: -2rpx; border-width: 3rpx 0 0 3rpx; border-radius: 10rpx 0 0 0; }
      &.br { bottom: -2rpx; right: -2rpx; border-width: 0 3rpx 3rpx 0; border-radius: 0 0 10rpx 0; }
    }

    .panel-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10rpx;

      .title-bar {
        width: 8rpx;
        height: 28rpx;
        border-radius: 4rpx;
        margin-right: 14rpx;
        background: linear-gradient(180deg, $cyan, $blue);
        box-shadow: 0 0 12rpx rgba(0, 229, 255, 0.6);
      }

      .title-text {
        font-size: 29rpx;
        font-weight: 600;
        color: $text;
        letter-spacing: 2rpx;
      }

      .title-en {
        margin-left: 14rpx;
        font-size: 19rpx;
        letter-spacing: 3rpx;
        color: rgba(0, 229, 255, 0.5);
      }

      .title-extra {
        margin-left: auto;
        font-size: 24rpx;
        color: $cyan;
      }
    }

    .elder-panel {
      padding: 24rpx 26rpx 10rpx 26rpx;
    }

    .elder-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx dashed rgba(0, 229, 255, 0.14);

      &:last-child {
        border-bottom: none;
      }
    }

    .elder-avatar {
      width: 78rpx;
      height: 78rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.08);
      border: 1rpx solid rgba(0, 229, 255, 0.32);

      .avatar-char {
        font-size: 34rpx;
        color: $cyan;
      }
    }

    .elder-main {
      flex: 1;
      margin-left: 20rpx;
    }

    .elder-name-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
    }

    .elder-name {
      margin-right: 14rpx;
      font-size: 30rpx;
      font-weight: 600;
      color: $text;
    }

    .name-row .tag,
    .elder-name-row .tag {
      margin-right: 10rpx;
    }

    .elder-sub {
      margin-top: 8rpx;
      font-size: 23rpx;
      color: rgba(230, 244, 255, 0.55);
    }

    .elder-scope {
      display: flex;
      flex-direction: row;
      margin-top: 12rpx;
    }

    .scope {
      margin-right: 12rpx;
      padding: 3rpx 14rpx;
      font-size: 20rpx;
      color: #7df3ff;
      border: 1rpx solid rgba(0, 229, 255, 0.35);
      border-radius: 6rpx;
      background: rgba(0, 229, 255, 0.07);
    }

    .scope.dim {
      color: rgba(230, 244, 255, 0.3);
      border-color: rgba(230, 244, 255, 0.16);
      background: rgba(230, 244, 255, 0.04);
    }

    .elder-owed {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 16rpx;

      .owed-num {
        font-size: 30rpx;
        font-weight: 700;
        color: #ff6b8b;
      }

      .owed-label {
        margin-top: 4rpx;
        font-size: 20rpx;
        color: rgba(230, 244, 255, 0.45);
      }
    }

    .menu-list {
      margin: 24rpx 0 0 0;
      padding: 10rpx 0;
      overflow: hidden;

      .list-cell {
        background-color: transparent;
      }

      .menu-item-box {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: $text;

        .menu-icon {
          color: $cyan;
          font-size: 34rpx;
          margin-right: 18rpx;
          text-shadow: 0 0 12rpx rgba(0, 229, 255, 0.5);
        }
      }
    }

    .logout-btn {
      margin: 30rpx 0 0 0;
      padding: 26rpx 0;
      text-align: center;
      font-size: 29rpx;
      letter-spacing: 2rpx;
      color: #ffb3c2;
      border: 1rpx solid rgba(255, 107, 139, 0.4);
      border-radius: 16rpx;
      background: rgba(255, 107, 139, 0.08);
    }

    .footer-note {
      text-align: center;
      font-size: 21rpx;
      letter-spacing: 2rpx;
      color: rgba(230, 244, 255, 0.28);
      padding: 26rpx 0 10rpx 0;
    }

    .empty {
      padding: 50rpx 0;
      text-align: center;
      font-size: 25rpx;
      color: rgba(230, 244, 255, 0.4);
    }

    .tag {
      padding: 4rpx 12rpx;
      font-size: 20rpx;
      border-radius: 6rpx;
      border: 1rpx solid transparent;
    }

    .tag-cyan { color: #7df3ff; border-color: rgba(0, 229, 255, 0.45); background: rgba(0, 229, 255, 0.1); }
    .tag-green { color: #7dffcf; border-color: rgba(0, 255, 179, 0.45); background: rgba(0, 255, 179, 0.1); }
    .tag-gray { color: rgba(230, 244, 255, 0.6); border-color: rgba(230, 244, 255, 0.22); background: rgba(230, 244, 255, 0.06); }
  }
</style>
