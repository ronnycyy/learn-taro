## RN API

â support

âï¸ todo

ð¤ let me think

ð éè¦å¼å¥ç¬¬ä¸æ¹åºåçæ¯æ

â unsupport

### ç½ç»

#### åèµ·è¯·æ±

â wx.request 

#### ä¸ä¼ ãä¸è½½

âï¸ wx.uploadFile (ä¾èµ chooseImage)

ð wx.downloadFile

#### WebSocket

â wx.connectSocket

â wx.onSocketOpen

â wx.onSocketError

â wx.sendSocketMessage

â wx.onSocketMessage

â wx.closeSocket

â wx.onSocketClose

â SocketTask

### åªä½

#### å¾ç

ð wx.chooseImage (IOSæå®æ¹APIæ¯æï¼ä½è¯¥APIè¿äºç®åï¼è¡¨ç°ä¸æ³è±¡ä¸åï¼ä¸å¨çæºä¸ä¼éªé)

â wx.previewImage

â wx.getImageInfo (ä»è½è¿åå®½é«)

â wx.saveImageToPhotosAlbum
        

#### å½é³

ð wx.startRecord

ð wx.stopRecord

#### å½é³ç®¡ç

ð wx.getRecorderManager
    

#### é³é¢æ­æ¾æ§å¶

ð wx.playVoice
ð wx.pauseVoice
ð wx.stopVoice

#### é³ä¹æ­æ¾æ§å¶

ð¤ wx.getBackgroundAudioPlayerState

ð¤ wx.playBackgroundAudio

ð¤ wx.pauseBackgroundAudio

ð¤ wx.seekBackgroundAudio

ð¤ wx.stopBackgroundAudio

ð¤ wx.onBackgroundAudioPlay

ð¤ wx.onBackgroundAudioPause

ð¤ wx.onBackgroundAudioStop
        

#### èæ¯é³é¢æ­æ¾ç®¡ç

ð¤ wx.getBackgroundAudioManager
        

#### é³é¢ç»ä»¶æ§å¶

ð wx.createAudioContext

ð wx.createInnerAudioContext
        

#### è§é¢

ð wx.chooseVideo  (åwx.chooseImageä¸æ ·)

â wx.saveVideoToPhotosAlbum
        

#### è§é¢ç»ä»¶æ§å¶

ð wx.createVideoContext
        

#### ç¸æºç»ä»¶æ§å¶

ð¤ wx.createCameraContext
        

#### å®æ¶é³è§é¢

ð¤ wx.createLivePlayerContext

ð¤ wx.createLivePusherContext
        

#### æä»¶

ð¤ wx.saveFile

ð¤ wx.getFileInfo

ð¤ wx.getSavedFileList

ð¤ wx.getSavedFileInfo

ð wx.removeSavedFile

ð wx.openDocument

#### æ°æ®ç¼å­

â wx.setStorage

â wx.setStorageSync  (å rnåé¨çapiæ¯å¼æ­¥çï¼æä»¥ä¸æ¯æ)

â wx.getStorage

â wx.getStorageSync  (å rnåé¨çapiæ¯å¼æ­¥çï¼æä»¥ä¸æ¯æ)

â wx.getStorageInfo

â wx.getStorageInfoSync   (å rnåé¨çapiæ¯å¼æ­¥çï¼æä»¥ä¸æ¯æ)

â wx.removeStorage

â wx.removeStorageSync  (å rnåé¨çapiæ¯å¼æ­¥çï¼æä»¥ä¸æ¯æ)

â wx.clearStorage

â wx.clearStorageSync   (å rnåé¨çapiæ¯å¼æ­¥çï¼æä»¥ä¸æ¯æ)

### ä½ç½®

#### è·åä½ç½®

â wx.getLocation

â wx.chooseLocation

#### æ¥çä½ç½®

â wx.openLocation

#### å°å¾ç»ä»¶æ§å¶

â wx.createMapContext

### è®¾å¤

#### ç³»ç»ä¿¡æ¯

â wx.getSystemInfo

â wx.getSystemInfoSync

âï¸ wx.canIUse

#### ç½ç»ç¶æ

â wx.getNetworkType

â wx.onNetworkStatusChange

#### å éåº¦è®¡

ð wx.onAccelerometerChange

ð wx.startAccelerometer

ð wx.stopAccelerometer

#### ç½ç

ð wx.onCompassChange

ð wx.startCompass

ð wx.stopCompass

#### æ¨æçµè¯

â wx.makePhoneCall

#### æ«ç 

ð wx.scanCode

#### åªè´´æ¿

â wx.setClipboardData

â wx.getClipboardData

#### èç

ð wx.openBluetoothAdapter

ð wx.closeBluetoothAdapter

ð wx.getBluetoothAdapterState

ð wx.onBluetoothAdapterStateChange

ð wx.startBluetoothDevicesDiscovery

ð wx.stopBluetoothDevicesDiscovery

ð wx.getBluetoothDevices

ð wx.getConnectedBluetoothDevices

ð wx.onBluetoothDeviceFound

ð wx.createBLEConnection

ð wx.closeBLEConnection

ð wx.getBLEDeviceServices

ð wx.getBLEDeviceCharacteristics

ð wx.readBLECharacteristicValue

ð wx.writeBLECharacteristicValue

ð wx.notifyBLECharacteristicValueChange

ð wx.onBLEConnectionStateChange

ð wx.onBLECharacteristicValueChange

#### iBeacon

â wx.startBeaconDiscovery

â wx.stopBeaconDiscovery

â wx.getBeacons

â wx.onBeaconUpdate

â wx.onBeaconServiceChange

#### å±å¹äº®åº¦

â wx.setScreenBrightness

â wx.getScreenBrightness

â wx.setKeepScreenOn

#### ç¨æ·æªå±äºä»¶

â wx.onUserCaptureScreen

#### æ¯å¨

â wx.vibrateLong

â wx.vibrateShort ï¼IOSæ¯å¨é´éæ¯åºå®çï¼

#### ææºèç³»äºº

ð wx.addPhoneContact

#### NFC

ð wx.getHCEState

ðwx.startHCE

ð wx.stopHCE

ðwx.onHCEMessage

ðwx.sendHCEMessage

#### Wi-Fi

ð wx.startWifi

ð wx.stopWifi

ð wx.connectWifi

ð wx.getWifiList

ð wx.onGetWifiList

ð wx.setWifiList

ð wx.onWifiConnected

ð wx.getConnectedWifi

ð wx.offWifiConnected

ð wx.offGetWifiList

### çé¢

#### äº¤äºåé¦

âï¸ wx.showToast

â wx.showLoading

â wx.hideToast

â wx.hideLoading

â wx.showModal

â wx.showActionSheet

#### è®¾ç½®å¯¼èªæ¡

â wx.setNavigationBarTitle

â wx.showNavigationBarLoading

â wx.hideNavigationBarLoading

â wx.setNavigationBarColor

#### è®¾ç½®tabBar

ð¤ wx.setTabBarBadge

ð¤ wx.removeTabBarBadge

ð¤ wx.showTabBarRedDot

ð¤ wx.hideTabBarRedDot

ð¤ wx.setTabBarStyle

ð¤ wx.setTabBarItem

ð¤ wx.showTabBar

ð¤ wx.hideTabBar

#### è®¾ç½®ç½®é¡¶ä¿¡æ¯

â wx.setTopBarText

#### å¯¼èª

â wx.navigateTo

â wx.redirectTo

â wx.switchTab

â wx.navigateBack

ð¤ wx.reLaunch

#### å¨ç»

ð¤ wx.createAnimation

#### ä½ç½®

ð¤ï¸ wx.pageScrollTo (ScrollViewï¼æ»å¨è§å¾ï¼çç»ä»¶æ¯æ scrollTo æ¹æ³ï¼å·ä½çä»£ç è½¬æ¢åé¡µé¢çå¤çæåµ)

#### ç»å¾

âï¸  wx.createCanvasContext

âï¸  wx.createContext

âï¸  wx.drawCanvas

âï¸  wx.canvasToTempFilePath

âï¸  wx.canvasGetImageData

âï¸  wx.canvasPutImageData

âï¸  setFillStyle

âï¸  setStrokeStyle

âï¸  setShadow

âï¸  createLinearGradient

âï¸  createCircularGradient

âï¸  addColorStop

âï¸  setLineWidth

âï¸  setLineCap

âï¸  setLineJoin

âï¸  setLineDash

âï¸  setMiterLimit

âï¸  rect

âï¸  fillRect

âï¸  strokeRect

âï¸  clearRect

âï¸  fill

âï¸  stroke

âï¸  beginPath

âï¸  closePath

âï¸  moveTo

âï¸  lineTo

âï¸  arc

âï¸  bezierCurveTo

âï¸  quadraticCurveTo

âï¸  scale

âï¸  rotate

âï¸  translate

âï¸  clip

âï¸  setFontSize

âï¸  fillText

âï¸  setTextAlign

âï¸  setTextBaseline

âï¸  drawImage

âï¸  setGlobalAlpha

âï¸  save

âï¸  restore

âï¸  draw

âï¸  getActions

âï¸  clearActions

âï¸  measureText

âï¸  globalCompositeOperation

âï¸  arcTo

âï¸  strokeText

âï¸  lineDashOffset

âï¸  createPattern

âï¸  shadowBlur

âï¸  shadowColor

âï¸  shadowOffsetX

âï¸  shadowOffsetY

âï¸  font

âï¸  transform

âï¸  setTransform

#### ä¸æå·æ°

â Page.onPullDownRefresh

â wx.startPullDownRefresh

â wx.stopPullDownRefresh

#### WXMLèç¹ä¿¡æ¯

â wx.createSelectorQuery

â selectorQuery.in

âselectorQuery.select

â selectorQuery.selectAll

â selectorQuery.selectViewport

â nodesRef.boundingClientRect

â nodesRef.scrollOffset

â nodesRef.fields

â selectorQuery.exec

#### WXMLèç¹å¸å±ç¸äº¤ç¶æ

ð¤ wx.createIntersectionObserver

ð¤ intersectionObserver.relativeTo

ð¤ intersectionObserver.relativeToViewport

ð¤ intersectionObserver.observe

ð¤ intersectionObserver.disconnect

### ç¬¬ä¸æ¹å¹³å°

â wx.getExtConfig
    
â wx.getExtConfigSync
    

### å¼æ¾æ¥å£

#### ç»å½

â wx.login

â wx.checkSession

#### ææ

â wx.authorize

#### ç¨æ·ä¿¡æ¯

â wx.getUserInfo

â getPhoneNumber
        

#### å¾®ä¿¡æ¯ä»

â wx.requestPayment

#### æ¨¡æ¿æ¶æ¯

â

#### å®¢ææ¶æ¯

â

#### è½¬å

â
    

#### è·åäºç»´ç 

â

#### æ¶è´§å°å

â wx.chooseAddress
    

#### å¡å¸

â wx.addCard

â wx.openCard

â ä¼åå¡ç»ä»¶

#### è®¾ç½®

â wx.openSetting

â wx.getSetting

#### å¾®ä¿¡è¿å¨

â wx.getWeRunData

#### æå¼å°ç¨åº

â wx.navigateToMiniProgram

â wx.navigateBackMiniProgram

#### æå¼APP

âï¸ launchApp

#### è·ååç¥¨æ¬å¤´

â wx.chooseInvoiceTitle

#### çç©è®¤è¯

â wx.checkIsSupportSoterAuthentication

â wx.startSoterAuthentication

â wx.checkIsSoterEnrolledInDevice

#### éè¿

â

#### æä»¶ç®¡ç

â

### æ°æ®

â

#### æ´æ°

â wx.getUpdateManager

#### å¤çº¿ç¨

ð¤ wx.createWorker

#### è°è¯æ¥å£

â æå¼/å³é­è°è¯
