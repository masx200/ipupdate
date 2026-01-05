好的，我来帮你写一个关于 Hysteria 订阅链接格式的 Markdown
文档。根据代码分析，我已经了解了 URI 的生成和解析逻辑。

---

# Hysteria 2 订阅链接格式说明

## 概述

Hysteria 2 支持使用 URI
格式的订阅链接，允许客户端通过一个字符串携带所有必要的连接配置信息。这种格式便于分享和自动配置。

## URI 格式

```
hysteria2://[userinfo@]host[:port]/?[query]
```

或者简写为：

```
hy2://[userinfo@]host[:port]/?[query]
```

### 组件说明

#### 1. Scheme（协议标识）

- `hysteria2` - 完整协议标识
- `hy2` - 简写协议标识

两者等效，客户端均支持识别。

#### 2. Userinfo（认证信息）

格式：`username` 或 `username:password`

示例：

- `myuser` - 单用户名
- `myuser:mypassword` - 用户名和密码组合

如果认证信息包含特殊字符，需要进行 URL 编码（Percent-encoding）。

#### 3. Host（服务器地址）

格式：

- `example.com` - 仅主机名，默认使用 443 端口
- `example.com:8443` - 主机名和端口
- `192.168.1.1:8443` - IP 地址和端口

#### 4. Query Parameters（查询参数）

通过 URL Query 参数传递额外配置：

| 参数名          | 类型   | 说明                                     |
| --------------- | ------ | ---------------------------------------- |
| `obfs`          | string | 混淆类型，如 `salamander`                |
| `obfs-password` | string | 混淆密码                                 |
| `sni`           | string | TLS SNI（Server Name Indication）        |
| `insecure`      | bool   | 是否跳过证书验证（`1` 或 `0`）           |
| `pinSHA256`     | string | TLS 证书 SHA256 指纹（小写，去除分隔符） |

## 完整示例

### 基础配置

```
hysteria2://myuser@server.example.com:8443/
```

### 带 SNI

```
hysteria2://myuser@server.example.com:8443/?sni=example.com
```

### 带 Salamander 混淆

```
hysteria2://myuser@server.example.com:8443/?obfs=salamander&obfs-password=mypassword
```

### 完整配置示例

```
hysteria2://myuser:mypass@server.example.com:8443/?obfs=salamander&obfs-password=obfspass&sni=example.com&insecure=0&pinSHA256=abc123def456...
```

## 在配置文件中使用

订阅链接可以直接放在客户端配置文件的 `server` 字段中：

```yaml
# config.yaml
server: hysteria2://myuser@server.example.com:8443/?obfs=salamander&obfs-password=mypass

socks5:
  listen: 127.0.0.1:1080

http:
  listen: 127.0.0.1:8080
```

使用订阅链接后，以下字段可以省略（因为已在 URI 中包含）：

- `auth`
- `tls.sni`
- `tls.insecure`
- `tls.pinSHA256`
- `obfs`

## URL 编码注意事项

如果参数值包含特殊字符（如 `?`、`&`、`=`、`/`、`@` 等），必须进行 URL 编码：

示例：

- 原始密码：`pass@word` → 编码后：`pass%40word`
- 原始用户名：`user?123` → 编码后：`user%3F123`

## 证书指纹格式

`pinSHA256` 参数使用标准化的 SHA256 指纹：

- 转换为小写
- 移除冒号、短横线等分隔符

例如：

- 原始：`AB:CD:EF:12:34:56...` 或 `AB-CD-EF-12-34-56...`
- 标准：`abcdef123456...`

## 多服务器订阅

可以将多个 URI 组合在订阅链接中，每行一个：

```
hysteria2://user1@server1.example.com:8443/?sni=server1.example.com
hysteria2://user2@server2.example.com:8443/?obfs=salamander&obfs-password=mypass
hysteria2://user3@server3.example.com:8443/?insecure=1
```

## 客户端兼容性

- Hysteria 2.0.0+ 客户端支持 URI 格式
- URI 中的参数会覆盖配置文件中的对应字段
- 如果服务器地址不是有效的 URI，客户端会按普通地址处理

## 相关文档

- [客户端配置详细说明](4-client-configuration)
- [认证方法](12-authentication-methods)
- [流量混淆](13-traffic-obfuscation)

---

## 代码参考

URI 解析逻辑见：[client.go#L414-L449](app/cmd/client.go#L414-L449)

URI 生成逻辑见：[client.go#L372-L410](app/cmd/client.go#L372-L410)

---

这个文档涵盖了 Hysteria 2 订阅链接的所有要点。如果需要补充更多细节，可以查阅
[客户端配置](4-client-configuration) 页面了解更多配置选项。
