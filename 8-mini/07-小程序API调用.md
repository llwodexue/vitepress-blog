# 小程序API调用

## 网络请求API和封装

> [https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)

微信提供了专属的 API 接口,用于网络请求: wx.request(Object object)

![image-20231009112432235](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231009112432235.png)

![image-20231009112551537](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231009112551537.png)

### 域名设置

> [https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)

每个微信小程序需要事先设置通讯域名，小程序只可以跟指定的域名进行网络通信

- 小程序登录后台 – 开发管理 – 开发设置 – 服务器域名

服务器域名请在 「小程序后台 - 开发 - 开发设置 - 服务器域名」 中进行配置，配置时需要注意：

- 域名只支持 https (wx.request、wx.uploadFile、wx.downloadFile) 和 wss (wx.connectSocket) 协议
- 域名不能使用 IP 地址（小程序的局域网 IP 除外）或 localhost
- 可以配置端口，如 `https://myserver.com:8080`，但是配置后只能向 `https://myserver.com:8080` 发起请求。如果向 `https://myserver.com、https://myserver.com:9091` 等 URL 请求则会失败。
- 如果不配置端口。如 `https://myserver.com`，那么请求的 URL 中也不能包含端口，甚至是默认的 443 端口也不可以。如果向 `https://myserver.com:443` 请求则会失败
- 域名必须经过 ICP 备案
- 出于安全考虑，api.weixin.qq.com 不能被配置为服务器域名，相关 API 也不能在小程序内调用。 开发者应将 AppSecret 保存到后台服务器中，通过服务器使用 getAccessToken 接口获取 access_token，并调用相关 API
- 不支持配置父域名，使用子域名

![image-20231009153232621](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231009153232621.png)

### API封装

```js
class MYRequest {
  constructor(baseURL) {
    this.baseURL = baseURL
  }
  request(options) {
    const { url } = options
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: this.baseURL + url,
        success: res => {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }
  get(options) {
    return this.request({ ...options, method: 'get' })
  }
  post(options) {
    return this.request({ ...options, method: 'post' })
  }
}
export const myReqInstance = new MYRequest()
```

## 展示弹窗和页面分享

### 展示弹窗

小程序中展示弹窗有四种方式: showToast、showModal、showLoading、showActionSheet

```js
onShowToast() {
  wx.showToast({
    title: '购买成功！',
    icon: 'success',
    mask: true,
    duration: 3000
  })
  // wx.showLoading({
  //   title: '加载中ing'
  // })
}
onShowModal() {
  wx.showModal({
    title: '确定购买吗？',
    content: '确定是否有钱',
    confirmColor: '#f00',
    complete: res => {
      if (res.cancel) {
        console.log('Modal cancel')
      }
      if (res.confirm) {
        console.log('Modal confirm')
      }
    }
  })
}
onShowAction() {
  wx.showActionSheet({
    itemList: ['衣服', '鞋子', '书包']
  })
}
```

![image-20231009163857911](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231009163857911.png)

showToast 属性

![image-20231009170619087](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231009170619087.png)

### 页面分享

分享是小程序扩散的一种重要方式，小程序中有两种分享方式：

- 方式一：点击右上角的菜单按钮，之后点击转发
- 方式二：点击某一个按钮，直接转发

当我们转发给好友一个小程序时，通常小程序中会显示一些信息：

- 如何决定这些信息的展示呢？通过 onShareAppMessage
- 监听用户点击页面内转发按钮（button 组件 open-type="share"）或右上角菜单“转发”按钮的行为，并自定义转发内容
- 此事件处理函数需要 return 一个 Object，用于自定义转发内容

```js
onShareAppMessage() {
  return {
    title: '旅途的内容',
    path: '/pages/favor/favor',
    imageUrl: '/assets/nhlt.jpg'
  }
}
```

![image-20231010085944346](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010085944346.png)

## 设备信息和位置信息

### 设备信息

> [https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfo.html](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfo.html)

 在开发中，我们需要经常获取当前设备的信息，用于搜集信息或者进行一些适配工作

- 小程序提供了相关个API：wx.getSystemInfo(Object object)

```js
wx.getSystemInfo({
  success: res => {
    console.log(res)
  }
})
```

![image-20231010091550592](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010091550592.png)

### 位置信息

> [https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html](https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html)

开发中我们需要经常获取用户的位置信息，以方便给用户提供相关的服务

- 我们可以通过API获取：wx.getLocation(Object object)

```js
wx.getLocation({
  success: res => {
    console.log(res)
  }
})
```

对于用户的关键信息，需要获取用户的授权后才能获得

- [https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#permission](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#permission)

![image-20231010091949869](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010091949869.png)

## 小程序Storage存储

在开发中，某些常见我们需要将一部分数据存储在本地：比如 token、用户信息等。

- 小程序提供了专门的 Storage 用于进行本地存储

同步存取数据的方法：

- wx.setStorageSync(string key, any data)
- wx.getStorageSync(string key)
- wx.removeStorageSync(string key)
- wx.clearStorageSync()

异步存储数据的方法：

- wx.setStorage(Object object)
- wx.getStorage(Object object)
- wx.removeStorage(Object object)
- wx.clearStorage(Object object)

**setStorage**

> [https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html)

```js
wx.setStorage({
  key: 'books',
  data: '哈哈哈',
  encrypt: true,
  success: res => {
    wx.getStorage({
      key: 'books',
      encrypt: true,
      success: res => {
        console.log(res)
      }
    })
  }
})
```

![image-20231010093323458](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010093323458.png)

## 页面跳转和数据传递

### 页面跳转

界面的跳转有两种方式：通过 navigator 组件和通过 wx 的 API 跳转

- 先以 wx 的 API 作为讲解

![image-20231010094806500](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010094806500.png)

wx.navigateTo(Object object)

- 保留当前页面，跳转到应用内的某个页面
- 但是不能跳到 tabbar 页面

```js
onNavTap() {
  const name = this.data.name
  const age = this.data.age
  wx.navigateTo({
    url: `/pages2/detail/detail?name=${name}&age=${age}`
  })
}
```

![image-20231010095435925](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010095435925.png)

wx.navigateBack(Object object)

- 关闭当前页面，返回上一页面或多级页面

```js
onBackTap() {
  wx.navigateBack({ delta: 1 })
}
```

![image-20231010100127702](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010100127702.png)

### 数据传递

如何在界面跳转过程中我们需要相互传递一些数据，应该如何完成呢？

- 首页 -> 详情页：使用 URL 中的 query 字段
- 详情页 -> 首页：在详情页内部拿到首页的页面对象，直接修改数据

```js
// 子组件
wx.navigateBack()
const pages = getCurrentPages()
const prePage = pages[pages.length - 2]
prePage.setData({ message: '呵呵呵' })

// 父组件
wx.navigateTo({
  url: `/pages2/detail/detail?name=${name}&age=${age}`
})
```

![image-20231010100535872](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010100535872.png)

早期数据的传递方式只能通过上述的方式来进行，在小程序基础库 2.7.3 开始支持 events 参数，也可以用于数据的传递

```js
// 子组件
wx.navigateBack()
const eventChannel = this.getOpenerEventChannel()
eventChannel.emit('backEvent', { name: 'back', age: 11 })

// 父组件
wx.navigateTo({
  url: `/pages2/detail/detail?name=${name}&age=${age}`,
  events: {
    backEvent(data) {
      console.log('back', data)
    }
  }
})
```

![image-20231010102629539](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010102629539.png)

### 界面跳转的方式

navigator 组件主要就是用于界面的跳转的，也可以跳转到其他小程序中

```html
<navigator open-type="navigateBack">navigator组件返回</navigator>
```

![image-20231010103111685](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010103111685.png)

## 小程序登录流程演练

为什么需要用户登录？

- 增加用户的粘性和产品的停留时间

如何识别同一个小程序用户身份？

- 认识小程序登录流程
- openid 和 unionid
- 获取 code
- 换取 authToken

用户身份多平台共享

- 账号绑定
- 手机号绑定

![image-20231010104120530](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231010104120530.png)

```js
Page({
  async onLoad() {
    // 1.获取token，判断token是否有值
    const token = wx.getStorageSync('token') || ''
    // 2.判断token是否过期
    const res = await myLoginInstance.post({
      url: '/auth',
      header: {
        token
      }
    })
    if (token && res.message === '已登录') {
      console.log('登录成功！')
    } else {
      this.handleLogin()
    }
  },
  async handleLogin() {
    // 1.获取code
    const code = await getCode()
    // 2.将这个code发送给自己的服务端
    const res = await myLoginInstance.post({ url: '/login', data: { code } })
    // 3.存储token
    const token = res.token
    wx.setStorageSync('token', token)
  },
  getCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res.code)
        },
        fail: reject
      })
    })
  }
})
```

