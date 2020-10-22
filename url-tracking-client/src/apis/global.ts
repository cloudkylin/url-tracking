import base from "@/apis/base";

export default {
  async getServers() {
    return base.get("/v1/master/serversInfo");
  }
};
