<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="card">
          <el-alert
            :title="alertElement.title"
            :type="alertElement.type"
            show-icon
          />
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            hide-required-asterisk
            @submit.native.prevent
            label-width="80px"
            class="card-form"
          >
            <el-form-item label="网址 URL" prop="url">
              <el-input v-model.trim="form.url" clearable></el-input>
            </el-form-item>
            <el-form-item label="模拟设备" prop="device">
              <el-radio-group v-model="form.device">
                <el-radio-button label="pc">电脑</el-radio-button>
                <el-radio-button label="wechat">手机微信</el-radio-button>
                <el-radio-button label="iphone">iPhone 浏览器</el-radio-button>
                <el-radio-button label="android">
                  Android 浏览器
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="监测节点" prop="server">
              <span v-if="serversInfo.length === 0">暂无可用节点</span>
              <el-radio-group v-else v-model="form.server">
                <el-radio
                  v-for="server in serversInfo"
                  :key="server.addr"
                  :label="server.addr"
                  >{{ server.name }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="card-btn">
            <el-button
              type="primary"
              plain
              circle
              icon="el-icon-arrow-right"
              @click="getData"
            ></el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="table" stripe border style="width: 100%">
          <el-table-column
            type="index"
            label="跳转次数"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column prop="url" label="跳转地址"></el-table-column>
          <el-table-column prop="whois" label="网址拥有者信息">
            <template slot-scope="scope">
              <span v-if="scope.row.whois">{{ scope.row.whois }}</span>
              <a v-else :href="handleWhoisUrl(scope.row.url)" target="_blank"
                >查看信息</a
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "tools",
  data() {
    const checkUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入网址"));
      } else {
        const patt = /^(https?:)?(\/\/)?[-A-Za-z0-9+&@#%?=~_|!:,;]+\.[-A-Za-z0-9+&@#%?=~_|!:,;]+[-A-Za-z0-9+&@#/%=~_|.]*/i;
        if (patt.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的网址"));
        }
      }
    };
    return {
      alertElement: {
        type: "info",
        title: "数据更新中..."
      },
      rules: {
        url: [{ validator: checkUrl, trigger: "change" }],
        device: [
          { required: true, message: "请选择模拟设备", trigger: "change" }
        ],
        server: [
          { required: true, message: "请选择监测节点", trigger: "change" }
        ]
      },
      form: {
        url: "",
        device: "pc",
        server: null
      },
      table: [],

      // 监测节点信息
      serversInfo: []
    };
  },
  mounted() {
    this.updateServersList(this.$store.getters.trackingUrl);
  },
  methods: {
    // 检查并整理时间
    timeCheck(timestamp) {
      timestamp = parseInt(timestamp);
      const now = new Date().valueOf();
      const updated = new Date(timestamp);
      const time = updated.toLocaleString("zh-CN", { hour12: false });
      if (now - timestamp > 86400000)
        return {
          status: false,
          time,
          day: parseInt((now - timestamp) / 86400000)
        };
      else return { status: true, time, day: 0 };
    },
    // 更新监测节点信息
    updateServersList(list) {
      if (list) {
        this.serversInfo = list;
        const updateTime = this.$store.state.updateTime;
        if (updateTime) {
          const check = this.timeCheck(updateTime);
          if (check.status) {
            this.alertElement = {
              type: "success",
              title: `节点信息有效。上次更新时间 ${check.time}`
            };
          } else {
            this.alertElement = {
              type: "warning",
              title: `距上次更新节点信息已过去 ${check.day} 天，节点可能已经失效，请刷新页面以更新`
            };
          }
        } else {
          this.alertElement = {
            type: "warning",
            title:
              "距上次更新节点信息已过去很久，节点可能已经失效，请刷新页面更新"
          };
        }
      } else {
        this.serversInfo = [];
        this.alertElement = {
          type: "error",
          title: "没有获取到监测节点数据，请稍后再试"
        };
      }
    },
    // WHOIS 拼接
    handleWhoisUrl(val) {
      return `https://net.jdcloud.com/domainInfo/whois?domainName=${val}`;
    },
    // 获取数据
    getData() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const loading = this.$loading({ lock: true });

          // 整理URL
          let url = this.form.url;
          const patt = /^https?:\/\//;
          if (!patt.test(url)) {
            if (url.slice(0, 2) === "//") url = "http" + url;
            else url = "http://" + url;
          }

          // 整理UA
          let ua = "";
          switch (this.form.device) {
            case "pc":
              ua =
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36";
              break;
            case "wechat":
              ua =
                "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.8(0x17000820) NetType/WIFI Language/zh_CN";
              break;
            case "iphone":
              ua =
                "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1";
              break;
            case "android":
              ua =
                "Mozilla/5.0 (Linux; Android 7.0; Nexus 5X Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/54.0.2840.85 Mobile Safari/537.36";
              break;
            default:
              ua = "curl/7.54.0";
              break;
          }

          fetch(`http://${this.form.server}/v1/slave/trackingUrl`, {
            method: "POST",
            body: JSON.stringify({ url, ua }),
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
              if (res.status) this.table = res.data;
              else {
                const msg = res.message ? res.message : "追踪失败，请稍后再试";
                this.$notify.warning({
                  title: "追踪失败",
                  message: msg
                });
                this.table = [];
              }
            })
            .catch(() => {
              this.$notify.error({
                title: "请求失败",
                message: "请求失败，请重试"
              });
              this.table = [];
            })
            .finally(() => loading.close());
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.card {
  margin: 20px auto;
  padding: 20px;
  width: calc(100% - 40px);
  max-width: 520px;
  border: 1px solid #e6e6e6;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.card-form {
  width: 100%;
  max-width: 520px;
  margin-top: 18px;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 0;
}

.card-btn {
  margin-top: 10px;
  text-align: center;
}
</style>
