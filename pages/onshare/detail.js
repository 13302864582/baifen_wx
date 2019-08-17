// pages/homework/ans.js
var imageUtils = require('../../utils/util.js');  
Page({
  
  data: {
    sound:'../../images/sound.png'
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
    this.setData ({
      checkpointdata:options.checkpointdata.split(",") 
    })
    //checkpointdata 由detail传递过来的数据0为checkpointid，1为图片，2为原图宽，3为原图长,4为作业状态
    if(options.id==1){
      this.setData({
        applyurl:'',
        applytext:'请点击右上角进行选择分享',
        onsharePath:'/pages/onshare/homework?xcxorg='+wx.getStorageSync('xcxorg')+'&xcxexr='+wx.getStorageSync('xcxexr')
      })
    }else{
      this.setData({
        applyurl:'../login/register?onshareid=1',
        applytext:'免费申请批改作业'
      })
    }
  },

  onReady:function(){
    // 页面渲染完成
  },

  onShow:function(){
    // 页面显示
    var that = this 

    wx.request({
      url: (getApp().apiUrl)+'/api/OnShare/homeworkexplain',
      data: {
        tokenid: wx.getStorageSync('id_token'),
        checkpointid:that.data.checkpointdata[0],
        xcxorg: wx.getStorageSync('xcxorg'),
        xcxexr: wx.getStorageSync('xcxexr')
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var scale = imageUtils.imageUtil(that.data.checkpointdata[2],that.data.checkpointdata[3])
        console.log(scale)
        
        for(var i=0;i<res.data.length;i++){
          console.log(res.data[i].coordinate)
          var strs=res.data[i].coordinate.split(",")
          //res.data[i].coordinate_x = Math.round(scale.imageWidth*strs[0])
          //res.data[i].coordinate_y = Math.round(scale.imageHeight*strs[1]-scale.imageHeight-i*24)
            if(scale.marginTop>0){
              res.data[i].coordinate_x = Math.round(scale.imageWidth*strs[0])
              res.data[i].coordinate_y = Math.round(scale.imageHeight*strs[1]+scale.marginTop)
            } else {
              res.data[i].coordinate_x = Math.round(scale.imageWidth*strs[0]+scale.marginLeft)
              res.data[i].coordinate_y = Math.round(scale.imageHeight*strs[1]+20)
            }
        }
        that.setData({
          coordinateList:res.data,
          marginTop : scale.marginTop,
          correctHeight:scale.imageHeight,
          state:that.data.checkpointdata[4]
        })
      console.log(that.data.coordinateList.marginTop)
        
      },
      fail: function (res) {
        console.log(res);
        console.log('is failed')
      }
    })
  },
  onHide:function(){
    // 页面隐藏
    wx.pauseBackgroundAudio()
  },
  onUnload:function(){
    // 页面关闭
    wx.pauseBackgroundAudio()
  },
  gotoPlay: function (e) {  
    //var filePath = ;  
    //点击开始播放  
    console.log(e)
    
    if(e.currentTarget.dataset.id==0){
        this.setData ({
        'soundset[0]':'../../images/sound-y.png',
      })
    } else if(e.currentTarget.dataset.id==1){
        this.setData ({
        'soundset[1]':'../../images/sound-y.png',
      })
    } else if(e.currentTarget.dataset.id==2){
        this.setData ({
        'soundset[2]':'../../images/sound-y.png',
      })
    } else if(e.currentTarget.dataset.id==3){
        this.setData ({
        'soundset[3]':'../../images/sound-y.png',
      })
    } else if(e.currentTarget.dataset.id==4){
        this.setData ({
        'soundset[4]':'../../images/sound-y.png',
      })
    } else if(e.currentTarget.dataset.id==5){
        this.setData ({
        'soundset[5]':'../../images/sound-y.png',
      })
    } else if(e.currentTarget.dataset.id==6){
        this.setData ({
        'soundset[6]':'../../images/sound-y.png',
      })
    } else if(e.currentTarget.dataset.id==7){
        this.setData ({
        'soundset[7]':'../../images/sound-y.png',
      })
    } else if(e.currentTarget.dataset.id==8){
        this.setData ({
        'soundset[8]':'../../images/sound-y.png',
      })
    } else if(e.currentTarget.dataset.id==9){
        this.setData ({
        'soundset[9]':'../../images/sound-y.png',
      })
    }
    
    console.log(this.data.soundset)
    wx.playBackgroundAudio({
        dataUrl: e.currentTarget.dataset.sndpath,
        title: '答案',
        coverImgUrl: '../../images/sound.png'
    })
    
   },
  gotoText: function (e) {
    wx.showModal({
      content: e.currentTarget.dataset.text,
      showCancel:false
    })
  },
  apply:function(){
    wx.navigateTo({
      url: this.data.applyurl
    })
  }
})