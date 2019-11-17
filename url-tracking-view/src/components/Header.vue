<template>
    <div>
        <el-row class="header">
            <el-col :span="12">
                <h1>网址重定向追踪</h1>
            </el-col>
            <el-col :span="12">
                <el-menu :default-active="activeMenu" mode="horizontal" @select="handleSelect" class="menu">
                    <el-menu-item index="网址重定向追踪">工具</el-menu-item>
                    <el-menu-item index="https://cloudkylin.me/">关于我</el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                activeMenu: '',
                menuItem: []
            }
        },
        mounted() {
            let thisPath = this.$route.fullPath;
            for (let route of this.$router.options.routes) {
                if (route.path === thisPath) {
                    this.activeMenu = route.name;
                    break;
                }
            }
        },
        methods: {
            handleSelect(val) {
                if (val.slice(0, 4) === 'http') {
                    window.open(val);
                    let activeMenu = this.activeMenu;
                    this.$nextTick(() => {
                        this.activeMenu = activeMenu;
                    })
                } else {
                    this.$router.push({name: val})
                }
            }
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