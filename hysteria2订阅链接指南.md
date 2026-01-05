好的，我来帮你编写一个关于Hysteria订阅链接的文档。基于现有文档的风格和Hysteria的URI格式，我会创建一个完整而实用的指南。

---

# 订阅链接指南

Hysteria 2 订阅链接基于 URI scheme
设计，允许客户端自动导入服务器配置，无需手动编辑配置文件。本指南将详细介绍订阅链接的格式、生成方法和使用场景。

## 基本概念

订阅链接本质上是 Hysteria 2 的 URI
格式，它包含了连接到服务器所需的所有核心信息：服务器地址、认证密码、混淆设置、TLS
配置等。客户端可以通过导入订阅链接快速建立连接。

## URI 结构

```
hysteria2://[auth@]hostname[:port]/?[key=value]&[key=value]...
```

或者简写：

```
hy2://[auth@]hostname[:port]/?[key=value]&[key=value]...
```

## URI 组件详解

### 协议名

- `hysteria2` - 完整协议名
- `hy2` - 简写形式（推荐，更简洁）

### 认证信息 (auth)

认证密码在 URI 的 `auth` 部分指定，这是标准 URI 格式的用户名字段。

**基本格式：**

```
hysteria2://password@server.com:443/
```

**使用 userpass 验证时：**

```
hysteria2://username:password@server.com:443/
```

> **注意：** 如果密码包含特殊字符，需要进行
> [百分号编码](https://datatracker.ietf.org/doc/html/rfc3986#section-2.1)，例如
> `#` 编码为 `%23`，`@` 编码为 `%40`。

### 服务器地址

- `hostname` - 服务器域名或 IP 地址
- `:port` - 可选端口，默认为 443

**单端口：**

```
hysteria2://password@example.com:8443/
```

**多端口（端口跳跃）：**

```
hysteria2://password@example.com:20000,30000-40000/
```

支持的格式：

- 单端口：`443`
- 多端口列表：`80,443,8443`
- 端口范围：`1000-2000`
- 混合：`443,8443,10000-20000`

### 查询参数

所有可选参数通过 URL 查询字符串传递：

| 参数            | 说明               | 示例值                     |
| --------------- | ------------------ | -------------------------- |
| `obfs`          | 混淆类型           | `salamander`               |
| `obfs-password` | 混淆密码           | `your_obfs_key`            |
| `sni`           | TLS 服务器名称指示 | `example.com`              |
| `insecure`      | 是否跳过 TLS 验证  | `1` (跳过) 或 `0` (不跳过) |
| `pinSHA256`     | 证书 SHA-256 指纹  | `BA:88:45:17:A1...`        |

## 完整示例

### 基础配置

```bash
hysteria2://my-secret-pass@example.com:443/
```

### 带混淆的配置

```bash
hysteria2://my-secret-pass@example.com:443/?obfs=salamander&obfs-password=salamander-key
```

### 完整配置（包含 TLS、混淆、端口跳跃）

```bash
hysteria2://my-secret-pass@example.com:20000,30000-40000/?insecure=1&obfs=salamander&obfs-password=gawrgura&pinSHA256=deadbeef&sni=real.example.com
```

## 客户端使用订阅链接

### 在配置文件中使用

在客户端配置文件中，直接使用 URI 作为 `server` 值：

```yaml
server: hysteria2://my-secret-pass@example.com:443/?obfs=salamander&obfs-password=key

# 由于 URI 已包含认证和混淆信息，无需重复配置
# auth: xxx  # 不需要
# obfs: xxx  # 不需要
```

### 命令行导入

```bash
# 使用订阅链接启动
./hysteria-linux-amd64-avx -c "hysteria2://my-secret-pass@example.com:443/"
```

### 图形客户端

大多数 Hysteria 图形客户端支持：

- 直接粘贴订阅链接
- 扫描二维码（订阅链接编码为 QR 码）
- 从剪贴板自动识别订阅链接

## 订阅链接格式编码

订阅链接本身不是标准格式，但通常有以下几种呈现方式：

### 1. 单链接（Base64 编码）

某些服务会将单条 Hysteria URI 进行 Base64 编码：

```bash
# 原始 URI
hysteria2://password@example.com:443/

# Base64 编码
aHlzdGVyaWEyOi8vcGFzc3dvcmRAZXhhbXBsZS5jb206NDQzLw==
```

客户端解码后即可使用。

### 2. 多节点订阅列表

多个服务器链接可以通过换行符分隔：

```
hysteria2://pass1@server1.com:443/
hysteria2://pass2@server2.com:8443/?obfs=salamander&obfs-password=key2
hy2://pass3@server3.com:20000-30000/?sni=cdn.example.com
```

某些服务会将整个列表进行 Base64 编码或使用其他格式封装。

## 生成订阅链接

### 方法一：从服务器配置生成

服务器启动时会显示日志：

```
[INFO] use this URI to share your server:
hysteria2://xxx@your.domain.net:443/?sni=your.domain.net
```

### 方法二：手动构建

根据上述格式规则手动构建，确保所有参数正确编码。

### 方法三：使用生成工具

部分第三方工具支持通过服务器配置文件自动生成订阅链接。

## 注意事项

### 安全性

⚠️ **重要安全提示：**

- **不要分享包含真实密码的订阅链接**到公开渠道
- 订阅链接包含认证信息，泄露等同于泄露服务器访问权限
- 定期更换密码并更新订阅链接

### 参数限制

订阅链接 **不应包含** 以下内容：

- ❌ 客户端代理模式（HTTP、SOCKS5、TUN 等）
- ❌ 带宽设置
- ❌ 快速打开、懒狗模式等客户端特定配置
- ❌ 任何非核心连接参数

这些设置属于个人使用偏好，不应随订阅链接共享。

### 兼容性

- URI 格式旨在保持简洁，确保跨客户端兼容
- 第三方实现可添加扩展参数，但不应假设其他客户端能识别这些参数
- 部分旧版客户端可能不支持 `hy2` 简写，建议使用完整 `hysteria2` 协议名

## 故障排查

### 认证失败

- 检查 `auth` 部分是否正确
- 确认特殊字符是否已进行百分号编码
- 验证服务器端配置的密码是否一致

### TLS 错误

- 检查 `sni` 参数是否正确设置
- 使用 `insecure=1` 仅供测试环境
- 生产环境建议使用 `pinSHA256` 指定证书指纹

### 混淆问题

- 确认服务器和客户端使用相同的混淆类型和密码
- `obfs` 参数目前仅支持 `salamander`

### 端口连接失败

- 验证服务器防火墙是否开放相应端口
- 端口跳跃格式是否正确
- 确认服务器配置中是否启用了端口跳跃功能

## 相关文档

- [完整客户端配置参考](../advanced/Full-Client-Config.md) - 详细配置参数说明
- [完整服务器配置参考](../advanced/Full-Server-Config.md) - 服务器端配置指南
- [Salamander 混淆协议](../advanced/Salamander-Obfuscation-Protocol.md) -
  混淆机制详解
- [端口跳跃](../advanced/Port-Hopping.md) - 端口跳跃配置指南
- [TLS 配置选项](../advanced/TLS-Configuration-Options.md) - TLS 安全设置
- [URI 方案定义](../developers/URI-Scheme.md) - 完整 URI 技术规范

---

**下一步建议：**

1. 查看 [完整客户端配置参考](../advanced/Full-Client-Config.md) 了解更多配置选项
2. 阅读 [Salamander 混淆协议](../advanced/Salamander-Obfuscation-Protocol.md)
   深入了解混淆机制
3. 参考 [端口跳跃](../advanced/Port-Hopping.md) 配置动态端口策略

---

这个文档涵盖了订阅链接的完整使用指南，包括基本概念、格式规范、实际使用方法和故障排查。你可以将其保存为
`docs/docs/getting-started/Subscription-Links.zh.md`，然后更新文档目录（`mkdocs.yml`）将其添加到导航中。

需要我对任何部分进行调整或补充吗？
