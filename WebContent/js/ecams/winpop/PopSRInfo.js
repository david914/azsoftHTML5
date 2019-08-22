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
var strStatus = "";
var strIsrTitle = "";
var cboQryGbnData = [];

var prjListData = [];

var loadSw = false;
var loadSw2 = false;
var inter = null;
var inter2 = null;
var count=0;
var gridSw = false;

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
	strReqCd = "XX";
	
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
	
	document.getElementById('frmSRRegister').onload = function() {
	    loadSw = true;
	}
	
	document.getElementById('frmDevPlan').onload = function() {
	    loadSw2 = true;
	}
	
	callSRRegister();
	//callDevPlan();
	//initScreen();
	//clickTabMenu();
});

//페이지 로딩 완료시 다음 진행 
function callSRRegister() {
   inter = setInterval(function(){
      if(loadSw) {
         initScreen();
         clearInterval(inter);
      }
   },100);
   callDevPlan();
}

function callDevPlan() {
	inter2 = setInterval(function(){
      if(loadSw2) {
    	  $('#frmDevPlan').get(0).contentWindow.createViewGrid();
    	  count++;
    	  console.log("count: " + count);
    	  if(count==2) {
    		  console.log("count 222222222");
    		  clearInterval(inter2);
    	  }
      }
	},1000);
	//callSRRegister();
}

function initScreen() {
	$('#tab1').attr('disabled', true);
	$('#tab2').attr('disabled', true);
	$('#tab3').attr('disabled', true);
	$('#tab4').attr('disabled', true);
	$('#tab5').attr('disabled', true);
	$("ul.tabs li").addClass('tab_disabled');
	
	getPrjList();
}

function getPrjList() {
	//PrjInfo.getPrjList(tmpObj);
	var tmpInfo = new Object();
	tmpInfo.reqcd = "99";
	tmpInfo.qrygbn = "99";
	tmpInfo.secuyn = "N";
	tmpInfo.srid = strIsrId;

	var tmpInfoData;
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETPRJLIST'
	}
	ajaxAsync('/webPage/winpop/PopSRInfoServlet', tmpInfoData, 'json', successPrjList, clickTabMenu);
}

function successPrjList(data) {
	prjListData = data;
	console.log(prjListData);
	if(prjListData.length > 0) {
		$("#txtSRID").val(strIsrId);
		$("#txtSRTitle").val(prjListData[0].cc_reqtitle);
		$("#txtSRSta").val(prjListData[0].status);
		strIsrTitle = prjListData[0].cc_reqtitle;
		strStatus = prjListData[0].cc_status;
		
		//console.log("101line. strStatus: " + strStatus);
		console.log("103line. prjListData: " , prjListData);
		
		iSRID_Click(prjListData[0]);
	}
}

function iSRID_Click(data) {
	console.log("110line data", data);
	if(data == null) return;
	
	var tabIdx = 0;
	
	if(data.isrproc.indexOf("69")>=0) {
		$('#tab5').attr('disabled', false);
		$('#tab5').removeClass('tab_disabled');
		if(strAcptNo != null && strAcptNo != "") {
			if(strAcptNo.substr(4,2) == "69") {
				tabIdx = 4;
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
//	console.log("data.isrproc: " + data.isrproc);
//	console.log("tabIdx: " + tabIdx);
//	console.log("strAcptNo: " + strAcptNo);
	
	tabIdx = tabIdx + 1;
	var activeTab = $('#tab' + tabIdx).attr("rel");
	$('#tab' + tabIdx).addClass("on");
	$("#" + activeTab).fadeIn();
	changeTabMenu();
	//$('#tab' + tabIdx).trigger('click');
	//clickTabMenu();
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
		tmpTab.strReqCd = "XX";
		tmpTab.strIsrId = strIsrId;
		tmpTab.elementInit("M"); //tab1.screenInit("M");
		tmpTab.firstGridClick(prjListData[0].cc_srid);
	}else if(document.getElementById("tab2").className == "on") { //개발계획/실적등록
		tmpTab = $('#frmDevPlan').get(0).contentWindow;
		
		tmpTab.createViewGrid();
		
		if(tmpTab.strIsrId == strIsrId) return;
		
		tmpTab.userId = userId;
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
		
		//if(tmpTab.strIsrId == strIsrId) return;
		
		tmpTab.strIsrId = strIsrId;
		tmpTab.userId = userId;
		tmpTab.strStatus = prjListData[0].cc_status;
		//tmpTab.screenInit("M");
		tmpTab.strIsrTitle = prjListData[0].cc_reqtitle;
		tmpTab.strEditor = prjListData[0].cc_lastupuser;
		tmpTab.strQryGbn = "00";
		tmpTab.getStrAcptno();
		tmpTab.srendInfoCall();
		
		console.log("cc_status: " + prjListData[0].cc_status);
		console.log("strIsrTitle: " + prjListData[0].cc_reqtitle);
	}
}

//public getQry_click
function cmdQry_click() {
	iSRID_Click(prjListData[0]);
}