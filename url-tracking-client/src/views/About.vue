<template>
  <div class="main">
    <img
      src="@/assets/logo.png"
      alt="LOGO"
      class="logo"
      :style="{ opacity: style.opacity, top: style.top + 'px' }"
    />
    <div class="list">
      <div class="main-title">{{ title }}</div>
      <div class="list-item" v-if="version">
        <div class="title">版本</div>
        <div class="text">{{ version }}</div>
      </div>
      <div class="list-item">
        <div class="title">GitHub</div>
        <div class="text">
          <a href="https://github.com/cloudkylin/url-tracking">
            https://github.com/cloudkylin/url-tracking
          </a>
        </div>
      </div>
      <div class="list-item">
        <div class="title">更新说明</div>
        <div class="text">
          <p>v1.1.0:</p>
          <p>增加了 v2 版本兼容性</p>
          <p>升级依赖，避免攻击风险</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      style: {
        opacity: 1,
        top: 160
      },
      title: "",
      version: ""
    };
  },
  mounted() {
    this.title = process.env.VUE_APP_TITLE || "链接跳转追踪";
    this.version = process.env.VUE_APP_VERSION;
    window.onscroll = () => {
      const pos = document.documentElement.scrollTop;
      if (pos <= 400) {
        this.style = {
          top: 160 - pos / 2,
          opacity: 1 - pos / 400
        };
      } else {
        this.style = {
          top: -40,
          opacity: 0
        };
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.logo {
  position: fixed;
  width: 200px;
  height: 200px;
  left: 50%;
  transform: translateX(-50%);
  z-index: -1;
}

.list {
  width: 90%;
  max-width: 800px;
  margin: 460px auto 0;
  border-top: 1px solid #e6e6e6;
  background: #fff;
  z-index: 1;
  padding-top: 30px;
  text-align: center;

  & > .main-title {
    font-size: 24px;
    line-height: 48px;
    font-weight: 500;
    margin-bottom: 30px;
  }

  & > .list-item {
    margin: 20px 0;

    & > .title {
      font-weight: 600;
      margin-bottom: 5px;
    }
  }
}
</style>
