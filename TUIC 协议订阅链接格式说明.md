好的，根据这个仓库的信息，v2rayN 确实支持 TUIC
协议订阅，但遗憾的是这个仓库中没有提供具体的 TUIC
分享链接格式说明。让我根据标准协议为你编写一个 TUIC 订阅链接的 Markdown 介绍。

---

# TUIC 协议订阅链接格式说明

## 基本格式

TUIC 协议的分享链接以 `tuic://` 开头，采用 URL 结构化格式：

```
tuic://[UUID]:[密码]@[服务器地址]:[端口]/[?参数]
```

## 完整示例

```markdown
### 基础链接示例
```

tuic://8e0d1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b:yourpassword@example.com:443

```
### 带参数的完整链接
```

tuic://8e0d1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b:yourpassword@example.com:443/?sni=example.com&congestion_control=bbr&alpn=h3

````
## 参数说明

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `UUID` | String | 是 | 用户标识符，格式为标准 UUID |
| `密码` | String | 是 | 连接密码 |
| `服务器地址` | String | 是 | 服务器域名或 IP 地址 |
| `端口` | Number | 是 | 服务器监听端口 |
| `sni` | String | 否 | TLS 服务器名称指示 |
| `congestion_control` | String | 否 | 拥塞控制算法（bbr/cubic/reno） |
| `alpn` | String | 否 | 应用层协议协商（h3/h2/http/1.1） |
| `udp_relay_mode` | String | 否 | UDP 中继模式（native/quic） |
| `disable_sni` | Boolean | 否 | 是否禁用 SNI |
| `reduce_rtt` | Boolean | 否 | 是否启用 RTT 优化 |

## 在订阅中的使用

### 单个链接
订阅服务器可以返回单个 TUIC 链接：

```text
tuic://uuid:password@server.com:443
````

### Base64 编码的多个链接

订阅也可以返回 Base64 编码的多行内容：

```text
dHVpYzovL3V1aWQ6cGFzc3dvcmRAc2VydmVyMS5jb206NDQzCnR1aWM6Ly91dWlkOnBhc3N3b3JkQHNlcnZlcjIuY29tOjQ0Mwp0dWljOi8vdXVpZDpwYXNzd29yZEBzZXJ2ZXIzLmNvbTo0NDM=
```

解码后为：

```text
tuic://uuid:password@server1.com:443
tuic://uuid:password@server2.com:443
tuic://uuid:password@server3.com:443
```

### 混合协议订阅

单个订阅可以返回多个不同协议的分享链接：

```text
vmess://base64(config)
ss://base64(config)
tuic://uuid:password@server.com:443
trojan://password@server.com:443
```

## 核心兼容性

> **注意**：TUIC 协议需要专用核心支持。在 v2rayN 中使用 TUIC 时，建议选择
> **sing-box** 或 **tuic** 核心，这些核心针对 TUIC 协议进行了优化。

## 订阅配置示例

### 订阅服务器端点示例

```
https://your-subscription-server.com/api/subscription?token=yourtoken
```

该端点返回的内容可以是：

- 纯文本 TUIC 链接
- Base64 编码的多个 TUIC 链接
- 混合了多种协议的链接列表

## 注意事项

1. **密码中的特殊字符**：如果密码包含特殊字符，需要进行 URL 编码
2. **端口范围**：TUIC 通常使用 443 或其他高端口
3. **协议版本**：确保客户端和服务端使用兼容的 TUIC 协议版本
4. **证书验证**：生产环境建议启用证书验证

---

很遗憾，这个 v2rayN-wiki 仓库中并没有提供 TUIC
分享链接的详细格式说明。如需更权威的技术细节，建议查阅 TUIC 官方文档或社区规范。

**相关资源：**

- [TUIC 核心](https://github.com/EAimTY/tuic/releases)
- [支持的核心列表](4-supported-cores)
- [订阅管理](6-subscription-management)
- [分享链接格式](7-share-link-formats)
