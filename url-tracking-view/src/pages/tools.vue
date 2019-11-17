<template>
    <el-main>
        <el-row>
            <el-col :span="24">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="form">
                    <el-form-item label="请输入网址" prop="url">
                        <el-input v-model.trim="form.url"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getData">提交</el-button>
                        <el-button @click="handleClean">清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="table" stripe border style="width: 100%">
                    <el-table-column type="index" label="跳转次数" width="80" align="center"></el-table-column>
                    <el-table-column prop="url" label="跳转地址"></el-table-column>
                    <el-table-column prop="whois" label="网址拥有者信息"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-main>
</template>

<script>
    export default {
        name: "tools",
        data() {
            let checkUrl = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入网址'));
                } else {
                    let patt = /^(https?:)?(\/\/)?[-A-Za-z0-9+&@#%?=~_|!:,;]+\.[-A-Za-z0-9+&@#%?=~_|!:,;]+[-A-Za-z0-9+&@#/%=~_|.]*/i;
                    if (patt.test(value)) {
                        callback()
                    } else {
                        callback(new Error('请输入正确的网址'))
                    }
                }
            };
            return {
                rules: {
                    url: [{validator: checkUrl, trigger: 'change'}]
                },
                form: {
                    url: ''
                },
                table: []
            }
        },
        methods: {
            handleClean() {
                this.form.url = '';
                this.table = [];
            },
            getData() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const loading = this.$loading({lock: true});

                        let url = this.form.url;
                        let patt = /^https?:\/\//;
                        if (!patt.test(url)) {
                            if (url.slice(0, 2) === '//')
                                url = 'http' + url;
                            else url = 'http://' + url;
                        }

                        fetch('/v1/trackingUrl', {
                            method: 'POST',
                            body: JSON.stringify({url}),
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
                            if (res.status)
                                this.table = res.data;
                            else {
                                let msg = res.message ? res.message : '追踪失败，请稍后再试';
                                this.$notify.warning({
                                    title: '追踪失败',
                                    message: msg
                                });
                                this.table = [];
                            }
                        }).catch(() => {
                            this.$notify.error({
                                title: '请求失败',
                                message: '请求失败，请重试'
                            });
                            this.table = [];
                        }).finally(() => loading.close())
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .form {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
    }
</style>