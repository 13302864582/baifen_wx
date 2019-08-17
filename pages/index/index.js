//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        tokenid: '',
        img: '../../images/release.png',
        url: '../login/register',
        Mineurl: '../login/register',
        avatar_100: '../../images/user-avatar.png',
        userid: '登录/注册',
        coupon_count: 0,
        onShareurl: 0
    },
    onLoad: function (options) {

        if (wx.getStorageSync('id_token') || wx.getStorageSync('xcxorg')) {

        } else {
            if (options.xcxorg) {
                wx.setStorageSync('xcxorg', options.xcxorg)
            } else {
                wx.setStorageSync('xcxorg', getApp().xcxorg)
            }
        }

        if (wx.getStorageSync('id_token') || wx.getStorageSync('xcxexr')) {

        } else {
            if (options.xcxexr) {
                wx.setStorageSync('xcxexr', options.xcxexr)
            } else {
                wx.setStorageSync('xcxexr', getApp().xcxexr)
            }
        }

        if (!wx.getStorageSync('remindindex')) {
            wx.showModal({
                title: '用户提示',
                content: '在 "微信 > 发现 > 小程序"  可以找到我哦！',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        wx.setStorageSync('remindindex', 1)
                    }
                }
            })
        }

    },
    onShow: function () {
      var that = this
        if (wx.getStorageSync('openid')) {
          //请求自动登录
          wx.request({
            url: (getApp().apiUrl) + '/api/login/telLogin',
            data: {
              openid: wx.getStorageSync('openid'),//
              userPhone: wx.getStorageSync('userPhone'),
              avatarUrl: wx.getStorageSync('avatarUrl'),
              nickName: wx.getStorageSync('nickName'),
              unionId: wx.getStorageSync('unionId'),
              xcxorg: wx.getStorageSync('xcxorg'),
              xcxexr: wx.getStorageSync('xcxexr')
            },
            method: 'GET',
            success: function (loginres) {
              if (loginres.data.Code == 0) {
                if (wx.getStorageSync('id_token')) {
                  that.setData({
                    tokenid: wx.getStorageSync('id_token')
                  })
                  wx.setStorageSync('id_token', loginres.data.Data.tokenid)
                  wx.setStorageSync('openid', loginres.data.Data.wx_openid)
                  wx.setStorageSync('passwd', loginres.data.Data.passwd)
                  wx.setStorageSync('userid', loginres.data.Data.userid)
                  wx.setStorageSync('xcxorg', loginres.data.Data.xcxorg)
                  wx.setStorageSync('xcxexr', loginres.data.Data.xcxexr)
                  wx.getStorage({
                    key: 'userinfo',
                    success: function (userStorageinfores) {
                      that.setData({
                        img: '../../images/release.png',
                        url: '../release/homework',
                        Mineurl: '../mine/mine',
                        id_token: wx.getStorageSync('id_token'),
                        avatar_100: loginres.data.Data.avatar_100,
                        userid: '学号:' + userStorageinfores.data.userid,
                        onShareurl: 1     //'../onshare/homework?id=1'
                      });
                    }
                  })
                } else {
                  that.setData({
                    tokenid: loginres.data.Data.tokenid
                  })
                  wx.setStorageSync('id_token', loginres.data.Data.tokenid)
                  wx.setStorageSync('passwd', loginres.data.Data.passwd)
                  wx.setStorageSync('userid', loginres.data.Data.userid)
                  wx.setStorageSync('xcxorg', loginres.data.Data.xcxorg)
                  wx.setStorageSync('xcxexr', loginres.data.Data.xcxexr)
                  wx.setStorage({
                    key: "userinfo",
                    data: loginres.data.Data
                  })
                  that.setData({
                    img: '../../images/release.png',
                    url: '../release/homework',
                    Mineurl: '../mine/mine',
                    id_token: loginres.data.Data.tokenid,
                    avatar_100: loginres.data.Data.avatar_100,
                    userid: '学号:' + loginres.data.Data.userid,
                    onShareurl: 1     //'../onshare/homework?id=1'
                  })
                }

                wx.request({
                  url: (getApp().apiUrl) + '/api/Release/CouponList',
                  data: {
                    tokenid: loginres.data.Data.tokenid,
                    xcxorg: loginres.data.Data.xcxorg,
                    xcxexr: loginres.data.Data.xcxexr,
                    appver: getApp().appver
                  },
                  method: 'GET',
                  success: function (res) {

                    that.setData({
                      coupon_count: res.data[0].count
                    })
                  }
                })
              } else {
                that.setData({
                  tokenid: '',
                  img: '../../images/release.png',
                  url: '../login/register',
                  Mineurl: '../login/register',
                  avatar_100: '../../images/user-avatar.png',
                  userid: '登录/注册',
                  coupon_count: 0,
                  onShareurl: 0           //'../login/login'
                });
              }

            },
          })


            
        } else {
            that.setData({
                tokenid: '',
                img: '../../images/release.png',
                url: '../login/register',
                Mineurl: '../login/register',
                avatar_100: '../../images/user-avatar.png',
                userid: '登录/注册',
                coupon_count: 0,
                onShareurl: 0           //'../login/login'
            });
        }


        if (wx.getStorageSync('id_token')) {

            wx.request({
                url: (getApp().apiUrl) + '/api/OnShare/onShareList',
                data: {
                    tokenid: wx.getStorageSync('id_token'),
                    xcxorg: wx.getStorageSync('xcxorg'),
                    xcxexr: wx.getStorageSync('xcxexr')
                },
                method: 'GET',
                success: function (res) {
                    that.setData({
                        S: res.data.uinfo.S
                    })
                }
            })
        } else {
            that.setData({
                S: 0
            })
        }

    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: this.data.url
        })
    },
    bindMine: function () {
        wx.navigateTo({
            url: this.data.Mineurl
        })
    },
    invite: function () {
        wx.navigateTo({
            url: '../onshare/homework?id=1'
        })
    },
    onShare: function () {
        if (this.data.onShareurl == 0) {
            wx.navigateTo({
                url: '../login/register'
            })
        } else if (this.data.onShareurl == 1) {
            wx.showActionSheet({
                itemList: ['邀请得劵', '我的邀请'],
                success: function (res) {
                    if (res.tapIndex == 0) {
                        wx.navigateTo({
                            url: '../onshare/homework?id=1'
                        })
                    } else if (res.tapIndex == 1) {
                        wx.navigateTo({
                            url: '../onshare/mylist'
                        })
                    }
                }
            })
        }
    }


})
