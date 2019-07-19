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
var strIsrId = "R201907-0002";
var strQryGbn = "";
var strWorkD = "";
var cboQryGbnData = [];

var urlArr = [];

$(document).ready(function(){
	//tab메뉴
	$('#tabSRRegister').width($('#tabSRRegister').width()+10);
	$('#tabDevPlan').width($('#tabDevPlan').width()+10);
	$('#tabReqHistory').width($('#tabReqHistory').width()+10);
	$('#tabPrgList').width($('#tabPrgList').width()+10);
	$('#tabTestCase').width($('#tabTestCase').width()+10);
	$('#tabDevCheck').width($('#tabDevCheck').width()+10);
	$('#tabMoniteringCheck').width($('#tabMoniteringCheck').width()+10);
	$('#tabSRComplete').width($('#tabSRComplete').width()+10);
	
	$("#tabDevPlan").show(); //개발계획실적탭
	//tabnavi.selectedIndex = tabnavi.childDescriptors.length-1;
	
	strReqCd = "99";
	
	$('#tabSRRegister').get(0).contentWindow.strReqCd = "XX";
	
	$('#tabDevPlan').get(0).contentWindow.strReqCd = "42";
	$('#tabDevPlan').get(0).contentWindow.strWorkD = strWorkD;
	
	$('#tabReqHistory').get(0).contentWindow.strReqCd = "43";
	
	$('#tabPrgList').get(0).contentWindow.strReqCd = "XX";
	
	$('#tabTestCase').get(0).contentWindow.strReqCd = "XX";
	
	$('#tabDevCheck').get(0).contentWindow.strReqCd = "69";
	
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
	ajaxAsync('/webPage/winpop/PopSRInfoServlet', tmpInfoData, 'json', successPrjList);
	
	initScreen();
	clickTabMenu();
});

function initScreen() {
	$("#tab1").unbind("click");
	$("#tab2").unbind("click");
	$("#tab3").unbind("click");
	$("#tab4").unbind("click");
	$("#tab5").unbind("click");
	$("#tab6").unbind("click");
	$("#tab7").unbind("click");
	$("#tab8").unbind("click");
}

function successPrjList(data) {
	
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
	console.log("changeTabMenu: " +  document.getElementById("tab2").className); //활성화:on, 비활성화: null

	if(document.getElementById("tab1").className == "on") { //SR등록/접수
		var tmpGrid = $('#frmPrjList').get(0).contentWindow.firstGrid;
		var tmpGridSelectedIndex = tmpGrid.selectedDataIndexs;
		var tmpSelectedGridItem = tmpGrid.list[tmpGrid.selectedDataIndexs];
		var tmpTab = $('#frmSRRegister').get(0).contentWindow;
		
		if(tmpGridSelectedIndex < 0) {
			tmpTab.elementInit("M");
			return;
		}
		
		if(tmpTab.strIsrId == strIsrId) return;
		
		tmpTab.strStatus = tmpSelectedGridItem.cc_status;
		tmpTab.elementInit("M"); //tab1.screenInit("M");
		tmpTab.firstGridClick(strIsrId); //tab1.grdPrj_click(strIsrId)
		
	}else if(document.getElementById("tab2").className == "on") { //개발계획/실적등록
		var tmpGrid = $('#frmPrjList').get(0).contentWindow.firstGrid;
		var tmpGridSelectedIndex = tmpGrid.selectedDataIndexs;
		var tmpSelectedGridItem = tmpGrid.list[tmpGrid.selectedDataIndexs];
		var tmpTab = $('#frmDevPlan').get(0).contentWindow;
		
		if(tmpGridSelectedIndex < 0) {
			tmpTab.screenInit("M"); //tab2.screenInit("M");
			return;
		}
		
		if(tmpTab.strIsrId == strIsrId) return;
		
		tmpTab.strIsrId = strIsrId; 
		tmpTab.strStatus = tmpSelectedGridItem.cc_status;
		tmpTab.screenInit("M");
		
		if(strIsrId != null && strIsrId != "") {
			tmpTab.initDevPlan(); //tab2.devPlanCall();
		}
	}else if(document.getElementById("tab3").className == "on") { //변경요청이력
		
	}else if(document.getElementById("tab4").className == "on") { //프로그램목록
		
	}else if(document.getElementById("tab5").className == "on") { //단위테스트
		
	}else if(document.getElementById("tab6").className == "on") { //개발검수
		
	}else if(document.getElementById("tab7").className == "on") { //모니터링체크
		
	}else if(document.getElementById("tab8").className == "on") { //SR완료
		
	}
}