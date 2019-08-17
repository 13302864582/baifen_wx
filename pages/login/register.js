// pages/login/register.js
// 从从60到到0倒计时
function countdown(that) {
  var second = that.data.second
  if (second == 0) {
    that.setData({
      obtain: '获取验证码'
    });
    return;
  }
  var time = setTimeout(function() {
    second = second - 1
    that.setData({
      second: second,
      obtain: second + '秒'
    });
    countdown(that);
  }, 1000)
}

Page({
  data: {
    grades: [{
        gradeid: 0,
        gradename: '选择年级'
      },
      {
        gradeid: 7,
        gradename: '一年级'
      },
      {
        gradeid: 8,
        gradename: '二年级'
      },
      {
        gradeid: 9,
        gradename: '三年级'
      },
      {
        gradeid: 10,
        gradename: '四年级'
      },
      {
        gradeid: 11,
        gradename: '五年级'
      },
      {
        gradeid: 12,
        gradename: '六年级'
      },
      {
        gradeid: 1,
        gradename: '初一'
      },
      {
        gradeid: 2,
        gradename: '初二'
      },
      {
        gradeid: 3,
        gradename: '初三'
      }
    ],
    index: 0,
    vcodeBtnHidden: 0,
    hidden: true,
    userPhone:""
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this

    wx.getSystemInfo({
      success: function(resSystem) {
        that.setData({
          system: resSystem.system,
          model: resSystem.model
        })
      }
    })
    that.setData({
      onshareid: options.onshareid
    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    if (wx.getStorageSync('second')) {
      countdown(this)
    } else {
      var that = this
      that.setData({
        second: 0,
        obtain: '获取验证码'
      });
    }
    var that = this
    wx.login({
      success: function(loginres) {
        that.lcode = loginres.code
        //console.log(loginres);
        wx.request({
          //code换取openid
          url: (getApp().apiUrl) + '/api/Aes/sendCode',
          data: {
            code: loginres.code,
            xcxorg: wx.getStorageSync('xcxorg'),
            xcxexr: wx.getStorageSync('xcxexr'),
          },
          method: 'GET',
          success: function(coderes) {
            if ("gradestr" in coderes.data) {
              console.log(coderes.data);
              if (typeof(coderes.data.gradestr) == "object" && coderes.data.gradestr != null) {
                if (coderes.data.gradestr.length > 0) {
                  that.setData({
                    grades: coderes.data.gradestr
                  });
                }
              }
            }
            if (wx.getStorageSync('openid')) {
              //wx.setStorageSync('openid', coderes.data.openid)
              that.setData({
                openid: wx.getStorageSync('openid')
              });
            } else {
              that.setData({
                openid: coderes.data.openid
              });
            }

          }
        })

      },

    })
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  bindGradeChange: function(e) {
    //console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value
    })
  },
  userPhoneInput: function(e) {
    this.setData({
      userPhone: e.detail.value
    })

    if (e.detail.value.length == 11) {
      var partten = /^1[1-9]\d{9}$/;
      if (partten.test(e.detail.value)) {
        this.setData({
          vcodeBtnHidden: 1
        })
      } else {
        this.setData({
          vcodeBtnHidden: 0
        })
      }
    } else {
      this.setData({
        vcodeBtnHidden: 0
      })
    }

  },
  obtain: function() {

    wx.request({
      url: (getApp().apiUrl) + '/api/index/sendSecurityCode',
      data: {
        userPhone: this.data.userPhone,
        xcxorg: wx.getStorageSync('xcxorg'),
        xcxexr: wx.getStorageSync('xcxexr')
      },
      method: 'GET',
      success: function(res) {
        var that = this
        if (res.data.Code == 1) {
          console.log(res.data);
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false

          })

        } else {
          console.log()

        }
      },
      fail: function(res) {
        console.log(res.data);
        console.log('is failed')
      }
    })

    //wx.setStorageSync('second', '60')
    this.setData({
      second: 60
    })
    countdown(this)
  },
  formSubmit: function(e) {
    //console.log(e.detail.value.gradeid)
    this.setData({
      hidden: false,
      loadingcontent: "请稍等..."
    })
    var longitude = this.data.longitude,
      latitude = this.data.latitude,
      province = this.data.province,
      city = this.data.city,
      location = this.data.location,
      phoneos = this.data.system,
      phonemodel = this.data.model
    if (!e.detail.value.userPhone) {
      this.setData({
        hidden: true,
        loadingcontent: ""
      })
      wx.showToast({
        title: '请填写手机号码',
        icon: 'loading',
        duration: 1000
      })
    }/* else if (!e.detail.value.code) {
      this.setData({
        hidden: true,
        loadingcontent: ""
      })
      wx.showToast({
        title: '请填写手机验证码',
        icon: 'loading',
        duration: 1000
      })
    } */
    else if (e.detail.value.gradeid == 0) {
      this.setData({
        hidden: true,
        loadingcontent: ""
      })
      wx.showToast({
        title: '请选择年级',
        icon: 'loading',
        duration: 1000
      })
    } else {
      //注册
      var that = this
      wx.request({
        url: (getApp().apiUrl) + '/api/login/telLogin',
        data: {
          userPhone: e.detail.value.userPhone,
          code: '000000',//e.detail.value.code
          gradeid: e.detail.value.gradeid,
          longitude: longitude,
          latitude: latitude,
          province: province,
          city: city,
          location: location,
          phoneos: phoneos,
          phonemodel: phonemodel,
          xcxorg: wx.getStorageSync('xcxorg'),
          xcxexr: wx.getStorageSync('xcxexr'),
          openid: that.data.openid,
          avatarUrl: wx.getStorageSync('avatarUrl'),
          nickName: wx.getStorageSync('nickName'),
          unionId: wx.getStorageSync('unionId'),
        },
        method: 'GET',
        success: function(res) {

          if (res.data.Code == 1) {
            that.setData({
              hidden: true,
              loadingcontent: ""
            })
            wx.showModal({
              title: '提示',
              content: res.data.Msg,
              showCancel: false

            })
          } else if (res.data.Code == 0) {
            //console.log(res.data)
            wx.setStorageSync('id_token', res.data.Data.tokenid)
            wx.setStorageSync('openid', res.data.Data.wx_openid)
            wx.setStorageSync('userPhone', e.detail.value.userPhone)
            wx.setStorageSync('passwd', res.data.Data.passwd)
            wx.setStorageSync('userid', res.data.Data.userid)
            wx.setStorageSync('xcxorg', res.data.Data.xcxorg)
            wx.setStorageSync('xcxexr', res.data.Data.xcxexr)
            wx.setStorage({
              key: "userinfo",
              data: res.data.Data
            })
            that.setData({
              hidden: true,
              loadingcontent: ""
            })
            if (that.data.onshareid == 1) {
              wx.switchTab({
                url: '../index/index'
              })
            } else {
              wx.navigateBack()
            }


            //注册后自动登陆
          } else if (res.data.Code == 2) {
            wx.removeStorage({
              key: 'userinfo'
            })
            wx.removeStorageSync('id_token')
            wx.removeStorageSync('userid')
          }
        }
      })
    }

  },
  /*
   *授权获取手机号
   */
  getPhoneNumber(e) {
    console.log(e)
    var that = this;
    wx.login({
      success: function (c) {
        wx.request({
          url: (getApp().apiUrl) + '/api/Aes/decrypt',
          data: {
            code: c.code,
            xcxorg: wx.getStorageSync('xcxorg'),
            xcxexr: wx.getStorageSync('xcxexr'),
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },
          method: 'GET',
          success: function (p) {
            console.log(p)
            that.setData({
              userPhone: p.data.purePhoneNumber
            })


          }

        })
      }
    })
    
  }
})