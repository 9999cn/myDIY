/*
 * Spotify JSON 解锁脚本 (2026 最新适配版)
 * 作用：修改艺术家、专辑视图，解锁切歌与限制
 */

if ($request.url.indexOf("album-entity-view") !== -1) {
  // 处理专辑页面视图
  let obj = JSON.parse($response.body);
  if (obj.explanations) {
    obj.explanations = [];
  }
  // 移除限制标记，允许自由切歌
  if (obj.traits) {
    obj.traits.isPlayable = true;
    obj.traits.isShuffleHeader = false;
  }
  $done({ body: JSON.stringify(obj) });
} else if ($request.url.indexOf("artistview") !== -1) {
  // 处理歌手页面视图
  let obj = JSON.parse($response.body);
  if (obj.header_image) {
    // 保持背景图正常加载
  }
  // 移除歌手页面的强制随机播放限制
  if (obj.dynamic_data) {
    obj.dynamic_data = {};
  }
  $done({ body: JSON.stringify(obj) });
} else {
  $done({});
}
