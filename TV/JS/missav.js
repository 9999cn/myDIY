/**
 * MissAV.ws TV QuickJS 爬虫 (嗅探增强版)
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
            try { options = JSON.parse(ext); } catch (e) { options = {}; }
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
            { type_id: "uncensored-leak", type_name: "無碼流出" }
        ];
        return output({ class: classes });
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
        let url = `${siteUrl}/${tid}?page=${pageNum}`;

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
            return output({ list: [], page: pageNum, pagecount: 1, limit: PAGE_SIZE, total: 0 });
        }
    }

    async function detail(id) {
        const vodId = id.replace(/^vod\//, "");
        const targetUrl = vodId.startsWith("http") ? vodId : `${siteUrl}/${vodId}`;

        try {
            const html = await fetchText(targetUrl);
            
            const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
            const title = titleMatch ? cleanText(titleMatch[1]) : "影片詳情";

            const picMatch = html.match(/poster="([^"]+)"/i) || html.match(/property="og:image"\s+content="([^"]+)"/i);
            const pic = picMatch ? picMatch[1] : "";

            // 将页面链接作为播放源传给 play，交由 App 嗅探处理
            const vod = {
                vod_id: id,
                vod_name: title,
                vod_pic: pic,
                vod_play_from: "MissAV 嗅探播放",
                vod_play_url: `播放全集$play/${encodeURIComponent(targetUrl)}`
            };

            return output({ list: [vod] });
        } catch (e) {
            return output({ list: [], msg: "解析詳情失敗" });
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
            return output({ list: [], page: pageNum, pagecount: 1, limit: PAGE_SIZE, total: 0 });
        }
    }

    function play(flag, id, vipFlags) {
        const targetUrl = decodeURIComponent(id.replace(/^play\//, ""));

        // 强行开启 parse: 1 (网页嗅探)，让 App 的 WebView 在后台加载网页并提取 m3u8
        return output({
            parse: 1,
            jx: 0,
            url: targetUrl,
            header: {
                "User-Agent": DEFAULT_UA,
                "Referer": siteUrl + "/"
            }
        });
    }

    function sniffer() {
        return true;
    }

    function isVideo(url) {
        return /\.m3u8|\.mp4/i.test(url);
    }

    function live(url) { return "[]"; }
    function proxy(params) { return [404, "text/plain", "Not Proxy"]; }
    function action(value) { return output({ msg: value }); }
    function destroy() {}

    async function fetchText(url) {
        if (typeof http === "function") {
            const res = await http(url, { headers: httpHeaders, timeout: 15000, redirect: 1 });
            return res && res.body ? res.body : "";
        }
        if (typeof req === "function") {
            const res = req(url, { headers: httpHeaders });
            return res && res.content ? res.content : "";
        }
        return "";
    }

    function parseVodList(html) {
        const list = [];
        // 匹配 HTML 列表块
        const regex = /<a[^>]*href="([^"]+)"[^>]*class="[^"]*thumbnail[^"]*"[\s\S]*?<img[^>]*(?:data-src|src)="([^"]+)"[^>]*alt="([^"]+)"/gi;
        let match;

        while ((match = regex.exec(html)) !== null) {
            const href = match[1];
            const pic = match[2];
            const name = match[3];

            if (href) {
                const vodId = href.startsWith("http") ? href : href.replace(/^\//, "");
                list.push({
                    vod_id: `vod/${vodId}`,
                    vod_name: cleanText(name),
                    vod_pic: pic,
                    style: { type: "rect", ratio: 1.78 }
                });
            }
        }
        return list;
    }

    function cleanText(str) {
        return str ? str.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
    }

    function output(val) {
        return JSON.stringify(val);
    }

    return { init, home, homeVod, category, detail, search, play, live, proxy, action, sniffer, isVideo, destroy };
}

export default createSpider;
