# Home Assistant

家里一台小主机刷了冬瓜 HAOS，通过 HACS 装了一些自定义集成，把海尔、美的、小米的设备统一接进来，另外用 JMGLink 做了外网访问和 3D 户型图。这里记录整个搭建过程，方便重装时照着抄

## 整体方案

| 模块     | 方案                                        |
| :------- | :------------------------------------------ |
| 系统     | 冬瓜 HAOS（基于 Home Assistant OS）         |
| 应用商店 | HACS                                        |
| 设备接入 | 海尔智家、美的 Midea Auto Cloud、小米 Xiaomi Home |
| 外网访问 | JMGLink（Docker 运行 jmgnode），也可用 Cloudflare Tunnel 或 Tailscale |
| 3D 户型图 | JMGLink HA 3D Home，或酷家乐 + PS 自制      |
| 电脑管控 | HASS.Agent + WOL                            |

## 基础配置

### 单位系统改成公制

如果 HA 把单位系统识别成了「英制 US customary（华氏℉）」，温度显示会很别扭，改成公制即可

1. HA 主页：**设置 → 系统 → 家庭信息（Home information）**
2. 找到【单位系统 Unit system】，选择 **Metric（公制，摄氏度℃、公斤）**

### HACS

HACS 是 Home Assistant 的第三方应用商店，装好之后才能安装下面的各种自定义集成

安装完成后在 **设置 → 设备与服务 → 添加集成** 中搜索 HACS，按提示完成 GitHub 授权

### 修改 configuration.yaml

冬瓜 HAOS 伴侣页面里点 **TTYD** 就能进入容器终端，配置文件在 `/config/configuration.yaml`

![冬瓜 HAOS 伴侣](https://gitee.com/lilyn/Pic/raw/master/vite-md-img/image-20261022140626308.png)

```bash
vi /config/configuration.yaml
```

改完在 **开发者工具 → YAML → 检查配置** 里验证，再重启 HA。频繁改的话建议装 File editor 或 Studio Code Server 加载项，网页上直接编辑更省事

## 接入大厂设备

### 海尔智家

[海尔智家 (Haier) Home Assistant 集成](https://github.com/sfairy/ha_haier)

1. 打开 HACS → Integrations → 右上角菜单 → Custom repositories
2. Repository 填写：`https://github.com/sfairy/ha_haier`
3. Category 选择：`Integration`
4. 添加后搜索 **海尔智家** 并安装
5. 重启 Home Assistant

### 美的 Midea Auto Cloud

在 HACS 中搜索 **Midea Auto Cloud** 安装，重启后在集成里添加，登录美居账号即可同步设备

### 小米 Xiaomi Home

安装小米官方的 [XiaoMi/ha_xiaomi_home](https://github.com/XiaoMi/ha_xiaomi_home)，添加集成后登录小米账号，按需选择要同步的设备

## 外网访问：JMGLink

JMGLink 负责内网穿透，在冬瓜 HAOS 上用 Docker 跑一个 jmgnode 节点即可

```bash
docker run -d --name jmgnode --network host --pull=always --restart=always \
--label io.hass.type=custom \
--label io.hass.version=1.0.0 \
docker.jmglink.cn/jmgnode:latest --id=你的节点ID --key=你的节点密钥
```

`--pull=always` 让容器每次启动自动拉取最新镜像。`io.hass.type` 和 `io.hass.version` 两个标签必须加，否则启动会直接失败

::: warning
`--id` 和 `--key` 相当于节点凭证，别把它们贴到公开的地方。换机器/重建容器时重新生成一套更稳妥
:::

报错信息主要看这几行，`ifthen(...) is not supported (got: null)` 的意思就是对应的 label 没读到

```
error running createRuntime hook #0: exit status 99
Error: argument 1 to ifthen(...) is not supported (got: null, ...)
app_type=ifthen("io.hass.type" in labels.keys(), ...)      # 缺少 io.hass.type
app_version=ifthen("io.hass.version" in labels.keys(), ...) # 缺少 io.hass.version
```

不加 Docker 的话，Cloudflare Tunnel、Tailscale、frp 也都能达到同样效果，按自己的网络环境选

## 3D 户型图

### JMGLink HA 3D Home

[JMGLink HA 3D Home 安装使用教程](https://github.com/freedomTT/JMGLink-ha-3d-home.git)

1. 打开 Home Assistant，进入 **设置 → 加载项 → 加载项商店**
2. 点击右上角菜单，选择「仓库」，添加 JMGLink 加载项仓库地址
3. 刷新加载项商店，找到「JMGLink HA 3D Home」并点击安装
4. 安装完成后启动加载项，建议开启「在侧边栏显示」方便快速访问

### 酷家乐 + PS 自制

不想装加载项也可以自己画，效果更自由

- 使用酷家乐制作家具图的日景和夜景两个效果图
- 使用 PS 抠出每个房间并单独导出
- 修改 yaml 文件，开灯时控制灯的实体并设置开关灯图片

## 电脑开关机：HASS.Agent + WOL

安装 [HASS.Agent 2 Integration](https://github.com/hass-agent/HASS.Agent-Integration)，配合 Windows 端的 HASS.Agent 客户端

- HASS.Agent 只能控制 Windows **开机之后**的操作（关机 / 锁屏 / 休眠 / 静音），**不能开机唤醒**
- 开机要靠 WOL（网络唤醒），两者搭配使用：WOL 负责开机，HASS.Agent 负责关机 / 锁屏
- 前置条件：**Mosquitto MQTT 插件必须先装好**，HASS.Agent 走 MQTT 通信

::: tip
WOL 这套机制当初就是给有线以太网设计的，无线 WiFi 天生不支持标准 WOL 唤醒。另外主板 BIOS 里要打开 Wake on LAN，路由器最好给电脑做 DHCP 静态绑定
:::

## 其他集成

### 国家电网

[国家电网 Home Assistant 集成](https://github.com/stevenjoezhang/hass-state-grid)，可以看每日用电量和电费

### Tai

[Tai](https://github.com/Planshit/Tai)，统计 Windows 各应用的使用时长

### 彩云天气

安装 Lovelace Colorfulclouds 卡片和彩云天气集成，API Key 在 [彩云天气控制台](https://dashboard.caiyunapp.com/user/sign_in/) 申请

### 网易云音乐

1. 云音乐 GitHub 地址：https://github.com/shaonianzhentan/ha_cloud_music
2. 云音乐 API 部署到 Vercel：https://github.com/Binaryify/NeteaseCloudMusicApi
3. 集成里填入 Vercel 部署后的 API 地址

### 扫地机器人地图

安装 **Xiaomi Cloud Map Extractor** 和 **xiaomi-vacuum-map-card**，前者生成实时地图，后者负责展示

```yaml
camera:
  - platform: xiaomi_cloud_map_extractor
    host: 192.168.50.58 # 扫地机 IP
    token: <扫地机 token>
    username: <小米账号>
    password: <小米密码>
    country: "cn"
    draw: ['all']
    map_transformation:
      rotate: 270
    attributes:
      - calibration_points
```

`rotate` 按实际地图方向调整，0 / 90 / 180 / 270 试一下哪个摆正

## 踩坑记录

- **jmgnode 启动报错**：`ifthen(...) is not supported (got: null)`，原因是漏了 `io.hass.type` / `io.hass.version` 标签
- **温度显示华氏度**：HA 单位系统识别成了英制，在家庭信息里改成 Metric
- **电脑无法远程开机**：WOL 需要有线网卡，WiFi 不支持；HASS.Agent 也只负责关机，管不了开机
- **扫地机地图方向不对**：调整 `map_transformation.rotate`
