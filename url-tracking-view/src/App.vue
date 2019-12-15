<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: 'app',
        mounted() {
            fetch('/v1/center/serversInfo', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    throw new Error('请求失败，请重试');
                }
            }).then(res => {
                if (res.status) {
                    let updateTime = new Date();
                    updateTime = updateTime.valueOf();
                    localStorage.setItem("updateTime", updateTime);
                    let trackingUrl = JSON.stringify(res.data.trackingUrl);
                    localStorage.setItem("trackingUrl", trackingUrl)
                } else {
                    let msg = res.message ? res.message : '从中心节点服务器更新数据失败，请稍后再试';
                    this.$notify.warning({
                        title: '请求失败',
                        message: msg
                    });
                }
            }).catch(() => {
                this.$notify.error({
                    title: '请求失败',
                    message: '请求失败，请重试'
                });
                this.table = [];
            })
        }
    }
</script>

<style lang="scss" scoped>

</style>
