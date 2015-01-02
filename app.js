var http=require("http");
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var async=require("async");
var fs=require("fs");
var config=require("./config.json");
var jobarea=config.jobarea;//城市代码
var address=config.address;//城市中心点 该城市任何一个均可
var startpage=config.startpage;//起始下载页码
var curr_page=0;
var url="http://search.51job.com/jobsearch/search_result.php?fromJs=1&jobarea="+jobarea+"&funtype=0000&industrytype=00&curr_page="+curr_page+"&keywordtype=2&lang=c&stype=3&postchannel=0000&address="+address+"&radius=10000&fromType=1";
var fileName=jobarea+address+".txt";
async.waterfall([
    function(callback){
        pages(url,startpage,function(pages){
            console.log("开始下载地区代号为"+jobarea+"的数据……");
            console.log("共"+pages.length+"页");
            callback(null, pages);
        })

    },
    function(pages, callback){
        // arg1 now equals 'three'
        async.eachLimit(pages,5,function(page,cb){
            console.log("正在下载第"+page+"页");
            url="http://search.51job.com/jobsearch/search_result.php?fromJs=1&jobarea="+jobarea+"&funtype=0000&industrytype=00&curr_page="+page+"&keywordtype=2&lang=c&stype=3&postchannel=0000&address="+address+"&radius=10000&fromType=1";

            getdata(url,function(data){

                 //处理数据
                for(var i=0;i<data.length;i++){
                   var str=data[i].jobID+"&"+data[i].id+"&"+data[i].jobName+"&"+data[i].conName+"&"+data[i].locate+"&"+data[i].time+"&"+data[i].description+"&"+data[i].jobrequest+"&"+data[i].jobinstroduction+"&"+data[i].lon+"&"+data[i].lat+"&"+data[i].jobcount+"\n";
                 fs.appendFileSync(fileName,str,{encoding:null})
                }
                 console.log("第"+page+"页下载完成");
                 cb();
             })

        },function(err){
            callback(null, 'done');
        })

    }
], function (err, result) {
    console.log("代号为"+jobarea+"的数据下载完成");
});

function parseHtml(html){
    var $ = cheerio.load(html);
    var data=[];
    var reg = /var lonlatInfo=\{([\s\S]*)\}\}/m;//匹配经纬度信息
    var reg2=/M_\d*/g;
    var lonlatInfo=reg.exec(html)[0].replace(/\n/g,"").split("=")[1].replace(/key/g,"\"key\"").replace(/jobids/g,"\"jobids\"").replace(/lonlat/g,"\"lonlat\"").replace(/'/g,"\"");
    var ids=lonlatInfo.match(reg2);
    for(var i=0;i<ids.length;i++){//格式化经纬度信息
        var regm=new RegExp(ids[i]);
        lonlatInfo=lonlatInfo.replace(regm,"\""+ids[i]+"\"")
    }
    lonlatInfo=JSON.parse(lonlatInfo);
    var count=$("table .navBold").text().split("/")[1];
    var pages=parseInt(count/50)+1;

    $(".resultListDiv table .tr0").each(function (i,item) {
        var items={};
        items.jobID=cheerio.load($(item).html())(".td0 input").val();
        items.id=cheerio.load($(item).html())(".td1 img").attr("name");
        items.jobName=cheerio.load($(item).html())(".td1 .jobname").text();
        items.conName=cheerio.load($(item).html())(".td2").text();
        items.locate=cheerio.load($(item).html())(".td3").text();
        items.time=cheerio.load($(item).html())(".td4").text();
        items.description=cheerio.load($(item).html())(".td5").text();
        items.jobrequest=$(".resultListDiv table .tr1 .td1234").text().replace(/\s/g,"");
        items.jobinstroduction=$(".resultListDiv table .tr2 .td1234 span").text();
        items.lon=Number(lonlatInfo[items.id].lonlat.split(",")[0]);
        items.lat=Number(lonlatInfo[items.id].lonlat.split(",")[1]);
        items.jobcount=lonlatInfo[items.id].jobids.length;
        data.push(items);
    });
    return data;
}
function pages(url,startpage,cb){
    http.get(url,function(res) {
            var bufferHelper = new BufferHelper();
            res.on("data", function (chunk) {

                bufferHelper.concat(chunk);
            });

            res.on("end", function () {
                var page=[];
                var html=iconv.decode(bufferHelper.toBuffer(), 'GB2312');
                var $ = cheerio.load(html);
                var count=$("table .navBold").text().split("/")[1];
                console.log("共"+count+"条招聘记录");
                var pages=parseInt(count/50)+1;
                for(var i=startpage;i<pages;i++){
                    page.push(i+1);
                }
                cb(page)
            })
        }
    )

}

function getdata(url,cb){
    http.get(url,function(res) {
            var bufferHelper = new BufferHelper();
            res.on("data", function (chunk) {

                bufferHelper.concat(chunk);
            });

            res.on("end", function () {

                var html=iconv.decode(bufferHelper.toBuffer(), 'GB2312');
                var data=parseHtml(html);
                cb(data);
            })
        }
    )
}