/**
 * SR정보 winPop
 * <pre>
 * <b>History</b>
 * 	작성자: 방지연
 * 	버전 : 1.0
 *  수정일 : 2019-07-19
 */

var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;
var strReqCd	 	= window.top.reqCd;

//public
var strIsrId  = "";
var strQryGbn = "";
var strWorkD  = "";
var strAcptNo = "";
var cboQryGbnData = [];

var prjListData = [];


$(document).ready(function() {
	//tab메뉴
	$('#tabSRRegister').width($('#tabSRRegister').width()+10);
	$('#tabDevPlan').width($('#tabDevPlan').width()+10);
	$('#tabReqHistory').width($('#tabReqHistory').width()+10);
	$('#tabPrgList').width($('#tabPrgList').width()+10);
	$('#tabSRComplete').width($('#tabSRComplete').width()+10);
	
	//$("#tabDevPlan").show();
	
	strIsrId = $('#SRId').val();
	strAcptNo = $('#AcptNo').val(); 
	userId = $('#UserId').val();
	strReqCd = "99";
	
//  테스트 후 주석
//	strIsrId = "R201907-0002";
	
//	document.getElementById('frmPrjList').onload = function() {
//		console.log("frmPrjList is loaded");
//	};
	
	$('#frmSRRegister').get(0).contentWindow.strReqCd = "XX";
	
	$('#frmDevPlan').get(0).contentWindow.strReqCd = "42";
	$('#frmDevPlan').get(0).contentWindow.strWorkD = strWorkD;	
	
	$('#frmReqHistory').get(0).contentWindow.strReqCd = "43";
	
	$('#frmPrgList').get(0).contentWindow.strReqCd = "XX";
	
	initScreen();
	//clickTabMenu();
	
	//PrjInfo.getPrjList(tmpObj);
	var tmpInfo = new Object();
	tmpInfo.reqcd = strReqCd;
	tmpInfo.qrygbn = strReqCd;
	tmpInfo.secuyn = "N";
	tmpInfo.srid = strIsrId;
	
	var tmpInfoData;
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETPRJLIST'
	}
	ajaxAsync('/webPage/winpop/PopSRInfoServlet', tmpInfoData, 'json', successPrjList, clickTabMenu);
});

function initScreen() {
	$('#tab1').attr('disabled', true);
	$('#tab2').attr('disabled', true);
	$('#tab3').attr('disabled', true);
	$('#tab4').attr('disabled', true);
	$('#tab5').attr('disabled', true);
	$("ul.tabs li").addClass('tab_disabled');
}

function successPrjList(data) {
	prjListData = data;
	if(prjListData.length > 0) {
		$("#txtSRID").val(strIsrId);
		$("#txtSRTitle").val(prjListData[0].cc_reqtitle);
		$("#txtSRSta").val(prjListData[0].status);
		iSRID_Click(prjListData[0]);
	}
}

function iSRID_Click(data) {
	if(data == null) return;
	
	var tabIdx = 0;
	
	if(data.isrproc.indexOf("69")>=0) {
		$('#tab5').attr('disabled', false);
		$('#tab5').removeClass('tab_disabled');
		if(strAcptNo != null && strAcptNo != "") {
			if(strAcptNo.substr(4,2) == "69") {
				tabIdx = 7;
			}
		}
	}
	
	if(data.isrproc.indexOf("44")>=0 || data.isrproc.indexOf("54")>=0 || data.isrproc.indexOf("55")>=0) {
		$('#tab4').attr('disabled', false);
		$('#tab4').removeClass('tab_disabled');
		//프로그램목록.initApp();
	}
	
	if(data.isrproc.indexOf("43")>=0) {
		$('#tab3').attr('disabled', false);
		$('#tab3').removeClass('tab_disabled');
		//변경요청이력.initApp();
		if(tabIdx == 0) tabIdx = 4;
	}
	
	if(data.isrproc.indexOf("42")>=0) {
		$('#tab2').attr('disabled', false);
		$('#tab2').removeClass('tab_disabled');
		//개발계획실적.initApp();
		if(tabIdx == 0) tabIdx = 1;
	}
	
	if(data.isrproc.indexOf("41")>=0) {
		$('#tab1').attr('disabled', false);
		$('#tab1').removeClass('tab_disabled');
		if(strAcptNo != null && strAcptNo != "") {
			if(strAcptNo.substr(4,2) == "41") {
				//$('#tabSRRegister').get(0).contentWindow.strAcptno = strAcptNo;
				tabIdx = 0;
			}
		}
		//SR등록.initApp();
	}
	console.log("data.isrproc: " + data.isrproc);
	console.log("tabIdx: " + tabIdx);
	console.log("strAcptNo: " + strAcptNo);
	//tabIdx = tabIdx + 1;
	$('#tab' + tabIdx).trigger('click');
	clickTabMenu();
}

//탭메뉴 클릭 이벤트
function clickTabMenu() {
	$("ul.tabs li").click(function () {
		//이미 on상태면 pass
		if($(this).hasClass("on")) {
			changeTabMenu();
			return;
		}
	
		$(".tab_content").hide();
		var activeTab = $(this).attr("rel");
		
		//tab메뉴 클릭에 따라 색상 변경
		$("ul.tabs li").removeClass('on');
		$(this).addClass("on");
		
		$("#" + activeTab).fadeIn();
		changeTabMenu();
	});
}

//tabnavi_click
function changeTabMenu() {
	var tmpTab = null;
	
	//console.log("changeTabMenu: " +  document.getElementById("tab2").className); //활성화:on, 비활성화: null
	
	if(document.getElementById("tab1").className == "on") { //SR등록/접수
		tmpTab = $('#frmSRRegister').get(0).contentWindow;
		
		if(tmpTab.strIsrId == strIsrId) return;
		
		//initApp();
		
		//tmpTab.strEditor = prjListData[0].cc_createuser
		tmpTab.strStatus = prjListData[0].cc_status;
		tmpTab.firstGridClick(prjListData[0].cc_srid);
		tmpTab.strIsrId = strIsrId;
		
	}else if(document.getElementById("tab2").className == "on") { //개발계획/실적등록
		tmpTab = $('#frmDevPlan').get(0).contentWindow;
		
		if(tmpTab.strIsrId == strIsrId) return;
		
		tmpTab.strIsrId = strIsrId;
		tmpTab.strStatus = prjListData[0].cc_status;
		tmpTab.screenInit("M");
		
		if(strIsrId != null) {
			tmpTab.initDevPlan();
		}
		
	}else if(document.getElementById("tab3").className == "on") { //변경요청이력
		var tmpTab = $('#frmReqHistory').get(0).contentWindow;
		
		if(tmpTab.strIsrId == strIsrId) return;
		
		//tmpTab.screenInit();
		if(strIsrId != null) {
			tmpTab.getReqDepartInfo();
		}
		
	}else if(document.getElementById("tab4").className == "on") { //프로그램목록
		tmpTab = $('#frmPrgList').get(0).contentWindow;
		
		if(tmpTab.strIsrId == strIsrId) return;
		
		tmpTab.strIsrId = strIsrId;
		//tmpTab.screenInit();
		if(strIsrId != null) {
			tmpTab.getReqDepartInfo();
		}
		
	}else if(document.getElementById("tab5").className == "on") { //SR완료
		tmpTab = $('#frmSRComplete').get(0).contentWindow;
		
		if(tmpTab.strIsrId == strIsrId) return;
		
		tmpTab.strIsrId = strIsrId;
		tmpTab.userId = userId;
		tmpTab.strStatus = prjListData[0].cc_status;
		//tmpTab.screenInit("M");
		tmpTab.strIsrTitle = prjListData[0].cc_reqtitle;
		tmpTab.strEditor = prjListData[0].cc_lastupuser;
		tmpTab.strQryGbn = "00";
		//tmpTab.srendInfoCall();
	}
}

//public getQry_click
function cmdQry_click() {
	iSRID_Click(prjListData[0]);
}