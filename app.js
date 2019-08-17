//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    
    
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.encryptedData
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  },
  apiUrl:'https://xc.baifen.lantel.net',
  xcxorg:'10165_0_0_0',
  xcxexr:'ea_eb',
  appver:'3036'
})