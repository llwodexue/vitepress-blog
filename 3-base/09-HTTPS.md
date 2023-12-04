# HTTPS

## SSL/TLS

### HTTPS

**HTTPS (HyperText Transfer Protocol Secure)**，译为：**超文本传输安全协议**

- 常称为 **HTTP over TLS**、**HTTP over SSL**、**HTTP Secure**
- 由网景公司于 1994 年首次提出

![image-20230727170937384](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230727170937384.png)

HTTPS 的默认端口号是 443（HTTP 是 80）

现在在浏览器输入 [http://www.iconfont.cn/](http://www.iconfont.cn/) 会自动重定向到 [https://www.iconfont.cn/](https://www.iconfont.cn/)

- 由于 **历史原因**，用户代理可能会在重定向后的请求中把 POST 方法改为 GET 方法。如果不想这样，应该使用 307（Temporary Redirect） 状态码
- 307 的定义实际上和 302 是一致的，唯一的区别在于，307 状态码不允许浏览器将原本为 POST 的请求重定向到 GET 请求上

![image-20230727171353727](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230727171353727.png)

HTTPS 是在 HTTP 的基础上使用 SSL/TLS来 加密报文，对 **窃听** 和 **中间人攻击** 提供合理的防护

![image-20230727171655892](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230727171655892.png)

### 协议

SSL/TLS 也可以用在其他协议上，比如

- FTP → FTPS
- SMTP → SMTPS

TLS（**T**rasnport **L**ayer **S**ecurity），译为：传输层安全性协议

- 前身是 SSL（**S**ecure **S**ockets **L**ayer），译为：安全套接层

历史版本信息

- SSL 1.0：因存在严重的安全漏洞，从未公开过
- SSL 2.0：1995年，已于2011年弃用 ([RFC 6176](https://tools.ietf.org/html/rfc6176))
- SSL 3.0：1996年，已于2015年弃用 ([RFC 7568](https://tools.ietf.org/html/rfc7568))
- TLS 1.0：1999年 ([RFC 2246](https://tools.ietf.org/html/rfc2246))
- TLS 1.1：2006年 ([RFC 4346](https://tools.ietf.org/html/rfc4346))
- TLS 1.2：2008年 ([RFC 5246](https://tools.ietf.org/html/rfc5246))
- TLS 1.3：2018年 ([RFC 8446](https://tools.ietf.org/html/rfc8846))
- 小细节：TLS 的 RFC 文档编号都是以 46 结尾

![image-20230727172454996](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230727172454996.png)

### OpenSSL

[OpenSSL](https://www.openssl.org/) 是 SSL/TLS 协议的开源实现，始于 1998 年，支持 Windows、Mac、Linux 等平台

- Linux、Mac 一般自带 OpenSSL
- Windows 下载安装 OpenSSL：[https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html)

常用命令

- **生成私钥**：`openssl genrsa -out mj.key`
- **生成公钥**：`openssl rsa -in mj.key -pubout -out mj.pem`

可以使用 OpenSSL 构建一套属于自己的 CA，自己给自己颁发证书，称为 "自签名证书"

## HTTPS

> [看图学HTTPS](https://juejin.cn/post/6844903608421449742)

### 成本

- 证书的费用
- 加解密计算
- 降低了访问速度

有些企业的做法是：包含敏感数据的请求才使用 HTTPS，其他保持使用 HTTP

### 通信过程

总的可以分为 3 大阶段

1. <span style="color: red">TCP 的 3 次握手</span>
2. <span style="color: green">TLS 的连接</span>
3. <span style="color: blue">HTTP 请求和响应</span>

![image-20230727174538768](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230727174538768.png)

## TLS1.2连接

ECDHE 密钥交换算法

![image-20230727175207683](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230727175207683.png)

TLS1.2 的连接大概有 10 大步骤:（图中省略了中间产生的一些 ACK 确认）

![image-20230727175941043](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230727175941043.png)

### 1.Client Hello

- TLS 版本号
- 支持的加密组件（Cipher Suite）列表
  - 加密组件是指所使用的加密算法及密钥长度等
- 一个随机数（Client Random）

![image-20230728140336580](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728140336580.png)

### 2.Server Hello

- TLS 版本号
- 选择的加密组件
  - 是从接收到的客户端加密组件列表中挑选出来的
- 一个随机数（Server Random）

![image-20230728140355096](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728140355096.png)

### 3.Certificate

- 服务器的公钥证书（被 CA 签名过的）

![image-20230728140431928](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728140431928.png)

### 4.Server Key Exchange

- 用以实现 ECDHE算法的其中一个参数（Server Params）

  - ECDHE 是一种密钥交换算法

  - 为了防止伪造，Server Params 经过了服务器私钥签名

![image-20230728140537374](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728140537374.png)

### 5.Server Hello Done

- 告知客户端：协商部分结束
- 目前为止，客户端和服务器之间通过明文共享了
  - Client Random、Server Random、Server Params
- 而且，客户端也已经拿到了服务器的公钥证书，接下来，客户端会验证证书的真实有效性

![image-20230728140659228](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728140659228.png)

### 6.Client Key Exchange

- 用以实现 ECDHE 算法的另一个参数（Client Params）
- 目前为止，客户端和服务器都拥有了 ECDHE 算法需要的 2 个参数：Server Params、Client Params
- 客户端、服务端都可以
  - 使用 ECDHE 算法根据 Server Params、Client Params 计算出一个新的随机密钥串：Pre-master secret
  - 然后结合 Client Random、Server Random、Pre-master secret 生成一个主密钥
  - 最后利用主密钥衍生出其他密钥：客户端发送用的会话密钥、服务器发送用的会话密钥等

![image-20230728141220218](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728141220218.png)

### 7.Change Cipher Spec

- 告知服务器：之后的通信会采用计算出来的会话密钥进行加密

![image-20230728142300345](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728142300345.png)

### 8.Finished

- 包含连接至今全部报文的整体校验值（摘要），加密之后发送给服务器
- 这次握手协商是否成功，要以服务器是否能够正确解密该报文作为判断标准

![image-20230728142523537](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728142523537.png)

### 9.Change Cipher Spec

### 10.Finshed

- 到此为止，客户端服务器都验证加密解密没问题，握手正式结束

  ![image-20230728144156723](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728144156723.png)

- 后面开始传输加密的 HTTP 请求和响应

  ![image-20230728143259309](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728143259309.png)

## HTTPS握手总结

![image-20230728164955789](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728164955789.png)

### TLS1.2

TLS1.2 里面有两个核心算法 RSA（Rivest-Shamir-Adleman） 和 DH（Diffie-Hellman）

- RSA
  - 服务器拥有成对的公钥和私钥
  - 公钥加密后只有私钥能解开，加密以后公钥也无法解开
  - 客户端收到公钥后，把要协商的密钥进行加密
  - 服务器拥有对应私钥，因此可以解密
- DH
  - 服务器和客户端都有私钥且有自己的协商参数
  - 服务器和客户端交换协商参数，双方用各自参数和私钥算出同一个密钥

TLS1.2 支持降级且一开始握手是明文的

- 黑客还是可以截获客户端和服务端之间的内容，让服务器进行 TLS 降级
- 破解 1024bit DH 算法依旧很难，但是如果使用 512bit 就容易很多了

![image-20230728171843913](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728171843913.png)

TLS1.2 分组密码：填充 + 异或运算，是可以猜出来的

密钥交换里的预主密钥一共才 48 字节，384bit，如果服务器公钥是 2048bit，因为长度的问题得给预主密钥填充：规律字节+随机值+规律直接+预主密钥

![image-20230728173501087](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728173501087.png)

### TLS1.3

TLS1.3 移除 RSA+静态密钥 和 DH+静态密钥，废弃了 DH 算法里很多弱的参数组合

![image-20230728171904431](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728171904431.png)

TLS1.3 密钥交换只支持

- DHE（私钥+协商参数）
- PSK-only（对称加密）
- PSK with DHE（私钥+协商参数）

TLS1.3 中服务器可选参数少了很多，因此客户端可以在握手一开始就发生 DH 算法中的协商参数，而不需要协商好所有算法和参数再发送

分组密码：填充 + 异或运算，是可以猜出来的，TLS1.3弃用了此模式

![image-20230728172619523](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728172619523.png)

服务器会先验证再解密

![image-20230728172939061](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728172939061.png)

TLS1.3 采用 PSS 进行填充加密

![image-20230728173609233](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728173609233.png)

## Wireshark解密HTTPS

环境变量：SSLKEYLOGFILE

- 当配置这个环境变量，意味着你告诉浏览器，你想知道 https 会话的 key 记录，浏览器会在每次 https 会话结束后，将会话数据解密的 key 记录到 keylog 文件中
- Wireshark 通过访问 keylog 文件使用里面的 key 就可以解密自己捕获的浏览器产生的 https 会话数据流

![image-20230728144540833](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728144540833.png)

## 配置服务器HTTPS

> 一个生成免费证书的网站： [https://freessl.org/](https://freessl.org/)
>
> [Https 生成证书（keytool），并在Springboot中进行配置](https://blog.csdn.net/zyx1260168395/article/details/112802464)

在 keystore 里，包含两种数据：

1. 密钥实体（Key entity）：密钥（secret key）又或是私钥和配对公钥（采用非对称加密）
2. 可信任的证书实体（trusted certificate entiries）：只包含公钥
3. alias（别名）：每个 keystore 都关联这一个独一无二的 alias

环境：Tomcat9.0.34、JDK1.8.0_251

- 使用 JDK 自带的 **keytool** 生成证书

```bash
# keytool -genkeypair
# -alias     别名
# -keypass   私钥密码
# -keyalg    密钥算法
# -keysize   密钥长度
# -validity  证书有效期
# -keystore  密钥库的生成路径、名称
# -storepass 密钥库密
keytool -genkeypair -alias mj -keyalg RSA -keysize 1024 -validity 365 -keystore F:/mj.jks -storepass 123456
```

修改 TOMCAT_HOME/conf/server.xml 中的 Connector

![image-20230728153153660](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230728153153660.png)