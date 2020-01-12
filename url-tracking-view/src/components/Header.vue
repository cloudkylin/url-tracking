<template>
  <div>
    <el-row class="header">
      <el-col :span="8">
        <h1>Web工具箱</h1>
      </el-col>
      <el-col tag="nav" :span="16">
        <el-menu :default-active="activeMenu" mode="horizontal" @select="handleSelect" class="menu">
          <el-menu-item v-for="menu in menuList" :key="menu.path" :index="menu.path">
            {{menu.name}}
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Watch} from 'vue-property-decorator'

  @Component
  export default class Header extends Vue {
    // data
    activeMenu: any = ''
    menuList: Array<string> = []

    mounted() {
      let router: any = this.$router
      this.menuList = router.options.routes[0].children.map((d: any) => {
        return {...d, path: '/' + d.path}
      })
      this.activeMenu = this.$route.path
    }

    // methods
    handleSelect(val: string): void {
      if (val !== this.activeMenu)
        this.$router.push({path: val})
    }

    @Watch('$route.path')
    watchRouterPath(val: string): void {
      this.$nextTick(() => {
        this.activeMenu = val
      })
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    border-bottom: solid 1px #e6e6e6;

    h1 {
      font-size: 28px;
      line-height: 60px;
      font-weight: 500;
      margin: 0;
      padding: 0;
    }
  }

  .menu {
    float: right;
  }
</style>
<style>
  .menu.el-menu--horizontal.el-menu {
    border-bottom: none;
  }
</style>