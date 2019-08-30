var pReqNo  = null;
var pItemId = null;
var pUserId = null;

var grdDiffSrc     = new ax5.ui.grid();
var grdProgHistory = new ax5.ui.grid();

var selOptions 	   = [];

var grdProgHistoryData = null; //체크인목록그리드 데이타
var grdDiffSrcData     = null;
var diffSrcData        = null;
var selectedGridItem   = null;

var isAdmin 	   = false;
var ingSw          = false;
var tmpDir         = null;
var downURL        = null;
var diffGbn        = 'A';         
var svIdx          = 0;
var befVer         = 0;
var aftVer         = 0;
var cr_qrycd         = 0;
var cr_itemid         = 0;

var tmpInfo = new Object();
var tmpInfoData = new Object();

var f = document.getSrcData;

pReqNo = f.acptno.value;
pItemId = f.itemid.value;
pUserId = f.user.value;


$('#txtAcptno').val(pReqNo.substr(0,4)+'-'+pReqNo.substr(4,2)+'-'+pReqNo.substr(6));

grdProgHistory.setConfig({
    target: $('[data-ax5grid="grdProgHistory"]'),
    sortable: true, 
    multiSort: true,
    //showRowSelector: true,
    header: {
        align: "center",
        columnHeight: 28
    },
    body: {
        columnHeight: 26,
        onClick: function () {
           this.self.clearSelect();
           this.self.select(this.dindex);
           //grdProgHistory_Click();
        },
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
		{key: "cr_rsrcname", label: "프로그램명",  width: '20%', align: 'left'},
        {key: "cr_befver", label: "변경전",  width: '10%'},
        {key: "cr_aftver", label: "변경후",  width: '10%'},
        {key: "cm_codename", label: "구분",  width: '8%'},
        {key: "basename", label: "기준프로그램",  width: '20%', align: 'left'},
        {key: "cm_dirpath", label: "프로그램경로",  width: '50%',  align: 'left'}
    ]
});

grdDiffSrc.setConfig({
    target: $('[data-ax5grid="grdDiffSrc"]'),
    sortable: false, 
    multiSort: false,
    header: {
        align: "center",
        columnHeight: 28
    },
    body: {
        columnHeight: 25,
        onClick: function () {
           this.self.clearSelect();
           this.self.select(this.dindex);
           grdSrcDiff_Click();
        },
    	onDataChanged: function(){
    	    this.self.repaint();
    	},
     	trStyleClass: function () {
     		if (this.item.file1diff != null) {
     			if (this.item.file1diff === 'RO' || this.item.file1diff === 'RN'){
         			return "fontStyle-error";
         		} else if (this.item.file1diff === 'RO'){
         			return "fontStyle-error";
         		} else if (this.item.file1diff === 'D '){
         			return "fontStyle-cncl";
         		} else if (this.item.file1diff === 'I '){
         			return "fontStyle-ing";
         		} 
     		}
     		if (this.item.file2diff != null) {
     			if (this.item.file2diff === 'RO' || this.item.file2diff === 'RN'){
         			return "fontStyle-error";
         		} else if (this.item.file2diff === 'RO'){
         			return "fontStyle-error";
         		} else if (this.item.file2diff === 'D '){
         			return "fontStyle-cncl";
         		} else if (this.item.file2diff === 'I '){
         			return "fontStyle-ing";
         		} 
     		}
     	},
    },
    
    columns: [
        {key: "file1", label: "변경전",  width: '50%',  align: 'left'
        	,
        	formatter: function(){
                var htmlStr = '<xmp>'+this.value+'</xmp>';
                return htmlStr;
             }
        },
        {key: "file2", label: "변경후",  width: '50%',  align: 'left'
        	,
        	formatter: function(){
                var htmlStr = '<xmp>'+this.value+'</xmp>';
                return htmlStr;
             }
        }
    ]
});

$('input:radio[name^="optradio"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});
$('input:radio[name^="optSysGbn"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});

$('#txtSearch').bind('keypress', function(event){
	if(event.keyCode==13) {
		$('#btnSearch').trigger('click');
	}
});

$(document).ready(function(){
	
	if (pUserId == null || pUserId.length == 0) {
		dialog.alert('로그인 후 사용하시기 바랍니다.',function(){});
		return;		
	}
	if (pReqNo == null || pReqNo.length != 12) {
		dialog.alert('신청번호가 정확하지 않습니다. 확인 후 진행하시기 바랍니다.');
		return;
	}
	
	screenInit('M');
	
	//소스비교클릭
	$('#btnVerDiff').bind('click', function() {
		btnVerDiff_click();
	});

	//변경부분클릭
	$('#btnSrcDiff').bind('click', function() {
		btnSrcDiff_click();
	});
	
	//변경위치클릭
	$('#btnChgPart').bind('click', function() {
		btnChgPart_click();
	});
	
	//왼쪽화살표클릭
	$('#btnLeft').bind('click', function() {
		btnLeft_click();
	});

	//오른쪽화살표클릭
	$('#btnRight').bind('click', function() {
		btnRight_click();
	});

	//찾기클릭
	$('#btnSearch').bind('click', function() {
		btnSearch_click();
	});

	// 엑셀저장버튼 클릭
	$('#btnExcel').bind('click', function() {
		grdDiffSrc.exportExcel("grid-to-excel.xls");
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
	grdDiffSrc.setData([]);
	grdDiffSrc.repaint();
	
		
}
function getTmpDir(dirCd){
	
	var tmpInfoData = {
		pCode: 	dirCd,
		requestType: 	'GETECAMSDIR'
	}
	ajaxAsync('/webPage/winpop/SourceDiffServlet', tmpInfoData, 'json', successeCAMSDir);
	
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
		acptNo:     pReqNo,
		requestType: 	'GETPROGHISTORY'
	}
	ajaxAsync('/webPage/winpop/SourceDiffServlet', tmpInfoData, 'json', successProgList);
	
}

function successProgList(data) {
	var firstSw = false;
	var secondSw = false;
	
	grdProgHistoryData = data;
	grdProgHistory.setData(grdProgHistoryData);
	
	if (grdProgHistoryData.length == 0) {
		dialog.alert('프로그램변경이력이 존재하지 않습니다.');
		return;
	}
	
	grdProgHistory.setData(grdProgHistoryData);
	
	btnVerDiff_click();

}
function btnVerDiff_click() {
	var selCnt = 0;
	var firstLine = 0;
	var secondLine = 0;
	var befVer = 0;
	var aftVer = 0;
	
	if (befVer > 0 && aftVer > 0) {
		grdDiffSrc.setData(grdDiffSrcData);
		grdDiffSrc.repaint();
		return;
	}
	
	if(grdProgHistory.selectedDataIndexs == null || grdProgHistory.selectedDataIndexs == ""){
		befVer = grdProgHistoryData[0].cr_befver;
		aftVer = grdProgHistoryData[0].cr_aftver;
		cr_itemid = grdProgHistoryData[0].cr_itemid;
		cr_qrycd = grdProgHistoryData[0].cr_qrycd;
	}else{
		befVer = grdProgHistoryData[grdProgHistory.selectedDataIndexs].cr_befver;
		aftVer = grdProgHistoryData[grdProgHistory.selectedDataIndexs].cr_aftver;
		cr_itemid = grdProgHistoryData[grdProgHistory.selectedDataIndexs].cr_itemid;
		cr_qrycd = grdProgHistoryData[grdProgHistory.selectedDataIndexs].cr_qrycd;
	}
	//grdProgHistory.select(1);
	
	
	console.log("pUserId:" + pUserId);
	console.log("cr_itemid:" + cr_itemid);
	console.log("cr_qrycd:" + cr_qrycd);
	console.log("befVer:" + befVer);
	console.log("aftVer:" + aftVer);
	console.log("tmpDir:" + tmpDir);
	console.log("tmp:" + "local");
	console.log("tmp:" + "server");
	
	tmpInfo = new Object();
	tmpInfo.userid = pUserId;
	tmpInfo.itemid  = cr_itemid;
	tmpInfo.diffgbn1  = cr_qrycd;
	tmpInfo.befver  = befVer;
	tmpInfo.diffgbn2  = cr_qrycd;
	tmpInfo.aftver  = aftVer;
	tmpInfo.tmpdir = tmpDir;
//	tmpInfo.tmp = "local";
	tmpInfo.tmp = "server";
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETDIFFLIST'
	}
	ajaxAsync('/webPage/winpop/SourceDiffServlet', tmpInfoData, 'json', successDiffList);
	
}

function successDiffList(data) {
	var delCnt = 0;
	var befCnt = 0;
	var addCnt = 0;
	var aftCnt = 0;
	
	grdDiffSrcData = data;
	diffSrcData = data;
	
	for(var i=0; i<grdDiffSrcData.length; i++) {
		if (grdDiffSrcData[i].file1diff != null) {
			if (grdDiffSrcData[i].file1diff == 'D ') {
				++delCnt;
			} else if (grdDiffSrcData[i].file1diff == 'RO') {
				++befCnt;
			} 
		}
		if (grdDiffSrcData[i].file2diff != null) {
		    if (grdDiffSrcData[i].file2diff == 'I ') {
				++addCnt;
			} else if (grdDiffSrcData[i].file2diff == 'RN') {
				++aftCnt;
			}
		}
	}	
	
	diffSrcData = diffSrcData.filter(function(data) {
		if(data.file1diff != null && data.file1diff != '') return true;
		if(data.file2diff != null && data.file2diff != '') return true;
		return false;
	});
	
	$('#txtDelLine').val(String(delCnt));
	$('#txtBefLine').val(String(befCnt));
	$('#txtAftLine').val(String(aftCnt));
	$('#txtAddLine').val(String(addCnt));
	
	grdDiffSrc.setData(grdDiffSrcData);
	
	if (diffSrcData.length == 0) {
		$('#btnSrcDiff').prop('disabled', true); 
		$('#btnChgPart').prop('disabled', true); 
		$('#btnLeft').prop('disabled', true); 
		$('#btnRight').prop('disabled', true); 
	}
	
}
function grdSrcDiff_Click() {
	$('#txtBefSrc').val('');
	$('#txtAftSrc').val('');
	
	var selectedGridRow = grdDiffSrc.list[grdDiffSrc.selectedDataIndexs];
	if (selectedGridRow == null) return;
	
	$('#txtBefSrc').val(selectedGridRow.file1);
	$('#txtAftSrc').val(selectedGridRow.file2);
}

function btnSrcDiff_click() {	
	
	diffGbn = 'D';
	grdDiffSrc.setData(diffSrcData);
	grdDiffSrc.repaint();

	svIdx = -1;
	svWord = '';
	if (diffSrcData.length == 0) {
		dialog.alert('변경된 내용이 없습니다.');
		return;
	}
	
}

function btnChgPart_click() {	
	
	var i = 0;
	
	if (diffSrcData.length == 0) {
		dialog.alert('변경된 내용이 없습니다.');
		return;
	}
	svIdx = -1;
	svWord = '';
	if (diffGbn == 'A') {
		for(i=0; i<grdDiffSrcData.length; i++) {
			if (grdDiffSrcData[i].file1diff != null && grdDiffSrcData[i].file1diff != '') {
				svIdx = i;
				break;
			}
			if (grdDiffSrcData[i].file2diff != null && grdDiffSrcData[i].file2diff != '') {
				svIdx = i;
				break;
			}
		}	
	}
	grdDiffSrc.select(svIdx);
	grdDiffSrc.focus(svIdx);
	
}

function btnLeft_click() {	
	
	var i = 0;
	
	if (diffSrcData.length == 0) {
		dialog.alert('변경된 내용이 없습니다.');
		return;
	}
	grdDiffSrc.clearSelect();

	svWord = '';
	if (diffGbn == 'A') {
		if (svIdx <= 0) svIdx = grdDiffSrcData.length;
		--svIdx;

		for(i=svIdx;i>=0; i--) {
			if (grdDiffSrcData[i].file1diff != null && grdDiffSrcData[i].file1diff != '') {
				svIdx = i;
				break;
			}
			if (grdDiffSrcData[i].file2diff != null && grdDiffSrcData[i].file2diff != '') {
				svIdx = i;
				break;
			}
		}	
	}
	grdDiffSrc.select(svIdx);
	grdDiffSrc.focus(svIdx);
	
}

function btnRight_click() {	
	
	var i = 0;
	
	if (diffSrcData.length == 0) {
		dialog.alert('변경된 내용이 없습니다.');
		return;
	}
	svWord = '';
	grdDiffSrc.clearSelect();
	if (diffGbn == 'A') {
		++svIdx;
		if (grdDiffSrcData.length<=svIdx) svIdx = 0;
		for(i=svIdx; i<grdDiffSrcData.length; i++) {
			if (grdDiffSrcData[i].file1diff != null && grdDiffSrcData[i].file1diff != '') {
				svIdx = i;
				break;
			}
			if (grdDiffSrcData[i].file2diff != null && grdDiffSrcData[i].file2diff != '') {
				svIdx = i;
				break;
			}
		}	
	}
	grdDiffSrc.select(svIdx);
	grdDiffSrc.focus(svIdx);
	
}
function optradio_change() {
	
	txtSearch_change();
	
}
function txtSearch_change() {
	
	svIdx = -1;
	svWord = '';
	
}
function btnSearch_click() {
	//console.log('txtSearch_change'+$('#txtSearch').val());
	var strWord = $('#txtSearch').val().trim();
	var findSw = false;
	var rowMsg = '';
	
	if (strWord == null || strWord.length == 0) {
		dialog.alert('검색 할 단어/라인을 입력하여 주시기 바랍니다.', function(){});
		return;
	}
	if (svWord == '' || svWord != strWord) svIdx = -1;
	++svIdx;

	grdDiffSrc.clearSelect();
	
	//console.log('svidx='+svIdx);
	svWord = strWord;
	var searchGbn = $('[name="optradio"]:checked').val();
	if (diffGbn == 'A') {
		if (searchGbn == 'W') {
			for(i=svIdx; i<grdDiffSrcData.length; i++) {
				rowMsg = grdDiffSrcData[i].file1;
				if (rowMsg.length > 0) {
					if (rowMsg.indexOf(svWord)>=0) {
						svIdx = i;
						findSw = true;
						break;
					}
				}
				rowMsg = grdDiffSrcData[i].file2;
				if (rowMsg.length > 0) {
					if (rowMsg.indexOf(svWord)>=0) {
						svIdx = i;
						findSw = true;
						break;
					}
				}
			}
		} else {
			svIdx = Number(svWord);
			if (svIdx < grdDiffSrcData.length) {
				--svIdx;
				findSw = true;
			}
		}
	} else {
		if (diffSrcData.length<=svIdx) svIdx = 0;

		if (searchGbn == 'W') {
			for(i=svIdx; i<diffSrcData.length; i++) {
				rowMsg = diffSrcData[i].file1;
				if (rowMsg.length > 0) {
					if (rowMsg.indexOf(svWord)>=0) {
						svIdx = i;
						findSw = true;
						break;
					}
				}
				rowMsg = diffSrcData[i].file2;
				if (rowMsg.length > 0) {
					if (rowMsg.indexOf(svWord)>=0) {
						svIdx = i;
						findSw = true;
						break;
					}
				}
			}
		} else {
			svIdx = Number(svWord);
			if (svIdx < diffSrcData.length) {
				--svIdx;
				findSw = true;
			}
		}
	}
	if (!findSw) {
		svIdx = -1;
		svWord = '';
		dialog.alert('더 이상 검색내용이 없습니다.');
		return;
	}
	grdDiffSrc.select(svIdx);
	grdDiffSrc.focus(svIdx);
	
	if(searchGbn == 'L') {
		svIdx = -1;
		svWord = '';
	}
}
function optSysGbn_change() {
	
	var reqGbn = $('[name="optSysGbn"]:checked').val();	
	var reqListData = grdProgHistoryData;
	
	if (reqGbn == 'ALL') grdProgHistory.setData(grdProgHistoryData);
	else {
		reqListData = reqListData.filter(function(data) {
			if(reqGbn == 'VER' && data.cr_qrycd == '07') return true;
			if(reqGbn == 'DEV' && data.cr_qrycd == '08') return true;
			if(reqGbn == 'TEST' && data.cr_qrycd == '03') return true;
			if(reqGbn == 'REAL' && data.cr_qrycd == '04') return true;
			return false;
		});
	
		grdProgHistory.setData(reqListData);
	}

	grdProgHistory.repaint();
}