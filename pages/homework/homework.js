// pages/homework/homework.js
Page({
  data:{
      homeworkList:[],
      hidden:true,
      count:5
  },
  onPullDownRefresh: function(){
    //page.onShow()
    var that = this 
    
    if(wx.getStorageSync('id_token')){
      wx.getStorage({
        key: 'userinfo',
        success: function(userinfo) {
            that.setData({
            gradeid:userinfo.data.gradeid
          });
        } 
      })
      wx.request({
        url: (getApp().apiUrl)+'/api/HomeWork/xcxHwList',
        data: {
          tokenid: wx.getStorageSync('id_token'),
          page:'1',
          count:that.data.count,
          xcxorg: wx.getStorageSync('xcxorg'),
          xcxexr: wx.getStorageSync('xcxexr'),
          gradeid:that.data.gradeid
        },
        method: 'GET',
        success: function (res) {
          
          that.setData({
            homeworkList:res.data.hwlist,
            hwtipInfos:res.data.tipInfos.remark,
            iseglists:res.data.iseglists,
            hidden:true,
          })
          //console.log(that.data.homeworkList)
        },
        fail: function (res) {
          console.log(res);
          console.log('is failed')
        }
      })
    }
    wx.stopPullDownRefresh()
  },
  
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
            that.setData({
            gradeid:userinfo.data.gradeid
          });
        } 
      })
      wx.request({
        url: (getApp().apiUrl)+'/api/HomeWork/xcxHwList',
        data: {
          tokenid: wx.getStorageSync('id_token'),
          page:'1',
          count:that.data.count,
          xcxorg: wx.getStorageSync('xcxorg'),
          xcxexr: wx.getStorageSync('xcxexr'),
          gradeid:that.data.gradeid
        },
        method: 'GET',
        success: function (res) {
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
            
            homeworkList:res.data.hwlist,
            hwtipInfos:res.data.tipInfos.remark,
            iseglists:res.data.iseglists

          })
        }
          
          //console.log(that.data.iseglists)
        },
        fail: function (res) {
          console.log(res);
          console.log('is failed')
        }
      })
    
    
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  onReachBottom: function() {
    
    var that = this 
    if(wx.getStorageSync('id_token')){
      that.setData( {
        count: this.data.count + 5,
        hidden:false,
      })
      wx.getStorage({
        key: 'userinfo',
        success: function(userinfo) {
            that.setData({
            gradeid:userinfo.data.gradeid
          });
        } 
      })
      wx.request({
        url: (getApp().apiUrl)+'/api/HomeWork/xcxHwList',
        data: {
          tokenid: wx.getStorageSync('id_token'),
          page:'1',
          count:that.data.count,
          xcxorg: wx.getStorageSync('xcxorg'),
          xcxexr: wx.getStorageSync('xcxexr'),
          gradeid:that.data.gradeid
        },
        method: 'GET',
        success: function (res) {
          
          that.setData({
            homeworkList:res.data.hwlist,
            hwtipInfos:res.data.tipInfos.remark,
            iseglists:res.data.iseglists,
            hidden:true,
          })
          //console.log(that.data.homeworkList)
        },
        fail: function (res) {
          console.log(res);
          console.log('is failed')
        }
      })
    }
  },
})
