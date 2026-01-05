# 代理工具配置集合

[![GitLab CI/CD](https://img.shields.io/badge/GitLab-CI%2FCD-blue.svg)](https://gitlab.com/masx200/ipupdate)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-green.svg)](COPYING)
[![代理配置](https://img.shields.io/badge/代理配置-30+-orange.svg)](#支持的代理协议)

> 本仓库收集并整理了多种常用代理工具的配置文件，涵盖
> V2Ray、Clash、Sing-Box、Hysteria、Trojan、Shadowsocks
> 等主流代理协议。所有配置均经过实际测试，可直接导入使用。

## 目录

- [项目简介](#项目简介)
- [支持的代理协议](#支持的代理协议)
- [目录结构](#目录结构)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 项目简介

本项目旨在为用户提供一个集中化的代理工具配置仓库。无论是日常科学上网需求，还是搭建代理服务器，本仓库都能提供相应的配置模板。所有的配置文件都遵循最佳实践，包含了常用的路由规则、出站代理设置以及安全加固选项。

我们的目标是简化代理工具的配置流程，让用户能够快速上手使用。通过提供标准化的配置模板，用户无需从零开始编写复杂的配置文件，只需根据自身需求进行简单修改即可。此外，仓库中的配置经过社区成员的不断优化和更新，能够适应各种网络环境和使用场景。

仓库采用模块化的组织方式，不同的代理工具配置分别存放在独立的目录中。每个目录都包含该工具的标准配置模板以及多个实际使用的配置示例。这种设计使得用户既能学习标准的配置格式，也能直接使用经过验证的实际配置。

## 支持的代理协议

本仓库支持多种主流代理协议，每种协议都有其独特的优势和适用场景。以下是详细的支持列表：

| 协议类型           | 目录                                  | 说明                                           |
| ------------------ | ------------------------------------- | ---------------------------------------------- |
| **V2Ray**          | `v2rayN/`                             | 支持 VMess、VLESS 协议，提供完整的入站出站配置 |
| **Clash**          | `clash/` `clash.meta/` `clash.meta2/` | 支持多种代理协议，内置丰富的路由规则           |
| **Sing-Box**       | `singbox/`                            | 新一代代理工具，支持混合协议配置               |
| **Hysteria**       | `hysteria/` `hysteria2/`              | 基于 UDP 的高速代理协议，抗干扰能力强          |
| **Trojan**         | `trojan/` `trojan-go/`                | 伪装为 HTTPS 流量，隐蔽性强                    |
| **Shadowsocks**    | `SS/` `SSROT/`                        | 轻量级加密代理，广泛使用                       |
| **ShadowsocksR**   | `ssr/` `ssr-wj/`                      | 在 Shadowsocks 基础上增加混淆功能              |
| **Brook**          | `brook/`                              | 跨平台代理工具，简洁易用                       |
| **Hysteria+TUIC**  | `hysteria-tuic-proxy/`                | 结合 Hysteria 和 TUIC 优势                     |
| **AnyTLS Reality** | `anytls_reality/`                     | 基于 TLS 的安全代理方案                        |
| **Juicity**        | `juicity/`                            | 高性能 QUIC 代理协议                           |
| **NaiveProxy**     | `naiveproxy/`                         | 基于 Chrome 的前向代理                         |
| **Mieru**          | `mieru/`                              | 多平台代理工具                                 |
| **Quick**          | `quick/`                              | 轻量级快速配置                                 |
| **DAZE**           | `DAZE/`                               | 简单易用的代理工具                             |
| **Lightsocks**     | `lightsocks/` `lightsocks2/`          | 轻量级 SOCKS5 代理                             |
| **Goflyway**       | `goflyway/`                           | 轻量级 HTTP 代理                               |
| **Metawj**         | `metawj/`                             | 自定义代理配置                                 |
| **Etgo**           | `etgo/`                               | 特定用途的代理配置                             |
| **Xray**           | `xray/`                               | V2Ray 的分支项目，功能增强                     |
| **WARP**           | `warp/`                               | Cloudflare WARP 配置                           |

每种协议都有其特定的适用场景。例如，Hysteria
协议在网络环境较差的情况下仍能保持较高的连接质量；而 Trojan
协议则更适合需要高度隐蔽性的场景。用户可以根据自身的网络环境、设备平台和安全需求选择合适的代理协议。

## 目录结构

```
ipupdate/
├── v2rayN/                    # V2Ray 客户端配置
│   ├── config.json            # 主配置文件
│   ├── guiNConfig.json        # GUI 配置文件
│   └── 2~8/                   # 多节点配置
├── clash/                     # Clash 标准版配置
│   ├── config.yaml            # 主配置
│   └── 2~3/                   # 备用配置
├── clash.meta/                # Clash Meta 内核配置
├── clash.meta2/               # Clash Meta 变体配置
├── singbox/                   # Sing-Box 配置
├── hysteria/                  # Hysteria v1 配置
│   ├── config.json
│   └── 2/
├── hysteria2/                 # Hysteria v2 配置
├── hysteria-tuic-proxy/       # Hysteria + TUIC 混合配置
│   ├── configs.json
│   └── configs.yaml
├── trojan/                    # Trojan 配置
│   ├── config.json
│   └── private.crt
├── trojan-go/                 # Trojan-Go 配置
├── singbox/                   # Sing-Box 配置
├── SS/                        # Shadowsocks 配置
├── SSROT/                     # ShadowsocksR 配置
├── ssr/                       # ShadowsocksR 变体配置
├── ssr-wj/                    # ShadowsocksR 自定义配置
├── brook/                     # Brook 配置
├── xray/                      # Xray 配置
├── juicity/                   # Juicity 配置
├── naiveproxy/                # NaiveProxy 配置
├── mieru/                     # Mieru 配置
├── quick/                     # 快速配置模板
├── metawj/                    # Metawj 配置
├── goflyway/                  # Goflyway 配置
├── lightsocks/                # Lightsocks 配置
├── lightsocks2/               # Lightsocks v2 配置
├── DAZE/                      # DAZE 配置
├── etgo/                      # Etgo 配置
├── anytls_reality/            # AnyTLS Reality 配置
├── warp/                      # WARP 配置
│   ├── 1/
│   └── 3/
├── backup/                    # 备份文件
├── CMakeLists.txt             # CMake 构建配置
├── configure.ac               # Autotools 构建配置
├── Dockerfile-doxygen         # Docker 构建配置
├── autogen.sh                 # 自动生成脚本
└── COPYING                    # 许可证文件
```

## 快速开始

### 选择适合你的配置

根据你的使用场景和设备类型，按照以下步骤选择合适的配置：

**桌面端用户（Windows、macOS、Linux）**：

- 推荐使用 V2RayN（Windows）、Qv2ray（Linux/macOS）或 Clash Verge
- 导入 `v2rayN/config.json` 或 `clash/config.yaml` 即可开始使用
- 如需更多节点选择，可查看各子目录中的备用配置

**移动端用户（Android、iOS）**：

- Android 推荐使用 V2RayNG、Clash for Android 或 SFA
- iOS 推荐使用 Shadowrocket、Stash 或 Quantumult X
- 对应导入相应的配置文件即可

**路由器用户**：

- OpenWrt 建议使用 OpenClash 或 PassWall
- 直接导入 Clash 配置即可自动生成分离规则

### 导入配置

每种客户端的导入方式略有不同，但基本流程相似：

1. 下载对应的配置文件
2. 打开你的代理客户端
3. 进入配置导入或设置页面
4. 选择下载的配置文件
5. 保存并应用配置
6. 选择节点并启用代理

以 V2RayN 为例，具体步骤如下：首先下载 `v2rayN/config.json` 文件，然后打开
V2RayN 软件，点击菜单栏的「服务器」→「从文件导入配置」，选择下载的 JSON
文件即可。导入成功后，右键点击系统托盘中的 V2RayN
图标，选择「启用系统代理」即可开始使用。

## 配置说明

### 通用配置结构

大多数配置文件遵循相似的结构，包含以下核心部分：

**入站配置（Inbounds）**定义了本地代理服务的监听端口和协议类型。标准的 SOCKS5
代理通常监听 1080 端口或 10808 端口，而 HTTP 代理则通常监听 1081
端口。这些配置决定了本地应用程序如何连接代理服务。

**出站配置（Outbounds）**定义了代理服务器的连接信息，包括服务器地址、端口、加密方式和认证信息。这是配置文件中最关键的部分，直接决定了代理能否正常工作。每个节点配置都包含服务器地址、端口号、用户
ID 或密码等必要信息。

**路由规则（Routing）**定义了流量分流的策略。通过设置域名和 IP
规则，可以实现特定网站走代理或直连的目的。常用的规则包括：Google、Twitter
等需要代理访问的网站走 proxy 出站，而国内网站则走 direct 直连。

### 节点配置示例

以下是一个典型的 V2Ray VMess 节点配置示例：

```json
{
  "protocol": "vmess",
  "settings": {
    "vnext": [
      {
        "address": "example.com",
        "port": 443,
        "users": [
          {
            "id": "uuid-string",
            "alterId": 64,
            "security": "auto"
          }
        ]
      }
    ]
  },
  "streamSettings": {
    "network": "tcp",
    "security": "tls"
  }
}
```

对于 Clash 格式的节点配置，则采用 YAML 格式：

```yaml
- name: 示例节点
  type: vmess
  server: example.com
  port: 443
  uuid: uuid-string
  alterId: 64
  cipher: auto
  tls: true
```

### 常用端口参考

以下是各代理工具常用的默认端口：

| 服务类型 | 默认端口    | 用途说明             |
| -------- | ----------- | -------------------- |
| SOCKS5   | 1080, 10808 | 标准 SOCKS5 代理端口 |
| HTTP     | 1081        | HTTP 代理端口        |
| Mixed    | 1080        | 混合协议代理端口     |
| API      | 9090        | Clash 控制面板端口   |
| REST API | 6249        | V2Ray 控制端口       |

## 贡献指南

我们欢迎社区成员贡献新的配置或改进现有配置。如需贡献，请遵循以下指南：

### 提交新配置

1. 首先 fork 本仓库
2. 创建新的功能分支：`git checkout -b feature/new-config`
3. 在对应目录下添加你的配置文件
4. 确保配置文件格式正确，语法无误
5. 提交你的更改：`git commit -m "Add new proxy configuration"`
6. 推送到你的仓库：`git push origin feature/new-config`
7. 创建 Pull Request

### 配置规范

提交的配置文件应满足以下要求：

- 使用标准格式（JSON 或 YAML）
- 包含必要的注释说明
- 不包含敏感信息（如真实的服务地址、密码等）
- 遵循项目现有的目录结构
- 提供简洁明了的文件名

我们建议贡献者使用占位符或示例数据来配置代理服务器信息，避免在配置文件中包含真实的认证信息。这样既保护了贡献者的隐私，也方便其他用户根据自身情况进行修改。

## 许可证

本项目采用 GNU General Public License v3.0 许可证开源。详情请参阅
[COPYING](COPYING) 文件。

许可证的具体条款确保了项目的开源性质：任何人都可以自由地使用、修改和分发本项目的代码和配置文件，但必须在分发时保留相同的许可证条款，并公开修改后的源代码。

---

**免责声明**：本仓库仅提供配置文件模板，使用者应确保遵守当地法律法规。本项目开发者不对任何滥用行为承担责任。

---

如有任何问题或建议，欢迎通过 GitLab 的 Issues 功能进行反馈。
