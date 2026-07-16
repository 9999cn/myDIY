/*
 * Spotify JSON 2026 修复增强版
 */
let url = $request.url;
if (url.indexOf("album-entity-view") !== -1 || url.indexOf("artistview") !== -1) {
    try {
        let obj = JSON.parse($response.body);
        
        // 移除限制标签，强制解锁切歌与随机播放
        if (obj.traits) {
            obj.traits.isPlayable = true;
            obj.traits.isShuffleHeader = false;
        }
        if (obj.dynamic_data) {
            obj.dynamic_data = {};
        }
        if (obj.explanations) {
            obj.explanations = [];
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
