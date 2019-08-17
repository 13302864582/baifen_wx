// pages/recharge/payment.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var ctime = new Date().toLocaleString( )
    var cmonth =  new Date().getMonth()+1
    if(cmonth<10){
        cmonth = '0'+String(cmonth)
    }
    var cdate =  new Date().getDate()
    if(cdate<10){
        cdate = '0'+String(cdate)
    }
    var chours =  new Date().getHours()
    if(chours<10){
        chours = '0'+String(chours)
    }
    var cminutes =  new Date().getMinutes()
    if(cminutes<10){
        cminutes = '0'+String(cminutes)
    }
    var cseconds =  new Date().getSeconds()
    if(cseconds<10){
        cseconds = '0'+String(cseconds)
    }
    
    this.setData({
        payprice:options.pay,
        title:options.title,
        packageid: options.packageid,
        currenttime:ctime,
        orderid:String(new Date().getFullYear())+String(cmonth)+String(cdate)+String(chours)+String(cminutes)+String(cseconds)+(Math.floor(Math.random()*899999+100000)+1)
    })
    console.log(this.data.packageid)
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示

    //if (!wx.getStorageSync('openid')) {
      var that = this
      wx.login({
          success: function (loginres) {
              console.log(loginres);
              wx.request({
                  //code换取openid
                  url: (getApp().apiUrl) + '/api/Aes/sendCode',
                  data: {
                      code: loginres.code,
                      xcxorg: wx.getStorageSync('xcxorg'),
                      xcxexr: wx.getStorageSync('xcxexr'),
                  },
                  method: 'GET',
                  success: function (coderes) {
                      wx.setStorageSync('openid', coderes.data.openid)
                  }
              })

          },

      })
      
    //}
    //console.log(wx.getStorageSync('openid'))
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  paymentinfo:function(e){
    console.log(e.detail.value)
    wx.request({
        
        url: (getApp().apiUrl) + '/api/Payment/prePayMent',
        data: {
            openid: wx.getStorageSync('openid'),
            out_trade_no:e.detail.value.out_trade_no,
            body:e.detail.value.body,
            packageid: this.data.packageid,
            total_fee:e.detail.value.total_fee,
            xcxorg: wx.getStorageSync('xcxorg'),
            xcxexr: wx.getStorageSync('xcxexr'),
        },
        method: 'GET',
        success: function (response) {
          console.log(response)
            if(response.data.result_code=='SUCCESS'){
                console.log(response)
                wx.requestPayment({
                    'timeStamp': response.data.timeStamp,
                    'nonceStr': response.data.nonce_str,
                    'package': response.data.pkg,
                    'signType': 'MD5',
                    'paySign': response.data.paySign,
                    'success':function(res){
                        //console.log('success');
                        //console.log(res);
                      wx.switchTab({
                        url: '/pages/index/index'
                      })
                    },
                    'fail': function (res) {
                      console.log(res);
                    }
                });
            } else {
              
              wx.showModal({
                title: '提示',
                content: response.data.Msg,
                showCancel: false

              })
            }
            
        }
    })
  }
})