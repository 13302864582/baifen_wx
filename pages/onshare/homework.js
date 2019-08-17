// pages/detail/detail.js
var imageUtils = require('../../utils/util.js');  
Page({
  
  data:{
    current:0,
    indicatorDots: true,
    imageData:[]
  },
  onShareAppMessage: function () {
    return {
      title: '百分作业帮你检查家庭作业',
      desc: '百分作业在线作业检查，前所未有的细致',
      path: this.data.onsharePath
    }
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    
    if(options.id==1){
      this.setData({
        applyurl:'',
        applytext:'请点击右上角进行分享',
        ansurl:'id=1',
        onsharePath:'/pages/onshare/homework?xcxorg='+wx.getStorageSync('xcxorg')+'&xcxexr='+wx.getStorageSync('xcxexr')
      })
    }else{
      this.setData({
        applyurl:'../login/register?onshareid=1',
        applytext:'免费申请批改作业',
        ansurl:'',
      })
      if(options.xcxorg){
        wx.setStorageSync('xcxorg', options.xcxorg)
      }
      if(options.xcxexr){
        wx.setStorageSync('xcxexr', options.xcxexr)
      }
      if(!wx.getStorageSync('remindonshare')){
      wx.showModal({
        title: '用户提示',
        content: '在 "微信 > 发现 > 小程序"  可以找到我哦！',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            wx.setStorageSync('remindonshare', 1)
          }
        }
      })
    }
    }
    console.log(this.data.onsharePath)
    console.log(options.xcxorg)
    console.log(wx.getStorageSync('xcxorg'))
  },
  onReady:function(){
    // 页面渲染完成
    
  },
  onShow:function(){
    // 页面显示
    //console.log(this.data.id)
    //console.log(this.data.current)
    var that = this 
    
    wx.request({
      url: (getApp().apiUrl)+'/api/OnShare/homeWorkDetail',
      data: {
        tokenid: wx.getStorageSync('id_token'),
        xcxorg: wx.getStorageSync('xcxorg'),
        xcxexr: wx.getStorageSync('xcxexr')
      },
      method: 'GET',
      success: function (res) {
        //console.log(that.data.pageList)
        //console.log(that.data.pageList[0].checkpointlist)
        console.log(res)
        if(res.data.pagelist){
          for (var i=0;i<res.data.pagelist.length;i++){
            var scale = imageUtils.imageUtil(res.data.pagelist[i].width,res.data.pagelist[i].height,i)
            console.log(scale)
            //res.data.pagelist[i].marginTop = scale.marginTop;
              if(res.data.pagelist[i].checkpointlist){
                for(var j=0;j<res.data.pagelist[i].checkpointlist.length;j++){
                    //console.log(res.data.pagelist[i].checkpointlist[j].coordinate)
                  var strs=res.data.pagelist[i].checkpointlist[j].coordinate.split(",") 
                  //res.data.pagelist[i].checkpointlist[j].coordinate_x = Math.round(scale.imageWidth*strs[0]-j*30)
                  //res.data.pagelist[i].checkpointlist[j].coordinate_y = Math.round(scale.imageHeight*strs[1]-scale.imageHeight)
                  if(scale.marginTop>0){
                    res.data.pagelist[i].checkpointlist[j].coordinate_x = Math.round(scale.imageWidth*strs[0])
                    res.data.pagelist[i].checkpointlist[j].coordinate_y = Math.round(scale.imageHeight*strs[1]+scale.marginTop)
                  } else {
                    res.data.pagelist[i].checkpointlist[j].coordinate_x = Math.round(scale.imageWidth*strs[0]+scale.marginLeft+20)
                    res.data.pagelist[i].checkpointlist[j].coordinate_y = Math.round(scale.imageHeight*strs[1])
                  }
                  
                }
              }
          }
        }
        
        that.setData({
          pageList:res.data.pagelist,
          state:res.data.state,
          taskid:res.data.taskid
        })
      console.log(that.data.state)
        
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

  bindAnsUrl: function(e) {
    wx.navigateTo({
      url: 'detail?checkpointdata='+e.target.dataset.checkpointdata+'&'+this.data.ansurl
    })
  },
  apply:function(){
    wx.navigateTo({
      url: this.data.applyurl
    })
  }
  
})