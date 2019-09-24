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
var SRId = '';
var strAcptNo = "";
var cboUserData = null;
var retMsg = "";
var confAcpt = "";
var resultMSG ="";

var confirmData = [];
var confirmInfoData = null;

var devListGridData = [];
var devListGrid 	= new ax5.ui.grid();
var approvalModal 		= new ax5.ui.modal();

$(document).ready(function() {
	createViewGrid();
	screenInit();
	/*
	if(strIsrId != ""){
		getStrAcptno();	// AcptNo 가져오기
		srendInfoCall();
	}*/
	// 결재버튼 클릭
	$('#btnOk').bind('click', function() {
		btnOk_click();
	});
	
	// 반려버튼 클릭
	$('#btnCncl').bind('click', function() {
		btnCncl_click();
	});
	
	// 등록/수정버튼 클릭
	$('#btnReg').bind('click', function() {
		format_confirm2();
	});
	
	// 결재정보
	$('#btnConf2').bind('click', function() {
		openApprovalInfo(2, confAcpt, "R60");
	});
});

//그리드 생성
function createViewGrid() {
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
	
	if(devListGridData.length > 0){
		devListGrid.setData(devListGridData);
	}
}

// 화면 초기화
function screenInit(){
	$("#txtSRID").val("");
	$("#txtSRTitle").val("");
	
	$("#applyUserDate").hide();
	$("#lbTxt").hide();
	$("#divTxt").hide();
	$("#btnOk").hide();
	$("#btnCncl").hide();
	$("#btnConf2").hide();
	
	$("#txtApplyUser").val("");
	$("#txtApplyDate").val("");
	$("#txtReqContent").val("");
	
	$("#btnConf2").hide();
	$("#btnReg").attr("disabled", true);
	
}

// 등록/수정 클릭
function format_confirm2(){
	var ajaxReturnData = null;
	
	if($("#txtReqContent").val().length === 0 || $("#txtReqContent").val() == ""){
		dialog.alert("완료의견을 입력하여 주시기 바랍니다.");
    	return;
	}
	
	confirmInfoData = new Object();
	confirmInfoData.SysCd = "99999";
	confirmInfoData.EmgSw = "0";
	confirmInfoData.strRsrcCd = "";
	confirmInfoData.PrjNo = strIsrId;
	confirmInfoData.ReqCd = strReqCd;
	confirmInfoData.UserID = userId;
	confirmInfoData.strQry = "";
	
	var tmpData = {
			requestType : 'confSelect',
			confirmInfoData : confirmInfoData
	}	
	ajaxReturnData = ajaxCallWithJson('/webPage/apply/ApplyRequest', tmpData, 'json');
	
	if(ajaxReturnData == "Y"){
		confselect2();
	}
}

function confselect2(){
	approvalModal.open({
        width: 820,
        height: 365,
        iframe: {
            method: "get",
            url: "../../modal/request/ApprovalModal.jsp",
            param: "callBack=modalCallBack"
	    },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
            	if(confirmData.length > 0){
            		endSr();
            	}
            	ingSw = false;
                mask.close();
            }
        }
	});
}

function endSr(){
	var EndSRData = new Object();
	var ajaxReturnData = null;
	
	EndSRData.cc_srid = strIsrId;
	EndSRData.cc_editor = userId;
	EndSRData.reqcd = strReqCd;
	EndSRData.cc_confmsg = $("#txtReqContent").val();
	EndSRData.endgbn = "01";
	
	var EndSRInfo = {
			EndSRData: 	EndSRData,
			confirmData:    confirmData,
			requestType: 	'insertSREnd'
		}
		
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/SRCompleteTab', EndSRInfo, 'json');
	console.log(ajaxReturnData);
	if(ajaxReturnData !== 'ERR') {
		if(ajaxReturnData === "INSERT"){
			dialog.alert("등록이 완료되었습니다.");
		} else {
			dialog.alert("수정이 완료되었습니다.");
		}
		
		//parent.document.location.reload();
		srendInfoCall();
		window.parent.reloadVal = "Y";
		window.parent.getPrjList();
	}
}

//결재 정보 창 띄우기
function openApprovalInfo(type, acptNo, reqCd) {
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
    
    if(type === 2) {
    	nHeight = 471;
        nWidth  = 1033;
    	cURL	= '/webPage/winpop/PopApprovalInfo.jsp';
    }
    
	myWin = winOpen(form, winName, cURL, nHeight, nWidth);
}

function srendInfoCall(){
	screenInit();
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
					
					if(strStatus != "9"){	// 나중에 주석처리 제거해야됨
						$("#btnCncl").show();
					}
					
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
	console.log("GERDEVUSER");
	var ajaxReturnData = null;
		
	var devInfo = {
		strIsrId : strIsrId,
		requestType: 	'getRealTime'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/SRCompleteTab', devInfo, 'json');
	if(ajaxReturnData !== 'ERR') {
		devListGridData = ajaxReturnData;
		
		devListGrid.setData(devListGridData);
		console.log(devListGridData);
		//if(ajaxReturnData[0].cmc0290_check === "Y"){
			getSREnd();
		//}
	}
}

// SREnd
function getSREnd(){
	console.log("GET SR END");
	var ajaxReturnData = null;
	
	var SRendInfo = {
		strIsrId : strIsrId,
		requestType: 	'getSREnd'
	}
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/SRCompleteTab', SRendInfo, 'json');
	console.log(ajaxReturnData);
	console.log(strEditor + "   /    " + userId);
	if(ajaxReturnData !== 'ERR') {
		if(ajaxReturnData.length > 0){
			$("#applyUserDate").show();
			$("#txtReqContent").val(ajaxReturnData[0].cc_confmsg);
			$("#txtApplyDate").val(ajaxReturnData[0].lastdt);
			$("#txtApplyUser").val(ajaxReturnData[0].cm_username);
			confAcpt = "";
			
			if(ajaxReturnData[0].acptno != null){
				$("#btnConf2").show();
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
			
			
			if((strStatus == "6" || strStatus == "D") && userId == strEditor){
				$("#btnReg").attr('disabled', false);
				$("#txtReqContent").attr('readonly', false);
			}
		} else {
			if(strStatus == "6" && userId == strEditor){
				$("#btnReg").attr('disabled', false);
				$("#txtReqContent").attr('readonly', false);
				$("#rdoOpt1").attr('disabled', false);
				$("#rdoOpt2").attr('disabled', false);
				$("#rdoOpt1").prop('checked', true);
				$("#rdoOpt2").attr('disabled', true);
			} else if(strStatus != "6" &&  userId == strEditor && strQryGbn == "02") {
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

// 결재버튼 클릭
function btnOk_click(){
	if($("#txtConMsg").val().length === 0){
    	dialog.alert("결재의견을 입력하여 주시기 바랍니다.");
    	return;
    }
	
	confirmDialog.confirm({
		msg: '결재처리하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			confChk2();
		}
	});
}

function confChk2(){
	var gyulData = new Object();
	var ajaxReturnData = null;
	
	gyulData.strAcptno = strAcptNo;
	gyulData.strUserId = userId;
	gyulData.txtConMsg = $('#txtConMsg').val();
	gyulData.strReqCd = strReqCd;
	
	var gyulInfo = {
		gyulData: 	gyulData,
		cnt     :   "1",
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
	} else {
		dialog.alert("[" + resultMSG + "] 처리에 실패하였습니다.");
	}
	
	//parent.document.location.reload();
	srendInfoCall();
}

// 반려 버튼 클릭
function btnCncl_click(){
	if($("#txtConMsg").val().length === 0){
    	dialog.alert("반려의견을 입력하여 주시기 바랍니다.");
    	return;
    }
	
	confirmDialog.confirm({
		msg: '반려처리하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			cnclChk2();
		}
	});
}

function cnclChk2(){
	var gyulData2 = new Object();
	var ajaxReturnData = null;
	
	gyulData2.strAcptno = strAcptNo;
	gyulData2.strUserId = userId;
	gyulData2.txtConMsg = $('#txtConMsg').val();
	gyulData2.strReqCd = strReqCd;
	
	var gyulInfo2 = {
		gyulData: 	gyulData2,
		cnt     :   "3",
		requestType: 	'nextConf'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webpage/tab/SR/SRCompleteTab', gyulInfo2, 'json');
	console.log(ajaxReturnData);
	if(ajaxReturnData !== 'ERR') {
		resultMSG = "반려";
		gyulProc_result(ajaxReturnData);
	}
}
