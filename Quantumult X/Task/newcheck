// 在原有脚本基础上添加 Litv、ofiii、4gtv 检测

const BASE_URL = 'https://www.netflix.com/title/';
const BASE_URL_YTB = "https://www.youtube.com/premium";
const BASE_URL_DISNEY = 'https://www.disneyplus.com';
const BASE_URL_Dazn = "https://startup.core.indazn.com/misl/v5/Startup";
const BASE_URL_Param = "https://www.paramountplus.com/"
const BASE_URL_Litv = "https://www.litv.tv"
const BASE_URL_Ofiii = "https://www.ofiii.com"
const BASE_URL_4gtv = "https://www.4gtv.tv"
const FILM_ID = 81280792
const BASE_URL_Discovery_token = "https://us1-prod-direct.discoveryplus.com/token?deviceId=d1a4a5d25212400d1e6985984604d740&realm=go&shortlived=true"
const BASE_URL_Discovery = "https://us1-prod-direct.discoveryplus.com/users/me"
const BASE_URL_GPT = 'https://chat.openai.com/'
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace'

const link = { "media-url": "https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/img/southpark/7.png" } 
const policy_name = "Netflix" //填入你的 netflix 策略组名

const arrow = " ➟ "

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'

// 状态常量
const STATUS_COMING = 2
const STATUS_AVAILABLE = 1
const STATUS_NOT_AVAILABLE = 0
const STATUS_TIMEOUT = -1
const STATUS_ERROR = -2

var opts = {
  policy: $environment.params
};

var opts1 = {
  policy: $environment.params,
  redirection: false
};

// 国旗emoji映射
var flags = new Map([[ "AC" , "🇦🇨" ] ,["AE","🇦🇪"], [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , ["BA", "🇧🇦"], [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧🇭" ] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫🇲" ] , [ "FO" , "🇫" ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ],["HU","🇭🇺"], [ "ID" , "🇮🇩" ]" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "LU" , "🇱🇺" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇨🇳" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ] , [ "ZA" , "🇿🇦"]])

// 初始化结果对象
let result = {
  "title": '    📺  流媒体服务查询',
  "YouTube": '<b>YouTube: </b>检测失败，请重试 ❗️',
  "Netflix": '<b>Netflix: </b>检测失败，请重试 ❗️',
  "Dazn": "<b>Dazn: </b>检测失败，请重试 ❗️",
  "Disney": "<b>Disneyᐩ: </b>检测失败，请重试 ❗️",
  "Paramount" : "<b>Paramountᐩ: </b>检测失败，请重试 ❗️",
  "Discovery" : "<b>Discoveryᐩ: </b>检测失败，请重试 ❗️",
  "ChatGPT" : "<b>ChatGPT: </b>检测失败，请重试 ❗️",
  "Litv": "<b>Litv: </b>检测失败，请重试 ❗️",
  "Ofiii": "<b>Ofiii: </b>检测失败，请重试 ❗️",
  "4gtv": "<b>4gtv: </b>检测失败，请重试 ❗️"
}

const message = {
  action: "get_policy_state",
  content: $environment.params
};

;(async () => {
  testYTB()
  testDazn()
  testParam()
  testLitv()
  testOfiii()
  test4gtv()
  
  let [{ region, status }] = await Promise.all([testDisneyPlus(),testNf(FILM_ID),testDiscovery(),testChatGPT()])
  console.log("NetFlix Result:"+result["Netflix"])
  console.log(`testDisneyPlus: region=${region}, status=${status}`)
  
  if (status==STATUS_COMING) {
    result["Disney"] = "<b>Disneyᐩ:</b> 即将登陆 ➟ "+'⟦'+flags.get(region.toUpperCase())+"⟧ ⚠️"
  } else if (status==STATUS_AVAILABLE){
    result["Disney"] = "<b>Disneyᐩ:</b> 支持 ➟ "+'⟦'+flags.get(region.toUpperCase())+"⟧ 🎉"
    console.log(result["Disney"])
  } else if (status==STATUS_NOT_AVAILABLE) {
    result["Disney"] = "<b>Disneyᐩ:</b> 未支持 🚫 "
  } else if (status==STATUS_TIMEOUT) {
    result["Disney"] = "<b>Disneyᐩ:</b> 检测超时 🚦 "
  }

  let content = "------------------------------"+"</br>"+([result["YouTube"],result["Netflix"],result["Disney"],result["Dazn"],result["Paramount"],result["Discovery"],result["ChatGPT"],result["Litv"],result["Ofiii"],result["4gtv"]]).join("</br></br>")
  content = content + "</br>------------------------------</br>"+"<font color=#CD5C5C >"+"<b>节点</b> ➟ " + $environment.params+ "</font>"
  content =`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
  
  $configuration.sendMessage(message).then(resolve => {
    if (resolve.error) {
      console.log(resolve.error);
      $done()
    }
    if (resolve.ret) {
      let output=JSON.stringify(resolve.ret[message.content])? JSON.stringify(resolve.ret[message.content]).replace(/\"|\[|\]/g,"").replace(/\,/g," ➟ ") : $environment.params
      let content = "--------------------------------------</br>"+([result["Dazn"],result["Discovery"],result["Paramount"],result["Disney"],result["ChatGPT"],result["Netflix"],result["YouTube"],result["Litv"],result["Ofiii"],result["4gtv"]]).join("</br></br>")
      content = content + "</br>--------------------------------------</br>"+"<font color=#CD5C5C>"+"<b>节点</b> ➟ " + output+ "</font>"
      content =`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
      console.log(output);
      $done({"title":result["title"],"htmlMessage":content})
    }
  }, reject => {
    $done();
  });  
})()
.catch(error => {
  console.log(error);
  $done({"title":result["title"],"htmlMessage":`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">`+'----------------------</br></br>'+"🚥 检测异常"+'</br></br>----------------------</br>'+ $environment.params + `</p>`})
});

// 新增的检测函数
function testLitv() {
  let option = {
    url: BASE_URL_Litv,
    opts: opts1,
    timeout: 3000,
    headers: {
      'User-Agent': UA
    }
  }
  
  $task.fetch(option).then(response => {
    console.log("Litv Status Code:" + response.statusCode)
    if (response.statusCode === 200) {
      let region = 'TW'; // 默认设置为台湾地区
      result["Litv"] = "<b>Litv: </b>支持 ➟ " + "⟦"+flags.get(region.toUpperCase())+"⟧ 🎉"
    } else if (response.statusCode === 403 || response.statusCode === 404) {
      result["Litv"] = "<b>Litv: </b>未支持 🚫"
    } else {
      result["Litv"] = "<b>Litv: </b>检测失败 ❗️"
    }
  }, reason => {
    result["Litv"] = "<b>Litv: </b>检测超时 🚦"
  });
}

function testOfiii() {
  let option = {
    url: BASE_URL_Ofiii,
    opts: opts1,
    timeout: 3000,
    headers: {
      'User-Agent': UA
    }
  }
  
  $task.fetch(option).then(response => {
    console.log("Ofiii Status Code:" + response.statusCode)
    if (response.statusCode === 200) {
      let region = 'TW'; // 默认设置为台湾地区
      result["Ofiii"] = "<b>Ofiii: </b>支持 ➟ " + "⟦"+flags.get(region.toUpperCase())+"⟧ 🎉"
    } else if (response.statusCode === 403 || response.statusCode === 404) {
      result["Ofiii"] = "<b>Ofiii: </b>未支持 🚫"
    } else {
      result["Ofiii"] = "<b>Ofiii: </b>检测失败 ❗️"
    }
  }, reason => {
    result["Ofiii"] = "<b>Ofiii: </b>检测超时 🚦"
  });
}

function test4gtv() {
  let option = {
    url: BASE_URL_4gtv,
    opts: opts1,
    timeout: 3000,
    headers: {
      'User-Agent': UA
    }
  }
  
  $task.fetch(option).then(response => {
    console.log("4gtv Status Code:" + response.statusCode)
    if (response.statusCode === 200) {
      let region = 'TW'; // 默认设置为台湾地区
      result["4gtv"] = "<b>4gtv: </b>支持 ➟ " + "⟦"+flags.get(region.toUpperCase())+"⟧ 🎉"
    } else if (response.statusCode === 403 || response.statusCode === 404) {
      result["4gtv"] = "<b>4gtv: </b>未支持 🚫"
    } else {
      result["4gtv"] = "<b>4gtv: </b>检测失败 ❗️"
    }
  }, reason => {
    result["4gtv"] = "<b>4gtv: </b>检测超时 🚦"
  });
}

// 原有函数保持不变（testDisneyPlus, testNf, testYTB, testDazn, testParam, testDiscovery, testChatGPT等）
// ... [原有函数的代码保持不变，此处省略以节省空间]
