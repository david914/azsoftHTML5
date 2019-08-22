/** ReqHistoryTab 화면 정의
 * 
 * <pre>
 * <b>History</b>
 * 	작성자: 이성현
 * 	버전 : 1.1
 *  수정일 : 2019-07-25
 */

var userName 	 	= window.parent.userName;
var userId 		 	= window.parent.userId;
var adminYN 		= window.parent.adminYN;
var userDeptName 	= window.parent.userDeptName;
var userDeptCd 	 	= window.parent.userDeptCd;
var strReqCd	 	= window.parent.strReqCd; 

var strStatus		= window.parent.strStatus; //SR상태 "2";
var strIsrId		= window.parent.strIsrId; //"R201906-0003";  
var strReqCd = "";

var cboUserData = null;

var ReqListGridData = null;
var ReqListGrid 	= new ax5.ui.grid();
var ReqListGridColumns = null;

$('[data-ax5select="cboProgramer2"]').ax5select({
    options: []
});

$(document).ready(function() {
	strReqCd = "XX";
	createViewGrid();
	
	getReqDepartInfo();
	
	getReqList();
	
	// 대상구분 변경시 달력 변경
	$('#cboProgramer2').bind('change', function() {
		getReqList();
	});
	
	// 신청건별 클릭이벤트
	$('#rdoOpt1').bind('click', function() {
		getReqList();
	});
	
	// 프로그램별 클릭이벤트
	$('#rdoOpt2').bind('click', function() {
		getReqList();
	});
	
	// 엑셀 저장
	$('#btnExcel').bind('click', function() {
		var excelStr = '변경요청이력.xls';
		ReqListGrid.exportExcel(excelStr);
	});
});

// 그리드 생성
function createViewGrid() {
	ReqListGrid.setConfig({
	    target: $('[data-ax5grid="ReqListGrid"]'),
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
	        },
	        onDBLClick: function () {
	        	if(ReqListGrid.selectedDataIndexs.length < 1 ) {
	        		return;
	        	}
	        	var item = ReqListGrid.list[ReqListGrid.selectedDataIndexs];
	        	openApprovalInfo(1, item.cr_acptno, item.cr_qrycd, item.cc_srid);
	        }, 
	        onDataChanged: function(){
	    		this.self.repaint();
	    	}
	    },
	    columns: [
	        {key: "cm_sysmsg", label: "시스템",  width: '15%', align: "left"},
	        {key: "qrycd", label: "신청구분",  width: '10%', align: "left"},
	        {key: "acptno", label: "신청번호",  width: '15%', align: "left"},
	        {key: "acptdate", label: "신청일",  width: '10%'},
	        {key: "status", label: "상태",  width: '10%', align: "left"},
	        {key: "prcdate", label: "완료일",  width: '10%'},
	        {key: "passok", label: "처리구분",  width: '10%', align: "left"},
	        {key: "prcreq", label: "적용예정일시",  width: '20%'}
	    ]
	});
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
	
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/ReqHistoryTab', teamInfo, 'json');
	
	if(ajaxReturnData !== 'ERR') {
		console.log(ajaxReturnData);
		cboUserData = ajaxReturnData;
		options = [];
		$.each(cboUserData,function(key,value) {
			options.push({value: value.cc_scmuser, text: value.scmuser});
		});
		
		$('[data-ax5select="cboProgramer2"]').ax5select({
	        options: options
		});
	}
	
	$('[data-ax5select="cboProgramer2"]').ax5select("setValue", userId, true);
}


// 그리드 데이터 가져오기
function getReqList() {
	var ReqData = new Object();
	var ajaxReturnData = null;
	
	ReqData.strIsrId = strIsrId;
	
	if(getSelectedIndex('cboProgramer2') > 0){
		ReqData.cc_scmuser = getSelectedVal('cboProgramer2').value;
	}
	
	if($('#rdoOpt1').is(':checked')){
		ReqData.rdoChk = "A";
	} else {
		ReqData.rdoChk = "P";
	}
	
	console.log(ReqData);
	
	var ReqInfo = {
		ReqInfoData: 	ReqData,
		requestType: 	'getAcptHist'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/ReqHistoryTab', ReqInfo, 'json');
	console.log(ajaxReturnData);
	
	if(ajaxReturnData !== 'ERR') {
		if($('#rdoOpt1').is(':checked')){
			//컬럼 제거하기
			ReqListGridColumns = ReqListGrid.columns;
			if(ReqListGridColumns[4].key == 'cm_dirpath'){
				ReqListGrid.removeColumn(4);
				ReqListGrid.removeColumn(4);
			}
			ReqListGridData = ajaxReturnData;
			ReqListGrid.setData(ReqListGridData);
		} else {
			// 컬럼 추가하기
			ReqListGridColumns = ReqListGrid.columns;
			if(ReqListGridColumns[4].key != 'cm_dirpath'){
				var excelDataColums = {key: 'cm_dirpath', label: '경로',  width: '15%', align: "left"};
				ReqListGridColumns.splice(4, 0,excelDataColums);
				ReqListGrid.config.columns = ReqListGridColumns;
				ReqListGrid.setConfig();
				
				ReqListGridColumns = ReqListGrid.columns;
				var excelDataColums = {key: 'cr_rsrcname', label: '파일명',  width: '15%', align: "left"};
				ReqListGridColumns.splice(5, 0,excelDataColums);
				ReqListGrid.config.columns = ReqListGridColumns;
				ReqListGrid.setConfig();
			}
			
			ReqListGridData = ajaxReturnData;
			ReqListGrid.setData(ReqListGridData);
		}
	}
}

//신청 상세내역 팝업창 띄우기
function openApprovalInfo(type, acptNo, reqCd, srId) {
	var nHeight, nWidth, cURL, winName;
	
	if ( (type+'_'+reqCd) == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}

    winName = type+'_'+reqCd;
    
	var form = document.popPam;   		//폼 name
    
	form.acptno.value	= acptNo;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.user.value 	= userId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.srid.value 	= srId;    		//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	
    if(type === 1) {
    	nHeight = screen.height - 300;
	    nWidth  = screen.width - 400;
	    
	    cURL = "/webPage/winpop/PopRequestDetail.jsp";
    }
      
	myWin = winOpen(form, winName, cURL, nHeight, nWidth);
}