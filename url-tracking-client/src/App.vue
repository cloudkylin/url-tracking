<template>
  <div id="app">
    <header>
      <Header></Header>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import global from "@/apis/global";

@Component({ components: { Header } })
export default class App extends Vue {
  @Prop() private msg!: string;

  mounted() {
    this.updateServers();
  }

  // 更新Slave服务器信息
  updateServers(): void {
    // 加载缓存
    const updateTime = localStorage.getItem("updateTime");
    const servers = localStorage.getItem("servers");
    if (updateTime && servers) {
      this.$store.dispatch("updateServers", {
        updateTime,
        servers: JSON.parse(servers)
      });
    }

    // 获取更新
    global
      .getServers()
      .then(res => {
        if (res.status) {
          const updateTime = new Date().valueOf();
          this.$store.dispatch("updateServers", {
            updateTime,
            servers: res.data
          });
        } else {
          const msg = res.message
            ? res.message
            : "从中心节点服务器更新数据失败，请稍后再试";
          this.$notify.warning({
            title: "请求失败",
            message: msg
          });
        }
      })
      .catch(() => {
        this.$notify.error({
          title: "请求失败",
          message: "请求失败，请重试"
        });
      });
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #fff;
}

main {
  margin-top: 60px;
}
</style>
