// pages/onshare/mylist.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.onLoading()
    
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  onLoading: function(){
    var that = this
    if (wx.getStorageSync('id_token')){
      
      wx.request({
      url: (getApp().apiUrl)+'/api/OnShare/onShareList',
      data: {
        tokenid: wx.getStorageSync('id_token'),
        xcxorg: wx.getStorageSync('xcxorg'),
        xcxexr: wx.getStorageSync('xcxexr')
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.Code == 2){
              wx.request({
                  url: (getApp().apiUrl)+'/api/login/reLogin',
                  data: {
                    username: wx.getStorageSync('userid'),
                    password: wx.getStorageSync('passwd'),
                    xcxorg: wx.getStorageSync('xcxorg'),
                    xcxexr: wx.getStorageSync('xcxexr')
                  },
                  method: 'GET',
                  success: function (reslogin) {
                    if(reslogin.data.Code == 1){
                      wx.redirectTo({
                        url: '/pages/login/register'
                      })
                    } else {
                      wx.setStorageSync('id_token', reslogin.data.tokenid)
                      wx.setStorageSync('userid', reslogin.data.userid)
                      wx.setStorageSync('xcxorg', reslogin.data.xcxorg)
                      wx.setStorageSync('xcxexr', reslogin.data.xcxexr)
                      wx.setStorage({
                        key:"userinfo",
                        data:reslogin.data
                      })
                    }
                  }
                })
          
        } else {
          that.setData({
            uinfo: res.data.uinfo,
            ulist:res.data.ulist
          })
        }
        
        console.log(res)
      }
    })
    } else {
      that.setData({
          uinfo: 0,
          ulist:0
        })
    }
  }
})