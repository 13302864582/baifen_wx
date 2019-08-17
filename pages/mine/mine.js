// pages/mine/mine.js
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
    
    var that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(userinfo) {
        console.log(userinfo)
          that.setData({
          userid: userinfo.data.userid,
          grade:userinfo.data.grade,
          name:userinfo.data.name
        })
      } 
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  login_out: function() {
    //wx.removeStorageSync('id_token')
    //wx.removeStorage({
    //  key: 'userinfo'
    //})
    wx.showActionSheet({
      itemList: ['退出登陆'],
      success: function(res) {
        console.log(res.tapIndex)
        if(res.tapIndex==0){
          wx.removeStorage({key: 'userinfo'})
          wx.removeStorageSync('id_token')
          wx.removeStorageSync('userid')
          wx.removeStorageSync('openid')
          wx.removeStorageSync('userPhone')
          wx.navigateBack()
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },

})