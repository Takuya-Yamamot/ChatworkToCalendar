// 前提：予定は今日以降に立てる
// APIにチャットワークのトークン、IDに登録したいGoogleカレンダーのIDを加えてください。
var API_TOKEN = "chatworkのAPI";
var ID = "googleCalendarのID";


function doPost(e){
  var json = JSON.parse(e.postData.contents);
  var roomId = json.webhook_event.room_id;
  var jsonBody = json.webhook_event.body;
  var bodyArray = jsonBody.split(",");
  var params = {
    headers: {"X-ChatWorkToken":API_TOKEN},
    method: "post"
  };
  var url = "https://api.chatwork.com/v2/rooms/" + roomId + "/messages";

  if( jsonBody.slice(0, 1) !== "["　&& bodyArray[0] === "予定"　&& bodyArray.length >=3){
  try{
    var accountId = json.webhook_event.account_id;
    var messagesId = json.webhook_event.message_id;

    var title = bodyArray[1];
    var startDay = bodyArray[2];
    var endDay = bodyArray[3];
    var place = bodyArray[4];
    now = new Date();
    nowyear = now.getFullYear();
    var MY_CAL = CalendarApp.getCalendarById(ID);
    // 年をまたぐ場合は秒数まで指定して登録する必要がある。
    if(startDay.slice(0,2)==='20' && endDay.slice(0,2) === '20'){
      var myCal = MY_CAL.createEvent(title, new Date(startDay), new Date(endDay), place);
    }else{
      var myCal = MY_CAL.createEvent(title, new Date(nowyear+"/"+startDay), new Date(nowyear+"/"+endDay), place);
    }

    myCal;

    var body = ''
    body += '[rp aid=' + accountId;
    body += ' to=' + roomId + '-' + messagesId + '] '
    body += '[info]登録完了しました！[/info]'
    params.payload = {body :body};
    UrlFetchApp.fetch(url,params);
  }catch(ex){
    return false;
  }
  }
}
