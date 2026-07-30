const BASE_URL = 'http://localhost:8080'

function request(method, url, data) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    const header = {}
    if (token) { header['authentication'] = token }

    let queryData = data
    if (method === 'GET' || method === 'DELETE') {
      queryData = {}
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          queryData[key] = data[key]
        }
      }
    }

    wx.request({
      url: BASE_URL + url,
      method: method,
      data: queryData,
      header: header,
      success: res => {
        if (res.statusCode === 200 && res.data) {
          if (res.data.code === 1) {
            resolve(res.data.data)
          } else {
            reject(res.data.msg || '请求失败')
          }
        } else {
          reject('网络错误: ' + (res.statusCode || '未知'))
        }
      },
      fail: () => reject('网络请求失败')
    })
  })
}

function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({ success: res => resolve(res.code), fail: () => reject('登录失败') })
  })
}

function login(code) { return request('POST', '/user/user/login', { code }) }

function ensureLogin() {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    if (token) { resolve(token); return }
    wxLogin().then(code => login(code)).then(data => {
      wx.setStorageSync('token', data.token)
      resolve(data.token)
    }).catch(() => reject('登录失败'))
  })
}

function getCategoryList(type) { return request('GET', '/user/category/list', { type }) }
function getDishList(categoryId) { return request('GET', '/user/dish/list', { categoryId }) }
function getSetmealList(categoryId) { return request('GET', '/user/setmeal/list', { categoryId }) }
function getSetmealDish(setmealId) { return request('GET', '/user/setmeal/dish/' + setmealId) }
function getCartList() { return request('GET', '/user/shoppingCart/list') }
function addCart(data) { return request('POST', '/user/shoppingCart/add', data) }
function cleanCart() { return request('DELETE', '/user/shoppingCart/clean') }
function getAddressList() { return request('GET', '/user/addressBook/list') }
function addAddress(data) { return request('POST', '/user/addressBook', data) }
function updateAddress(data) { return request('PUT', '/user/addressBook', data) }
function deleteAddress(id) { return request('DELETE', '/user/addressBook', { id }) }
function setDefaultAddress(id) { return request('PUT', '/user/addressBook/default', { id }) }
function getDefaultAddress() { return request('GET', '/user/addressBook/default') }
function submitOrder(data) { return request('POST', '/user/order/submit', data) }
function pageQuery4User(page, pageSize, status) { return request('GET', '/user/order/historyOrders', { page, pageSize, status }) }
function orderDetail(id) { return request('GET', '/user/order/orderDetail/' + id) }
function cancelOrder(id) { return request('PUT', '/user/order/cancel/' + id) }
function repetition(id) { return request('POST', '/user/order/repetition/' + id) }
function reminder(id) { return request('GET', '/user/order/reminder/' + id) }

module.exports = {
  ensureLogin, wxLogin, login,
  getCategoryList, getDishList, getSetmealList, getSetmealDish,
  getCartList, addCart, cleanCart,
  getAddressList, addAddress, updateAddress, deleteAddress,
  setDefaultAddress, getDefaultAddress,
  submitOrder, pageQuery4User, orderDetail, cancelOrder, repetition, reminder
}
