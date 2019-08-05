/** PrgListTab 화면 정의
 * 
 * <pre>
 * <b>History</b>
 * 	작성자: 이성현
 * 	버전 : 1.1
 *  수정일 : 2019-07-24
 */

var userName 	 	= window.parent.userName;
var userId 		 	= window.parent.userId;
var adminYN 		= window.parent.adminYN;
var userDeptName 	= window.parent.userDeptName;
var userDeptCd 	 	= window.parent.userDeptCd;
var strReqCd	 	= window.parent.strReqCd; 

var strStatus		= window.parent.strStatus; //SR상태 "2";
var strIsrId		= window.parent.strIsrId; //"R201906-0003";  

//var strIsrId = 'R201708-0001';
//var userId = 'MASTER';
//var strReqCd = "";
var cboUserData = null;

var PrgListGridData = null;
var PrgListGrid 	= new ax5.ui.grid();

$('[data-ax5select="cboProgramer"]').ax5select({
    options: []
});

PrgListGrid.setConfig({
    target: $('[data-ax5grid="PrgListGrid"]'),
    sortable: true, 
    multiSort: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        }
    },
    columns: [
        {key: "qrycd", label: "신청구분",  width: '10%'},
        {key: "cm_sysmsg", label: "시스템",  width: '10%'},
        {key: "cm_dirpath", label: "프로그램경로",  width: '30%'},
        {key: "cr_rsrcname", label: "프로그램명",  width: '10%'},
        {key: "status", label: "상태",  width: '10%'},
        {key: "rsrccd", label: "프로그램유형",  width: '10%'},
        {key: "lastdate", label: "최종변경일",  width: '10%'},
        {key: "cr_story", label: "프로그램설명",  width: '10%'},
    ]
});


$(document).ready(function() {
	strReqCd = "XX";
	
	getReqDepartInfo();
	
	getPrgList();
	
	// 대상구분 변경시 달력 변경
	$('#cboProgramer').bind('change', function() {
		getPrgList();
	});
	
	// 엑셀 저장
	$('#btnExcel').bind('click', function() {
		var excelStr = '프로그램목록.xls';
		PrgListGrid.exportExcel(excelStr);
	});
});

//개발자 가져오기
function getReqDepartInfo() {
	var ajaxReturnData = null;
	
	var teamInfo = {
			strIsrId: strIsrId,
			strReqCd: strReqCd,
			userId: userId,
		requestType: 	'getScmuserList'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/PrgListTab', teamInfo, 'json');
	
	if(ajaxReturnData !== 'ERR') {
		console.log(ajaxReturnData);
		cboUserData = ajaxReturnData;
		options = [];
		$.each(cboUserData,function(key,value) {
			options.push({value: value.cc_scmuser, text: value.scmuser});
		});
		
		$('[data-ax5select="cboProgramer"]').ax5select({
	        options: options
		});
	}
	
	$('[data-ax5select="cboProgramer"]').ax5select("setValue", userId, true);
}

function getPrgList() {
	var PrgData = new Object();
	var ajaxReturnData = null;
	
	PrgData.strIsrId = strIsrId;
	
	if(getSelectedIndex('cboProgramer') > 0){
		PrgData.cc_scmuser = getSelectedVal('cboProgramer').value;
	}
	
	console.log(PrgData);
	
	var PrgInfo = {
		PrgInfoData: 	PrgData,
		requestType: 	'getProgHist'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/PrgListTab', PrgInfo, 'json');
	console.log(ajaxReturnData);
	if(ajaxReturnData !== 'ERR') {
		PrgListGridData = ajaxReturnData;
		PrgListGrid.setData(PrgListGridData);
	}
}

