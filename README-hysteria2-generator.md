# Hysteria 2 订阅链接生成器

这个 Node.js 程序可以从 `hysteria-tuic-proxy_configs.json` 配置文件中提取
Hysteria 配置,并转换为标准的 Hysteria 2 订阅链接格式。

## 功能特性

- ✅ 自动从 JSON 配置文件提取 Hysteria/Hysteria2 配置
- ✅ 支持 Hysteria 2 URI 格式 (hysteria2://)
- ✅ 自动处理认证信息 (auth_str/password)
- ✅ 支持 TLS 配置 (SNI, insecure)
- ✅ 自动 URL 编码特殊字符
- ✅ 自动去重相同的服务器
- ✅ 支持命令行直接运行或作为模块导入

## 安装要求

- Node.js 12.0 或更高版本
- hysteria-tuic-proxy_configs.json 配置文件

## 使用方法

### 方法 1: 直接运行 (输出到终端)

```bash
node generate-hysteria2-subscription.js
```

### 方法 2: 输出到文件

```bash
node generate-hysteria2-subscription.js hysteria2_subscription.txt
```

### 方法 3: 使用重定向

```bash
node generate-hysteria2-subscription.js > subscription.txt
```

### 方法 4: 作为模块使用

```javascript
const generator = require("./generate-hysteria2-subscription");

// 读取配置文件
const data = require("./hysteria-tuic-proxy_configs.json");

// 提取配置
const configs = generator.extractHysteriaConfigs(data);

// 生成订阅链接
const subscription = generator.generateSubscription(configs, {
  includeNames: false, // 是否包含名称注释
  deduplicate: true, // 是否去重
});

console.log(subscription);
```

## 订阅链接格式

程序生成的订阅链接遵循 Hysteria 2 URI 格式规范:

```
hysteria2://[auth@]host[:port]/?[query]
```

### 支持的查询参数:

| 参数            | 说明               | 示例                  |
| --------------- | ------------------ | --------------------- |
| `sni`           | TLS 服务器名称指示 | `sni=apple.com`       |
| `insecure`      | 跳过证书验证       | `insecure=1`          |
| `obfs`          | 混淆类型           | `obfs=salamander`     |
| `obfs-password` | 混淆密码           | `obfs-password=xxx`   |
| `pinSHA256`     | 证书指纹           | `pinSHA256=abc123...` |

## 配置转换规则

程序会自动处理以下字段转换:

| 配置字段           | URI 参数       | 说明                      |
| ------------------ | -------------- | ------------------------- |
| `auth_str`         | 用户认证       | 支持 auth_str 或 password |
| `password`         | 用户认证       | 备用认证字段              |
| `server`           | 主机地址       | 必需字段                  |
| `port`             | 端口           | 默认 443 不显示           |
| `sni`              | sni=           | TLS SNI                   |
| `skip_cert_verify` | insecure=1     | 值为 true 时添加          |
| `obfs`             | obfs=          | 混淆类型                  |
| `obfs_password`    | obfs-password= | 混淆密码                  |
| `pinSHA256`        | pinSHA256=     | 证书指纹                  |

## 示例输出

运行程序后,输出格式如下:

```
hysteria2://dongtaiwang.com@89.144.35.30:23008/?sni=apple.com&insecure=1
hysteria2://oO5q7L6QPSuJ@hy1.dtku47.xyz:11257/
hysteria2://dongtaiwang.com@2001:bc8:32d7:402::3:20001/?sni=apple.com&insecure=1
hysteria2://Ryr93NBZcQneXUrlB9MX6RR414GPrsgJLHcecA9X6z0sazuHVC@104.149.153.91:10802/?sni=www.microsoft.com&insecure=1
...
```

## 输出统计信息

程序会将统计信息输出到 stderr (不影响订阅链接内容):

```
========================================
Hysteria 2 订阅链接生成成功
========================================
总配置数: 45
去重后: 32 条链接
========================================
```

## 在客户端中使用

### Hysteria 2 客户端配置

将生成的订阅链接直接放入配置文件:

```yaml
# config.yaml
server: hysteria2://password@example.com:8443/?sni=example.com&insecure=1

socks5:
  listen: 127.0.0.1:1080

http:
  listen: 127.0.0.1:8080
```

### 图形客户端

大多数 Hysteria 图形客户端支持:

- 直接粘贴订阅链接
- 扫描二维码 (将订阅链接转为 QR 码)
- 从剪贴板自动识别

### 多节点订阅

可以将多条链接按行分隔,作为订阅列表使用:

```
hysteria2://pass1@server1.com:443/
hysteria2://pass2@server2.com:8443/?obfs=salamander&obfs-password=key2
hy2://pass3@server3.com:20000-30000/?sni=cdn.example.com
```

## 注意事项

### 安全性

⚠️ **重要提示:**

- 订阅链接包含认证信息,请勿分享到公开渠道
- 生成的订阅链接包含敏感信息 (服务器地址、密码等)
- 建议将生成的订阅文件妥善保管
- 生产环境建议使用 `pinSHA256` 而不是 `insecure=1`

### 兼容性

- 程序生成的 URI 兼容 Hysteria 2.0.0+ 客户端
- URI 中的参数会覆盖配置文件中的对应字段
- 如果客户端不支持 URI 格式,会按普通地址处理

### 特殊字符处理

程序会自动进行 URL 编码,处理以下特殊字符:

- `@` → `%40`
- `#` → `%23`
- `?` → `%3F`
- `&` → `%26`
- `=` → `%3D`
- 等等...

## 故障排查

### 问题: 找不到配置文件

```
错误: 找不到配置文件 [...]/hysteria-tuic-proxy_configs.json
```

**解决方案:**

1. 确保在项目根目录运行程序
2. 检查 `hysteria-tuic-proxy_configs.json` 文件是否存在

### 问题: 未找到任何 Hysteria 配置

```
警告: 未找到任何 Hysteria 配置
```

**解决方案:**

1. 检查配置文件格式是否正确
2. 确认配置文件中包含 `type: "hysteria"` 或 `type: "hysteria2"` 的配置

### 问题: JSON 格式错误

```
错误: JSON 格式错误,请检查配置文件
```

**解决方案:**

1. 使用 JSON 验证工具检查配置文件
2. 确保文件编码为 UTF-8

## 相关文档

- [Hysteria 2 订阅链接格式说明.md](./Hysteria%202%20订阅链接格式说明.md)
- [hysteria2订阅链接指南.md](./hysteria2订阅链接指南.md)
- [hysteria-tuic-proxy_configs.json](./hysteria-tuic-proxy_configs.json)

## 许可证

本程序基于项目配置文件开发,遵循项目原有的许可证。

## 更新日志

### v1.0.0 (2025-01-05)

- ✨ 初始版本
- ✅ 支持从 hysteria-tuic-proxy_configs.json 提取配置
- ✅ 生成标准 Hysteria 2 订阅链接
- ✅ 自动去重
- ✅ URL 编码处理
- ✅ 支持命令行和模块化使用
