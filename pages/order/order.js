const api = require('../../utils/api')
Page({
  data: { address: null, cartList: [], total: '0.00', remark: '', submitted: false },

  onShow() {
    this.loadCart()
    api.getDefaultAddress().then(addr => {
      if (addr) this.setData({ address: addr })
    }).catch(() => {})
  },

  loadCart() {
    api.getCartList().then(list => {
      let total = 0
      list.forEach(item => { total += item.amount * item.number })
      this.setData({ cartList: list, total: total.toFixed(2) })
    }).catch(() => {})
  },

  onRemarkInput(e) { this.setData({ remark: e.detail.value }) },

  chooseAddress() { wx.navigateTo({ url: '/pages/address/address?select=1' }) },

  submitOrder() {
    if (!this.data.address) { wx.showToast({ title: '请选择地址', icon: 'none' }); return }
    if (this.data.cartList.length === 0) { wx.showToast({ title: '购物车为空', icon: 'none' }); return }

    api.submitOrder({
      addressBookId: this.data.address.id,
      remark: this.data.remark,
      estimatedDeliveryTime: null,
      deliveryStatus: 1,
      packAmount: 0,
      tablewareNumber: 1,
      tablewareStatus: 1
    }).then(res => {
      this.setData({ submitted: true })
    }).catch(err => {
      wx.showToast({ title: err || '下单失败', icon: 'none' })
    })
  },

  goBack() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
