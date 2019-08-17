// pages/index/homework.js
Page({
    data: {
        imageurl: [],
        hidden: true,
        imagesnumset: 2,
        click:0
    },
    onShow: function () {
        // Do something when page show.
        var that = this

        wx.getStorage({
            key: 'userinfo',
            success: function (userinfo) {
                that.setData({
                    supervip: userinfo.data.supervip
                })
            }
        })
        
        //请求作业辅导列表返回作业劵id
        wx.request({
            url: (getApp().apiUrl) + '/api/Release/CouponList',
            data: {
                tokenid: wx.getStorageSync('id_token'),
                xcxorg: wx.getStorageSync('xcxorg'),
                xcxexr: wx.getStorageSync('xcxexr'),
                appver:getApp().appver
            },
            method: 'GET',
            success: function (res) {
                console.log(res)
                if (res.data.Code == 2) {
                    wx.request({
                        url: (getApp().apiUrl) + '/api/login/reLogin',
                        data: {
                            username: wx.getStorageSync('userid'),
                            password: wx.getStorageSync('passwd'),
                            xcxorg: wx.getStorageSync('xcxorg'),
                            xcxexr: wx.getStorageSync('xcxexr'),
                            appver:getApp().appver
                        },
                        method: 'GET',
                        success: function (reslogin) {
                            if (reslogin.data.Code == 1) {
                                wx.redirectTo({
                                    url: '/pages/login/register'
                                })
                            } else {
                                wx.setStorageSync('id_token', reslogin.data.tokenid)
                                wx.setStorageSync('userid', reslogin.data.userid)
                                wx.setStorageSync('xcxorg', reslogin.data.xcxorg)
                                wx.setStorageSync('xcxexr', reslogin.data.xcxexr)
                                wx.setStorage({
                                    key: "userinfo",
                                    data: reslogin.data
                                })
                            }
                        }
                    })

                } else if (res.data.Code == 1) {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'loading',
                        duration: 20000000,
                        mask: true
                    })

                } else {
                    that.setData({
                        coupon_count: res.data[0].count,
                        coupon_id: res.data[0].id
                    })
                }

            },
            fail: function (res) {
                console.log(res);
                console.log('is failed')
            }
        })
        //请求科目
        wx.request({
            url: (getApp().apiUrl) + '/api/Release/PublishTaskSubjects',
            data: {
                tokenid: wx.getStorageSync('id_token'),
                xcxorg: wx.getStorageSync('xcxorg'),
                xcxexr: wx.getStorageSync('xcxexr'),
                appver:getApp().appver
            },
            method: 'GET',
            success: function (res) {
                console.log(res)
                if (res.data.Code == 1) {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'loading',
                        duration: 20000000,
                        mask: true
                    })
                } else {
                    that.setData({
                        subjects: res.data
                    })
                }

            },
            fail: function (res) {
                console.log(res);
                console.log('is failed')
            }
        })
        //请求邀请送劵
        wx.request({
            url: (getApp().apiUrl) + '/api/Release/checkShare',
            data: {
                tokenid: wx.getStorageSync('id_token'),
                xcxorg: wx.getStorageSync('xcxorg'),
                xcxexr: wx.getStorageSync('xcxexr'),
                appver:getApp().appver
            },
            method: 'GET',
            success: function (resShare) {
                if (resShare.data.Code == 1) {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'loading',
                        duration: 20000000,
                        mask: true
                    })
                } else {
                    that.setData({
                        S:resShare.data.S
                    })
                }
            }
        })
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var subjects = this.data.subjects;
        for (var i = 0, len = subjects.length; i < len; ++i) {
            subjects[i].checked = subjects[i].subjectid == e.detail.value;
        }
        this.setData({
            subjects: subjects,
            subjectidExist: e.detail.value
        });
    },

    //选择图片
    chooseImage: function () {
        var that = this
        wx.chooseImage({
            sourceType: ['album', 'camera'],
            sizeType: ['compressed'],
            count: that.data.imagesnumset,
            success: function (res) {
                //console.log(res)
                if (that.data.imageurl.length >= that.data.imagesnumset) {
                    wx.showToast({
                        title: '只能发布两张图片',
                        icon: 'loading',
                        duration: 1000
                    })
                } else {
                    if(that.data.coupon_count==0){
                        wx.showModal({
                            title: '提示',
                            content: '您当前没有作业劵，无法发布作业',
                            showCancel: false
                        })
                    } else if(that.data.coupon_count<res.tempFilePaths.length||that.data.coupon_count<=that.data.imageurl.length){
                        
                        wx.showModal({
                            title: '提示',
                            content: '您当前作业劵为'+that.data.coupon_count+'张，只能发布'+that.data.coupon_count+'页',
                            showCancel: false
                        })
                    } else {

                        for (var i = 0; i < res.tempFilePaths.length; ++i) {
                            if (that.data.imageurl.length < that.data.imagesnumset) {
                                that.data.imageurl.push(res.tempFilePaths[i]);
                            }
                        }
                        that.setData({
                            imageList: that.data.imageurl,
                            imagelength: that.data.imageurl.length
                        });
                    }
                }

                console.log(that.data.imagelength)

            }
        })

    },

    //预览图片
    previewImage: function (e) {
        var current = e.target.dataset.src

        wx.previewImage({
            current: current,
            urls: this.data.imageList

        })
    },

//删除图片
    delImage: function (e) {
        var dataid = e.target.dataset.id;
        this.data.imageurl.splice(dataid, 1)
        //console.log(this.data.imageurl)
        this.setData({
            imageList: this.data.imageurl,
            imagelength: this.data.imageurl.length
        });
    },

    homeworkpublish: function (e) {
        var longitude = this.data.longitude,
            latitude = this.data.latitude,
            province = this.data.province,
            city = this.data.city,
            location = this.data.location,
            phoneos = this.data.system,
            phonemodel = this.data.model
        if (e.detail.value.subjectid == 0 || e.detail.value.subjectid == '' || e.detail.value.subjectid == undefined || e.detail.value.subjectid == null) {
            wx.showModal({
                content: '选择科目',
                showCancel: false
            })
        } else {
            this.setData({
                hidden: false,
                click:1,
                loadingcontent: "正在准备发布作业"
            })
            var that = this
            console.log(e)
            wx.request({
                url: (getApp().apiUrl) + '/api/Release/homeWorkPublish',
                data: {
                    tokenid: wx.getStorageSync('id_token'),
                    subjectid: e.detail.value.subjectid,
                    couponid: that.data.coupon_id,
                    longitude: longitude,
                    latitude: latitude,
                    province: province,
                    city: city,
                    location: location,
                    phoneos: phoneos,
                    phonemodel: phonemodel,
                    num: that.data.imagelength,
                    xcxorg: wx.getStorageSync('xcxorg'),
                    xcxexr: wx.getStorageSync('xcxexr'),
                    appver:getApp().appver
                },
                method: 'GET',
                success: function (res) {
                    console.log(res)
                    if (res.data.Code == 1) {
                        wx.showToast({
                            title: res.data.Msg,
                            icon: 'loading',
                            duration: 20000000,
                            mask: true
                        })
                    } else {
                        that.setData({
                            taskid: res.data.taskid
                        })
                        //上传图片并完成作业作业发布
                        that.syncUploadImages(that.data.imageList, that.data.imageList.length);
                    }
                },

                fail: function (res) {
                    console.log(res);
                    console.log('is failed')
                }
            })
            //console.log(that.data.taskid)
        }

    },

    syncUploadImages: function (imageListDatas, i) {

        var that = this
        var imageListData = imageListDatas.pop();
        that.setData({
            loadingcontent: "上传图片/剩余" + i + "张"
        })
        wx.uploadFile({
            url: (getApp().apiUrl) + '/api/release/Upload', //真实的接口地址

            filePath: imageListData,
            name: 'photo',
            formData: {
                taskid: that.data.taskid,
                tokenid: wx.getStorageSync('id_token'),
                picseqid: i,
                appver:getApp().appver
            },
            success: function (res) {
                console.log(res)
                console.log(imageListDatas)
                if (res.data.Code == 1) {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'loading',
                        duration: 20000000,
                        mask: true
                    })
                } else {
                    if (imageListDatas.length > 0) {
                        that.syncUploadImages(imageListDatas, i - 1);
                    } else {
                        //完成发布作业
                        that.setData({
                            loadingcontent: "正在完成发布作业"
                        })
                        wx.request({
                            url: (getApp().apiUrl) + '/api/Release/HomeWorkUpoadFinish',
                            data: {
                                tokenid: wx.getStorageSync('id_token'),
                                taskid: that.data.taskid,
                                num: that.data.imagelength,
                                xcxorg: wx.getStorageSync('xcxorg'),
                                xcxexr: wx.getStorageSync('xcxexr'),
                                appver:getApp().appver
                            },
                            method: 'GET',
                            success: function (res) {

                                that.setData({
                                    hidden: true
                                })

                                wx.getLocation({
                                    type: 'wgs84',
                                    success: function (locationres) {
                                        //console.log(res.longitude)
                                        //console.log(res.latitude)
                                        wx.request({
                                            url: (getApp().apiUrl) + '/api/index/restapiAmap',
                                            data: {
                                                longitude: locationres.longitude,
                                                latitude: locationres.latitude
                                            },
                                            method: 'GET',
                                            success: function (resmap) {
                                                console.log(resmap)
                                                if (resmap.data.status == 1) {
                                                    wx.request({
                                                        url: (getApp().apiUrl) + '/api/Release/SetPosition',
                                                        data: {
                                                            tokenid: wx.getStorageSync('id_token'),
                                                            taskid: that.data.taskid,
                                                            longitude: locationres.longitude,
                                                            latitude: locationres.latitude,
                                                            location: resmap.data.location,
                                                            xcxorg: wx.getStorageSync('xcxorg'),
                                                            xcxexr: wx.getStorageSync('xcxexr'),
                                                            appver:getApp().appver
                                                        },
                                                        method: 'GET',
                                                        success: function (res) {
                                                            wx.request({
                                                                url: (getApp().apiUrl) + '/api/Release/checkShare',
                                                                data: {
                                                                    tokenid: wx.getStorageSync('id_token'),
                                                                    xcxorg: wx.getStorageSync('xcxorg'),
                                                                    xcxexr: wx.getStorageSync('xcxexr'),
                                                                    appver:getApp().appver
                                                                },
                                                                method: 'GET',
                                                                success: function (rescheckShare) {
                                                                    if (rescheckShare.data.Code == 1) {
                                                                        wx.showToast({
                                                                            title: res.data.Msg,
                                                                            icon: 'loading',
                                                                            duration: 20000000,
                                                                            mask: true
                                                                        })
                                                                    } else if(rescheckShare.data.showshare==1) {
                                                                        wx.showModal({
                                                                        title: '福利',
                                                                        content: '邀请好友使用，即可得'+rescheckShare.data.S+'张免费券，多邀多得！',
                                                                        cancelText:'稍后邀请',
                                                                        confirmText:'马上邀请',
                                                                        success: function(res) {
                                                                            if (res.confirm) {
                                                                                wx.redirectTo({
                                                                                    url: '../onshare/homework?id=1'
                                                                                })
                                                                            } else {
                                                                                wx.switchTab({
                                                                                    url: '../homework/homework'
                                                                                })
                                                                            }
                                                                        }
                                                                        })
                                                                    } else {
                                                                        wx.switchTab({
                                                                            url: '../homework/homework'
                                                                        })
                                                                    } 
                                                                }
                                                            })
                                                        
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    },
                                    fail: function () {
                                        wx.request({
                                            url: (getApp().apiUrl) + '/api/Release/checkShare',
                                            data: {
                                                tokenid: wx.getStorageSync('id_token'),
                                                xcxorg: wx.getStorageSync('xcxorg'),
                                                xcxexr: wx.getStorageSync('xcxexr'),
                                                appver:getApp().appver
                                            },
                                            method: 'GET',
                                            success: function (rescheckShare) {
                                                if (rescheckShare.data.Code == 1) {
                                                    wx.showToast({
                                                        title: res.data.Msg,
                                                        icon: 'loading',
                                                        duration: 20000000,
                                                        mask: true
                                                    })
                                                } else if(rescheckShare.data.showshare==1) {
                                                    wx.showModal({
                                                    title: '福利',
                                                    content: '邀请好友使用，即可得'+rescheckShare.data.S+'张免费券，多邀多得！',
                                                    cancelText:'稍后邀请',
                                                    confirmText:'马上邀请',
                                                    success: function(res) {
                                                        if (res.confirm) {
                                                            wx.redirectTo({
                                                                url: '../onshare/homework?id=1'
                                                            })
                                                        } else {
                                                            wx.switchTab({
                                                                url: '../homework/homework'
                                                            })
                                                        }
                                                    }
                                                    })
                                                } else {
                                                    wx.switchTab({
                                                        url: '../homework/homework'
                                                    })
                                                } 
                                            }
                                        })
                                    }
                                })

                                /*wx.switchTab({
                                    url: '../homework/homework'
                                })*/

                            }
                        })
                    }
                }

                //console.log(that.data.imageList)
            }
        })
    },
invite: function () {
    wx.navigateTo({
            url: '../onshare/homework?id=1'
        })
    },

})
