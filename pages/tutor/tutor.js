// pages/tutor/tutor.js
Page({
  data:{
      
  },
  
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
       
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var bespokephone = [];
    var bespoketime = [];
    var hour = new Date().getHours() 

    for (var i=0; i<6;i++){
      var arr = ["3", "5", "7", "8"];
　　　　var rs = Math.floor((Math.random()*arr.length));
       bespokephone[i]="1"+arr[rs]+(Math.floor(Math.random()*890+100)+1)+"***"+(Math.floor(Math.random()*890+100)+1)
       var mydate = new Date(new Date().getTime()-70000*i*20);
       bespoketime[i] = mydate.toLocaleString();
    }
    //console.log(hour)
    this.setData ({
      bespokephone:bespokephone,
      bespoketime:bespoketime,
      hour:hour
    })
    var that = this
    wx.request({
      url: (getApp().apiUrl)+'/api/index/OrgInfo',
      data: {
        xcxorg: wx.getStorageSync('xcxorg'),
        xcxexr: wx.getStorageSync('xcxexr')
      },
      method: 'GET',
      success: function (res) {
        console.log()
        that.setData({
          phone:res.data.phone,
          orginfo:res.data.orginfo,
          orgname:res.data.orgname,
          school:res.data.school[0]
        })
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
  callPhone:function(e){
    //console.log(e.currentTarget.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  }
})