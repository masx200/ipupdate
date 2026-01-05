# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## 项目概述

这是一个代理配置管理项目，包含多种代理协议的客户端配置文件。项目主要用于组织和管理不同代理客户端（Clash、V2RayN、Xray、Singbox
等）的配置。

## 项目结构

### 主要代理客户端目录

- **clash/** - Clash 客户端配置（YAML 格式）
- **clash.meta/** 和 **clash.meta2/** - Clash Meta 客户端配置（支持更多协议）
- **v2rayN/** - V2RayN Windows 客户端配置（JSON 格式）
- **xray/** - Xray 核心配置（JSON 格式）
- **singbox/** - Singbox 通用代理配置（JSON 格式）
- **hysteria/** 和 **hysteria2/** - Hysteria/Hysteria2 协议配置
- **quick/** - Quick 客户端配置（UDP 协议）
- **trojan/** 和 **trojan-go/** - Trojan 协议配置
- **juicity/** - Juicity 协议配置
- **mieru/** - Mieru 协议配置
- **naiveproxy/** - NaiveProxy 配置
- **warp/** - Cloudflare WARP 配置
- **SS/**、**SSROT/**、**ssr/** - Shadowsocks/ShadowsocksR 相关配置

### 备份目录

- **backup/img/1/2/ip/** - 历史代理配置备份
- **backup/img/1/2/ipp/** - 另一套配置备份

每个备份子目录包含完整的客户端配置（clash.meta2, hysteria, hysteria2, juicity,
mieru, naiveproxy, quick, shadowquic, singbox, xray 等）

### 配置摘要文件

项目根目录包含三个配置摘要文件，便于快速查找特定协议的配置：

- **hysteria-tuic-proxy_configs.yaml** 和 **hysteria-tuic-proxy_configs.json**
  - 包含所有 TUIC（5 个文件）和 Hysteria（18 个文件）协议配置
  - 涵盖服务器地址、端口、认证信息、SNI、带宽设置等

- **anytls_reality_configs.yaml** 和 **anytls_reality_configs.json**
  - 包含所有 AnyTLS（6 个文件）和 Reality（17 个文件）协议配置
  - AnyTLS 使用自定义域名（如 fan3.394615.xyz:8443）
  - Reality 配置包含 VLESS 协议、xhttp/tcp 网络、Chrome 指纹等

- **vmess-tls_configs.yaml** 和 **vmess-tls_configs.json**
  - 包含所有启用了 TLS 的 VMess 配置（排除了 `tls: false` 的配置）
  - 主要来自 clash/2 和 clash/3 目录（41 个 VMess 节点中只有 5 个启用 TLS）

## 支持的代理协议

项目包含以下协议的配置：

1. **VMess** - V2Ray 原生协议
2. **VLESS** - 轻量级 V2Ray 协议（常与 Reality 配合使用）
3. **Shadowsocks (SS)** - SS, SS-Kcptun, SSROT, ssr-wj, SS-v2ray
4. **Trojan** - trojan, trojan-go
5. **Hysteria/Hysteria2** - 基于 QUIC 的高性能代理
6. **TUIC** - 轻量级 QUIC 代理
7. **AnyTLS** - TLS 封装协议
8. **Reality** - 反审查协议（无需 TLS 证书）
9. **Juicity** - Another QUIC-based proxy
10. **NaiveProxy** - 基于 Chromium 网络栈的代理
11. **Quick** - UDP 代理协议
12. **WARP** - Cloudflare VPN

## 配置文件格式

### Clash 配置（YAML）

典型的 Clash 配置结构：

```yaml
port: 7890
socks-port: 7891
allow-lan: true
mode: Rule
log-level: info
external-controller: :9090
proxies:
  - name: 代理名称
    type: vmess|ss|hysteria|vless|tuic|reality|anytls
    server: 服务器地址
    port: 端口
    # ... 其他协议特定参数
proxy-groups:
  - name: 代理组
    type: select
    proxies:
      - 代理1
      - 代理2
rules:
  - DOMAIN-SUFFIX,google.com,代理组
```

### JSON 配置格式

大多数其他客户端使用 JSON 格式，包含：

- **inbounds** - 入站连接配置
- **outbounds** - 出站代理配置
- **routing** - 路由规则
- **tls** - TLS 配置
- **transport** - 传输层配置

## 传输协议和网络类型

配置中常用的传输协议：

- **TCP** - 基础 TCP 传输
- **WebSocket (ws)** - WebSocket 隧道
- **xhttp** - XHTTP 传输（与 Reality 配合）
- **QUIC** - 用于 Hysteria, Hysteria2, TUIC, Juicity
- **gRPC** - gRPC 传输

## 安全特性

- **TLS** - 大多数配置使用 TLS 加密
- **Reality** - 反审查协议，使用真实网站指纹伪装
- **客户端指纹伪装** - Chrome, Firefox, Safari 等
- **SNI 伪装** - 使用 apple.com, bing.com, baidu.com 等常见 SNI
- **ALPN** - h3, h2, http/1.1
- **跳过证书验证** - `skip-cert-verify: true` 或 `insecure: true`

## 多路复用

部分配置启用了多路复用以提升性能：

- **h2mux** - HTTP/2 多路复用
- **smux** - SMUX 多路复用

## 常见任务

### 搜索特定协议配置

使用 Grep 工具搜索特定协议：

```bash
# 搜索所有 Hysteria 配置
grep -r "type: hysteria" .

# 搜索所有 Reality 配置
grep -r "reality" .

# 搜索 VMess 配置（排除 tls: false）
grep -A 10 "type: vmess" . | grep -B 5 "tls: true"
```

### 提取配置信息

参考现有的摘要文件（hysteria-tuic-proxy_configs.yaml
等），它们展示了如何从多个配置文件中提取和汇总特定协议的配置。

### 配置验证

- Clash 配置：使用 YAML 语法验证
- JSON 配置：使用 JSON 验证器确保格式正确
- 检查必需字段：server, port, 认证信息等

## Git 仓库

项目已上传到 GitLab：https://gitlab.com/masx200/ipupdate

## 注意事项

- 配置文件包含敏感信息（服务器地址、认证密码等），需谨慎处理
- 部分配置使用 `skip-cert-verify: true` 或 `insecure: true`，存在安全风险
- README.md 内容与实际项目不符（描述的是 Python 脚本项目）
- 所有配置均来自公开源（如 https://github.com/Alvin9999/new-pac/wiki）
