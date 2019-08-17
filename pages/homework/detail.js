// pages/detail/detail.js
var imageUtils = require('../../utils/util.js');  
Page({
  
  data:{
    current:0,
    indicatorDots: true,
    imageData:[],
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData ({
      id:options.id,
      iseglists:options.iseglists
    })
    
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
      url: (getApp().apiUrl)+'/api/HomeWork/homeworkdetail',
      data: {
        tokenid: wx.getStorageSync('id_token'),
        id:this.data.id,
        iseglists:this.data.iseglists,
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
      //console.log(that.data.state)
        
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

  loading:function(e){
    var that = this 
    
    wx.request({
      url: (getApp().apiUrl)+'/api/HomeWork/homeworkdetail',
      data: {
        tokenid: wx.getStorageSync('id_token'),
        id:this.data.id,
        iseglists:this.data.iseglists,
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
      //console.log(that.data.state)
        
      },
      fail: function (res) {
        console.log(res);
        console.log('is failed')
      }
    })
  },

  bindAnsUrl: function(e) {
    wx.navigateTo({
      url: 'ans?checkpointdata='+e.target.dataset.checkpointdata+'&iseglists='+this.data.iseglists
    })
  },
  adoptAnswer: function(e) {
    console.log(e.target.dataset.taskid);
    var that = this
    wx.request({
        url: (getApp().apiUrl)+'/api/OnShare/onShareList',
        data: {
          tokenid: wx.getStorageSync('id_token'),
          xcxorg: wx.getStorageSync('xcxorg'),
          xcxexr: wx.getStorageSync('xcxexr')
        },
        method: 'GET',
        success: function (inte) {
          
            that.setData({
              S:inte.data.uinfo.S
            })
          
        }
      })
    wx.showModal({
        title: '是否采纳',
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: (getApp().apiUrl)+'/api/HomeWork/homeWorkAdoptAnswer',
              data: {
                tokenid: wx.getStorageSync('id_token'),
                taskid:e.target.dataset.taskid,
                xcxorg: wx.getStorageSync('xcxorg'),
                xcxexr: wx.getStorageSync('xcxexr')
              },
              method: 'GET',
              success: function (rts) {
                //console.log(rts);
                
                if(rts.data.Code==0){
                  
                  wx.showModal({
                    title: '采纳成功',
                    content: '福利：邀请好友使用，使用后您可得'+that.data.S+'张作业劵',
                    confirmText: '马上邀请',
                    success: function(res) {
                      that.setData({
                        state:4
                      })
                      if (res.confirm) {
                        wx.redirectTo({
                          url: '/pages/onshare/homework?id=1'
                        })
                      }
                    }
                  })
                } else {
                  wx.showToast({
                    title: '作业当前状态不可采纳',
                    icon: 'loading',
                    duration: 1000
                  })
                }
              },
              fail: function (res) {
                console.log(res);
                console.log('is failed')
              }

            })
          }
        }
      })
  },
  refuseAnswer: function(e) {
      console.log(e.target.dataset.taskid);
      var that =this
      wx.showModal({
          title: '是否拒绝',
          success: function(res) {
            if (res.confirm) {
              wx.request({
                url: (getApp().apiUrl)+'/api/HomeWork/homeworkRefuseAnswer',
                data: {
                  tokenid: wx.getStorageSync('id_token'),
                  taskid:e.target.dataset.taskid,
                  xcxorg: wx.getStorageSync('xcxorg'),
                  xcxexr: wx.getStorageSync('xcxexr')
                },
                method: 'GET',
                success: function (rts) {
                console.log(rts);
                if(rts.data.Code==0){
                  wx.showToast({
                    title: '已拒绝',
                    icon: 'success',
                    duration: 1000,
                    success: function(){
                      that.setData({
                        state:5
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: '作业当前状态不可拒绝',
                    icon: 'loading',
                    duration: 1000
                  })
                }
                
              },
                fail: function (res) {
                  console.log(res);
                  console.log('is failed')
                }

              })
            }
          }
        })
    }
  
})