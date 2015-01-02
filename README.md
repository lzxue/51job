###下载51job招聘信息的爬虫程序
 1.程序使用NodeJS编写，运行安装nodejs

 2.下载的数据存储在文本文档中以&字符为分隔符，一条招聘信息为一行数据。

 3.下载51job招聘信息，jobid，companyid 公司简介，岗位简介，经纬度等

 

 [原数据来自51job地图搜索](http://search.51job.com/jobsearch/search_result.php?fromJs=1&jobarea=010000&industrytype=00&issuedate=9&keywordtype=2&lang=c&stype=3&address=%E4%B8%AD%E5%85%B3%E6%9D%91&radius=0.03&fromType=20) 可根据自身需要修改url参数实现分类下载招聘数据。

地区查询一次下载整个地区的数据，程序中默认将查询半径设radius置1000(100000公里)旨在获取该地区的所有数据。但是数据最多返回10w条，向北京这样城市超过10w条数据因此需要设置多个中心点然后去重。

下载参数设置在config,json中 
  
     {
   
       "address":"中关村",    //搜索中心 
        "jobarea":"010000",   //搜索城市代码
       " startpage":0        //下载起始页码，默认为0 在下载出错时修改该值，改完出错时中断的页码，实现继续上次中断下载
     }
 

windows下启动，修改下载参数，双击startapp.cmd 开始下载

城市代码表：

***

				<a name="SelectMapArea" codestr="010000" city="北京" href="javascript:void(0);">北京</a></span>
				<a name="SelectMapArea" codestr="050000" city="天津" href="javascript:void(0);">天津</a>
				<a name="SelectMapArea" codestr="230300" city="大连" href="javascript:void(0);">大连</a>
				<a name="SelectMapArea" codestr="230200" city="沈阳" href="javascript:void(0);">沈阳</a>
				<a name="SelectMapArea" codestr="240200" city="长春" href="javascript:void(0);">长春</a>
				<a name="SelectMapArea" codestr="220200" city="哈尔滨" href="javascript:void(0);">哈尔滨</a>
				<a name="SelectMapArea" codestr="160200" city="石家庄" href="javascript:void(0);">石家庄</a>
			</td>
		</tr>
		<tr>

			<td class="normalfont" nowrap="nowrap" valign="top"><strong>华东地区：</strong></td>
			<td>
				<a name="SelectMapArea" codestr="020000" city="上海" href="javascript:void(0);">上海</a>
				<a name="SelectMapArea" codestr="070200" city="南京" href="javascript:void(0);">南京</a>
				<a name="SelectMapArea" codestr="070300" city="苏州" href="javascript:void(0);">苏州</a>
				<a name="SelectMapArea" codestr="080200" city="杭州" href="javascript:void(0);">杭州</a>
				<a name="SelectMapArea" codestr="080300" city="宁波" href="javascript:void(0);">宁波</a>
				<a name="SelectMapArea" codestr="150200" city="合肥" href="javascript:void(0);">合肥</a>
				<a name="SelectMapArea" codestr="120200" city="济南" href="javascript:void(0);">济南</a>
				<a name="SelectMapArea" codestr="120300" city="青岛" href="javascript:void(0);">青岛</a>
				<a name="SelectMapArea" codestr="110200" city="福州" href="javascript:void(0);">福州</a>
				<a name="SelectMapArea" codestr="110300" city="厦门" href="javascript:void(0);">厦门</a>
				<br/>
				<a name="SelectMapArea" codestr="130200" city="南昌" href="javascript:void(0);">南昌</a>
				<a name="SelectMapArea" codestr="070400" city="无锡" href="javascript:void(0);">无锡</a>
				<a name="SelectMapArea" codestr="070500" city="常州" href="javascript:void(0);">常州</a>
			</td>                     
                                
		</tr>
		<tr>
			<td class="normalfont" nowrap="nowrap"><strong>华南-华中：</strong></td>
			<td>
				<a name="SelectMapArea" codestr="030200"  city="广州" href="javascript:void(0);">广州</a>
				<a name="SelectMapArea" codestr="040000"  city="深圳" href="javascript:void(0);">深圳</a>
				<a name="SelectMapArea" codestr="030800"  city="东莞" href="javascript:void(0);">东莞</a>
				<a name="SelectMapArea" codestr="180200"  city="武汉" href="javascript:void(0);">武汉</a>
				<a name="SelectMapArea" codestr="190200"  city="长沙" href="javascript:void(0);">长沙</a>
				<a name="SelectMapArea" codestr="170200"  city="郑州" href="javascript:void(0);">郑州</a>	
			</td>                            
               
		</tr>                                                            
		<tr>                                            
			<td class="normalfont" nowrap="nowrap"><strong>西北-西南：</strong></td>
			<td>
				<a name="SelectMapArea" codestr="200200" city="西安" href="javascript:void(0);">西安</a>
				<a name="SelectMapArea" codestr="090200" city="成都" href="javascript:void(0);">成都</a>
				<a name="SelectMapArea" codestr="060000" city="重庆" href="javascript:void(0);">重庆</a>
				<a name="SelectMapArea" codestr="250200" city="昆明" href="javascript:void(0);">昆明</a>
			</td>                     
		</tr>                       
 
***

 **codestr即为参数中的**jobarea

  address为 原网站 http://search.51job.com/list/010000%252C00,000000,0000,00,9,99,%2B,0,1.html?lang=c&stype=3&postchannel=0000&workyear=99&cotype=99&degreefrom=99&jobterm=01&companysize=99&address=%D6%D0%B9%D8%B4%E5&lonlat=116.323066%2C39.989956&radius=0.05&ord_field=1&list_type=1&confirmdate=9&fromType=10选取该城市的任何一个 中心即可。

***
数据导入excel示例
![gis](http://thinkgis.qiniudn.com/sinajobxx.png)
