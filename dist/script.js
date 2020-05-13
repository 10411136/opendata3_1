// 若要處理網頁縮圖可參考 https://medium.com/@JasonCK/%E5%A6%82%E4%BD%95%E4%B8%8D%E8%AE%93%E7%B8%AE%E5%9C%96%E6%AF%80%E6%8E%89%E4%BD%A0%E7%9A%84%E8%A8%AD%E8%A8%88-a6edd290981d

function centerHandler(){
  var scrollDist1=$(window).scrollTop();
  var myTop1=( $(window).height()-$("#popWindow").height())/2+scrollDist1;
  var myLeft1=($(window).width()-$("#popWindow").width())/2;$("#popWindow").offset({top:myTop1,left:myLeft1});
}
centerHandler ();
$(window).scroll(centerHandler);
$(window).resize(centerHandler);
var img = document.getElementById("picture");

var winHeight;
if(window.innerHeight)
  winHeight = window.innerHeight;
else if ((document.body) && (document.body.clientHeight))
  winHeight = document.body.clientHeight;
winHeight = window.innerHeight;

img.innerHTML = '<img  style="width: 100' + '%; height: ' + winHeight + 'px;" src="https://i.imgur.com/pt5KgJ2.jpg">';

// 以下是氣象資料處理
/* get JSON */
var Url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30';
var Url1 = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30';
function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}
var jdata = JSON.parse(Get(Url)); /* 三十六小時天氣預報 */
var jdata1 = JSON.parse(Get(Url1));  /* 局屬氣象站-現在天氣觀測報告 */

var datasetDes = document.getElementById("datasetDescription");
datasetDes.innerHTML = jdata["records"]["datasetDescription"];

//console.log(jdata["records"]);
/*
for(i in jdata["records"]["location"]){
  console.log(jdata["records"]["location"][i]);
}
*/

var north = ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣'];
var west = ['臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣'];
var south = ['臺南市', '高雄市', '屏東縣'];
var east = ['宜蘭縣', '花蓮縣', '臺東縣'];
var oland = ['澎湖縣', '金門縣', '連江縣'];

function findPosition(string){
  for(var i=0; i<north.length; i++){
    if(north[i] === string){
      return 'N';
    }
  }
  for(var i=0; i<north.length; i++){
    if(east[i] === string){
      return 'E';
    }
  }
  for(var i=0; i<north.length; i++){
    if(west[i] === string){
      return 'W';
    }
  }
  for(var i=0; i<north.length; i++){
    if(south[i] === string){
      return 'S';
    }
  }
  for(var i=0; i<north.length; i++){
    if(oland[i] === string){
      return 'O';
    }
  }
}
var n_str='', e_str='', w_str='', s_str='', o_str='';
function combine(index){
  var str='';
  str += '<div class="country" '+'id="'+jdata["records"]["location"][index]["locationName"][0]+jdata["records"]["location"][index]["locationName"][1]+jdata["records"]["location"][index]["locationName"][2]+'"'+'>';
      str += '<p id="country_name">'+jdata["records"]["location"][index]["locationName"]+'</p>';
      for(j in jdata["records"]["location"][index]["weatherElement"]['0']['time']){
        str += '<div id="day">';
        str += '<p>'+jdata["records"]["location"][index]["weatherElement"]['0']['time'][j]['startTime']+' 至 '+jdata["records"]["location"][index]["weatherElement"]['0']['time'][j]['endTime']+'</p>';
        str += '<p>'+jdata["records"]["location"][index]["weatherElement"]['0']['time'][j]['parameter']['parameterName']+'<p>';
        str += '<p>'+'溫度:'+jdata["records"]["location"][index]["weatherElement"]['2']['time'][j]['parameter']['parameterName']+' 至 '+jdata["records"]["location"][index]["weatherElement"]['4']['time'][j]['parameter']['parameterName']+'  (單位: °C)'+'<p>';
        str += '<p>'+'氣候:'+jdata["records"]["location"][index]["weatherElement"]['3']['time'][j]['parameter']['parameterName']+'<p>';
        str += '<p>'+'降雨機率'+':'+jdata["records"]["location"][index]["weatherElement"]['1']['time'][j]['parameter']['parameterName']+'   (單位: '+jdata["records"]["location"][index]["weatherElement"]['1']['time'][j]['parameter']['parameterUnit']+')'+'</p>';
        str += '</div>' + '<br>';
      }
      str += '</div>';
      return str;
}

for(var i=0; i<jdata["records"]["location"].length; i++){
  //console.log(jdata["records"]["location"][i]["locationName"]);
  var position = findPosition(jdata["records"]["location"][i]["locationName"]);
  if(position === 'N'){
      n_str+=combine(i);
  }
  if(position === 'E'){
      e_str+=combine(i);
  }
  if(position === 'W'){
      w_str+=combine(i);
  }
  if(position === 'S'){
      s_str+=combine(i);
  }
  if(position === 'O'){
      o_str+=combine(i);
  }
}

var obj_tab_north = document.getElementById("tab-north");
obj_tab_north.innerHTML = n_str;

var obj_tab_east = document.getElementById("tab-east");
obj_tab_east.innerHTML = e_str;

var obj_tab_west = document.getElementById("tab-west");
obj_tab_west.innerHTML = w_str;

var obj_tab_south = document.getElementById("tab-south");
obj_tab_south.innerHTML = s_str;

var obj_tab_oland = document.getElementById("tab-oland");
obj_tab_oland.innerHTML = o_str;


document.write('<hr>');

document.write('<div id="data_title"><p id="immediate">即時天氣</p></div>');
var immediate_north_obj_str = '{ "基隆市": [], "臺北市": [], "新北市": [], "桃園市": [], "新竹市": [], "新竹縣": [], "苗栗縣": [] }';
var immediate_north_obj = JSON.parse(immediate_north_obj_str);
var immediate_east_obj_str = '{ "宜蘭縣": [], "花蓮縣": [], "臺東縣": [] }';
var immediate_east_obj = JSON.parse(immediate_east_obj_str);
var immediate_west_obj_str = '{ "臺中市": [], "彰化縣": [], "南投縣": [], "雲林縣": [], "嘉義市": [], "嘉義縣": [] }';
var immediate_west_obj = JSON.parse(immediate_west_obj_str);
var immediate_south_obj_str = '{ "臺南市": [], "高雄市": [], "屏東縣": [] }';
var immediate_south_obj = JSON.parse(immediate_south_obj_str);
var immediate_oland_obj_str = '{ "澎湖縣": [], "金門縣": [], "連江縣": [] }';
var immediate_oland_obj = JSON.parse(immediate_oland_obj_str);

/*找目前最高溫的測站 head*/
var imm_max_temp = parseFloat(jdata1["records"]["location"][0]['weatherElement'][3]['elementValue']);
var imm_max_temp_pos = jdata1["records"]["location"][0]['locationName'];
for(var i=0; i<jdata1["records"]["location"].length; i++){
  if(imm_max_temp < parseFloat(jdata1["records"]["location"][i]['weatherElement'][3]['elementValue'])){
    imm_max_temp = parseFloat(jdata1["records"]["location"][i]['weatherElement'][3]['elementValue']);
    imm_max_temp_pos = jdata1["records"]["location"][i]['locationName'];
  }
}
//console.log('最高溫的測站名稱 : ' +imm_max_temp_pos );
/*找目前最高溫的測站 tail*/

function immediate_combine(index){
  if(jdata1["records"]["location"][index]['locationName'] !== imm_max_temp_pos){
    var temp_s;
    temp_s = '<div id="immediate_country">' + '<p id="immediate_title">' + jdata1["records"]["location"][index]['parameter'][0]['parameterValue']+jdata1["records"]["location"][index]['parameter'][2]['parameterValue']+'  測站: '+jdata1["records"]["location"][index]['locationName'] + '</p>' + '<p>' + '  時間: '+jdata1["records"]["location"][index]['time']['obsTime']+ '</p>' + '<p id="immediate_TEMP">' +'  溫度: '+jdata1["records"]["location"][index]['weatherElement'][3]['elementValue']+'  (單位: °C)' + '</p>' + '</div>';
    return temp_s;
  }else if(jdata1["records"]["location"][index]['locationName'] === imm_max_temp_pos){
    var temp_s;
    temp_s = '<div id="immediate_country" style="color: red">' + '<p id="immediate_title">' + jdata1["records"]["location"][index]['parameter'][0]['parameterValue']+jdata1["records"]["location"][index]['parameter'][2]['parameterValue']+'  測站: '+jdata1["records"]["location"][index]['locationName'] + '</p>' + '<p>' + '  時間: '+jdata1["records"]["location"][index]['time']['obsTime']+ '</p>' + '<p id="immediate_TEMP">' +'  溫度: '+jdata1["records"]["location"][index]['weatherElement'][3]['elementValue']+'  (單位: °C)' + '</p>' + '</div>';
    return temp_s;
  }
}
for(i in jdata1["records"]["location"]){
  var s = jdata1["records"]["location"][i]['parameter'][0]['parameterValue'];
  var t = immediate_combine(i);
  var position = findPosition(jdata1["records"]["location"][i]['parameter'][0]['parameterValue']);
  if(position === 'N'){
    immediate_north_obj[s].push( {s: t} );
  }
  if(position === 'E'){
    immediate_east_obj[s].push( {s: t} );
  }
  if(position === 'W'){
    immediate_west_obj[s].push( {s: t} );
  }
  if(position === 'S'){
    immediate_south_obj[s].push( {s: t} );
  }
  if(position === 'O'){
    immediate_oland_obj[s].push( {s: t} );
  }
}

var imm_weather = document.getElementById("imm_weather");
document.write('<div id="immediate_weather">');
document.write('<div id="imm_country" class="imm_north">');
document.write('<h3 id="pos">'+"北部"+"<h3>");
for(var i=0; i<north.length; i++){
  if(immediate_north_obj[north[i]].length!==0){
    document.write('<h4 id="immediate_country">'+north[i]+"<h4>");
  }
  for(var j=0; j<immediate_north_obj[north[i]].length; j++){
    document.write(immediate_north_obj[north[i]][j].s);
  }
}
document.write('</div>');

document.write('<div id="imm_country" class="imm_east">');
document.write('<h3 id="pos">'+"東部"+"<h3>");
for(var i=0; i<east.length; i++){
  if(immediate_east_obj[east[i]].length!==0){
    document.write('<h4 id="immediate_country">'+east[i]+"<h4>");
    for(var j=0; j<immediate_east_obj[east[i]].length; j++){
      document.write(immediate_east_obj[east[i]][j].s);
    }
  }
}
document.write('</div>');

document.write('<div id="imm_country" class="imm_west">');
document.write('<h3 id="pos">'+"中部"+"<h3>");
for(var i=0; i<west.length; i++){
  if(immediate_west_obj[west[i]].length!==0){
    document.write('<h4 id="immediate_country">'+west[i]+"<h4>");
  }
  for(var j=0; j<immediate_west_obj[west[i]].length; j++){
    document.write(immediate_west_obj[west[i]][j].s);
  }
}
document.write('</div>');

document.write('<div id="imm_country" class="imm_south">');
document.write('<h3 id="pos">'+"南部"+"<h3>");
for(var i=0; i<south.length; i++){
  if(immediate_south_obj[south[i]].length!==0){
    document.write('<h4 id="immediate_country">'+south[i]+"<h4>");
  }
  for(var j=0; j<immediate_south_obj[south[i]].length; j++){
    document.write(immediate_south_obj[south[i]][j].s);
  }
}
document.write('</div>');

document.write('<div id="imm_country" class="imm_oland">');
document.write('<h3 id="pos">'+"外島"+"<h3>");
for(var i=0; i<oland.length; i++){
  if(immediate_oland_obj[oland[i]].length!==0){
    document.write('<h4 id="immediate_country">'+oland[i]+"<h4>");
  }
  for(var j=0; j<immediate_oland_obj[oland[i]].length; j++){
    document.write(immediate_oland_obj[oland[i]][j].s);
  }
}
document.write('</div>');

document.write('</div>');

document.write('<div id="remark">' + '<h4>備註:</h4>' + '<p>' + '紅色表目前最高溫之測站' + '</p>' + '</div>');

document.write('<body onload="ShowTime()"></body>');
function ShowTime(){
　document.getElementById('showbox').innerHTML = new Date().toString().split(' ')[0]+' '+new Date().toString().split(' ')[1]+' '+new Date().toString().split(' ')[2]+' '+new Date().toString().split(' ')[3]+' '+new Date().toString().split(' ')[4]+' '+new Date().toString().split(' ')[6]+'(資料來源: 中央氣象局opendata)';
　setTimeout('ShowTime()',1000);
  setTimeout('parent.location.reload()', 600000);
}
document.write('<div><p id="showbox"></p>'+ '<p id="copyright">' +'© 2020 YLL. All Rights Reserved'+'</p>'+'</div>');



/* pop視窗 head */
var close_status = 0;
var btn_close = document.getElementById("close");
var popWindow = document.getElementById("popWindow");
btn_close.onclick = function (){
  popWindow.innerHTML = '';
  var parentObj = popWindow.parentNode;
  parentObj.removeChild(popWindow);
  $(window).unbind ('scroll');
  $(window).unbind ('resize');
  close_status = 1;
}
/* pop視窗 tail */


/* 一周天氣 head */
// ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣']
// ['臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣']
// ['臺南市', '高雄市', '屏東縣']
// ['宜蘭縣', '花蓮縣', '臺東縣']
// ['澎湖縣', '金門縣', '連江縣']

// var close_status_week_weather=0;
// var popWindow = document.getElementById("popWindow");
// btn_close.onclick = function (){
//   popWindow.innerHTML = '';
//   var parentObj = popWindow.parentNode;
//   parentObj.removeChild(popWindow);
//   close_status = 1;
// }





function week_weather_content_show(city, data_json){
  console.log(data_json["weatherElement"][1]);  //debug重要地方
  function centerHandler1(){
    var scrollDist2=$(window).scrollTop();
    var myTop2=( $(window).height()-$("#week_weather").height())/2+scrollDist2;
    var myLeft2=($(window).width()-$("#week_weather").width())/2;$("#week_weather").offset({top:myTop2,left:myLeft2});
  }
  centerHandler1 ();
  $(window).scroll(centerHandler1); 
  $(window).resize(centerHandler1);
  obj_week_weather_content.innerHTML = '<h3 id="week_weather_country">'+city+'</h3>';
  if(data_json["weatherElement"][1]["description"] === "平均溫度"){
    
    /*重新畫圖 head*/
    $("canvas.myChart").remove();
    $("div.chart-container").append('<canvas id="myChart1" class="myChart" height="170"></canvas>');
    $("div.chart-container").append('<canvas id="myChart2" class="myChart" height="170"></canvas>');
    $("div.chart-container").append('<canvas id="myChart3" class="myChart" height="170"></canvas>');
    /*重新畫圖 tail*/
    
    obj_week_weather_content.innerHTML += '<p id="week_weahter_content_fistTitle">'+'一週平均溫度'+'</p>';
    var data_json_firt_chart = [];
    var data_json_second_chart = [];
    
    var title_startTime = [];
    for(var i=0; i < data_json["weatherElement"][1]["time"].length; i++){
      title_startTime.push(data_json["weatherElement"][1]["time"][i]["startTime"]);
    }
    // console.log(title_startTime);
    var title_endTime = [];
    for(var i=0; i < data_json["weatherElement"][1]["time"].length; i++){
      title_endTime.push(data_json["weatherElement"][1]["time"][i]["endTime"]);
    }
    // console.log(title_endTime);
    
    for(var i=0; i<data_json["weatherElement"][1]["time"].length; i+=2){
      // console.log(data_json["weatherElement"][1]["time"][i]["elementValue"][0]["value"]);
      data_json_firt_chart.push(data_json["weatherElement"][1]["time"][i]["elementValue"][0]["value"]);
    }
    for(var i=1; i<data_json["weatherElement"][1]["time"].length; i+=2){
      // console.log(data_json["weatherElement"][1]["time"][i]["elementValue"][0]["value"]);
      data_json_second_chart.push(data_json["weatherElement"][1]["time"][i]["elementValue"][0]["value"]);
    }
    // console.log(data_json_second_chart);
    
    var chart1_label = [];
    for(var i=0; i<title_startTime.length; i+=2){
      chart1_label.push(title_startTime[i].split(' ')[0]);
    }
    // console.log(chart1_label);
    var chart2_label = [];
    for(var i=1; i<title_startTime.length; i+=2){
      chart2_label.push(title_startTime[i].split(' ')[0]);
    }
    // console.log(chart2_label);
    var continue_two_date_same = 0;  // 檢查是否有連兩天的資料日期相同
    if(chart1_label[0] === chart1_label[1]){
      continue_two_date_same = 1;
      // console.log(chart1_label[0].split(' '));
      var correct_date = new Date(chart1_label[0].split(' '));
      // console.log(correct_date);
      correct_date.setDate(correct_date.getDate()-1);
      // console.log(correct_date);
      
      var mm = (correct_date.getMonth()+1) < 10 ? '0'+(correct_date.getMonth()+1) : (correct_date.getMonth()+1);
      var dd = (correct_date.getDate()) < 10 ? '0'+correct_date.getDate() : correct_date.getDate();
      
      chart1_label[0] = correct_date.getFullYear() + '-' + mm + '-' + dd;
    }
    console.log(chart1_label[0]);
    
    for(var i=0; i<chart1_label.length; i++){
      chart1_label[i] += '  ' + title_startTime[2].split(' ')[1] + '~' + title_endTime[2].split(' ')[1];
    }
    for(var i=0; i<chart2_label.length; i++){
      chart2_label[i] += '  ' + title_startTime[1].split(' ')[1] + '~' + title_endTime[1].split(' ')[1];
    }
    
    // console.log('length = '+ data_json["weatherElement"][1]["time"].length % 2);
    if(data_json["weatherElement"][1]["time"].length % 2 === 0){ // 處理第一個圖表的標題 14項 偶數項
      var chart1_title_text; // 處理第一個圖表的標題
      chart1_title_text = data_json["locationName"] + ' 日期: ' + title_startTime[0].split(' ')[0] + ' ' + title_startTime[2].split(' ')[1] + ' 至 ' + title_endTime[title_endTime.length-2] + '    時段: ' + title_startTime[2].split(' ')[1] + '~' + title_endTime[2].split(' ')[1];
      
      if(continue_two_date_same){
        chart1_title_text = data_json["locationName"] + ' 日期: ' + chart1_label[0].split(' ')[0] + ' ' + title_startTime[2].split(' ')[1] + ' 至 ' + title_endTime[title_endTime.length-2] + '    時段: ' + title_startTime[2].split(' ')[1] + '~' + title_endTime[2].split(' ')[1];
      }
      
      var chart2_title_text; // 處理第二個圖表的標題
      chart2_title_text = data_json["locationName"] + ' 日期: ' + title_startTime[1] + ' ' + ' 至 ' + title_endTime[title_endTime.length-1] + '    時段: ' + title_startTime[1].split(' ')[1] + '~' + title_endTime[1].split(' ')[1];
      
    }else{
      var chart1_title_text;
      chart1_title_text = data_json["locationName"] + ' 日期: ' + title_startTime[0].split(' ')[0] + ' ' + title_startTime[2].split(' ')[1] + ' 至 ' + title_endTime[title_endTime.length-1] + '    時段: ' +  title_startTime[2].split(' ')[1] + '~' + title_endTime[2].split(' ')[1];
      
      if(continue_two_date_same){
        chart1_title_text = data_json["locationName"] + ' 日期: ' + chart1_label[0].split(' ')[0] + ' ' + title_startTime[2].split(' ')[1] + ' 至 ' + title_endTime[title_endTime.length-1] + '    時段: ' +  title_startTime[2].split(' ')[1] + '~' + title_endTime[2].split(' ')[1];
        
      }
      
      var chart2_title_text;
      chart2_title_text = data_json["locationName"] + ' 日期: ' + title_startTime[1] + ' 至 ' + title_endTime[title_endTime.length-2] + '    時段: ' + title_startTime[1].split(' ')[1] + '~' + title_endTime[1].split(' ')[1];
      
    }
    
    
    
    obj_chart_container.style.display="block";
    var ctx1 = document.getElementById('myChart1').getContext('2d');
    var chart1 = new Chart(ctx1, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chart1_label,
            datasets: [{
                label: '平均溫度',
                backgroundColor: 'rgb(0, 99, 132)',
                borderColor: 'rgb(0, 99, 132)',
                data: data_json_firt_chart,
                fill: false,
            }]
        },

        // Configuration options go here
        options: {title: {
              display: true,
              text: chart1_title_text,
            }}
    });
    
    var ctx2 = document.getElementById('myChart2').getContext('2d');
    var chart2 = new Chart(ctx2, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: chart2_label,
            datasets: [{
                label: '平均溫度',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data_json_second_chart,
                fill: false,
            }]
        },

        // Configuration options go here
        options: {title: {
              display: true,
              text: chart2_title_text,
            }}
    });
    
    
    
      var obj_myChart3 = document.getElementById("myChart3");
      obj_myChart3.style.display="none"; //將以下chart3的物件預設為隱藏
      var ctx3 = document.getElementById('myChart3').getContext('2d');
      var chart3 = new Chart(ctx3, {
          // The type of chart we want to create
          type: 'line',

          // The data for our dataset
          data: {
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [{
                  label: '高溫',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: [0, 10, 5, 2, 20, 30, 45],
                  fill: false,
              },{
                  label: '低溫',
                  backgroundColor: 'rgb(0, 99, 132)',
                  borderColor: 'rgb(0, 99, 132)',
                  data: [80, 10, 5, 20, 70, 3, 40],
                  fill: false,
              }]
          },

          // Configuration options go here
          options: {title: {
                display: true,
                text: data_json["locationName"]
              }}
      });
    
    
  }else{
    obj_week_weather_content.innerHTML += '<p id="undevelop">'+'opendata查不到該縣市之平均溫度'+'</p>';
  }
}

/* 處理一周天氣視窗 head */
var week_weather_close_status = 0;
var obj_week_weather = document.getElementById("week_weather");
obj_week_weather.style.display="none"; /* 將weekweather視窗預設為隱藏 */
var obj_week_weather_content = document.getElementById("week_weather_content");
var obj_chart_container = document.getElementById("chart_container");
obj_chart_container.style.display="none";
var weekclose_status_close_status = 0;
var btn_week_weather_close = document.getElementById("weekweatherClose");
btn_week_weather_close.onclick = function (){
  obj_week_weather.style.display="none";
  obj_chart_container.style.display="none";
  week_weather_close_status = 0;
  $(window).unbind ('scroll');
  $(window).unbind ('resize');
}
/* 處理一周天氣視窗 tail */



/*基隆市一周天氣 head */
var obj_KeelungCity = document.getElementById(north[0]);
obj_KeelungCity.onclick = function(){
  if(close_status && !week_weather_close_status){
    var Url_KeelungCity = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-051?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_KeelungCity = JSON.parse(Get(Url_KeelungCity));
    obj_week_weather.style.display="block";
    week_weather_content_show(north[0],jdata_KeelungCity["records"]["locations"][0]["location"][0]); //基隆市中正區
    week_weather_close_status = 1;
    
  }
}
/*基隆市一周天氣 tail */

/*臺北市一周天氣 head */
var obj_TaipeiCity = document.getElementById(north[1]);
obj_TaipeiCity.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_TaipeiCity = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_TaipeiCity = JSON.parse(Get(Url_TaipeiCity));
    obj_week_weather.style.display="block";
    week_weather_content_show(north[1], jdata_TaipeiCity["records"]["locations"][0]["location"][6]); //台北市信義區
    week_weather_close_status = 1;
    
  }
}
/*臺北市一周天氣 tail */

/*新北市一周天氣 head */
var obj_NewTaipeiCity = document.getElementById(north[2]);
obj_NewTaipeiCity.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_NewTaipeiCity = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-071?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_NewTaipeiCity = JSON.parse(Get(Url_NewTaipeiCity));
    obj_week_weather.style.display="block";
    week_weather_content_show(north[2], jdata_NewTaipeiCity["records"]["locations"][0]["location"][12]); //新北市板橋區
    week_weather_close_status = 1;
    
  }
}
/*新北市一周天氣 tail */

/*桃園市一周天氣 head */
var obj_TaoyuanCity = document.getElementById(north[3]);
obj_TaoyuanCity.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_TaoyuanCity = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-007?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_TaoyuanCity = JSON.parse(Get(Url_TaoyuanCity));
    // console.log(jdata_TaoyuanCity["records"]["locations"][0]["location"][0]);
    
    obj_week_weather.style.display="block";
    week_weather_content_show(north[3], jdata_TaoyuanCity["records"]["locations"][0]["location"][0]); //桃園市桃園區
    week_weather_close_status = 1;
    
  }
}
/*桃園市一周天氣 tail */


/*新竹市一周天氣 head */
var obj_HsinchuCity = document.getElementById(north[4]);
obj_HsinchuCity.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_HsinchuCity = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-055?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_HsinchuCity = JSON.parse(Get(Url_HsinchuCity));    
    obj_week_weather.style.display="block";
    week_weather_content_show(north[4], jdata_HsinchuCity["records"]["locations"][0]["location"][0]); //新竹市北區
    week_weather_close_status = 1;
    
  }
}
/*新竹市一周天氣 tail */

/*新竹縣一周天氣 head */
var obj_HsinchuCounty = document.getElementById(north[5]);
obj_HsinchuCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_HsinchuCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-009?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_HsinchuCounty = JSON.parse(Get(Url_HsinchuCounty));
    
    obj_week_weather.style.display="block";
    week_weather_content_show(north[5], jdata_HsinchuCounty["records"]["locations"][0]["location"][1]); //新竹縣竹北市
    week_weather_close_status = 1;
    
  }
}
/*新竹縣一周天氣 tail */

/*苗栗縣一周天氣 head */
var obj_MiaoliCounty = document.getElementById(north[6]);
obj_MiaoliCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_MiaoliCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-015?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_MiaoliCounty = JSON.parse(Get(Url_MiaoliCounty));
    obj_week_weather.style.display="block";
    week_weather_content_show(north[6], jdata_MiaoliCounty["records"]["locations"][0]["location"][2]); //苗栗縣苗栗市
    week_weather_close_status = 1;
    
  }
}
/*苗栗縣一周天氣 tail */

/*臺中市一周天氣 head */
var obj_TaichungCity = document.getElementById(west[0]);
obj_TaichungCity.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_TaichungCity = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-075?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_TaichungCity = JSON.parse(Get(Url_TaichungCity));
    // console.log(jdata_TaichungCity["records"]["locations"][0]);
    obj_week_weather.style.display="block";
    week_weather_content_show(west[0], jdata_TaichungCity["records"]["locations"][0]["location"][21]); // 臺中市西屯區
    week_weather_close_status = 1;
    
  }
}
/*臺中市一周天氣 tail */

/*彰化縣一周天氣 head */
var obj_ChanghuaCounty = document.getElementById(west[1]);
obj_ChanghuaCounty.onclick = function(){
  if(close_status && !week_weather_close_status){
     var Url_ChanghuaCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-019?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_ChanghuaCounty = JSON.parse(Get(Url_ChanghuaCounty));
    
    obj_week_weather.style.display="block";
    week_weather_content_show(west[1], jdata_ChanghuaCounty["records"]["locations"][0]["location"][20]); // 彰化縣彰化市
    week_weather_close_status = 1;
    
  }
}
/*彰化縣一周天氣 tail */

/*南投縣一周天氣 head */
var obj_NantouCounty = document.getElementById(west[2]);
obj_NantouCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_NantouCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-023?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_NantouCounty = JSON.parse(Get(Url_NantouCounty));
    
    obj_week_weather.style.display="block";
    week_weather_content_show(west[2], jdata_NantouCounty["records"]["locations"][0]["location"][7]); //南投縣南投市
    week_weather_close_status = 1;
    
  }
}
/*南投縣一周天氣 tail */

/*雲林縣一周天氣 head */
var obj_YunlinCounty = document.getElementById(west[3]);
obj_YunlinCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_YunlinCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-027?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_YunlinCounty = JSON.parse(Get(Url_YunlinCounty));
    // console.log(jdata_YunlinCounty["records"]["locations"][0]);
    
    obj_week_weather.style.display="block";
    week_weather_content_show(west[3], jdata_YunlinCounty["records"]["locations"][0]["location"][18]); //雲林縣斗六市
    week_weather_close_status = 1;
    
  }
}
/*雲林縣一周天氣 tail */

/*嘉義市一周天氣 head */
var obj_ChiayiCity = document.getElementById(west[4]);
obj_ChiayiCity.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_ChiayiCity = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-059?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_ChiayiCity = JSON.parse(Get(Url_ChiayiCity));
    // console.log(jdata_ChiayiCity["records"]["locations"][0]);
    
    
    obj_week_weather.style.display="block";
    week_weather_content_show(west[4], jdata_ChiayiCity["records"]["locations"][0]["location"][1]); //嘉義市東區
    week_weather_close_status = 1;
    
  }
}
/*嘉義市一周天氣 tail */

/*嘉義縣一周天氣 head */
var obj_ChiayiCounty = document.getElementById(west[5]);
obj_ChiayiCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_ChiayiCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-031?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_ChiayiCounty = JSON.parse(Get(Url_ChiayiCounty));
    // console.log(jdata_ChiayiCounty["records"]["locations"][0]);
    
    obj_week_weather.style.display="block";
    week_weather_content_show(west[5], jdata_ChiayiCounty["records"]["locations"][0]["location"][11]); //嘉義縣太保市
    week_weather_close_status = 1;
    
  }
}
/*嘉義縣一周天氣 tail */

/*臺南市一周天氣 head */
var obj_TainanCity = document.getElementById(south[0]);
obj_TainanCity.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_TainanCity = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-079?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_TainanCity = JSON.parse(Get(Url_TainanCity));
    //console.log(jdata_TainanCity["records"]["locations"][0]);
    
    obj_week_weather.style.display="block";
    week_weather_content_show(south[0], jdata_TainanCity["records"]["locations"][0]["location"][29]); // 台南市安平區
    week_weather_close_status = 1;
    
  }
}
/*臺南市一周天氣 tail */

/*高雄市一周天氣 head */
var obj_KaohsiungCity = document.getElementById(south[1]);
obj_KaohsiungCity.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_KaohsiungCity = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-065?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_KaohsiungCity = JSON.parse(Get(Url_KaohsiungCity));
    // console.log(jdata_KaohsiungCity["records"]["locations"][0]);
    
    
    obj_week_weather.style.display="block";
    week_weather_content_show(south[1], jdata_KaohsiungCity["records"]["locations"][0]["location"][14]); //高雄市苓雅區
    week_weather_close_status = 1;
    
  }
}
/*高雄市一周天氣 tail */

/*屏東縣一周天氣 head */
var obj_PingtungCounty = document.getElementById(south[2]);
obj_PingtungCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_PingtungCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-035?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_PingtungCounty = JSON.parse(Get(Url_PingtungCounty));
    // console.log(jdata_PingtungCounty["records"]["locations"][0]);    
    
    obj_week_weather.style.display="block";
    week_weather_content_show(south[2], jdata_PingtungCounty["records"]["locations"][0]["location"][11]); //屏東縣屏東市
    week_weather_close_status = 1;
    
  }
}
/*屏東縣一周天氣 tail */

/*宜蘭縣一周天氣 head */
var obj_YilanCounty = document.getElementById(east[0]);
obj_YilanCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_YilanCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-003?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_YilanCounty = JSON.parse(Get(Url_YilanCounty));

    obj_week_weather.style.display="block";
    week_weather_content_show(east[0], jdata_YilanCounty["records"]["locations"][0]["location"][6]); //宜蘭縣宜蘭市
    week_weather_close_status = 1;
    
  }
}
/*宜蘭縣一周天氣 tail */

/*花蓮縣一周天氣 head */
var obj_HualienCounty = document.getElementById(east[1]);
obj_HualienCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_HualienCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-043?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_HualienCounty = JSON.parse(Get(Url_HualienCounty));
    // console.log(jdata_HualienCounty["records"]["locations"][0]);
    
    obj_week_weather.style.display="block";
    week_weather_content_show(east[1], jdata_HualienCounty["records"]["locations"][0]["location"][0]); //花蓮縣花蓮市
    week_weather_close_status = 1;
    
  }
}
/*花蓮縣一周天氣 tail */

/*臺東縣一周天氣 head */
var obj_TaitungCounty = document.getElementById(east[2]);
obj_TaitungCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_TaitungCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-039?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_TaitungCounty = JSON.parse(Get(Url_TaitungCounty));
    // console.log(jdata_TaitungCounty["records"]["locations"][0]);    
    
    obj_week_weather.style.display="block";
    week_weather_content_show(east[2], jdata_TaitungCounty["records"]["locations"][0]["location"][2]); //台東縣台東市
    week_weather_close_status = 1;
    
  }
}
/*臺東縣一周天氣 tail */

/*澎湖縣一周天氣 head */
var obj_PenghuCounty = document.getElementById(oland[0]);
obj_PenghuCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_PenghuCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-047?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_PenghuCounty = JSON.parse(Get(Url_PenghuCounty));
    // console.log(jdata_PenghuCounty["records"]["locations"][0]);  
    
    
    obj_week_weather.style.display="block";
    week_weather_content_show(oland[0], jdata_PenghuCounty["records"]["locations"][0]["location"][1]); //澎湖縣馬公市
    week_weather_close_status = 1;
    
  }
}
/*澎湖縣一周天氣 tail */

/*金門縣一周天氣 head */
var obj_KinmenCounty = document.getElementById(oland[1]);
obj_KinmenCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_KinmenCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-087?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_KinmenCounty = JSON.parse(Get(Url_KinmenCounty));
    // console.log(jdata_KinmenCounty["records"]["locations"][0]);  
    
    obj_week_weather.style.display="block";
    week_weather_content_show(oland[1], jdata_KinmenCounty["records"]["locations"][0]["location"][5]); //金門縣金城鎮
    week_weather_close_status = 1;
    
  }
}
/*金門縣一周天氣 tail */

/*連江縣一周天氣 head */
var obj_LienchiangCounty = document.getElementById(oland[2]);
obj_LienchiangCounty.onclick = function(){
  if(close_status && !week_weather_close_status){ 
    var Url_LienchiangCounty = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-083?Authorization=CWB-3A06F307-FD61-4BDC-B0FD-DC6EA34C0E30";
    var jdata_LienchiangCounty = JSON.parse(Get(Url_LienchiangCounty));
    // console.log(jdata_LienchiangCounty["records"]["locations"][0]);  
    
    obj_week_weather.style.display="block";
    week_weather_content_show(oland[2], jdata_LienchiangCounty["records"]["locations"][0]["location"][0]);
    week_weather_close_status = 1;
    
  }
}
/*連江縣一周天氣 tail */