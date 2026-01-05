# TUIC 协议订阅链接格式

## 基本格式

```
tuic://[用户名]:[密码]@[服务器地址]:[端口]?[参数]#[备注名称]
```

## URL 结构解析

### 必需部分

| 部分       | 说明               | 示例                       |
| ---------- | ------------------ | -------------------------- |
| 协议头     | 固定为 `tuic://`   | `tuic://`                  |
| 用户名     | UUID 格式的用户 ID | `uuid-here`                |
| 密码       | TUIC 认证密码      | `password-here`            |
| 服务器地址 | 服务器域名或 IP    | `example.com` 或 `1.2.3.4` |
| 端口       | TUIC 服务端口      | `443` 或 `8443`            |

### 可选参数（Query 参数）

| 参数                 | 说明                 | 可选值         | 示例                     |
| -------------------- | -------------------- | -------------- | ------------------------ |
| `sni`                | TLS SNI 域名         | 域名           | `sni=example.com`        |
| `alpn`               | ALPN 协议            | `h3,h2`, `h3`  | `alpn=h3,h2`             |
| `congestion_control` | 拥塞控制算法         | `bbr`, `cubic` | `congestion_control=bbr` |
| `insecure`           | 跳过证书验证         | `0` 或 `1`     | `insecure=0`             |
| `allowInsecure`      | 跳过证书验证（兼容） | `0` 或 `1`     | `allowInsecure=0`        |

### 备注

使用 URL 编码的节点名称，以 `#` 开头

## 完整示例

```
tuic://a1b2c3d4-e5f6-7890-abcd-ef1234567890:my-secret-password@tuic.example.com:8443?sni=tuic.example.com&alpn=h3,h2&congestion_control=bbr&insecure=0#我的TUIC节点
```

## 详细分解

```text
tuic://                          协议头
a1b2c3d4-e5f6-7890-abcd-ef1234567890  用户名（UUID）
:                               分隔符
my-secret-password             密码
@                               分隔符
tuic.example.com               服务器地址
:                               分隔符
8443                            端口
?                               参数开始
sni=tuic.example.com           SNI 域名
&                               参数分隔符
alpn=h3,h2                      ALPN 协议列表
&                               参数分隔符
congestion_control=bbr          拥塞控制算法
&                               参数分隔符
insecure=0                      严格证书验证
#                               备注开始
%E6%88%91%E7%9A%84TUIC%E8%8A%82%E7%82%B9  URL编码的备注
```

## 参数说明

### congestion_control（拥塞控制）

- `bbr`: BBR 拥塞控制算法（推荐，延迟更低）
- `cubic`: CUBIC 拥塞控制算法（默认）

### alpn（应用层协议协商）

- `h3`: HTTP/3（QUIC）
- `h2`: HTTP/2
- 多个协议用逗号分隔，如 `h3,h2`

### insecure / allowInsecure

- `0`: 严格证书验证（推荐，更安全）
- `1`: 跳过证书验证（不推荐，仅用于测试）

## IPv6 地址格式

如果使用 IPv6 地址，需要用方括号包裹：

```
tuic://uuid:password@[2001:db8::1]:8443?sni=example.com#节点名称
```

## 编码注意事项

- URL 中的特殊字符（如 `#`, `?`, `&`, `@`）需要进行 URL 编码
- 备注名称使用 URL 编码（中文等非 ASCII 字符必须编码）
- 参数值中的特殊字符也需要 URL 编码

## 订阅链接使用

将完整的 TUIC 链接加入订阅内容中，每行一个节点。客户端会自动解析并导入节点配置。

---

代码参考：[TuicFmt.cs](v2rayN/ServiceLib/Handler/Fmt/TuicFmt.cs#L38-L57)\
相关文档：[服务器格式解析器](24-server-format-parsers)
