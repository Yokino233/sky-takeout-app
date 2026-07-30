const api = require('../../utils/api')

Page({
  data: {
    shopOpen: true,
    categories: [],
    currentCategory: -1,
    dishList: [],
    setmealList: [],
    showSetmeal: false,
    cartCount: 0
  },

  onLoad() {
    api.ensureLogin().then(() => {
      this.getShopStatus()
      this.getCategories()
    }).catch(() => {
      wx.showToast({ title: '登录失败', icon: 'none' })
    })
  },

  onShow() {
    const token = wx.getStorageSync('token')
    if (token) this.getCartCount()
  },

  getShopStatus() {
    wx.request({
      url: 'http://localhost:8080/user/shop/status', method: 'GET',
      success: res => {
        if (res.data && res.data.code === 1) {
          this.setData({ shopOpen: res.data.data === 1 })
        }
      }
    })
  },

  getCategories() {
    api.getCategoryList().then(list => {
      this.setData({ categories: list })
    }).catch(() => {})
  },

  switchCategory(e) {
    const id = parseInt(e.currentTarget.dataset.id)
    this.setData({ currentCategory: id === -1 ? -1 : id, showSetmeal: false })
    if (!id || id === -1) { this.setData({ dishList: [], setmealList: [] }); return }
    const cat = this.data.categories.find(c => c.id === id)
    if (!cat) return
    if (cat.type === 1) {
      this.setData({ showSetmeal: false })
      api.getDishList(id).then(list => { this.setData({ dishList: list }) }).catch(() => {})
    } else if (cat.type === 2) {
      this.setData({ showSetmeal: true })
      api.getSetmealList(id).then(list => { this.setData({ setmealList: list }) }).catch(() => {})
    }
  },

  addToCart(e) {
    const id = parseInt(e.currentTarget.dataset.id)
    api.ensureLogin().then(() => {
      api.addCart({ dishId: id, dishFlavor: '' }).then(() => {
        wx.showToast({ title: '已加入购物车', icon: 'success' })
        this.getCartCount()
      }).catch(err => { wx.showToast({ title: err || '添加失败', icon: 'none' }) })
    })
  },

  addSetmealToCart(e) {
    const id = parseInt(e.currentTarget.dataset.id)
    api.ensureLogin().then(() => {
      api.addCart({ setmealId: id, dishFlavor: '' }).then(() => {
        wx.showToast({ title: '已加入购物车', icon: 'success' })
        this.getCartCount()
      }).catch(err => { wx.showToast({ title: err || '添加失败', icon: 'none' }) })
    })
  },

  getCartCount() {
    api.getCartList().then(list => {
      let count = 0
      list.forEach(item => { count += item.number })
      this.setData({ cartCount: count })
    }).catch(() => {})
  },

})
