/** SR완료 화면 정의
 * 
 * <pre>
 * <b>History</b>
 * 	작성자: 이성현
 * 	버전 : 1.1
 *  수정일 : 2019-07-29
 */

var userName 	 	= window.parent.userName;
var userId 		 	= window.parent.userId;
var adminYN 		= window.parent.adminYN;
var userDeptName 	= window.parent.userDeptName;
var userDeptCd 	 	= window.parent.userDeptCd;
var strReqCd	 	= window.parent.strReqCd; 
var strStatus		= window.parent.strStatus; //SR상태 "2";
var strIsrId		= window.parent.strIsrId; //"R201906-0003";  
var strIsrTitle 	= window.parent.strIsrTitle;

//var strIsrId = 'R201708-0001';
//var strIsrId = 'R201808-0001';
var strAcptNo = "";
var cboUserData = null;
var retMsg = "";
var confAcpt = "";
var resultMSG ="";



var devListGridData = null;
var devListGrid 	= new ax5.ui.grid();

devListGrid.setConfig({
    target: $('[data-ax5grid="devListGrid"]'),
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
        {key: "gbn", label: "구분",  width: '20%'},
        {key: "cm_username", label: "담당자명",  width: '20%'},
        {key: "cc_worktime", label: "투입시간",  width: '60%'}
    ]
});

$(document).ready(function() {
	console.log(userId);
	console.log(strStatus);
	console.log(strReqCd);
	console.log(strIsrId);
	console.log(strIsrTitle);
	getStrAcptno();	// AcptNo 가져오기
	srendInfoCall();
	
	// 결재버튼 클릭
	$('#btnOk').bind('click', function() {
		btnOk_click();
	});
});

function srendInfoCall(){
	if(strIsrId != null){
		$('#txtSRID').val(strIsrId);
		$('#txtSRTitle').val(strIsrTitle);
		
		// 그리드 초기화
		devListGrid.setData([]);
		
		getDevUser();
		
		if(strAcptNo != null && strAcptNo != ""){
			var ajaxReturnData = null;
			
			var tmpInfo = {
				strAcptNo : strAcptNo,
				strUserId : userId,
				requestType: 	'gyulChk'
			}
			
			ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/SRCompleteTab', tmpInfo, 'json');
			if(ajaxReturnData !== 'ERR') {
				retMsg = ajaxReturnData;

				if(retMsg == "0"){
					$("#btnOk").show();
					
					//if(strStatus != "9"){	// 나중에 주석처리 제거해야됨
						$("#btnCncl").show();
					//}
					
					$("#lbTxt").show();
					$("#divTxt").show();
				} else if(retMsg != "1") {
					dialog.alert("결재정보 체크 중 오류가 발생했습니다.");
				}
				
			}
		}
	}
}

//Acptno 가져오기
function getStrAcptno(){
	var ajaxReturnData = null;
		
	var tmpInfo = {
		strIsrId : strIsrId,
		requestType: 	'getAcptNo'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/SRCompleteTab', tmpInfo, 'json');

	if(ajaxReturnData !== 'ERR') {
		strAcptNo = ajaxReturnData;
	}
}

// 개발자 투입시간 가져오기
function getDevUser(){
	var ajaxReturnData = null;
		
	var devInfo = {
		strIsrId : strIsrId,
		requestType: 	'getRealTime'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/SRCompleteTab', devInfo, 'json');
	if(ajaxReturnData !== 'ERR') {
		devListGridData = ajaxReturnData;
		devListGrid.setData(devListGridData);
		
		if(ajaxReturnData[0].cmc0290_check === "Y"){
			getSREnd();
		}
	}
}

// SREnd
function getSREnd(){
	var ajaxReturnData = null;
	
	var SRendInfo = {
		strIsrId : strIsrId,
		requestType: 	'getSREnd'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/SRCompleteTab', SRendInfo, 'json');
	console.log(ajaxReturnData);
	if(ajaxReturnData !== 'ERR') {
		if(ajaxReturnData.length > 0){
			$("#txtReqContent").val(ajaxReturnData[0].cc_confmsg);
			$("#txtApplyDate").val(ajaxReturnData[0].lastdt);
			$("#txtApplyUser").val(ajaxReturnData[0].cm_username);
			confAcpt = "";
			
			if(ajaxReturnData[0].acptno != null){
				$("#btnConf").show();
				confAcpt = ajaxReturnData[0].acptno;
			}
			
			if(ajaxReturnData[0].cc_endgbn == "9"){
				$("#rdoOpt1").attr('disabled', false);
				$("#rdoOpt2").attr('disabled', false);
				$("#rdoOpt1").prop('checked', true);
				$("#rdoOpt2").attr('disabled', true);
			} else {
				$("#rdoOpt1").attr('disabled', false);
				$("#rdoOpt2").attr('disabled', false);
				$("#rdoOpt1").attr('disabled', true);
				$("#rdoOpt2").prop('checked', true);
			}
			
			
			if((strStatus == "6" || strStatus == "D") && strUserId == strEditor){
				$("#btnReg").attr('disabled', false);
				$("#txtReqContent").attr('readonly', false);
			}
		} else {
			if(strStatus == "6" && strUserId == strEditor){
				$("#btnReg").attr('disabled', false);
				$("#txtReqContent").attr('readonly', false);
				$("#rdoOpt1").attr('disabled', false);
				$("#rdoOpt2").attr('disabled', false);
				$("#rdoOpt1").prop('checked', true);
				$("#rdoOpt2").attr('disabled', true);
			} else if(strStatus != "6" &&  strUserId == strEditor && strQryGbn == "02") {
				$("#btnReg").attr('disabled', false);
				$("#txtReqContent").attr('readonly', false);
				$("#rdoOpt1").attr('disabled', false);
				$("#rdoOpt2").attr('disabled', false);
				$("#rdoOpt1").attr('disabled', true);
				$("#rdoOpt2").prop('checked', true);
			}
		}
	}
}

// 화면 클리어
function screenInit(tmp){
	
}

// 결재버튼 클릭
function btnOk_click(){
	if($('#"txtConMsg"').val().length === 0){
    	dialog.alert("결재의견을 입력하여 주시기 바랍니다.");
    	return;
    }
	
	if(confirm("결재처리하시겠습니까?") == true){
		confChk1();
    } else {
    	return;
    }
}

function confChk1(){
	var gyulData = new Object();
	var ajaxReturnData = null;
	
	gyulData.strAcptno = strAcptNo;
	gyulData.strUserId = userId;
	gyulData.txtConMsg = $('#"txtConMsg"').val();
	gyulData.strReqCd = strReqCd;
	
	var gyulInfo = {
		gyulData: 	gyulData,
		requestType: 	'nextConf'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/SRCompleteTab', gyulInfo, 'json');
	console.log(ajaxReturnData);
	if(ajaxReturnData !== 'ERR') {
		resultMSG = "결재";
		gyulProc_result(ajaxReturnData);
	}
}

function gyulProc_result(result){
	if(result == "0"){
		window.close();
		return;
	} else {
		dialog.alert("[" + resultMSG + "] 처리에 실패하였습니다.");
	}
	
	screenInit("S");
	srendInfoCall();
}