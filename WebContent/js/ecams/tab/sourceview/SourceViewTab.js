var pReqNo  = null;
var pItemId = null;
var pUserId = null;


var selOptions 	   = [];
var selectedGridItem   = null;
var srcData        = null;
var srcArray       = [];

var isAdmin 	   = false;
var ingSw          = false;
var findLine       = 0;
var svWord         = null;
var tmpDir         = null;
var downURL        = null;
var outName        = null;
var prettify       = null;
var status         = null;
var ver			   = null;
var pUserId		   = null;
var cr_aftviewver  = null;
var rsrcname	   = null;
var basename	   = null;

var tmpInfo = new Object();
var tmpInfoData = new Object();

$('input:radio[name^="optradio"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});

$(document).ready(function(){
	
});
//환성화 비활성화 초기화로직
function elementInit() {
	$('#txtProgId').val(rsrcname);
	$('#txtBaseId').val(basename);
	$('#txtVer').val(cr_aftviewver);
	$("body").bind("mousedown", onBodyMouseDown); 
	getFileText(pUserId,pItemId,pReqNo,ver,cr_aftviewver,status);
}

function onBodyMouseDown(event){
	window.parent.$("#context-menu").css({"visibility" : "hidden"});
} 

function getFileText(userid, itemid, acptno, ver,cr_aftviewver, status){
	tmpInfo = new Object();
	tmpInfo.userId = userid;
	tmpInfo.cr_itemid  = itemid;
	outName = userid + '_' + ver + '_' + rsrcname;
	tmpInfo.outname = outName; 
	tmpInfo.tmpdir = tmpDir;
	if(status == "9"){
		tmpInfo.cr_acptno  = ver;
		tmpInfo.gbncd = "CMR0025";
	}else{
		tmpInfo.cr_acptno  = acptno;
		tmpInfo.gbncd = "CMR0027";
	}
	
	var tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType: 	'GETFILETEXT'
	}
	ajaxAsync('/webPage/winpop/RequestSourceViewServlet', tmpInfoData, 'json', successFileText);
	
}

function successFileText(data) {
	var htmlObj = document.getElementById("htmlSrc");
	htmlObj = null;
	prettify = null;
	hljs.initHighlightingOnLoad();
	
	var lineData = '';
	
	srcArray = data;
	srcData = '';
	$.each(srcArray,function(key,value) {
		lineData = value.line + ' ' + value.src;
		srcData += lineData;
	});
	
	prettify = hljs.highlightAuto(srcData).value;
	var htmlObj = document.getElementById("htmlSrc");
	htmlObj.innerHTML = prettify;
}

function txtSearch_change() {
	findLine = 0;
	svWord = "";
	if (prettify != null) {
		var htmlObj = document.getElementById("htmlSrc");
		htmlObj.innerHTML = prettify;
		$('#htmlView').scrollTop(0);
	}
}

function btnSearch_click(word,gbn) {
	var strWord = word;
	var findSw = false;
	var lineData = '';
	
	if (strWord != null && strWord.length == 0) {
		dialog.alert('검색 할 단어/라인을 입력하여 주시기 바랍니다.', function(){});
		return;
	}
	var searchGbn = gbn;
	//console.log('radio='+searchGbn);
	if (searchGbn == 'W') {
		if (svWord != strWord) {
			findLine = 0;
			svWord = strWord;
			var chgString = '<span class="hljs-search">' + strWord + '</span>';
			var resultString = replaceAllString(prettify,strWord,chgString);
			
			var htmlObj = document.getElementById("htmlSrc");
			htmlObj.innerHTML = resultString;
		}
		for (var i=findLine;srcArray.length>i;i++) {
			lineData = srcArray[i].src;
			if (lineData.toUpperCase().indexOf(strWord.toUpperCase())>=0) {
				findLine = ++i;
				findSw = true;
				break;
			}
		}
	} else {
		findLine = Number(strWord);
		//console.log('line search='+findLine);
		if (srcArray.length < findLine) {
			dialog.alert('검색 할 라인이 존재하지 않습니다.', function(){});
			return;
		}
		findLine = findLine - 1;
		findSw = true;
	}
	//console.log(findLine);
	
	if (findSw) {
		yPOS = findLine * 13.75;
		//console.log(yPOS);
		$('#htmlView').scrollTop(yPOS);
		if (searchGbn == 'L') {
			findLine = 0;
		}
	} else if (findLine == 0) {
		dialog.alert('검색단어가 존재하지 않습니다.', function(){});
		return;
	} else {
		dialog.alert('더 이상 검색단어가 존재하지 않습니다.', function(){});
		findLine = 0;
		return;
	}

}

function btnSrcDown_click() {
	location.href = downURL+'?f='+rsrcname+'&folderPath='+tmpDir+'/'+outName;
}