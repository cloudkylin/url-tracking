<template>
  <div class="header">
    <nav class="navigator">
      <div class="normal">
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          @select="handleSelect"
          class="menu"
        >
          <el-menu-item
            v-for="menu in menuList"
            :key="menu.path"
            :index="menu.path"
          >
            {{ menu.name }}
          </el-menu-item>
        </el-menu>
      </div>
      <!--小屏幕-->
      <div class="fold">
        <el-button
          @click="foldVisible = !foldVisible"
          class="button"
          icon="el-icon-menu"
          size="small"
        />
        <div v-show="foldVisible" class="menu">
          <div
            v-for="menu in menuList"
            :key="menu.path"
            :class="['menu-item', activeMenu === menu.path && 'active']"
            @click="handleSelect(menu.path)"
          >
            {{ menu.name }}
          </div>
        </div>
      </div>
    </nav>
    <div class="title">
      <h1>链接跳转追踪</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class Header extends Vue {
  // data
  menuList: Array<string> = [];
  activeMenu = "";
  foldVisible = false;

  mounted() {
    const router: { [key: string]: any } = this.$router;
    if (router.options.routes) {
      this.menuList = router.options.routes[0].children.map(
        (d: { [key: string]: any }) => {
          return { ...d, path: "/" + d.path };
        }
      );
    }
    this.activeMenu = this.$route.path;
  }

  // methods
  handleSelect(val: string): void {
    if (val !== this.activeMenu) this.$router.push({ path: val });
  }

  @Watch("$route.path")
  watchRouterPath(val: string): void {
    this.$nextTick(() => {
      this.activeMenu = val;
    });
  }
}
</script>

<style lang="scss" scoped>
.header {
  border-bottom: solid 1px #e6e6e6;

  h1 {
    font-size: 20px;
    line-height: 34px;
    font-weight: 500;
    padding: 12.5px 13px;
    margin: 0;
  }

  & > .navigator {
    float: right;

    @media screen and (max-width: 768px) {
      & > .normal {
        display: none;
      }

      & > .fold {
        & > .button {
          margin: 13px;
        }

        & > .menu {
          border: 1px solid #e6e6e6;
          position: fixed;
          top: 60px;
          left: 0;
          width: calc(100% - 22px);
          padding: 10px;
          z-index: 1000;
          background: #fff;

          & > .menu-item {
            padding: 5.6px 11.2px;
            margin: 5px 0;
            font-size: 16px;
            color: #606266;
            cursor: pointer;

            &::before {
              content: "\00a0";
              width: 3px;
              vertical-align: middle;
              display: inline-block;
              background: #dcdfe6;
              height: 3px;
              margin-right: 4px;
              color: #606266;
              position: relative;
              top: -1px;
            }

            &.active {
              color: #303133;

              &::before {
                background: #409eff;
                height: 16px;
              }
            }

            &:hover {
              background: #f2f6fc;
              border-radius: 2px;
            }
          }
        }
      }
    }
    @media screen and (min-width: 768px) {
      .fold {
        display: none;
      }
      &::v-deep {
        .el-menu {
          border-bottom: none;
        }

        li {
          height: 59px;
          line-height: 59px;
          padding: 0 19.5px;
        }
      }
    }
  }
}
</style>
