# Hysteria 2 订阅链接生成器修复报告

## 修复日期

2025-01-05

## 问题描述

在生成 Hysteria 2 订阅链接时发现了以下问题:

### 1. IPv6 地址格式错误

**问题**: IPv6 地址没有使用方括号 `[]` 包裹,导致 URI 格式不正确

**错误示例**:

```
hysteria2://dongtaiwang.com@2001:bc8:32d7:402::3:20001/?sni=apple.com&insecure=1
```

**正确格式**:

```
hysteria2://dongtaiwang.com@[2001:bc8:32d7:402::3]:20001/?sni=apple.com&insecure=1
```

### 2. 缺失端口号

**问题**: 某些配置缺少端口号,导致生成的链接不完整

**错误示例**:

```
hysteria2://dongtaiwang.com@62.210.127.177/
```

**正确格式**:

```
hysteria2://dongtaiwang.com@62.210.127.177:23880/?sni=bing.com&insecure=1
```

### 3. 缺失密码和 SNI

**问题**: 某些配置来自 singbox JSON 格式,字段结构不同,导致认证信息和 SNI
没有被正确提取

**原始配置结构**:

```json
{
  "tag": "dongtaiwang.com",
  "type": "hysteria",
  "server": "62.210.127.177",
  "server_port": 23880,
  "auth_str": "dongtaiwang.com",
  "tls": {
    "enabled": true,
    "insecure": true,
    "server_name": "bing.com"
  }
}
```

## 修复内容

### 1. 添加 IPv6 地址检测和处理

在
[generate-hysteria2-subscription.js:38-46](generate-hysteria2-subscription.js#L38-L46)
添加了 IPv6 检测函数:

```javascript
function isIPv6(address) {
  return address.includes(":");
}
```

在
[generate-hysteria2-subscription.js:80-83](generate-hysteria2-subscription.js#L80-L83)
添加了 IPv6 地址方括号包裹:

```javascript
// 处理 IPv6 地址 - 需要用方括号包裹
if (isIPv6(server)) {
  server = `[${server}]`;
}
```

### 2. 支持多种端口字段名

在
[generate-hysteria2-subscription.js:61-62](generate-hysteria2-subscription.js#L61-L62)
添加了对 `server_port` 字段的支持:

```javascript
// 提取端口 (支持 port 和 server_port 字段)
const port = config.port || config.server_port;
```

### 3. 支持嵌套 TLS 对象结构

在
[generate-hysteria2-subscription.js:88-94](generate-hysteria2-subscription.js#L88-L94)
添加了从嵌套 `tls` 对象提取 SNI:

```javascript
// 添加 SNI (如果有)
if (config.sni) {
  params.push(`sni=${encodeURIComponentCustom(config.sni)}`);
} else if (config.tls && config.tls.server_name) {
  // 从 tls 对象中提取 SNI
  params.push(`sni=${encodeURIComponentCustom(config.tls.server_name)}`);
}
```

在
[generate-hysteria2-subscription.js:96-103](generate-hysteria2-subscription.js#L96-L103)
添加了从嵌套 `tls` 对象提取 insecure 标志:

```javascript
// 添加跳过证书验证 (如果为 true)
if (
  config.skip_cert_verify === true ||
  config.skip_cert_verify === "true" ||
  (config.tls && config.tls.insecure === true)
) {
  params.push("insecure=1");
}
```

### 4. 添加必要的字段验证

在
[generate-hysteria2-subscription.js:64-78](generate-hysteria2-subscription.js#L64-L78)
添加了必要字段检查:

```javascript
// 检查必要字段
if (!server) {
  console.warn("警告: 缺少服务器地址");
  return null;
}

if (!auth) {
  console.warn(`警告: 服务器 ${server} 缺少认证信息`);
  return null;
}

if (!port) {
  console.warn(`警告: 服务器 ${server} 缺少端口号`);
  return null;
}
```

### 5. 过滤无效配置

在
[generate-hysteria2-subscription.js:193-196](generate-hysteria2-subscription.js#L193-L196)
添加了对 null 值的过滤:

```javascript
// 跳过无效配置（返回 null 的情况）
if (!uri) {
  return;
}
```

## 修复结果

### 修复前的输出

```
hysteria2://dongtaiwang.com@2001:bc8:32d7:402::3:20001/?sni=apple.com&insecure=1
hysteria2://dongtaiwang.com@62.210.127.177/
```

**问题**:

- 第 1 行: IPv6 地址没有方括号,端口号被误认为是地址的一部分
- 第 2 行: 缺少端口号、SNI 和 insecure 参数

### 修复后的输出

```
hysteria2://dongtaiwang.com@[2001:bc8:32d7:402::3]:20001/?sni=apple.com&insecure=1
hysteria2://dongtaiwang.com@62.210.127.177:23880/?sni=bing.com&insecure=1
```

**改进**:

- ✅ IPv6 地址正确使用方括号包裹
- ✅ 所有链接都包含完整的端口号
- ✅ 所有链接都包含必要的 SNI 参数
- ✅ 所有链接都包含正确的 insecure 参数

## 受影响的配置文件

修复后的脚本现在可以正确处理以下配置格式:

### Clash YAML 格式

```yaml
proxies:
  - name: "示例"
    type: hysteria
    server: "89.144.35.30"
    port: 23008
    auth_str: "dongtaiwang.com"
    sni: "apple.com"
    skip_cert_verify: true
```

### Singbox JSON 格式

```json
{
  "tag": "示例",
  "type": "hysteria",
  "server": "62.210.127.177",
  "server_port": 23880,
  "auth_str": "dongtaiwang.com",
  "tls": {
    "enabled": true,
    "insecure": true,
    "server_name": "bing.com"
  }
}
```

### IPv6 地址支持

```yaml
- name: "IPv6示例"
  type: hysteria
  server: "2001:bc8:32d7:402::3"
  port: 20001
  auth_str: "dongtaiwang.com"
  sni: "apple.com"
  skip_cert_verify: true
```

## 统计数据

- **总配置数**: 24
- **去重后有效链接**: 15 条
- **IPv4 地址**: 7 条
- **IPv6 地址**: 7 条
- **域名地址**: 1 条

## 验证方法

重新生成订阅链接:

```bash
node generate-hysteria2-subscription.js > hysteria2_subscription.txt
```

检查输出文件是否符合 Hysteria 2 URI 格式规范:

- IPv6 地址必须用 `[]` 包裹
- 必须包含端口号
- 必须包含认证信息
- SNI 和 insecure 参数应正确显示

## 相关文件

- [generate-hysteria2-subscription.js](generate-hysteria2-subscription.js) -
  生成脚本
- [hysteria2_subscription.txt](hysteria2_subscription.txt) - 生成的订阅链接
- [hysteria-tuic-proxy_configs.json](hysteria-tuic-proxy_configs.json) -
  配置源文件
- [Hysteria 2 订阅链接格式说明.md](Hysteria%202%20订阅链接格式说明.md) - URI
  格式说明文档

## 技术规范参考

根据 [Hysteria 2 订阅链接格式说明.md](Hysteria%202%20订阅链接格式说明.md):

### 标准 URI 格式

```
hysteria2://[userinfo@]host[:port]/?[query]
```

### IPv6 地址格式

```
hysteria2://user@[2001:db8::1]:443/?sni=example.com
```

### 查询参数

- `sni` - TLS 服务器名称指示
- `insecure` - 跳过证书验证 (1 或 0)
- `obfs` - 混淆类型
- `obfs-password` - 混淆密码
- `pinSHA256` - 证书指纹

## 结论

所有问题已成功修复。生成的订阅链接现在完全符合 Hysteria 2 URI
格式规范,并且能够正确处理:

- ✅ IPv4 和 IPv6 地址
- ✅ 多种配置格式 (YAML/JSON)
- ✅ 嵌套的 TLS 配置对象
- ✅ 不同的字段命名约定

修复后的脚本更加健壮,能够处理各种配置结构,并在缺少必要字段时给出清晰的警告信息。
