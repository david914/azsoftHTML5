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
var strAcptNo 		= window.parent.strAcptNo;
var strStatus		= window.parent.strStatus; //SR상태 "2";
var strIsrId		= window.parent.strIsrId; //"R201906-0003";  

var cboUserData = null;

var PrgListGridData = [];
var PrgListGrid 	= new ax5.ui.grid();

var screenWidth = 0;
var screenHeight = 0;

$(window).resize(function(){
	screenHeight = $("#frmPrgList", parent.document).height();
	screenWidth = $("#frmPrgList", parent.document).width();
 });


$('[data-ax5select="cboProgramer"]').ax5select({
    options: []
});

$(document).ready(function() {
	screenWidth = $("#iFrm", parent.document).width();
	screenHeight = $("#iFrm", parent.document).height();
	
	strReqCd = "XX";
	createViewGrid();
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

//그리드 생성
function createViewGrid() {
	PrgListGrid.setConfig({
	    target: $('[data-ax5grid="PrgListGrid"]'),
	    sortable: true, 
	    multiSort: true,
	    showRowSelector: false,
	    multipleSelect: false,
	    header: {
	        align: "center",
	        columnHeight: 30
	    },
	    body: {
	        columnHeight: 28,
	        onClick: function () {
	        	this.self.clearSelect();
	            this.self.select(this.dindex);
	        },
	        onDBLClick: function () {
	        	if (this.dindex < 0) return;
	
		       	var selIn = PrgListGrid.selectedDataIndexs;
		       	if(selIn.length === 0) return;
		       	console.log(PrgListGridData[selIn]);
		       	openWindow(1, '', PrgListGridData[selIn].cr_itemid);
	        },
	        onDataChanged: function(){
	    		this.self.repaint();
	    	}
	    },
	    columns: [
	        {key: "qrycd", label: "신청구분",  width: '10%'},
	        {key: "cm_sysmsg", label: "시스템",  width: '10%', align: "left"},
	        {key: "cm_dirpath", label: "프로그램경로",  width: '20%', align: "left"},
	        {key: "cr_rsrcname", label: "프로그램명",  width: '15%', align: "left"},
	        {key: "status", label: "상태",  width: '10%'},
	        {key: "rsrccd", label: "프로그램유형",  width: '10%'},
	        {key: "lastdate", label: "최종변경일",  width: '10%'},
	        {key: "cr_story", label: "프로그램설명",  width: '15%', align: "left"},
	    ]
	});
	
	if(PrgListGridData.length > 0){
		PrgListGrid.setData(PrgListGridData);
	}
}

function openWindow(type,acptNo, etcInfo) {
	var nHeight, nWidth, cURL, winName;

	if ( (type+'_'+strReqCd) == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}

    winName = type+'_pop_'+strReqCd;

    if (type === 1) {//프로그램정보
	   nWidth = screenWidth * 0.8; 
	   nHeight = screenHeight * 0.8; 
	   cURL = "/webPage/winpop/PopProgramInfo.jsp";
	} else {
		confirmDialog2.alert('window open - popup: invalid type ['+type+'] error', function(){return;});
	}
	
	var f = document.setReqData;
    f.user.value 	= userId;
    
	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	if (acptNo != '' && acptNo != null) {
		f.acptno.value	= acptNo;
	}
	
	if (etcInfo != '' && etcInfo != null) {
		f.itemid.value = etcInfo;
	}
    
    myWin = winOpen(f, winName, cURL, nHeight, nWidth);
}

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
