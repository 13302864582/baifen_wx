const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('id_token') || wx.getStorageSync('xcxorg')) {

    } else {
      if (options.xcxorg) {
        wx.setStorageSync('xcxorg', options.xcxorg)
      } else {
        wx.setStorageSync('xcxorg', app.xcxorg)
      }
    }

    if (wx.getStorageSync('id_token') || wx.getStorageSync('xcxexr')) {

    } else {
      if (options.xcxexr) {
        wx.setStorageSync('xcxexr', options.xcxexr)
      } else {
        wx.setStorageSync('xcxexr', app.xcxexr)
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('openid')) {
      wx.switchTab({
        url: '../index/index'
      }) 
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function (n) {
    var that = this
    "getUserInfo:ok" == n.detail.errMsg && (wx.showLoading({
      title: "正在授权",
      mask: !0
    }), wx.login({
      success: function (e) {
        var t = e.code;
        app.globalData.userInfo = n.detail.rawData
        wx.request({
          url: (app.apiUrl) + '/api/Aes/decrypt',
          data: {
            code: e.code,
            xcxorg: wx.getStorageSync('xcxorg'),
            xcxexr: wx.getStorageSync('xcxexr'),
            encryptedData: n.detail.encryptedData,
            iv: n.detail.iv
          },
          method: 'GET',
          success: function (sessionres) {
            if (!wx.getStorageSync('openid')) {
              wx.setStorageSync('openid', sessionres.data.openId)
            }
            wx.setStorageSync('avatarUrl', sessionres.data.avatarUrl)
            wx.setStorageSync('nickName', sessionres.data.nickName)
            wx.setStorageSync('unionId', sessionres.data.unionId)
            
            wx.switchTab({
              url: '../index/index'
            }) 
          },
          complete: function () {
            wx.hideLoading();
          }

        })
      },
      fail: function (e) { }
    }));
  }
})