// pages/recharge/recharge.js
Page({
  data:{
    login_state: 0
  },
  onShow: function(){
    if (wx.getStorageSync('id_token')){
      var that = this
      wx.request({
        url: (getApp().apiUrl) + '/api/Payment/package',
        data: {
          tokenid: wx.getStorageSync('id_token'),
          xcxorg: wx.getStorageSync('xcxorg'),
          xcxexr: wx.getStorageSync('xcxexr'),
          appver: getApp().appver
        },
        method: 'GET',
        success: function (respackage) {
          console.log(respackage)
          if (respackage.data.Code == 1) {
            wx.showToast({
              title: res.data.Msg,
              icon: 'loading',
              duration: 20000000,
              mask: true
            })
          } else if (respackage.data.Code == 2){
            wx.request({
              url: (getApp().apiUrl) + '/api/login/reLogin',
              data: {
                username: wx.getStorageSync('userid'),
                password: wx.getStorageSync('passwd'),
                xcxorg: wx.getStorageSync('xcxorg'),
                xcxexr: wx.getStorageSync('xcxexr')
              },
              method: 'GET',
              success: function (reslogin) {
                if (reslogin.data.Code == 1) {
                  that.setData({
                    login_state:1
                  })
                } else {
                  wx.setStorageSync('id_token', reslogin.data.tokenid)
                  wx.setStorageSync('userid', reslogin.data.userid)
                  wx.setStorageSync('xcxorg', reslogin.data.xcxorg)
                  wx.setStorageSync('xcxexr', reslogin.data.xcxexr)
                  wx.setStorage({
                    key: "userinfo",
                    data: reslogin.data
                  })
                }
              }
            })
          } else {
            that.setData({
              packagelist: respackage.data.Data.buy_vip_infos,
              login_state: 0
            })
          }
        }
      })

      wx.request({
        url: (getApp().apiUrl) + '/api/Release/CouponList',
        data: {
          tokenid: wx.getStorageSync('id_token'),
          xcxorg: wx.getStorageSync('xcxorg'),
          xcxexr: wx.getStorageSync('xcxexr'),
          appver: getApp().appver
        },
        method: 'GET',
        success: function (res) {
          console.log(res)
          if (res.data.Code == 1) {
            wx.showToast({
              title: res.data.Msg,
              icon: 'loading',
              duration: 20000000,
              mask: true
            })

          } else if (res.data.Code == 2) {
            wx.request({
              url: (getApp().apiUrl) + '/api/login/reLogin',
              data: {
                username: wx.getStorageSync('userid'),
                password: wx.getStorageSync('passwd'),
                xcxorg: wx.getStorageSync('xcxorg'),
                xcxexr: wx.getStorageSync('xcxexr')
              },
              method: 'GET',
              success: function (reslogin) {
                if (reslogin.data.Code == 1) {
                  that.setData({
                    login_state: 1
                  })
                } else {
                  wx.setStorageSync('id_token', reslogin.data.tokenid)
                  wx.setStorageSync('userid', reslogin.data.userid)
                  wx.setStorageSync('xcxorg', reslogin.data.xcxorg)
                  wx.setStorageSync('xcxexr', reslogin.data.xcxexr)
                  wx.setStorage({
                    key: "userinfo",
                    data: reslogin.data
                  })
                }
              }
            })
          } else {
            that.setData({
              coupon_count: res.data[0].count,
              login_state: 0
            })
          }

        }
      })
    } else {
      this.setData({
        login_state: 1
      })
    }

  },
  details: function (resdetails) {
        wx.showModal({
            content: resdetails.target.dataset.details,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
            }
        });
    },
    payment: function (respay) {
        wx.navigateTo({
          url: '../recharge/payment?pay=' + respay.target.dataset.money + '&title=' + respay.target.dataset.title + '&packageid=' + respay.target.dataset.packageid
        })
    },
    tologin: function(){
      wx.navigateTo({
        url: '/pages/login/register'
      })
    }
})