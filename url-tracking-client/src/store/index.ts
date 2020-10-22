import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export interface StateType {
  updateTime?: number;
  servers: Record<string, any>[];
  activeServers: Record<string, any>[];
}

export default new Vuex.Store<StateType>({
  state: {
    updateTime: undefined, // 更新时间
    servers: [], // Slave列表
    activeServers: [] // 激活的Slave列表
  },
  getters: {
    trackingUrl: state => {
      return state.servers.filter(
        (s: any) => s.service.indexOf("trackingUrl") > -1
      );
    }
  },
  mutations: {
    setUpdateTime: (state, data: number) => {
      localStorage.setItem("updateTime", String(data));
      state.updateTime = Number(data);
    },
    setServers: (state, data = []) => {
      localStorage.setItem("servers", JSON.stringify(data));
      state.servers = data;
    }
  },
  actions: {
    updateServers: ({ commit }, { updateTime, servers }) => {
      if (updateTime) {
        commit("setUpdateTime", updateTime);
        commit("setServers", servers);
      }
    }
  },
  modules: {}
});
