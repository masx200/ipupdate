#!/usr/bin/env node

/**
 * TUIC 订阅链接生成器
 * 从 hysteria-tuic-proxy_configs.json 提取 TUIC 配置并生成订阅链接
 */

import fs from "fs";
import path from "path";

// 读取配置文件
function loadConfig(configPath) {
  const fullPath = path.resolve(configPath);
  const content = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(content);
}

// URL 编码函数
function encodeURIComponentSpecial(str) {
  return encodeURIComponent(str).replace(/'/g, "%27");
}

// 生成单个 TUIC 订阅链接
function generateTuicLink(proxy) {
  const {
    name,
    server,
    port,
    uuid,
    password,
    sni,
    alpn = [],
    skip_cert_verify,
    reduce_rtt,
    udp_relay_mode,
    congestion_controller,
  } = proxy;

  // 构建基础 URL: tuic://uuid:password@server:port
  let link = `tuic://${uuid}:${password}@`;

  // 处理 IPv6 地址（需要用方括号包裹）
  if (server.includes(":")) {
    link += `[${server}]:${port}`;
  } else {
    link += `${server}:${port}`;
  }

  // 构建查询参数
  const params = [];

  if (sni) {
    params.push(`sni=${encodeURIComponentSpecial(sni)}`);
  }

  if (alpn && alpn.length > 0) {
    params.push(`alpn=${alpn.join(",")}`);
  }

  if (congestion_controller) {
    params.push(`congestion_control=${congestion_controller}`);
  }

  if (udp_relay_mode) {
    params.push(`udp_relay_mode=${udp_relay_mode}`);
  }

  if (skip_cert_verify !== undefined) {
    // 转换布尔值为 0 或 1
    const insecure = skip_cert_verify ? "1" : "0";
    params.push(`insecure=${insecure}`);
    params.push(`allowInsecure=${insecure}`);
    params.push(`allow_insecure=${insecure}`);
  }

  if (reduce_rtt !== undefined) {
    const reduceRttValue = reduce_rtt ? "1" : "0";
    params.push(`reduce_rtt=${reduceRttValue}`);
  }

  // 添加参数到 URL
  if (params.length > 0) {
    link += `?${params.join("&")}`;
  }

  // 添加备注名称（URL 编码）
  if (name) {
    link += `#${server}`;
  }

  return link;
}

// 主函数
function main() {
  const configPath = "./hysteria-tuic-proxy_configs.json";

  console.log("读取配置文件:", configPath);
  const config = loadConfig(configPath);

  console.log(`找到 ${config.tuic_configs.length} 个 TUIC 配置文件`);
  console.log("开始生成 TUIC 订阅链接...\n");

  const tuicLinks = [];

  // 遍历所有 TUIC 配置
  config.tuic_configs.forEach((configItem, index) => {
    console.log(`处理配置 ${index + 1}: ${configItem.file}`);

    configItem.proxies.forEach((proxy) => {
      if (proxy.type === "tuic") {
        const link = generateTuicLink(proxy);
        tuicLinks.push(link);
        console.log(`  ✓ 生成链接: ${proxy.name}`);
      }
    });
  });

  console.log(`\n共生成 ${tuicLinks.length} 个 TUIC 订阅链接\n`);
  console.log("=".repeat(80));

  // 输出所有链接
  tuicLinks.forEach((link, index) => {
    console.log(`[${index + 1}] ${link}`);
  });

  console.log("=".repeat(80));

  // 保存到文件
  const outputFile = "./tuic-subscription.txt";
  fs.writeFileSync(outputFile, tuicLinks.join("\n"), "utf8");
  console.log(`\n✓ 订阅链接已保存到: ${outputFile}`);

  // // 生成 Base64 编码的订阅内容
  // const base64Content = Buffer.from(tuicLinks.join('\n')).toString('base64');
  // const base64File = './tuic-subscription-base64.txt';
  // fs.writeFileSync(base64File, base64Content, 'utf8');
  // console.log(`✓ Base64 编码订阅已保存到: ${base64File}`);

  // 统计信息
  console.log("\n统计信息:");
  console.log(`  配置文件数: ${config.tuic_configs.length}`);
  console.log(`  TUIC 节点数: ${tuicLinks.length}`);
  console.log(`  唯一服务器数: ${config.statistics.unique_servers}`);
}

// 运行主函数
if (import.meta.main) {
  try {
    main();
    console.log("\n✓ 订阅链接生成完成！");
  } catch (error) {
    console.error("错误:", error.message);
    process.exit(1);
  }
}

export { generateTuicLink };
