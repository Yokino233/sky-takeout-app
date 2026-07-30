const api = require('../../utils/api')
Page({
  data: { nickName: '', avatar: '', token: '' },

  onShow() {
    const token = wx.getStorageSync('token') || ''
    const nickName = wx.getStorageSync('nickName') || ''
    this.setData({ token, nickName })
  },

  doLogin() {
    api.wxLogin().then(code => {
      return api.login(code)
    }).then(data => {
      wx.setStorageSync('token', data.token)
      this.setData({ token: data.token })
      wx.showToast({ title: '登录成功', icon: 'success' })
    }).catch(() => {
      wx.showToast({ title: '登录失败', icon: 'none' })
    })
  },

  goOrders() {
    wx.navigateTo({ url: '/pages/orders/orders' })
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/address/address' })
  }
})
