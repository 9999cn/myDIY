// 添加 Litv、ofiii、4gtv 检测的流媒体检测脚本

const POLICY_NAME = "PROXY"; // 你的代理策略名称
const TEST_URLS = {
    "YouTube": "https://www.youtube.com/premium",
    "Netflix": "https://www.netflix.com/title/81280792",
    "Disney+": "https://www.disneyplus.com",
    "BBC iPlayer": "https://www.bbc.co.uk/iplayer",
    "ABC": "https://www.abc.net.au",
    "NBC": "https://www.nbc.com",
    "CBS": "https://www.cbs.com",
    "Fox": "https://www.fox.com",
    "HBO Max": "https://www.hbomax.com",
    "Peacock": "https://www.peacocktv.com",
    "Paramount+": "https://www.paramountplus.com",
    "Discovery+": "https://www.discoveryplus.com",
    "DAZN": "https://www.dazn.com",
    "Hulu": "https://www.hulu.com",
    "TVB": "https://www.tvb.com",
    "Viu": "https://www.viu.com",
    "Abema": "https://abema.tv",
    "TVer": "https://tver.jp",
    "Bahamut": "https://ani.gamer.com.tw",
    "Bilibili TW/HK/MO": "https://www.bilibili.com",
    "MyTVSuper": "https://www.mytvsuper.com",
    "LineTV": "https://www.linetv.tw",
    "Litv": "https://www.litv.tv",
    "ofiii": "https://www.ofiii.com",
    "4gtv": "https://www.4gtv.tv"
};

async function testAccessibility(url) {
    try {
        let response = await $http.head({
            url: url,
            policy: POLICY_NAME,
            timeout: 3000
        });
        return response.statusCode === 200 || response.statusCode === 302 || response.statusCode === 301;
    } catch (e) {
        return false;
    }
}

async function performTests() {
    let results = [];
    
    for (let [service, url] of Object.entries(TEST_URLS)) {
        let isAccessible = await testAccessibility(url);
        results.push({
            service: service,
            accessible: isAccessible,
            icon: isAccessible ? "checkmark.seal.fill" : "xmark.seal"
        });
    }
    
    return results;
}

async function createWidget(results) {
    let widget = new ListWidget();
    widget.spacing = 4;
    
    let title = widget.addText("流媒体解锁检测");
    title.font = Font.boldSystemFont(16);
    title.textColor = new Color("#FFFFFF");
    
    widget.addSpacer(8);
    
    let grid = widget.addStack();
    grid.layoutHorizontally();
    grid.spacing = 8;
    
    // 最多显示3列
    let columnCount = 3;
    let itemsPerColumn = Math.ceil(results.length / columnCount);
    
    for (let i = 0; i < columnCount; i++) {
        let column = grid.addStack();
        column.layoutVertically();
        column.spacing = 4;
        
        let start = i * itemsPerColumn;
        let end = Math.min(start + itemsPerColumn, results.length);
        
        for (let j = start; j < end; j++) {
            let item = results[j];
            let row = column.addStack();
            row.layoutHorizontally();
            row.spacing = 4;
            
            let icon = row.addImage(SFSymbol.named(item.icon).image);
            icon.imageSize = new Size(12, 12);
            icon.tintColor = item.accessible ? new Color("#34C759") : new Color("#FF3B30");
            
            let text = row.addText(item.service);
            text.font = Font.mediumSystemFont(12);
            text.textColor = new Color("#FFFFFF");
            text.lineLimit = 1;
        }
    }
    
    widget.setPadding(12, 12, 12, 12);
    widget.backgroundColor = new Color("#1C1C1E");
    
    return widget;
}

async function run() {
    let results = await performTests();
    let widget = await createWidget(results);
    
    if (config.runsInWidget) {
        Script.setWidget(widget);
    } else {
        widget.presentSmall();
    }
    
    Script.complete();
}

await run();
