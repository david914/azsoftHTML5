/**
 * [결재정보 > 전체조회] 팝업 기능정의
 * 
 * <pre>
 * 	작성자	: 방지연
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-25
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var grdAllApprovalInfo		= new ax5.ui.grid();

var grdAllApprovalInfoData 	= [];
var cboSysData				= [];
var cboReqCdData			= [];

var tmpInfo     			= new Object(); 
var tmpInfoData 			= new Object();

$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

grdAllApprovalInfo.setConfig({
    target: $('[data-ax5grid="grdAllApprovalInfo"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 25,
        onClick: function () {
            this.self.select(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "reqname", 		label: "결재유형",  		width: 120},
        {key: "cm_sysmsg",		label: "시스템",  		width: 100},
        {key: "manid", 			label: "직원구분",  		width: 80},
        {key: "cm_seqno", 		label: "순서",  			width: 60},
        {key: "cm_name", 		label: "단계명칭",  		width: 150},
        {key: "cm_codename",	label: "결재구분",  		width: 100},
        {key: "common", 		label: "정상",  			width: 100},
        {key: "blank", 			label: "부재",  			width: 100},
        {key: "holi", 			label: "업무후",  		width: 100},
        {key: "emg", 			label: "긴급",  			width: 100},
        {key: "emg2", 			label: "긴급[후]",  		width: 100},
        {key: "deptcd", 		label: "결재조직",  		width: 100},
        {key: "rgtcd", 			label: "결재직무",  		width: 100},
        {key: "rsrccd", 		label: "프로그램종류",		width: 100},
        {key: "pgmtype", 		label: "프로그램등급", 		width: 100}
    ]
});

$(document).ready(function() {
	getCodeInfo();
	getSysInfo();
	
	$('#chkMember').wCheck("check", false);
	$('#chkOutsourcing').wCheck("check", false);
	
	// 조회
	$('#btnQry').bind('click', function() {
		btnQry_Click();
	});
	
	// 닫기
	$('#btnClose').bind('click', function() {
		btnClose_Click();
	});
});

function getCodeInfo(){
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('REQUEST', 'ALL','N')
	]);
	
	cboReqCdData = codeInfos.REQUEST;
	
	$('[data-ax5select="cboReqCd"]').ax5select({
        options: injectCboDataToArr(cboReqCdData, 'cm_micode' , 'cm_codename')
   	});
}

function getSysInfo() {
	tmpInfo = new Object();
	tmpInfo.userId = userId;
	tmpInfo.selMsg = "ALL";
	tmpInfo.closeYn = "N";
	tmpInfo.sysCd = "";
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETSYSINFO_RPT'
	}
	ajaxAsync('/webPage/administrator/ApprovalInfoServlet', tmpInfoData, 'json', successSysInfo);
}


function successSysInfo(data) {
	cboSysData = data;
	$('[data-ax5select="cboSys"]').ax5select({
        options: injectCboDataToArr(cboSysData, 'cm_syscd' , 'cm_sysmsg')
   	});
}

function btnQry_Click() {
	var strSys = "";
	var strReq = "";
	var strMem = "";
	
	grdAllApprovalInfoData 	= [];
	grdAllApprovalInfo.setData([]);
	
	if(!$('#chkMember').is(':checked') && !$('#chkOutsourcing').is(':checked')) {
		dialog.alert('직원/외주구분을 선택하여 주시기 바랍니다.',function(){});
		return;
	}
	
	if(getSelectedIndex('cboSys') > 0) {
		strSys = getSelectedVal('cboSys').value;
	}
	
	if(getSelectedIndex('cboReqCd') > 0) {
		strReq = getSelectedVal('cboReqCd').value;
	}
	
	if($('#chkMember').is(':checked') && $('#chkOutsourcing').is(':checked')) {
		strMem = "9";
	}else if($('#chkMember').is(':checked')) {
		strMem = "1";
	}else {
		strMem = "2";
	}
	
	tmpInfo = new Object();
	tmpInfo.SysCd = strSys;
	tmpInfo.ReqCd = strReq;
	tmpInfo.ManId = strMem;
	tmpInfo.SeqNo = "";
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETAPPROVALINFO'
	}
	ajaxAsync('/webPage/administrator/ApprovalInfoServlet', tmpInfoData, 'json', successApprovalInfo);
}

function successApprovalInfo(data) {
	grdAllApprovalInfoData = data;
	grdAllApprovalInfo.setData(grdAllApprovalInfoData);
}

function btnClose_Click() {
	window.parent.allApprovalInfoModal.close();
}