# 苍穹外卖 · 用户端微信小程序

原生微信小程序（WXML / WXSS / JavaScript，无第三方框架），对接 [sky-take-out](https://github.com/Yokino233/sky-take-out) 后端，完成「浏览 → 购物车 → 下单 → 查看订单 → 催单」的用户侧闭环。

> 配套仓库：
>
> - 后端：[sky-take-out](https://github.com/Yokino233/sky-take-out)
> - 商家管理端：[sky-takeout-admin](https://github.com/Yokino233/sky-takeout-admin)

## 页面结构

| 页面 | 路径 | 功能 |
|:----|:----|:----|
| 首页 / 点餐 | `pages/index` | 分类导航、菜品与套餐列表、加购、店铺营业状态 |
| 购物车 | `pages/cart` | 数量增减、清空、去结算 |
| 确认订单 | `pages/order` | 选择收货地址、备注、提交订单 |
| 收货地址 | `pages/address` | 地址增删改、默认地址 |
| 我的 | `pages/my` | 用户信息、入口聚合 |
| 订单列表 | `pages/orders` | 历史订单、状态筛选、再来一单 |
| 订单详情 | `pages/order-detail` | 订单明细、状态、催单 |

底部 tabBar：首页 / 购物车 / 我的。

## 运行方式

1. 先把后端跑起来（默认 `http://localhost:8080`，见 [sky-take-out](https://github.com/Yokino233/sky-take-out)）。
2. 用**微信开发者工具**导入本目录。
3. 在 `project.config.json` 里把 `appid` 换成你自己的小程序 AppID（当前是 `YOUR_APPID` 占位符）。
4. 确认 `utils/api.js` 里的后端地址：

```js
const BASE_URL = 'http://localhost:8080'
```

5. `project.config.json` 中已设置 `urlCheck: false`，本地开发可直接请求 `localhost`；真机调试请改用内网/公网地址。

## 技术说明

- 纯原生小程序，无 npm 依赖、无构建步骤，导入即可运行。
- `utils/api.js` 统一封装 `wx.request`：拼接 `BASE_URL`、注入 `Authorization` 头、统一处理业务错误码。
- 登录态 token 存在 `wx.getStorageSync('token')`，登录走后端 `POST /user/user/login`（微信 code 换 openid）。
- 订单状态通过后端枚举映射成文案，轮询/刷新时拉取最新状态。

## 已知限制

- 下单流程跳过了真实微信支付，提交后直接进入「待接单」（后端也未接商户号）。
- 收货地址为手动录入，未接入 `wx.chooseAddress` 与地图选点。
- 没有分包与图片懒加载优化，列表页数据量大时会偏慢。
- 只在微信开发者工具 + 少量真机环境验证过，未做完整兼容性测试。

## License

MIT
