/*
 * Spotify ProtoBuf 核心解密脚本 (2026 最新稳定版)
 * 作用：重构 bootstrap 和 user-customization-service，下发 Premium 权限
 */

let url = $request.url;
let body = $response.body;

// 1. 处理用户自定义服务 (user-customization-service)
if (url.indexOf("user-customization-service/v1/customize") !== -1) {
    try {
        let obj = JSON.parse(body);
        if (obj.customization) {
            // 强制注入溢价会员特征，解除随机播放和广告
            obj.customization.streamingRule = "FREE_TIER_PREMIUM_FEATURES";
            obj.customization.bypassCommercials = true;
            obj.customization.canSkipUnrestricted = true;
            obj.customization.publishActivity = true;
        }
        body = JSON.stringify(obj);
    } catch (e) {
        console.log("Spotify Customize JSON 转换失败，跳过修改。");
    }
} 
// 2. 处理核心启动数据 (bootstrap)
else if (url.indexOf("bootstrap/v1/bootstrap") !== -1) {
    // 由于是 Protobuf 二进制流，通过匹配特征 Hex 码，直接修改订阅等级
    // 查找 "type":"FREE" 或 "product":"free" 并替换为 "premium" 对应的字节
    let hexBody = bufToHex(body);
    
    // 替换普通用户的限制特征值为 Premium 特征值
    // free -> premium
    hexBody = hexBody.replace(/66726565/g, "7072656d69756d"); 
    
    body = hexToBuf(hexBody);
}

$done({ body });

// --- 辅助转换函数 ---
function bufToHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function hexToBuf(hexString) {
    let bytes = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return bytes.buffer;
}
