const api = require('../../utils/api')

const STATUS_MAP = {
  ALL: -1, PENDING_PAYMENT: 1, TO_BE_CONFIRMED: 2,
  CONFIRMED: 3, DELIVERY_IN_PROGRESS: 4, COMPLETED: 5, CANCELLED: 6
}

const STATUS_TEXT = {
  1: '待付款', 2: '待接单', 3: '已接单',
  4: '派送中', 5: '已完成', 6: '已取消'
}

const STATUS_COLOR = {
  1: '#ff6b35', 2: '#ff6b35', 3: '#4caf50',
  4: '#2196f3', 5: '#999', 6: '#999'
}

Page({
  data: {
    tabs: [
      { key: 'ALL', label: '全部' },
      { key: 'TO_BE_CONFIRMED', label: '待接单' },
      { key: 'CONFIRMED', label: '已接单' },
      { key: 'COMPLETED', label: '已完成' },
      { key: 'CANCELLED', label: '已取消' }
    ],
    currentTab: 'ALL',
    list: [], page: 1, pageSize: 10, hasMore: true, loading: false,
    statusText: STATUS_TEXT, statusColor: STATUS_COLOR
  },

  onShow() {
    this.data.page = 1; this.data.hasMore = true; this.data.list = []
    this.loadOrders()
  },

  switchTab(e) {
    const key = e.currentTarget.dataset.key
    if (key === this.data.currentTab) return
    this.setData({ currentTab: key, list: [], page: 1, hasMore: true })
    this.loadOrders()
  },

  loadOrders() {
    if (this.data.loading || !this.data.hasMore) return
    this.setData({ loading: true })
    const status = this.data.currentTab === 'ALL' ? null : STATUS_MAP[this.data.currentTab]
    api.pageQuery4User(this.data.page, this.data.pageSize, status).then(res => {
      const records = res.records || []
      const list = [...this.data.list, ...records]
      this.setData({
        list, loading: false,
        hasMore: records.length >= this.data.pageSize,
        page: this.data.page + 1
      })
    }).catch(() => { this.setData({ loading: false }) })
  },

  onReachBottom() { this.loadOrders() },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/order-detail/order-detail?id=' + e.currentTarget.dataset.id })
  },

  cancelOrder(e) {
    const id = e.currentTarget.dataset.id
    const that = this
    wx.showModal({
      title: '提示', content: '确定要取消该订单吗？',
      success(res) {
        if (res.confirm) {
          api.cancelOrder(id).then(() => {
            wx.showToast({ title: '已取消', icon: 'success' })
            that.data.page = 1; that.data.hasMore = true; that.data.list = []
            that.loadOrders()
          }).catch(err => { wx.showToast({ title: err || '取消失败', icon: 'none' }) })
        }
      }
    })
  },

  repetition(e) {
    const id = e.currentTarget.dataset.id
    api.repetition(id).then(() => {
      wx.showToast({ title: '已添加到购物车', icon: 'success' })
    }).catch(err => { wx.showToast({ title: err || '操作失败', icon: 'none' }) })
  }
})
