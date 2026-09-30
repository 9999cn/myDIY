/**
 * MissAV.ws TV QuickJS 點播爬蟲
 * 基於官方 QuickJS Spider 規範實現
 */

const PAGE_SIZE = 12;
const DEFAULT_SITE_URL = "https://missav.ws";
const DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function createSpider(site = {}) {
    let siteUrl = DEFAULT_SITE_URL;
    let httpHeaders = {
        "User-Agent": DEFAULT_UA,
        "Referer": DEFAULT_SITE_URL + "/"
    };

    function init(ext) {
        if (!ext) return;
        let options = ext;
        if (typeof ext === "string") {
            try {
                options = JSON.parse(ext);
            } catch (e) {
                options = {};
            }
        }
        if (options.site_url) {
            siteUrl = options.site_url.replace(/\/+$/, "");
        }
        if (options.headers && typeof options.headers === "object") {
            Object.assign(httpHeaders, options.headers);
        }
    }

    function home(filter) {
        const classes = [
            { type_id: "new", type_name: "最新影片" },
            { type_id: "uncensored-leak", type_name: "無碼流出" },
            { type_id: "actresses", type_name: "女優列表", type_flag: "1" },
            { type_id: "genres", type_name: "主題分類", type_flag: "1" }
        ];

        const filters = {};
        if (filter) {
            const defaultFilter = [
                {
                    key: "order",
                    name: "排序",
                    init: "released_at",
                    value: [
                        { n: "發行日期", v: "released_at" },
                        { n: "最近更新", v: "published_at" },
                        { n: "熱門瀏覽", v: "views" },
                        { n: "最多收藏", v: "saved" }
                    ]
                }
            ];
            filters["new"] = defaultFilter;
            filters["uncensored-leak"] = defaultFilter;
        }

        return output({
            class: classes,
            filters: filters
        });
    }

    async function homeVod() {
        try {
            const html = await fetchText(siteUrl + "/new");
            const list = parseVodList(html);
            return output({ list: list.slice(0, PAGE_SIZE) });
        } catch (e) {
            return output({ list: [] });
        }
    }

    async function category(tid, pg, filter, extend) {
        const pageNum = Number.parseInt(pg, 10) || 1;
        let url = siteUrl;

        // 處理分類/排序邏輯
        const ext = extend || {};
        const order = ext.order || "released_at";

        if (tid === "new") {
            url += `/new?sort=${order}&page=${pageNum}`;
        } else if (tid === "uncensored-leak") {
            url += `/uncensored-leak?sort=${order}&page=${pageNum}`;
        } else if (tid.startsWith("actress/")) {
            url += `/actresses/${tid.replace("actress/", "")}?page=${pageNum}`;
        } else if (tid.startsWith("genre/")) {
            url += `/genres/${tid.replace("genre/", "")}?page=${pageNum}`;
        } else {
            url += `/${tid}?page=${pageNum}`;
        }

        try {
            const html = await fetchText(url);
            const list = parseVodList(html);
            return output({
                list: list,
                page: pageNum,
                pagecount: list.length > 0 ? pageNum + 1 : pageNum,
                limit: PAGE_SIZE,
                total: 999
            });
        } catch (e) {
            return output(page([], pg));
        }
    }

    async function detail(id) {
        const vodId = id.replace(/^vod\//, "");
        const targetUrl = vodId.startsWith("http") ? vodId : `${siteUrl}/${vodId}`;

        try {
            const html = await fetchText(targetUrl);
            
            // 解析影片基本資訊
            const titleMatch = html.match(/<h1[^>]*class="[^"]*text-base[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
                               html.match(/<title>([\s\S]*?)<\/title>/i);
            const title = titleMatch ? cleanText(titleMatch[1]) : "未知片名";

            const picMatch = html.match(/<video[^>]*poster="([^"]+)"/i) ||
                             html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
            const pic = picMatch ? picMatch[1] : "";

            const descMatch = html.match(/<div[^>]*class="[^"]*text-secondary[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
            const desc = descMatch ? cleanText(descMatch[1]) : "";

            // 解析播放 m3u8 地址（MissAV 網頁通常包含 eval 混淆或直接的 m3u8 匹配）
            let playUrl = "";
            const m3u8Match = html.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*\/playlist\.m3u8/i) ||
                              html.match(/(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/i);
            
            if (m3u8Match) {
                playUrl = m3u8Match[1];
            } else {
                // 回傳頁面網址交由 play 解析或嗅探
                playUrl = targetUrl;
            }

            const vod = {
                vod_id: id,
                vod_name: title,
                vod_pic: pic,
                vod_content: desc,
                vod_play_from: "MissAV",
                vod_play_url: `正片$play/${encodeURIComponent(playUrl)}`
            };

            return output({ list: [vod] });
        } catch (e) {
            return output({ list: [], msg: "解析詳情失敗：" + e.message });
        }
    }

    async function search(key, quick, pg = "1") {
        const pageNum = Number.parseInt(pg, 10) || 1;
        const searchUrl = `${siteUrl}/search/${encodeURIComponent(key)}?page=${pageNum}`;

        try {
            const html = await fetchText(searchUrl);
            const list = parseVodList(html);
            return output({
                list: list,
                page: pageNum,
                pagecount: list.length > 0 ? pageNum + 1 : pageNum,
                limit: PAGE_SIZE,
                total: 999
            });
        } catch (e) {
            return output(page([], pg));
        }
    }

    function play(flag, id, vipFlags) {
        const rawUrl = decodeURIComponent(id.replace(/^play\//, ""));

        // 若直接匹配到了 m3u8 鏈接，直接宣告 parse=0 播放
        if (rawUrl.includes(".m3u8")) {
            return output({
                parse: 0,
                jx: 0,
                url: rawUrl,
                header: {
                    "User-Agent": DEFAULT_UA,
                    "Referer": siteUrl + "/"
                }
            });
        }

        // 否則交給 App 嗅探 (parse=1)
        return output({
            parse: 1,
            jx: 0,
            url: rawUrl,
            header: {
                "User-Agent": DEFAULT_UA,
                "Referer": siteUrl + "/"
            }
        });
    }

    function live(url) {
        return "[]";
    }

    function proxy(params) {
        return [404, "text/plain; charset=utf-8", "Proxy Not Enabled"];
    }

    function action(value) {
        return output({ msg: "Action: " + value });
    }

    function sniffer() {
        return true;
    }

    function isVideo(url) {
        return /\.m3u8|\.mp4/i.test(url);
    }

    function destroy() {}

    // --- 內部輔助工具函數 ---

    async function fetchText(url) {
        if (typeof http === "function") {
            const response = await http(url, {
                headers: httpHeaders,
                timeout: 15000,
                redirect: 1
            });
            return response && response.body ? response.body : "";
        }
        if (typeof req === "function") {
            const response = req(url, { headers: httpHeaders });
            return response && response.content ? response.content : "";
        }
        throw new Error("無可用 HTTP 請求 Bridge");
    }

    function parseVodList(html) {
        const list = [];
        // 正則匹配 HTML 卡片
        const itemRegex = /<div[^>]*class="thumbnail[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
        let match;

        while ((match = itemRegex.exec(html)) !== null) {
            const block = match[1];
            
            const hrefMatch = block.match(/href="([^"]+)"/i);
            const titleMatch = block.match(/alt="([^"]+)"/i) || block.match(/title="([^"]+)"/i);
            const picMatch = block.match(/data-src="([^"]+)"/i) || block.match(/src="([^"]+)"/i);
            const durationMatch = block.match(/class="[^"]*duration[^"]*"[^>]*>([\s\S]*?)<\/span>/i);

            if (hrefMatch) {
                const link = hrefMatch[1];
                const vodId = link.startsWith("http") ? link : link.replace(/^\//, "");
                
                list.push({
                    vod_id: `vod/${vodId}`,
                    vod_name: titleMatch ? cleanText(titleMatch[1]) : "未知片名",
                    vod_pic: picMatch ? picMatch[1] : "",
                    vod_remarks: durationMatch ? cleanText(durationMatch[1]) : "",
                    style: { type: "rect", ratio: 1.78 }
                });
            }
        }
        return list;
    }

    function page(items, pg) {
        const current = Number.parseInt(pg, 10) || 1;
        return {
            list: items,
            page: current,
            pagecount: 1,
            limit: PAGE_SIZE,
            total: items.length
        };
    }

    function cleanText(str) {
        return str.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    }

    function output(value) {
        return JSON.stringify(value);
    }

    return {
        init,
        home,
        homeVod,
        category,
        detail,
        search,
        play,
        live,
        proxy,
        action,
        sniffer,
        isVideo,
        destroy
    };
}

export default createSpider;
