function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function imageUtil(w,h,id) {
  var imageSize = [];
  var originalWidth = w;//图片原始宽
  var originalHeight = h;//图片原始高
  var originalScale = originalHeight/originalWidth;//图片高宽比
  //获取屏幕宽高
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight/windowWidth;//屏幕高宽比
      if(originalScale < windowscale){//图片高宽比小于屏幕高宽比
        //图片缩放后的宽为屏幕宽
         imageSize.imageWidth = windowWidth;
         imageSize.imageHeight = Math.round((windowWidth * originalHeight) / originalWidth);
         imageSize.marginTop = (windowHeight*0.9-imageSize.imageHeight)/2;
         imageSize.marginLeft = (windowWidth-imageSize.imageWidth)/2;
      }else{//图片高宽比大于屏幕高宽比
        //图片缩放后的高为屏幕高
         
         imageSize.imageWidth = Math.round((windowHeight * originalWidth) / originalHeight);
         imageSize.imageHeight = windowHeight*0.9;
         imageSize.marginTop = (windowHeight*0.9-imageSize.imageHeight)/2;
         imageSize.marginLeft = (windowWidth-imageSize.imageWidth)/2;
      }
      //console.log(imageSize)
    }
  })
  return imageSize;
}

module.exports = {
  imageUtil: imageUtil
}
