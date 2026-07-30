const api = require('../../utils/api')
Page({
  data: {
    list: [], selectMode: false,
    showForm: false, formMode: 'add', editId: null,
    formName: '', formPhone: '', formDetail: ''
  },

  onLoad(query) {
    if (query.select === '1') this.setData({ selectMode: true })
  },

  onShow() { this.loadAddress() },

  loadAddress() {
    api.getAddressList().then(list => { this.setData({ list }) }).catch(() => {})
  },

  addAddress() {
    this.setData({
      showForm: true, formMode: 'add', editId: null,
      formName: '', formPhone: '', formDetail: ''
    })
  },

  closeForm() { this.setData({ showForm: false }) },

  onFormName(e) { this.setData({ formName: e.detail.value }) },
  onFormPhone(e) { this.setData({ formPhone: e.detail.value }) },
  onFormDetail(e) { this.setData({ formDetail: e.detail.value }) },

  saveAddress() {
    const { formName, formPhone, formDetail } = this.data
    if (!formName || !formPhone || !formDetail) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' }); return
    }
    const data = { consignee: formName, phone: formPhone, detail: formDetail }
    api.addAddress(data).then(() => {
      wx.showToast({ title: '保存成功', icon: 'success' })
      this.closeForm()
      this.loadAddress()
    }).catch(err => { wx.showToast({ title: err || '保存失败', icon: 'none' }) })
  },

  setDefault(e) {
    api.setDefaultAddress(e.currentTarget.dataset.id).then(() => {
      wx.showToast({ title: '已设为默认', icon: 'success' })
      this.loadAddress()
    }).catch(() => {})
  },

  delAddr(e) {
    wx.showModal({
      title: '提示', content: '确定删除该地址？',
      success: res => {
        if (res.confirm) {
          api.deleteAddress(e.currentTarget.dataset.id).then(() => {
            wx.showToast({ title: '已删除', icon: 'success' })
            this.loadAddress()
          }).catch(() => {})
        }
      }
    })
  }
})
