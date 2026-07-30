const api = require('../../utils/api')
Page({
  data: { list: [], total: 0 },
  onShow() { api.ensureLogin().then(() => this.loadCart()).catch(() => {}) },
  loadCart() {
    api.getCartList().then(list => {
      let total = 0
      list.forEach(item => { total += item.amount * item.number })
      this.setData({ list, total: total.toFixed(2) })
    }).catch(() => {})
  },

  subCart(e) {
    const id = e.currentTarget.dataset.id
    const flavor = e.currentTarget.dataset.flavor || ''
    const data = { dishFlavor: flavor }
    // 通过遍历判断是 dish 还是 setmeal
    const item = this.data.list.find(i => i.dishId === id || i.setmealId === id)
    if (item) {
      if (item.dishId) data.dishId = id
      else data.setmealId = id
    }
    api.subCart(data).then(() => this.loadCart()).catch(() => {})
  },

  addCart(e) {
    const id = e.currentTarget.dataset.id
    const flavor = e.currentTarget.dataset.flavor || ''
    const isSetmeal = e.currentTarget.dataset.setmeal === 'true'
    const data = { dishFlavor: flavor }
    if (isSetmeal) data.setmealId = id
    else data.dishId = id
    api.addCart(data).then(() => this.loadCart()).catch(() => {})
  },

  cleanCart() {
    wx.showModal({
      title: '提示',
      content: '确定清空购物车？',
      success: res => {
        if (res.confirm) {
          api.cleanCart().then(() => {
            this.setData({ list: [], total: '0.00' })
            wx.showToast({ title: '已清空', icon: 'success' })
          }).catch(() => {})
        }
      }
    })
  },

  goOrder() {
    wx.navigateTo({ url: '/pages/order/order' })
  }
})
