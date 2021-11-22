/***

Thanks to & modified from 
1. https://gist.githubusercontent.com/Hyseen/b06e911a41036ebc36acf04ddebe7b9a/raw/nf_check.js
2. https://github.com/AtlantisGawrGura/Quantumult-X-Scripts/blob/main/media.js
3. https://github.com/CoiaPrant/MediaUnlock_Test/blob/main/check.sh


For Quantumult-X 598+ ONLY!!

[task_local]

event-interaction https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/streaming-ui-check.js, tag=瘚��雿�-閫���亥砭, img-url=checkmark.seal.system, enabled=true



@XIAO_KOP

**/

const BASE_URL = 'https://www.netflix.com/title/';
const BASE_URL_YTB = "https://www.youtube.com/premium";
const BASE_URL_DISNEY = 'https://www.disneyplus.com';
const BASE_URL_Dazn = "https://startup.core.indazn.com/misl/v5/Startup";
const BASE_URL_Param = "https://www.paramountplus.com/"
const FILM_ID = 81215567
const BASE_URL_Discovery_token = "https://us1-prod-direct.discoveryplus.com/token?deviceId=d1a4a5d25212400d1e6985984604d740&realm=go&shortlived=true"
const BASE_URL_Discovery = "https://us1-prod-direct.discoveryplus.com/users/me"

const link = { "media-url": "https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/img/southpark/7.png" } 
const policy_name = "Netflix" //憛怠�雿删� netflix 蝑𣇉裦蝏��

const arrow = " �� "

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'

// �喳��駁�
const STATUS_COMING = 2
// �舀�閫��
const STATUS_AVAILABLE = 1
// 銝齿𣈲��圾��
const STATUS_NOT_AVAILABLE = 0
// 璉�瘚贝���
const STATUS_TIMEOUT = -1
// 璉�瘚见�撣�
const STATUS_ERROR = -2

var opts = {
  policy: $environment.params
};

var opts1 = {
  policy: $environment.params,
  redirection: false
};


var flags = new Map([[ "AC" , "�𨤍�𠪊" ] ,["AE","�𨤍�䌊"], [ "AF" , "�𨤍�蒄" ] , [ "AI" , "�𨤍�䤰" ] , [ "AL" , "�𨤍�靊" ] , [ "AM" , "�𨤍�鈘" ] , [ "AQ" , "�𨤍�権" ] , [ "AR" , "�𨤍�袝" ] , [ "AS" , "�𨤍�瑌" ] , [ "AT" , "�𨤍�篅" ] , [ "AU" , "�𨤍�枂" ] , [ "AW" , "�𨤍�剏" ] , [ "AX" , "�𨤍�遆" ] , [ "AZ" , "�𨤍�珄" ] , ["BA", "�𣇪�𨤍"], [ "BB" , "�𣇪�𣇪" ] , [ "BD" , "�𣇪�𣉞" ] , [ "BE" , "�𣇪�䌊" ] , [ "BF" , "�𣇪�蒄" ] , [ "BG" , "�𣇪�龖" ] , [ "BH" , "�𣇪�鐯" ] , [ "BI" , "�𣇪�䤰" ] , [ "BJ" , "�𣇪�蘓" ] , [ "BM" , "�𣇪�鈘" ] , [ "BN" , "�𣇪�秐" ] , [ "BO" , "�𣇪�稲" ] , [ "BR" , "�𣇪�袝" ] , [ "BS" , "�𣇪�瑌" ] , [ "BT" , "�𣇪�篅" ] , [ "BV" , "�𣇪�稬" ] , [ "BW" , "�𣇪�剏" ] , [ "BY" , "�𣇪�㓦" ] , [ "BZ" , "�𣇪�珄" ] , [ "CA" , "�𠪊�𨤍" ] , [ "CF" , "�𠪊�蒄" ] , [ "CH" , "�𠪊�鐯" ] , [ "CK" , "�𠪊�墖" ] , [ "CL" , "�𠪊�靊" ] , [ "CM" , "�𠪊�鈘" ] , [ "CN" , "�𠪊�秐" ] , [ "CO" , "�𠪊�稲" ] , [ "CP" , "�𠪊�晠" ] , [ "CR" , "�𠪊�袝" ] , [ "CU" , "�𠪊�枂" ] , [ "CV" , "�𠪊�稬" ] , [ "CW" , "�𠪊�剏" ] , [ "CX" , "�𠪊�遆" ] , [ "CY" , "�𠪊�㓦" ] , [ "CZ" , "�𠪊�珄" ] , [ "DE" , "�𣉞�䌊" ] , [ "DG" , "�𣉞�龖" ] , [ "DJ" , "�𣉞�蘓" ] , [ "DK" , "�𣉞�墖" ] , [ "DM" , "�𣉞�鈘" ] , [ "DO" , "�𣉞�稲" ] , [ "DZ" , "�𣉞�珄" ] , [ "EA" , "�䌊�𨤍" ] , [ "EC" , "�䌊�𠪊" ] , [ "EE" , "�䌊�䌊" ] , [ "EG" , "�䌊�龖" ] , [ "EH" , "�䌊�鐯" ] , [ "ER" , "�䌊�袝" ] , [ "ES" , "�䌊�瑌" ] , [ "ET" , "�䌊�篅" ] , [ "EU" , "�䌊�枂" ] , [ "FI" , "�蒄�䤰" ] , [ "FJ" , "�蒄�蘓" ] , [ "FK" , "�蒄�墖" ] , [ "FM" , "�蒄�鈘" ] , [ "FO" , "�蒄�" ] , [ "FR" , "�蒄�袝" ] , [ "GA" , "�龖�𨤍" ] , [ "GB" , "�龖�𣇪" ] , [ "HK" , "�鐯�墖" ] ,["HU","�鐯�枂"], [ "ID" , "�䤰�𣉞" ] , [ "IE" , "�䤰�䌊" ] , [ "IL" , "�䤰�靊" ] , [ "IM" , "�䤰�鈘" ] , [ "IN" , "�䤰�秐" ] , [ "IS" , "�䤰�瑌" ] , [ "IT" , "�䤰�篅" ] , [ "JP" , "�蘓�晠" ] , [ "KR" , "�墖�袝" ] , [ "LU" , "�靊�枂" ] , [ "MO" , "�鈘�稲" ] , [ "MX" , "�鈘�遆" ] , [ "MY" , "�鈘�㓦" ] , [ "NL" , "�秐�靊" ] , [ "PH" , "�晠�鐯" ] , [ "RO" , "�袝�稲" ] , [ "RS" , "�袝�瑌" ] , [ "RU" , "�袝�枂" ] , [ "RW" , "�袝�剏" ] , [ "SA" , "�瑌�𨤍" ] , [ "SB" , "���𣇪" ] , [ "SC" , "�瑌�𠪊" ] , [ "SD" , "�瑌�𣉞" ] , [ "SE" , "�瑌�䌊" ] , [ "SG" , "�瑌�龖" ] , [ "TH" , "�篅�鐯" ] , [ "TN" , "�篅�秐" ] , [ "TO" , "�篅�稲" ] , [ "TR" , "�篅�袝" ] , [ "TV" , "�篅�稬" ] , [ "TW" , "�𠪊�秐" ] , [ "UK" , "�龖�𣇪" ] , [ "UM" , "�枂�鈘" ] , [ "US" , "�枂�瑌" ] , [ "UY" , "�枂�㓦" ] , [ "UZ" , "�枂�珄" ] , [ "VA" , "�稬�𨤍" ] , [ "VE" , "�稬�䌊" ] , [ "VG" , "�稬�龖" ] , [ "VI" , "�稬�䤰" ] , [ "VN" , "�稬�秐" ] , [ "ZA" , "�珄�𨤍"]])

let result = {
  "title": '    �唍  瘚��雿𤘪��⊥䰻霂�',
  "YouTube": '<b>YouTube: </b>璉�瘚见仃韐伐�霂琿�霂�� �梹�',
  "Netflix": '<b>Netflix: </b>璉�瘚见仃韐伐�霂琿�霂� �梹�',
  "Dazn": "<b>Dazn: </b>璉�瘚见仃韐伐�霂琿�霂� �梹�",
  "Disney": "<b>Disney��: </b>璉�瘚见仃韐伐�霂琿�霂� �梹�",
  "Paramount" : "<b>Paramount��: </b>璉�瘚见仃韐伐�霂琿�霂� �梹�",
  "Discovery" : "<b>Discovery��: </b>璉�瘚见仃韐伐�霂琿�霂� �梹�",
  //"Google": "Google 摰帋�: 璉�瘚见仃韐伐�霂琿�霂�"

}
const message = {
  action: "get_policy_state",
  content: $environment.params
};

;(async () => {
  testYTB()
  testDazn()
  testParam()
  let [{ region, status }] = await Promise.all([testDisneyPlus(),testNf(FILM_ID),testDiscovery()])
  console.log(result["Netflix"])
  console.log(`testDisneyPlus: region=${region}, status=${status}`)
  if (status==STATUS_COMING) {
    //console.log(1)
    result["Disney"] = "<b>Disney��:</b> �𩤃� �喳��駁� �� "+'��'+flags.get(region.toUpperCase())+"��"
  } else if (status==STATUS_AVAILABLE){
    //console.log(2)
    result["Disney"] = "<b>Disney��:</b> �舀� �� "+'��'+flags.get(region.toUpperCase())+"�� ��"
    console.log(result["Disney"])
  } else if (status==STATUS_NOT_AVAILABLE) {
    //console.log(3)
    result["Disney"] = "<b>Disney��:</b> �芣𣈲�� �麱 "
  } else if (status==STATUS_TIMEOUT) {
    result["Disney"] = "<b>Disney��:</b> 璉�瘚贝��� �鷼 "
  }

  let content = "------------------------------"+"</br>"+([result["YouTube"],result["Netflix"],result["Disney"],result["Dazn"],result["Paramount"],result["Discovery"]]).join("</br></br>")
  content = content + "</br>------------------------------</br>"+"<font color=#CD5C5C >"+"<b>���</b> �� " + $environment.params+ "</font>"
  content =`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
//  cnt = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` +'----------------------</br></br>'+result["Disney"]+'</br></br>----------------------</br>'+$environment.params + `</p>`
$configuration.sendMessage(message).then(resolve => {
    if (resolve.error) {
      console.log(resolve.error);
      $done()
    }
    if (resolve.ret) {
      let output=JSON.stringify(resolve.ret[message.content])? JSON.stringify(resolve.ret[message.content]).replace(/\"|\[|\]/g,"").replace(/\,/g," �� ") : $environment.params
      let content = "--------------------------------------</br>"+([result["Dazn"],result["Discovery"],result["Paramount"],result["Disney"],result["Netflix"],result["YouTube"]]).join("</br></br>")
      content = content + "</br>--------------------------------------</br>"+"<font color=#CD5C5C>"+"<b>���</b> �� " + output+ "</font>"
      content =`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
      //$notify(typeof(output),output)
      console.log(output);
      $done({"title":result["title"],"htmlMessage":content})
      
    }
    //$done();|
  }, reject => {
    // Normally will never happen.
    $done();
  });  
  //$done({"title":result["title"],"htmlMessage":content})
})()
.finally(() => {
  
  $configuration.sendMessage(message).then(resolve => {
    if (resolve.error) {
      console.log(resolve.error);
      $done()
    }
    if (resolve.ret) {
      let output=JSON.stringify(resolve.ret[message.content])? JSON.stringify(resolve.ret[message.content]).replace(/\"|\[|\]/g,"").replace(/\,/g," �� ") : $environment.params
      let content = "--------------------------------------</br>"+([result["Dazn"],result["Discovery"],result["Paramount"],result["Disney"],result["Netflix"],result["YouTube"]]).join("</br></br>")
      content = content + "</br>--------------------------------------</br>"+"<font color=#CD5C5C>"+"<b>���</b> �� " + output+ "</font>"
      content =`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
      //$notify(typeof(output),output)
      console.log(output);
      $done({"title":result["title"],"htmlMessage":content})
      
    }
    //$done();|
  }, reject => {
    // Normally will never happen.
    $done();
  }); 
  
    $done({"title":result["title"],"htmlMessage":`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">`+'----------------------</br></br>'+"�鷀 璉�瘚见�撣�"+'</br></br>----------------------</br>'+ output + `</p>`})
}
  );


async function testDisneyPlus() {
  try {
    let { region, cnbl } = await Promise.race([testHomePage(), timeout(7000)])
    console.log(`homepage: region=${region}, cnbl=${cnbl}`)
    // �喳��駁�
//  if (cnbl == 2) {
//    return { region, status: STATUS_COMING }
//  }
    let { countryCode, inSupportedLocation } = await Promise.race([getLocationInfo(), timeout(7000)])
    console.log(`getLocationInfo: countryCode=${countryCode}, inSupportedLocation=${inSupportedLocation}`)
    
    region = countryCode ?? region
    console.log( "region:"+region)
    // �喳��駁�
    if (inSupportedLocation === false || inSupportedLocation === 'false') {
      return { region, status: STATUS_COMING }
    } else {
      // �舀�閫��
      return { region, status: STATUS_AVAILABLE }
    }
    
  } catch (error) {
    console.log("error:"+error)
    
    // 銝齿𣈲��圾��
    if (error === 'Not Available') {
      console.log("銝齿𣈲��")
      return { status: STATUS_NOT_AVAILABLE }
    }
    
    // 璉�瘚贝���
    if (error === 'Timeout') {
      return { status: STATUS_TIMEOUT }
    }
    
    return { status: STATUS_ERROR }
  } 
  
}

function getLocationInfo() {
  return new Promise((resolve, reject) => {
    let opts0 = {
      url: 'https://disney.api.edge.bamgrid.com/graph/v1/device/graphql',
      method: "POST",
      opts: opts,
      headers: {
        'Accept-Language': 'en',
        "Authorization": 'ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84',
        'Content-Type': 'application/json',
        'User-Agent': UA,
      },
      body: JSON.stringify({
        query: 'mutation registerDevice($input: RegisterDeviceInput!) { registerDevice(registerDevice: $input) { grant { grantType assertion } } }',
        variables: {
          input: {
            applicationRuntime: 'chrome',
            attributes: {
              browserName: 'chrome',
              browserVersion: '94.0.4606',
              manufacturer: 'microsoft',
              model: null,
              operatingSystem: 'windows',
              operatingSystemVersion: '10.0',
              osDeviceIds: [],
            },
            deviceFamily: 'browser',
            deviceLanguage: 'en',
            deviceProfile: 'windows',
          },
        },
      }),
    }
    
    $task.fetch(opts0).then(response => {
      let data = response.body
      console.log("locationinfo:"+response.statusCode)
      if (response.statusCode !== 200) {
        console.log('getLocationInfo: ' + data)
        reject('Not Available')
        return
      } else {let {
        inSupportedLocation,
        location: { countryCode },
      } = JSON.parse(data)?.extensions?.sdk?.session
        resolve({ inSupportedLocation, countryCode })
      }
    }, reason => {
      reject('Error')
      return
    })
  })
}

function testHomePage() {
  return new Promise((resolve, reject) => {
    let opts0 = {
      url: 'https://www.disneyplus.com/',
      opts: opts,
      headers: {
        'Accept-Language': 'en',
        'User-Agent': UA,
      },
    }
    $task.fetch(opts0).then(response => {
      let data = response.body
      console.log("homepage"+response.statusCode)
      if (response.statusCode !== 200 || data.indexOf('unavailable') !== -1) {
        reject('Not Available')
        return
      } else {
        let match = data.match(/Region: ([A-Za-z]{2})[\s\S]*?CNBL: ([12])/)
        if (!match) {
          resolve({ region: '', cnbl: '' })
          return
        } else {
          let region = match[1]
          let cnbl = match[2]
          //console.log("homepage"+region+cnbl)
          resolve({ region, cnbl })
        }
      }
    }, reason => {
      reject('Error')
      return
    })
  })
}

function timeout(delay = 5000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timeout')
    }, delay)
  })
}


function testNf(filmId) {
  return new Promise((resolve, reject) =>{
    let option = {
      url: BASE_URL + filmId,
      opts: opts,
      timeout: 3200,
      headers: {
        'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
      },
    }
    $task.fetch(option).then(response => {
      //$notify("nf:"+response.statusCode)
      console.log("nf:"+response.statusCode)
      if (response.statusCode === 404) {
        
        result["Netflix"] = "<b>Netflix: </b>�舀��芸��折� �𩤃�"
        console.log("nf:"+result["Netflix"])
        resolve('Not Found')
        return 
      } else if (response.statusCode === 403) {
        
        //console.log("nfnf")
        result["Netflix"] = "<b>Netflix: </b>�芣𣈲�� �麱"
        console.log("nf:"+result["Netflix"])
        //$notify("nf:"+result["Netflix"])
        resolve('Not Available')
        return
      } else if (response.statusCode === 200) {
        let url = response.headers['X-Originating-URL']
        let region = url.split('/')[3]
        region = region.split('-')[0]
        if (region == 'title') {
          region = 'us'
        }
        console.log("nf:"+region)
        result["Netflix"] = "<b>Netflix: </b>摰峕㟲�舀�"+arrow+ "��"+flags.get(region.toUpperCase())+"�� ��"
        //$notify("nf:"+result["Netflix"])
        resolve("nf:"+result["Netflix"])
        return 
      }
    }, reason => {
      result["Netflix"] = "<b>Netflix: </b>璉�瘚贝��� �鷼"
      console.log(result["Netflix"])
      resolve("timeout")
    }
    )
  }
  )
}

function testYTB() { 
    let option = {
      url: BASE_URL_YTB,
      opts: opts,
      timeout: 2800,
      headers: {
        'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'
      },
    }
    $task.fetch(option).then(response=> {
      let data = response.body
      console.log("ytb:"+response.statusCode)
      if (response.statusCode !== 200) {
        //reject('Error')
        result["YouTube"] = "<b>YouTube Premium: </b>璉�瘚见仃韐� �梹�"
      } else if (data.indexOf('Premium is not available in your country') !== -1) {
          //resolve('Not Available')
        result["YouTube"] = "<b>YouTube Premium: </b>�芣𣈲�� �麱"
      } else if (data.indexOf('Premium is not available in your country') == -1) {//console.log(data.split("countryCode")[1])
      let region = ''
      let re = new RegExp('"GL":"(.*?)"', 'gm')
      let ret = re.exec(data)
      if (ret != null && ret.length === 2) {
        region = ret[1]
      } else if (data.indexOf('www.google.cn') !== -1) {
        region = 'CN'
      } else {
        region = 'US'
      }
      //resolve(region)
      result["YouTube"] = "<b>YouTube Premium: </b>�舀� "+arrow+ "��"+flags.get(region.toUpperCase())+"�� ��"
      console.log("ytb:"+region+ result["YouTube"])
      }
    }, reason => {
      result["YouTube"] = "<b>YouTube Premium: </b>璉�瘚贝��� �鷼"
      //resolve("timeout")
    })
}

function testDazn() { 
  
  const extra =`{
    "LandingPageKey":"generic",
    "Platform":"web",
    "PlatformAttributes":{},
    "Manufacturer":"",
    "PromoCode":"",
    "Version":"2"
  }`
  let option = {
    url: BASE_URL_Dazn,
    method: "POST",
    opts: opts,
    timeout: 2800,
    headers: {
      'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
      "Content-Type": "application/json"
    },
    body: extra
  }

  $task.fetch(option).then(response=> {
    let data = response.body
    //data = extra
    let header = JSON.stringify(response.headers)
    console.log("Dazn:"+response.statusCode)
    //console.log("Dazn:"+data)
    //$done(data)
    if (response.statusCode !== 200) {
      //reject('Error')
      result["Dazn"] = "<b>Dazn: </b>璉�瘚见仃韐� �梹�"
    } else if (response.statusCode == 200) {//console.log(data.split("countryCode")[1])
      //console.log(data)
      let region = ''
      let re = new RegExp('"GeolocatedCountry":"(.*?)"', 'gm')
      let ret = re.exec(data)
      if (ret != null && ret.length === 2) {
        region = ret[1]
        result["Dazn"] = "<b>Dazn: </b>�舀� "+arrow+ "��"+flags.get(region.toUpperCase())+"�� ��"
      } else {
        result["Dazn"] = "<b>Dazn: </b>�芣𣈲�� �麱"

      }
      //resolve(region)
            console.log("Dazn:"+region+ result["Dazn"])
    }
  }, reason => {
    result["Dazn"] = "<b>Dazn: </b>璉�瘚贝��� �鷼"
    //resolve("timeout")
  })
}

function testParam() { 
  let option = {
    url: BASE_URL_Param,
    opts: opts1,
    timeout: 2800,
    headers: {
      'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'
    },
  }
  $task.fetch(option).then(response=> {
    //let data = response.body
    console.log("Paramount��:"+response.statusCode)
    if (response.statusCode == 200) {
      //reject('Error')
      result["Paramount"] = "<b>Paramount��: </b>�舀� �� "
    } else if (response.statusCode == 302) {
      //resolve('Not Available')
      result["Paramount"] = "<b>Pramount��: </b>�芣𣈲�� �麱"
    } 
      console.log("Paramount��:"+ result["Paramount"])
  }, reason => {
    result["Paramount"] = "<b>Paramount��: </b>璉�瘚贝��� �鷼"
    //resolve("timeout")
  })
}



function testDiscovery() {
  return new Promise((resolve, reject) =>{
    let option = {
      url: BASE_URL_Discovery_token,
      opts: opts1,
      timeout: 2800,
      headers: {
        'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36'
      },
      verify: false
    }
    $task.fetch(option).then(response=> {
      console.log("GetToken:"+response.statusCode)
      let data = JSON.parse(response.body)
      let token = data["data"]["attributes"]["token"]
      const cookievalid =`_gcl_au=1.1.858579665.1632206782; _rdt_uuid=1632206782474.6a9ad4f2-8ef7-4a49-9d60-e071bce45e88; _scid=d154b864-8b7e-4f46-90e0-8b56cff67d05; _pin_unauth=dWlkPU1qWTRNR1ZoTlRBdE1tSXdNaTAwTW1Nd0xUbGxORFV0WWpZMU0yVXdPV1l6WldFeQ; _sctr=1|1632153600000; aam_fw=aam%3D9354365%3Baam%3D9040990; aam_uuid=24382050115125439381416006538140778858; st=${token}; gi_ls=0; _uetvid=a25161a01aa711ec92d47775379d5e4d; AMCV_BC501253513148ED0A490D45%40AdobeOrg=-1124106680%7CMCIDTS%7C18894%7CMCMID%7C24223296309793747161435877577673078228%7CMCAAMLH-1633011393%7C9%7CMCAAMB-1633011393%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1632413793s%7CNONE%7CvVersion%7C5.2.0; ass=19ef15da-95d6-4b1d-8fa2-e9e099c9cc38.1632408400.1632406594`
      let option1 = {
        url: BASE_URL_Discovery,
        opts: opts1,
        timeout: 2800,
        headers: {
          'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
          "Cookie": cookievalid,
        },
        ciphers: "DEFAULT@SECLEVEL=1",
        verify: false
      }
      $task.fetch(option1).then(response=> {
        console.log("Check:"+response.statusCode)
        let data = JSON.parse(response.body)
        let locationd = data["data"]["attributes"]["currentLocationTerritory"]
        if (locationd == "us") {
          result["Discovery"] = "<b>Discovery��: </b>�舀� �� "
          console.log("�舀�Discovery��")
          resolve("�舀�Discovery��")
          return
        } else {
          result["Discovery"] = "<b>Discovery��: </b>�芣𣈲�� �麱"
          console.log("銝齿𣈲��iscovery��")
          resolve("銝齿𣈲��iscovery��")
          return
        }
      }, reason => {
        console.log("Check-Error"+reason)
        resolve("discovery failed")
      })
    }, reason => {
      console.log("GetToken-Error"+reason)
      resolve("discovery failed")
    })})}
