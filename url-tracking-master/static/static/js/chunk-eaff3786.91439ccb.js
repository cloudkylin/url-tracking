(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-eaff3786"],{1202:function(e,t,r){},a79d:function(e,t,r){"use strict";var a=r("23e7"),n=r("c430"),o=r("fea9"),i=r("d039"),l=r("d066"),s=r("4840"),c=r("cdf9"),u=r("6eeb"),f=!!o&&i((function(){o.prototype["finally"].call({then:function(){}},(function(){}))}));a({target:"Promise",proto:!0,real:!0,forced:f},{finally:function(e){var t=s(this,l("Promise")),r="function"==typeof e;return this.then(r?function(r){return c(t,e()).then((function(){return r}))}:e,r?function(r){return c(t,e()).then((function(){throw r}))}:e)}}),n||"function"!=typeof o||o.prototype["finally"]||u(o.prototype,"finally",l("Promise").prototype["finally"])},ac9c:function(e,t,r){"use strict";var a=r("1202"),n=r.n(a);n.a},d5d4:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("el-row",[r("el-col",{attrs:{span:24}},[r("div",{staticClass:"card"},[r("el-alert",{attrs:{title:e.alertElement.title,type:e.alertElement.type,"show-icon":""}}),r("el-form",{ref:"form",staticClass:"card-form",attrs:{model:e.form,rules:e.rules,"hide-required-asterisk":"","label-width":"80px"},nativeOn:{submit:function(e){e.preventDefault()}}},[r("el-form-item",{attrs:{label:"网址 URL",prop:"url"}},[r("el-input",{attrs:{clearable:""},model:{value:e.form.url,callback:function(t){e.$set(e.form,"url","string"===typeof t?t.trim():t)},expression:"form.url"}})],1),r("el-form-item",{attrs:{label:"模拟设备",prop:"device"}},[r("el-radio-group",{model:{value:e.form.device,callback:function(t){e.$set(e.form,"device",t)},expression:"form.device"}},[r("el-radio-button",{attrs:{label:"pc"}},[e._v("电脑")]),r("el-radio-button",{attrs:{label:"wechat"}},[e._v("手机微信")]),r("el-radio-button",{attrs:{label:"iphone"}},[e._v("iPhone 浏览器")]),r("el-radio-button",{attrs:{label:"android"}},[e._v("Android 浏览器")])],1)],1),r("el-form-item",{attrs:{label:"监测节点",prop:"server"}},[0===e.serversInfo.length?r("span",[e._v("暂无可用节点")]):r("el-radio-group",{model:{value:e.form.server,callback:function(t){e.$set(e.form,"server",t)},expression:"form.server"}},e._l(e.serversInfo,(function(t){return r("el-radio",{key:t.addr,attrs:{label:t.addr}},[e._v(e._s(t.name)+" ")])})),1)],1)],1),r("div",{staticClass:"card-btn"},[r("el-button",{attrs:{type:"primary",plain:"",circle:"",icon:"el-icon-arrow-right"},on:{click:e.getData}})],1)],1)])],1),r("el-row",[r("el-col",[r("el-table",{staticStyle:{width:"100%"},attrs:{data:e.table,stripe:"",border:""}},[r("el-table-column",{attrs:{type:"index",label:"跳转次数",width:"80",align:"center"}}),r("el-table-column",{attrs:{prop:"url",label:"跳转地址"}}),r("el-table-column",{attrs:{prop:"whois",label:"网址拥有者信息"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.whois?r("span",[e._v(e._s(t.row.whois))]):r("a",{attrs:{href:e.handleWhoisUrl(t.row.url),target:"_blank"}},[e._v("查看信息")])]}}])})],1)],1)],1)],1)},n=[],o=(r("fb6a"),r("d3b7"),r("e6cf"),r("a79d"),{name:"tools",data:function(){var e=function(e,t,r){if(!t)return r(new Error("请输入网址"));var a=/^(https?:)?(\/\/)?[-A-Za-z0-9+&@#%?=~_|!:,;]+\.[-A-Za-z0-9+&@#%?=~_|!:,;]+[-A-Za-z0-9+&@#/%=~_|.]*/i;a.test(t)?r():r(new Error("请输入正确的网址"))};return{alertElement:{type:"info",title:"数据更新中..."},rules:{url:[{validator:e,trigger:"change"}],device:[{required:!0,message:"请选择模拟设备",trigger:"change"}],server:[{required:!0,message:"请选择监测节点",trigger:"change"}]},form:{url:"",device:"pc",server:null},table:[],serversInfo:[]}},mounted:function(){this.updateServersInfo()},methods:{timeCheck:function(e){e=parseInt(e);var t=(new Date).valueOf(),r=new Date(e),a=r.toLocaleString("zh-CN",{hour12:!1});return t-e>864e5?{status:!1,time:a,day:parseInt((t-e)/864e5)}:{status:!0,time:a,day:0}},updateServersInfo:function(){var e=localStorage.getItem("trackingUrl");if(e){this.serversInfo=JSON.parse(e),0!==this.serversInfo.length&&(this.form.server=this.serversInfo[0].addr);var t=localStorage.getItem("updateTime");if(t){var r=this.timeCheck(t);r.status?this.alertElement={type:"success",title:"节点信息有效。上次更新时间 ".concat(r.time)}:this.alertElement={type:"warning",title:"距上次更新节点信息已过去 ".concat(r.day," 天，节点可能已经失效，请刷新页面以更新")}}else this.alertElement={type:"warning",title:"距上次更新节点信息已过去很久，节点可能已经失效，请刷新页面更新"}}else this.serversInfo=[],this.alertElement={type:"error",title:"没有获取到监测节点数据，请稍后再试"}},handleWhoisUrl:function(e){return"https://net.jdcloud.com/domainInfo/whois?domainName=".concat(e)},getData:function(){var e=this;this.$refs.form.validate((function(t){if(!t)return!1;var r=e.$loading({lock:!0}),a=e.form.url,n=/^https?:\/\//;n.test(a)||(a="//"===a.slice(0,2)?"http"+a:"http://"+a);var o="";switch(e.form.device){case"pc":o="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36";break;case"wechat":o="Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.8(0x17000820) NetType/WIFI Language/zh_CN";break;case"iphone":o="Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1";break;case"android":o="Mozilla/5.0 (Linux; Android 7.0; Nexus 5X Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/54.0.2840.85 Mobile Safari/537.36";break;default:o="curl/7.54.0";break}fetch("http://".concat(e.form.server,"/v1/slave/trackingUrl"),{method:"POST",body:JSON.stringify({url:a,ua:o}),headers:new Headers({"Content-Type":"application/json"})}).then((function(e){if(200===e.status)return e.json();throw new Error("请求失败，请重试")})).then((function(t){if(t.status)e.table=t.data;else{var r=t.message?t.message:"追踪失败，请稍后再试";e.$notify.warning({title:"追踪失败",message:r}),e.table=[]}})).catch((function(){e.$notify.error({title:"请求失败",message:"请求失败，请重试"}),e.table=[]})).finally((function(){return r.close()}))}))}}}),i=o,l=(r("ac9c"),r("2877")),s=Object(l["a"])(i,a,n,!1,null,"0a71c0a0",null);t["default"]=s.exports},fb6a:function(e,t,r){"use strict";var a=r("23e7"),n=r("861d"),o=r("e8b5"),i=r("23cb"),l=r("50c4"),s=r("fc6a"),c=r("8418"),u=r("b622"),f=r("1dde"),d=r("ae40"),p=f("slice"),h=d("slice",{ACCESSORS:!0,0:0,1:2}),m=u("species"),v=[].slice,b=Math.max;a({target:"Array",proto:!0,forced:!p||!h},{slice:function(e,t){var r,a,u,f=s(this),d=l(f.length),p=i(e,d),h=i(void 0===t?d:t,d);if(o(f)&&(r=f.constructor,"function"!=typeof r||r!==Array&&!o(r.prototype)?n(r)&&(r=r[m],null===r&&(r=void 0)):r=void 0,r===Array||void 0===r))return v.call(f,p,h);for(a=new(void 0===r?Array:r)(b(h-p,0)),u=0;p<h;p++,u++)p in f&&c(a,u,f[p]);return a.length=u,a}})}}]);
//# sourceMappingURL=chunk-eaff3786.91439ccb.js.map