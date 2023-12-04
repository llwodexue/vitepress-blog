# HTTP版本

## HTTP/1.1协议不足

同一时间，一个连接只能对应一个请求

- 针对同一个域名，大多数浏览器允许同时最多 **6个并发连接**

只允许客户端主动发起请求

- 一个请求只能对应一个响应

同一个会话的多次请求中，头信息会被重复传输

- 通常会给每个传输增加 500~800 字节的开销
- 如果使用 Cookie，增加的开销会有时候达到上千字节



### 总结

- 默认是持久连接（Keep-Alive）
- 保持这个 TCP 连接不需要对每个请求再来一轮 TCP 握手。请求和响应都可以放在同一个连接里面
- 但只有一个连接肯定太慢，连接太多又怕造成 DDoS 攻击，因此各家浏览器允许的持久连接树都不太相同
  - Chorme 默认同时 6 个连接。如果其他 5 个连接都收到了，但只有一个连接文件没有收到，会造成对头阻塞问题
  - HTTP/1.1 里面有个叫管线化的技术（精灵图、Data Urls、域名分片、JS CSS合并、内嵌CSS）
- TCP 除了三次握手开销以外，还有会 TCP 慢启动，因为要进行拥塞控制
  - 拥塞控制：不知道网络情况、且为了不造成网络拥堵，一开始只会发送较小量 TCP 数据段，后面再慢慢增加
  - HTTP 本身还有固定开销，请求和响应都是有各种首部，而且大部分首部都是重复的，且没有进行压缩

## SPDY 协议

SPDY (speedy的缩写)，是 **基于TCP的应用层协议**，它强制要求使用 SSL/TLS

- 2009 年 11 月，Google 宣布将 SPDY 作为提高网络速度的内部项目

SPDY 与 HTTP 的关系

- SPDY 并不用于取代 HTTP，它只是修改了 HTTP 请求与响应的传输方式
- 只需增加一个 SPDY 层，现有的所有服务端应用均不用做任何修改

![image-20230731100501251](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731100501251.png)

- SPDY 是 HTTP/2 的前身

  2015 年 9 月，Google 宣布移除对 SPDY 的支持，拥抱 HTTP/2

## HTTP/2

HTTP/2，于 2015 年 5 月以 [RFC 7540](https://tools.ietf.org/html/rfc7540) 正式发表

- 根据 W3Techs 的数据，截至 2019 年 6 月，全球有 36.5% 的网站支持了 HTTP/2

下列两个网站可以进行 HTTP/1.1 和 HTTP/2 速度对比

- [http://www.http2demo.io/](http://www.http2demo.io/)
- [https://http2.akamai.com/demo](https://http2.akamai.com/demo)

HTTP/2 在底层传输做了很多的改进和优化，但 **在语意上完全与 HTTP/1.1 兼容**

- 比如请求方法（如 GET、POST）、Status Code、各种 Headers 等都没有改变
- 因此，要想升级到 HTTP/2
  - 开发者不需要修改任何代码
  - 只需要升级服务器配置、升级浏览器



### 总结

- 并不是单个文件直接响应过去，请求响应报文都被划分为不同的帧

  - 帧分为首部帧和数据帧（由原来的报文变为数据链路层的帧）
  - 帧有一个流标识符，使得帧可以不用按照顺序抵达对方那里
  - 帧类型还可以设置优先级，标注流的权重

- 首部压缩使用 HPACK 算法

  - 浏览器和服务器都保存一张静态只读的表

    HTTP/1.1 200 OK -> :staus:200

  - 重复的首部可以在二次请求和响应中直接去掉

  - 像 cookie 这样的首部可以作为动态信息加入动态表里

- HTTP/2 帧并不是 ASCII 编码的报文

  - 而是被提前转换为二进制的帧，解析起来会更快

- 主动推送

  - 不用等浏览器解析 HTML 时再一个一个响应，而是把浏览器后续可能需要的文件一次性全部发送过去（服务器推送可能会造成 DDoS 非对称攻击）

- 多路复用

![image-20230731171011756](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731171011756.png)

### 特性：二进制格式

![image-20230731150724837](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731150724837.png)

- HTTP/2 采用 **二进制格式** 传输数据，而非 HTTP/1.1 的 **文本格式**

  二进制格式在协议的解析和优化扩展上带来更多的优势和可能

### 基本概念：数据流、消息、帧

数据流：已建立的连接内的双向字节流，可以承载一条或多条消息

- 所有通信都在一个 TCP 连接上，此连接可以承载任意数量的双向数据流

消息：与逻辑 HTTP 请求或相应消息对应，由一系列帧组成

帧：HTTP/2 通信的最小单位，每个帧都包含帧头（会标识出当前帧所属的数据流）

- 来自不同数据流的帧可以交错发送，然后再根据每个帧头的数据流标识符重新组装

![image-20230731151756656](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731151756656.png)



![image-20230731151820840](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731151820840.png)

### 特性：多路复用

客户端和服务器可以将 HTTP消息分解为 **互不依赖的帧**，然后 **交错发送**，最后再在另一端把它们重新组装起来

- 并行交错地发送多个 **请求**，请求之间互不影响
- 并行交错地发送多个 **响应**，响应之间互不干扰
- 使用一个连接并行发送多个请求和响应

![image-20230731152531196](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731152531196.png)

不必再为绕过 HTTP/1.1 限制而做很多工作

- 比如：image sprites、合并 CSS/JS、内嵌 CSS/JS/Base64图片、域名分片等

**精灵图 (image sprites)**

image sprites（也叫做 CSS Sprites），将多张小图合并成一张大图

- 最后通过 CSS 结合小图的位置、尺寸进行精准定位

![image-20230731153317707](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731153317707.png)

![image-20230731155752803](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731155752803.png)

![image-20230731155813407](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731155813407.png)

### 特性：优先级

HTTP/2 标准允许每个 **数据流** 都有一个关联的权重和依赖关系

- 可以向每个数据流分配一个介于 1 至 256 之间的整数
- 每个数据流与其他数据流之间可以存在显式依赖关系

客户端可以构建和传递 **"优先级树"**，表明它倾向于如何接收响应

服务器可以使用此信息通过控制 CPU、内存和其他资源的分配设定数据流处理的优先级

- 在资源数据可用之后，确保将高优先级响应以最优方式传输至客户端

![image-20230731160033469](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731160033469.png)

- 尽可能先给父数据流分配资源
- 同级数据流（共享相同父项）应按其权重比例分配资源

### 特性：头部压缩

目前，HTTP/2 使用 **HPACK** 压缩请求头和响应头

- 可以极大减少头部开销，进而提高性能

**早期版本** 的 HTTP/2 和 SPDY 使用 **zlib** 压缩请求头和响应头

- 可以将所传输头数据的大小减小 85%~88%
- 但在 2012 年夏天，被攻击导致会话劫持
- 后被更 **安全** 的 **HPACK** 取代

![image-20230731160520296](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731160520296.png)

![image-20230731160650210](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731160650210.png)

### 特性：服务器推送

**服务器可以对一个客户端请求发送多个响应**

- 除了对最初请求的响应外，服务器还可以向客户端推送额外资源，而无需客户端额外明确地请求

![image-20230731160802109](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731160802109.png)

### 问题：队头阻塞

![image-20230731161125564](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731161125564.png)

后面 HTTP/3 提出的解决方案是 **QUIC**，使用的 UDP 协议

![image-20230731161229190](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731161229190.png)

### 问题：握手延迟

![image-20230731161320243](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731161320243.png)

**RTT (Round Trip Time)**：往返时延，可以简单理解为通信一来一回的时间

![image-20230731161412217](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731161412217.png)

## HTTP/3

Google 觉得 HTTP/2 仍然不够快，于是就有了 HTTP/3

- HTTP/3 由 Google 开发，弃用 TCP 协议，改为使用基于 UDP 协议的 QUIC 协议实现
- QUIC (Quick UDP Internet Connections)，快速 UDP 网络连接，由 Google 在 2013 年实现
- 于 2018 年从 HTTP-over-QUIC 改为 HTTP/3

![image-20230731161602074](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230731161602074.png)

HTTP/3 的一些疑问：

1. HTTP/3 基于 UDP，如何保证可靠传输？
   - 由 QUIC 来保证
2. 为何 Google 不开发一个新的不同于 TCP、UDP 的传输层协议？

   - 目前世界上的网络设备基本只认TCP、UDP
   - 如果要修改传输层，意味着操作系统的内核也要修改
   - 另外，由 IETF 标准化的许多 TCP 新特性都因缺乏广泛支持而没有得到广泛的部署或使用
   - 因此，要想开发并应用一个新的传输层协议，是极其困难的一件事情



### 总结

- HTTP/2 帧下来就要由 TCP 处理
  - TCP 不知道帧里面的内容哪个和哪个是一起的
  - TCP 会按照自己的数据段来发送，如果有丢失还得重传（TCP 队头阻塞）
- HTTP/3 把 TCP 和 TLS 握手整合在一起
  - 才用 UDP 协议，在 UDP 协议上新增 QUIC 协议（默认就得使用加密传输）
  - 应用层传过来的数据会被封装成 QUIC 帧，和 HTTP/2 帧一样加了流标识符，但是 HTTP/3 应用层没有帧概念
  - QUIC 帧再次封装为 QUIC 数据包，加了 Connection ID，如果网络发生改变（wifi -> 4G）。可以使用连接 ID 标识为同一个连接，避免再次握手
  - TLS 握手后对 QUIC 帧进行加密，QUIC 数据包会被 UDP 封装成数据段
- 应用数据被拆分为 QUIC 流，QUIC 流组合成 QUIC 帧，QUIC 帧封装成 QUIC 包
  - 每个 QUIC 包都有独立的号码，丢失了其中一个，就知道丢失的 QUIC 包的数据流，只需要重传必要的 QUIC 包，解决队头阻塞问题
  - HPACK 是给 TCP 用的。为了兼容 QUIC，在 HPACK 基础上发展出了 QPACK 压缩格式
  - TCP 可靠传输时是需要根据 4 元组建立一条逻辑连接（源IP地址、目标IP地址、源端口号、目标端口号），可以准确定位到某台主机的某个服务进程。如果 4 元组其中一个发生改变，就需要重新进行握手。QUIC 为了解决这种情况，QUIC 在包里加上了 Connection ID，使用链接 ID 识别链路
  - 主要解决高延迟和容易丢包的网络环境

![image-20230801085325924](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230801085325924.png)

![image-20230801085748560](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230801085748560.png)

![image-20230801085851457](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230801085851457.png)

### 特性：连接迁移

TCP 基于 4 要素：**源IP、源端口、目标IP、目标端口**

- 切换网络时至少会有一个要素发生变化，导致连接发生变化
- 当连接发生变化时，如果还使用原来的 TCP 连接，则会导致连接失败，就得等原来的连接超时后重新建立连接
- 所以我们有时候发现切换到一个新网络时，即使新网络状况良好，但内容还是需要加载很久
- 如果实现得好，当检测到网络变化时立刻建立新的 TCP 连接，即使这样，建立新的连接还是需要几百毫秒的时间

QUIC 的连接不受 4 要素的影响，当 4 要素发生变化时，原连接依然维持

- QUIC 连接不以 4 要素作为标识，而是使用一组 Connection ID (连接ID) 来标识一个连接

- 即使 IP 或者端口发生变化，只要 Connection ID 没有变化，那么连接依然可以维持

  比如：

  - 当设备连接到 Wi-Fi 时，将进行中的下载从蜂窝网络连接转移到更快速的 Wi-Fi 连接
  - 当 Wi-Fi 连接不再可用时，将连接转移到蜂窝网络连接

### 问题：操作系统内核、CPU负载

据 Google 和 Facebook 称，与基于 TLS 的 HTTP/2 相比，它们大规模部署的 QUIC 需要近2倍的CPU使用量

- Linux 内核的 UDP 部分没有像 TCP 那样的优化，因为传统上没有使用 UDP 进行如此高速的信息传输
- TCP 和 TLS 有硬件加速，而这对于 UDP 很罕见，对于 QUIC 则基本不存在

随着时间的推移，相信这个问题会逐步得到改善