// ==UserScript==
// @name         Quantumult X - Stream Unlock Check
// @version      1.0.0
// @description  检测当前节点对流媒体服务的解锁能力，包括 Netflix、Disney+、YouTube Premium、HBO Max、ChatGPT、LiTV、OFiii、4GTV 等
// @author       your_github_id
// @match        *
// @run-at       time
// @time         08:00
// ==/UserScript==

const services = [
  {
    name: "Netflix",
    url: "https://www.netflix.com/title/80018499",
    test: res => res.status === 200 || res.status === 403,
  },
  {
    name: "YouTube Premium",
    url: "https://www.youtube.com/premium",
    test: res => res.status === 200 && res.body.includes("Premium"),
  },
  {
    name: "Disney+",
    url: "https://www.disneyplus.com/",
    test: res => res.status === 200 && res.body.includes("disney"),
  },
  {
    name: "HBO Max",
    url: "https://www.hbomax.com/",
    test: res => res.status === 200 && res.body.includes("HBO"),
  },
  {
    name: "ChatGPT",
    url: "https://chat.openai.com/",
    test: res => res.status === 200 && !res.body.includes("not available"),
  },
  {
    name: "LiTV",
    url: "https://www.litv.tv/",
    test: res => res.status === 200 && res.body.includes("LiTV"),
  },
  {
    name: "OFiii",
    url: "https://www.ofiii.com/",
    test: res => res.status === 200 && res.body.includes("OFiii"),
  },
  {
    name: "4GTV",
    url: "https://www.4gtv.tv/",
    test: res => res.status === 200 && res.body.includes("4GTV"),
  }
];

(async () => {
  let resultList = [];

  for (const service of services) {
    try {
      const res = await httpAPI(service.url);
      if (service.test(res)) {
        resultList.push(`${service.name}: ✅`);
      } else {
        resultList.push(`${service.name}: ❌`);
      }
    } catch (err) {
      resultList.push(`${service.name}: 请求失败`);
    }
  }

  $notify("流媒体解锁检测", "", resultList.join("\n"));
  $done();
})();

function httpAPI(url) {
  return new Promise((resolve, reject) => {
    $task.fetch({
      url: url,
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0" }
    }).then(
      res => {
        resolve({ status: res.statusCode, body: res.body || "" });
      },
      err => reject(err)
    );
  });
}
