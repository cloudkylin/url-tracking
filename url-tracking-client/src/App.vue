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

@Component({ components: { Header } })
export default class App extends Vue {
  @Prop() private msg!: string;

  mounted() {
    fetch("/v1/master/serversInfo", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("请求失败，请重试");
        }
      })
      .then(res => {
        if (res.status) {
          const updateTimeDate = new Date();
          const updateTime: string = updateTimeDate.valueOf() + "";
          localStorage.setItem("updateTime", updateTime);
          const trackingUrl = JSON.stringify(res.data.trackingUrl);
          localStorage.setItem("trackingUrl", trackingUrl);
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
<!--<style lang="scss">-->
<!--  #app {-->
<!--    font-family: 'Avenir', Helvetica, Arial, sans-serif;-->
<!--    -webkit-font-smoothing: antialiased;-->
<!--    -moz-osx-font-smoothing: grayscale;-->
<!--    text-align: center;-->
<!--    color: #2c3e50;-->
<!--  }-->

<!--  #nav {-->
<!--    padding: 30px;-->

<!--    a {-->
<!--      font-weight: bold;-->
<!--      color: #2c3e50;-->

<!--      &.router-link-exact-active {-->
<!--        color: #42b983;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</style>-->
