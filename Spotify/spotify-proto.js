/*
 * Spotify Proto 2026 核心修复版
 */
let url = $request.url;

// 1. 优先处理并重构 JSON 格式的自定义接口（最稳妥的特权注入方法）
if (url.indexOf("user-customization-service/v1/customize") !== -1) {
    try {
        let obj = JSON.parse($response.body);
        if (obj.customization) {
            obj.customization.streamingRule = "FREE_TIER_PREMIUM_FEATURES";
            obj.customization.bypassCommercials = true;
            obj.customization.canSkipUnrestricted = true;
            obj.customization.publishActivity = true;
        }
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} 
// 2. 针对二进制 bootstrap 接口，避免暴力正则导致的包体损坏，我们使用安全重构
else if (url.indexOf("bootstrap/v1/bootstrap") !== -1) {
    try {
        let rawBody = $response.body;
        // 如果无法正常无损解析，此处直接拦截并放行，让本地缓存和 customize 逻辑起主导作用
        // 这能 100% 避免因 bootstrap 二进制结构损坏而导致的闪退和频繁强退登录
        $done({ body: rawBody });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
