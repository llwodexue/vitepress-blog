# Web Storage 使用

## localStorage 和 sessionStorage 区别

### 存储边界与安全性

- 两者均按 origin 隔离，且都可被同源 JavaScript 读取；不要存放密码、长期访问令牌等敏感凭据，以免在 XSS 中泄露。
- `localStorage` 适合可重新获取的持久化界面偏好或缓存；`sessionStorage` 适合单标签页会话状态。它们不是数据库、消息队列或安全会话机制。
- 认证 Cookie 应由服务端设置 `Secure`、`HttpOnly`、`SameSite` 等属性；`HttpOnly` Cookie 不能被 JavaScript 读取，可降低令牌被 XSS 直接窃取的风险。

> [sessionStorage存储时多窗口之前能否进行状态共享？](https://juejin.cn/post/7197309324275695675)

引用 MDN 中对 sessionStorage 和 localStorage 的解释：

- `sessionStorage` 属性允许你访问一个对应当前源的 session [`Storage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Storage) 对象。它与 [`localStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) 相似，不同之处在于 `localStorage` 里面存储的数据没有过期时间设置，而存储在 `sessionStorage` 里面的数据在页面会话结束时会被清除。
  - 页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的会话
  - 在新标签或窗口打开一个页面时会**复制**顶级浏览会话的上下文作为新会话的上下文，这点和 session cookies 的运行方式不同
  - 打开多个相同 URL 的 Tabs 页面，会创建各自的 sessionStorage
  - 关闭对应浏览器或窗口，会清除对应的 sessionStorage
- 只读的`localStorage` 属性允许你访问一个[`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 源（origin）的对象 [`Storage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Storage)；存储的数据将保存在浏览器会话中。`localStorage` 类似 [`sessionStorage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/sessionStorage)，但其区别在于：存储在 `localStorage` 的数据可以长期保留；而当页面会话结束——也就是说，当页面被关闭时，存储在 `sessionStorage` 的数据会被清除

总结：多窗口之间 sessionStorage 不可以共享状态，但是在某些场景下新开的页面会复制之前页面的 sessionStorage，相互之间无关联



MDN 解析里有一个关键词：**复制**，这个需要进行验证

### 实验页面

创建一个 `storage_index1.html` 页面

页面里有一个按钮和两个 a 标签

![image-20240305153651456](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240305153651456.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>sessionStorage1</title>
  </head>
  <body>
    <h2>sessionStorage1</h2>
    <button class="btn">打开同源页面</button>
    <a href="./storage_index2.html" target="_blank" rel="noopener">a标签 打开同源页面</a>
    <a href="./storage_index2.html" target="_blank" rel="opener">
      a标签 opener 打开同源页面
    </a>
    <script>
      window.sessionStorage.setItem('sessionStorage_page1', 11)
      window.localStorage.setItem('localStorage_page1', 22)
      document.cookie = 'cookie_page1=33'
      let oBtn = document.querySelector('.btn')
      oBtn.onclick = function () {
        window.open('storage_index2.html')
        window.sessionStorage.setItem('sessionStorage_page1', 111)
        window.localStorage.setItem('localStorage_page1', 222)
        document.cookie = 'cookie_page1=333'
      }
    </script>
  </body>
</html>
```

创建一个 `storage_index2.html` 页面

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>sessionStorage2</title>
  </head>
  <body>
    <h2>sessionStorage2</h2>
    <script>
      console.log('sessionStorage', window.sessionStorage.getItem('sessionStorage_page1'))
      console.log('localStorage', window.localStorage.getItem('localStorage_page1'))
      console.log('cookie', document.cookie)
    </script>
  </body>
</html>
```

### 验证结果

点击按钮会使用 `window.open` 打开 `storage_index2.html` 页面。之后设置 `sessionStorage`、`localStorage`、`cookie` 的值，由之前的两位数变成三位数

![image-20240305154610026](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240305154610026.png)

- 可以看到，多窗口之间 `sessionStorage` 不可以共享状态，是**复制**顶级浏览会话的上下文作为新会话的上下文
- `localStorage` 与符合 domain/path 限制的 Cookie 可在同源上下文间生效；Cookie 是否随请求发送还受 `SameSite`、`Secure` 等属性影响。

之后咱们刷新一下页面，再对 a 标签进行测试

点击 `a标签 打开同源页面`（a 标签默认行为 `rel="noopener"`）

- 注意：Chrome 89 版本，`Stop cloning sessionStorage for windows opened with noopener`

  Chrome 89 之后，a 标签默认点击打开将停止考虑 `sessionStorage`，如果测试版本再 Chrome 89 之前，是不会得到如下效果的

![image-20240305155212307](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240305155212307.png)

点击 `a标签 opener 打开同源页面`（非 a 标签默认行为 `rel="opener"`，类似于 `window.open`）

![image-20240305155223675](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240305155223675.png)

## storage与cookie区别

> [关于Cookie、session和Web Storage](https://juejin.cn/post/6844903592349040654?share_token=b8423ad8-fb0c-47a1-af27-9ede07e96195)

共同点：都是保存在浏览器端，且同源的

不同点：

- 数据存储方面

  - cookie 数据始终在同源的 http 请求中携带，即 cookie 在浏览器和服务器之间来回传递，cookie 数据还有路径概念，可以限制 cookie 只属于某个路径下
  - sessionStorage 和 localStorage 不会自动把数据发送给服务器，仅在本地保存

- 存储数据大小

- Cookie 单项与单域总大小受浏览器限制，通常仅适合保存很小的会话标识；每次符合范围的 HTTP 请求都会携带它。
- `sessionStorage` 和 `localStorage` 的配额由浏览器、设备和站点策略决定，不要把“5 MB”当作跨浏览器保证。

- 数据存储有效期

  - sessionStorage 仅在当前浏览器窗口关闭之前有效

    在该标签或窗口打开一个新页面会复制顶级浏览器会话的上下文作为新会话的上下文

    `window.open("同源页面")` 这种方式新开的页面会复制之前的 sessionStorage

    `a标签` 新开的页面同样也会，需要加 `rel="opener"`

  - localStorage 在显式清除、浏览器清理、配额回收或站点策略变更前保留，因此适合可丢失、可重建的持久数据

  - 设置 `Expires` 或 `Max-Age` 的 Cookie 在到期前有效；未设置时通常是会话 Cookie，浏览器会话结束后可能被清除

- 作用域不同

  - sessionStorage 不能在不同的浏览器窗口中共享，即使是同一个页面
  - localStorage 在同一 origin 的页面间共享，是否保留不取决于浏览器是否关闭
  - Cookie 按 domain、path、SameSite、Secure 等规则生效，不是简单的“所有同源窗口共享”

## cookie和session区别

共同点：cookie 和 session 都是用来跟踪浏览器用户身份的会话方式

不同点：

- 数据存储方面

  - cookie 数据存放在客户的浏览器上，cookie 保存的是字符串
  - session 数据存放在服务器上，session 中保存的是对象

- 安全性
  - Cookie 与 session 的安全性取决于实现，不是二选一。Cookie 可设置 `HttpOnly`、`Secure`、`SameSite`；服务端 session 需要防止会话固定、劫持并设置过期与轮换策略。
  - 常见方案是服务端保存会话状态，浏览器仅保存不可预测的会话标识 Cookie；也可使用其他认证方案，但都需要防 XSS、CSRF 和重放攻击。

- 性能考虑
  - session 会在一定时间内保存在服务器上，当访问增多，会比较占用服务器的性能
- 不应仅为节省服务端内存改用 Cookie 存储业务数据；应结合会话规模、失效策略、缓存与安全要求设计。

- 路径
  - session 不能区分路径，同一个用户在访问一个网站期间，所有的 session 在任何一个地方都可以访问到
  - 而 cookie 中如果设置了路径参数，那么同一个网站中不同路径下的 cookie 互相是访问不到的


![image-20230316172503583](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230316172503583.png)

