var pReqNo  = null;
var pItemId = null;
var pUserId = null;

var grdProgHistory = new ax5.ui.grid();

var selOptions 	   = [];

var grdProgHistoryData = null; //체크인목록그리드 데이타
var selectedGridItem   = null;

var isAdmin 	   = false;
var ingSw          = false;

var tmpInfo = new Object();
var tmpInfoData = new Object();

var f = document.getSrcData;

pReqNo = f.acptno.value;
pItemId = f.itemid.value;
pUserId = f.user.value;

grdProgHistory.setConfig({
    target: $('[data-ax5grid="grdProgHistory"]'),
    sortable: true, 
    multiSort: true,
    //showRowSelector: true,
    //showLineNumber: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
           this.self.clearSelect();
           this.self.select(this.dindex);
           grdProgHistory_Click();
        },
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: "cr_aftviewver", label: "버전",  width: '10%'},
        {key: "qryname", label: "신청구분",  width: '10%'},
        {key: "acptdate", label: "신청일시",  width: '10%'},
        {key: "prcdate", label: "종료일시",  width: '10%'},
        {key: "cm_username", label: "신청인",  width: '10%'},
        {key: "cr_sayu", label: "신청사유",  width: '50%'},
    ]
});

$(document).ready(function(){
	
	pUserId = 'MASTER';
	pItemId = '000000179672';
	if (pUserId == null || pUserId.length == 0) {
		dialog.alert('로그인 후 사용하시기 바랍니다.',function(){});
		return;		
	}
	if (pItemId == null || pItemId.length != 12) {
		dialog.alert('프로그램ID가 정확하지 않습니다. 확인 후 진행하시기 바랍니다.');
		return;
	}
	
	screenInit('M');
	
	//닫기클릭
	$('#btnClose').bind('click', function() {
		close();
	});
	
	//소스다운 클릭
	$('#btnSrcDown').bind('click', function() {
		openWindow(5, '', '');
	});
	
	getTmpDir('99,F1');
	
	getProgHistory(pItemId);
	
});
//환성화 비활성화 초기화로직
function screenInit(gbn){
	
	if (gbn == 'M') {
		grdProgHistory.setData([]);
		$('#txtProgId').val('');
		$('#txtDir').val('');
		grdProgHistory.repaint();	
	}
	$('#btnSrcDown').prop('disabled', true); 
	$('#txtSayu').val('');
	$('#txtSrc').val('');
	
	hljs.initHighlightingOnLoad();
	
}
function getTmpDir(dirCd){
	
	var tmpInfoData = {
		pCode: 	dirCd,
		requestType: 	'GETECAMSDIR'
	}
	ajaxAsync('/webPage/winpop/SourceViewServlet', tmpInfoData, 'json', successeCAMSDir);
	
}
function successeCAMSDir(data) {
	
	selOptions = data;
	selOptions = selOptions.filter(function(data) {
		if(data.cm_pathcd == '99') tmpDir = data.cm_path;
		else downURL = data.cm_path;
	});
	
}
function getProgHistory(itemid){
	
	var tmpInfoData = {
		itemId: 	itemid,
		requestType: 	'GETPROGHISTORY'
	}
	ajaxAsync('/webPage/winpop/SourceViewServlet', tmpInfoData, 'json', successProgList);
	
}

function successProgList(data) {
	
	grdProgHistoryData = data;
	grdProgHistory.setData(grdProgHistoryData);
	
	if (grdProgHistoryData == null || grdProgHistoryData.length == 0) return;
	
	$('#txtSysMsg').val(grdProgHistoryData[0].cm_sysmsg);
	$('#txtProgId').val(grdProgHistoryData[0].cr_rsrcname);
	$('#txtDir').val(grdProgHistoryData[0].cm_dirpath);
	
	if (pReqNo != null && pReqNo.length > 0) {
		for(var i=0; i<grdProgHistoryData.length; i++) {
			if(grdProgHistoryData[i].cr_acptno == pReqNo) {
				grdProgHistory.clearSelect();
				grdProgHistory.select(i);
				selectedGridItem = grdProgHistory.list[i];
				break;
			}
		}
	}
	
}

function grdProgHistory_Click() {
	screenInit('S');
	
	selectedGridItem = grdProgHistory.list[grdProgHistory.selectedDataIndexs];

	if (selectedGridItem.cr_sayu != null) {
		$('#txtSayu').val(selectedGridItem.cr_sayu);
	}
	if (selectedGridItem.rstmsg != 'OK') {
		dialog.alert(selectedGridItem.rstmsg);
		return;
	}	
	var strInfo = selectedGridItem.cm_info;
	if (strInfo.substring(9,10) == '1') {
		$('#btnSrcDown').prop('disabled', true); 
		$('#txtSrc').val('바이너리파일입니다.');
	} else { 
		tmpInfo = new Object();
		tmpInfo.userId = pUserId;
		tmpInfo.itemId  = selectedGridItem.cr_itemid;
		tmpInfo.vergbn  = selectedGridItem.gbncd;
		tmpInfo.version  = selectedGridItem.cr_version;
		tmpInfo.encoding = "X";
		tmpInfoData = new Object();
		tmpInfoData = {
			tmpInfo		: tmpInfo,
			requestType	: 'GETVERSION'
		}
		ajaxAsync('/webPage/winpop/SourceViewServlet', tmpInfoData, 'json', successVersion);
	}
}
function successVersion(data) {	
	//$('#txtSrc').val(data);
	
	var prettify = hljs.highlightAuto(data).value;
	$('#txtSrc').val(prettify);
	$('#btnSrcDown').prop('disabled', false); 
	/*if (hljs.getLanguage('java')) {
		$('#txtSrc').val(hljs.highlight('java',data).value);
		$('#btnSrcDown').prop('disabled', false); 
	} else {
		console.log('language not exists');
	}*/
}
