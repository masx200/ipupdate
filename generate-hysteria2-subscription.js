#!/usr/bin/env node

/**
 * Hysteria 2 订阅链接生成器
 *
 * 从 hysteria-tuic-proxy_configs.json 读取配置,生成 Hysteria 2 订阅链接
 *
 * 使用方法:
 *   node generate-hysteria2-subscription.js [输出文件路径]
 *
 * 示例:
 *   node generate-hysteria2-subscription.js
 *   node generate-hysteria2-subscription.js > subscription.txt
 *   node generate-hysteria2-subscription.js hysteria2.txt
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES module 中获取 __dirname 的方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置文件路径
const CONFIG_FILE = path.join(__dirname, "hysteria-tuic-proxy_configs.json");

/**
 * URL 编码函数 (处理特殊字符)
 */
function encodeURIComponentCustom(str) {
  if (!str) return "";
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16);
  });
}

/**
 * 判断是否为 IPv6 地址
 *
 * @param {string} address - 服务器地址
 * @returns {boolean} - 是否为 IPv6 地址
 */
function isIPv6(address) {
  return address.includes(":");
}

/**
 * 将 Hysteria 配置转换为 Hysteria 2 订阅链接
 *
 * @param {Object} config - Hysteria 配置对象
 * @returns {string} - Hysteria 2 URI 格式
 */
function convertToHysteria2URI(config) {
  // 提取认证信息 (支持 auth_str 和 password 字段)
  const auth = config.auth_str || config.password || "";

  // 提取服务器地址
  let server = config.server;

  // 提取端口 (支持 port 和 server_port 字段)
  const port = config.port || config.server_port;

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

  // 处理 IPv6 地址 - 需要用方括号包裹
  if (isIPv6(server)) {
    server = `[${server}]`;
  }

  // 构建 URL 参数
  const params = [];

  // 添加 SNI (如果有)
  if (config.sni) {
    params.push(`sni=${encodeURIComponentCustom(config.sni)}`);
  } else if (config.tls && config.tls.server_name) {
    // 从 tls 对象中提取 SNI
    params.push(`sni=${encodeURIComponentCustom(config.tls.server_name)}`);
  } else {
    params.push(`sni=${encodeURIComponentCustom(config.server)}`);
  }

  // 添加跳过证书验证 (如果为 true)
  if (
    config.skip_cert_verify === true ||
    config.skip_cert_verify === "true" ||
    (config.tls && config.tls.insecure === true)
  ) {
    params.push("insecure=1");
  }
  if (
    config.skip_cert_verify === false ||
    config.skip_cert_verify === "false" ||
    (config.tls && config.tls.insecure === false)
  ) {
    params.push("insecure=0");
  } else {
    params.push("insecure=1");
  }

  // 添加混淆 (obfs) - Hysteria 2 支持 salamander 混淆
  // 注意: 配置中没有 obfs 字段,但保留扩展性
  if (config.obfs) {
    params.push(`obfs=${encodeURIComponentCustom(config.obfs)}`);
  }

  // 添加混淆密码 (如果有)
  if (config.obfs_password) {
    params.push(
      `obfs-password=${encodeURIComponentCustom(config.obfs_password)}`,
    );
  }

  // 添加证书指纹 (如果有)
  if (config.pinSHA256) {
    params.push(`pinSHA256=${encodeURIComponentCustom(config.pinSHA256)}`);
  }

  // 构建 URI
  // 格式: hysteria2://[auth@]host[:port]/?[query]
  let uri = `hysteria2://${encodeURIComponentCustom(auth)}@${server}`;

  // 添加端口 (如果不是默认的 443)
  if (port && port !== 443) {
    uri += `:${port}`;
  }

  // 添加路径和查询参数
  uri += "/";
  if (params.length > 0) {
    // uri += "?" + params.join("&");
    let urlobj = new URL(uri);
    urlobj.search = new URLSearchParams(
      Object.entries(Object.fromEntries(params.map((a) => a.split("=")))),
    )
      .toString();
    uri = urlobj.href;
  }

  return uri;
}

/**
 * 从 JSON 配置文件中提取所有 Hysteria 配置
 */
function extractHysteriaConfigs(data) {
  const configs = [];

  // 从 hysteria_configs 数组中提取所有代理配置
  if (data.hysteria_configs && Array.isArray(data.hysteria_configs)) {
    data.hysteria_configs.forEach((fileConfig) => {
      if (fileConfig.proxies && Array.isArray(fileConfig.proxies)) {
        fileConfig.proxies.forEach((proxy) => {
          // 只处理 hysteria 和 hysteria2 类型
          if (proxy.type === "hysteria" || proxy.type === "hysteria2") {
            configs.push({
              name: proxy.name || proxy.tag || "Unnamed",
              source: fileConfig.file,
              config: proxy,
            });
          }
        });
      }
    });
  }

  return configs;
}

/**
 * 生成订阅链接列表
 */
function generateSubscription(configs, options = {}) {
  const { includeNames = false, deduplicate = true } = options;

  // 去重 (基于服务器地址和端口)
  let uniqueConfigs = configs;
  if (deduplicate) {
    const seen = new Set();
    uniqueConfigs = configs.filter((item) => {
      const key = `${item.config.server}:${item.config.port}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // 生成订阅链接
  const lines = [];
  uniqueConfigs.forEach((item) => {
    const uri = convertToHysteria2URI(item.config);

    // 跳过无效配置（返回 null 的情况）
    if (!uri) {
      return;
    }

    if (includeNames) {
      // 添加名称注释
      lines.push(`# ${item.name}`);
      if (item.source) {
        lines.push(`# 来源: ${item.source}`);
      }
    }

    lines.push(uri);

    if (includeNames) {
      lines.push(""); // 空行分隔
    }
  });

  return lines.join("\n");
}

/**
 * 主函数
 */
function main() {
  try {
    // 检查配置文件是否存在
    if (!fs.existsSync(CONFIG_FILE)) {
      console.error(`错误: 找不到配置文件 ${CONFIG_FILE}`);
      process.exit(1);
    }

    // 读取配置文件
    const configData = fs.readFileSync(CONFIG_FILE, "utf8");
    const data = JSON.parse(configData);

    // 提取 Hysteria 配置
    const configs = extractHysteriaConfigs(data);

    if (configs.length === 0) {
      console.error("警告: 未找到任何 Hysteria 配置");
      process.exit(0);
    }

    // 生成订阅链接
    const subscription = generateSubscription(configs, {
      includeNames: false, // 不包含名称注释,只输出纯 URI
      deduplicate: true, // 去重
    });

    // 输出订阅链接
    console.log(subscription);

    // 输出统计信息到 stderr
    console.error(`\n========================================`);
    console.error(`Hysteria 2 订阅链接生成成功`);
    console.error(`========================================`);
    console.error(`总配置数: ${configs.length}`);
    console.error(
      `去重后: ${
        subscription.split("\n").filter((l) => l.trim()).length
      } 条链接`,
    );
    console.error(`========================================\n`);
  } catch (error) {
    console.error(`错误: ${error.message}`);
    if (error.code === "ENOENT") {
      console.error(`提示: 请确保 ${CONFIG_FILE} 文件存在`);
    } else if (error instanceof SyntaxError) {
      console.error(`提示: JSON 格式错误,请检查配置文件`);
    }
    process.exit(1);
  }
}

// 如果通过命令行直接运行
if (import.meta.main) {
  // 获取输出文件路径参数 (可选)
  const outputFile = process.argv[2];

  if (outputFile) {
    // 重定向 stdout 到文件
    const stream = fs.createWriteStream(outputFile);
    process.stdout.write = process.stderr.write = function (data) {
      stream.write(data);
    };

    stream.on("error", (err) => {
      console.error(`无法写入文件 ${outputFile}: ${err.message}`);
      process.exit(1);
    });
  }

  main();
}

// 导出函数供其他模块使用
export { convertToHysteria2URI, extractHysteriaConfigs, generateSubscription };
