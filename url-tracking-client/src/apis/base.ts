export default {
  async get(url: string, params?: { [key: string]: string | number }) {
    if (params && params.length) {
      const paramsStr = Object.entries(params).map(
        ([key, value]) => `${key}=${value}`
      );
      url += "?" + paramsStr.join("&");
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  },
  async post(url: string, data?: { [key: string]: any }) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }
};
