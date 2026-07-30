const api = require('../../utils/api')

const STATUS_TEXT = {
  1: '待付款', 2: '待接单', 3: '已接单',
  4: '派送中', 5: '已完成', 6: '已取消'
}

Page({
  data: { order: null, statusText: STATUS_TEXT },

  onLoad(options) {
    if (options.id) {
      this.loadDetail(options.id)
    }
  },

  loadDetail(id) {
    api.orderDetail(id).then(order => {
      this.setData({ order })
    }).catch(err => {
      wx.showToast({ title: err || '加载失败', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
    })
  },

  cancelOrder() {
    const id = this.data.order.id
    const that = this
    wx.showModal({
      title: '提示', content: '确定要取消该订单吗？',
      success(res) {
        if (res.confirm) {
          api.cancelOrder(id).then(() => {
            wx.showToast({ title: '已取消', icon: 'success' })
            that.loadDetail(id)
          }).catch(err => { wx.showToast({ title: err || '取消失败', icon: 'none' }) })
        }
      }
    })
  },

  repetition() {
    api.repetition(this.data.order.id).then(() => {
      wx.showToast({ title: '已添加到购物车', icon: 'success' })
    }).catch(err => { wx.showToast({ title: err || '操作失败', icon: 'none' }) })
  },

  urgeDelivery() {
    api.reminder(this.data.order.id).then(() => {
      wx.showToast({ title: '已通知商家', icon: 'success' })
    }).catch(err => { wx.showToast({ title: err || '催单失败', icon: 'none' }) })
  }
})
