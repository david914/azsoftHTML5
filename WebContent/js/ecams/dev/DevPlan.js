/**
 * 개발계획/실적등록 화면 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 방지연
 * 	버전 : 1.0
 *  수정일 : 2019-06-26
 */

var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;
var strReqCd	 	= window.top.reqCd;

//public
var strIsrId = "";
var strQryGbn = "";
var cboQryGbnData = [];

var urlArr = [];

$(document).ready(function(){
	//tab메뉴
	$('#tabSRRegister').width($('#tabSRRegister').width()+10);
	$('#tabDevPlan').width($('#tabDevPlan').width()+10);
	$("#tabDevPlan").show(); //개발계획실적탭
	
	strQryGbn = "01";
	if(strReqCd != null && strReqCd != "") {
		if(strReqCd.length > 3) strReqGbn = strReqCd.substr(0,2);
	}
	
	strReqCd = "42";
	
	setCbo();
	initScreen();
	clickTabMenu();
});

function setCbo() {
	//PrjListTab 대상구분 콤보박스 데이터
	cboQryGbnData.push({value: "00", text: "전체", dateyn: "Y"});
	cboQryGbnData.push({value: "01", text: "개발계획등록대상", dateyn: "N"});
	cboQryGbnData.push({value: "02", text: "개발실적등록대상", dateyn: "N"});
	
	if(strQryGbn != null && strQryGbn != "") {
		for(var i=0; i<cboQryGbnData.length; i++) {
			if(cboQryGbnData[i].value == strQryGbn) {
				$('[data-ax5select="cboQryGbn"]').ax5select("setValue", cboQryGbnData[i].value, true);
				break;
			}
		}
	}
	
	var tmpTab = $('#frmPrjList').get(0).contentWindow;
	tmpTab.changeQryGbn(); //tab0.cboQryGbn_click();
//	tab0.screenInit();
	tmpTab.getPrjList(); //tab0.cmdQry_click();
}

function initScreen() {
	//$("#tab1").prop('disabled',true);
	$("#tab1").unbind("click");
	//$("#tab2").prop('disabled',true);
	$("#tab2").unbind("click");
}

//자식(PrjListTab)에서 호출하는 함수 subScreenInit()
function initSubScreen() {
	var tmpTab1 = $('#frmSRRegister').get(0).contentWindow;
	var tmpTab2 = $('#frmDevPlan').get(0).contentWindow;
	
	tmpTab1.elementInit("M"); 
	tmpTab2.screenInit("M");
	tmpTab1.strIsrId = "";
	tmpTab2.strIsrId = "";
}

//PrjListTab 에서 그리드 클릭 이벤트
function iSRID_Click(data) {
	strIsrId = "";
	
	//$("#tab1").prop('disabled',true);
	$("#tab1").unbind("click");
	//$("#tab2").prop('disabled',true);
	$("#tab2").unbind("click");
	
	if(data == null) return;
	
	strIsrId = data.cc_srid;
	
	if(data.isrproc.indexOf("41") >= 0) {
		//$("#tab1").prop('disabled',false);
		$("#tab1").bind("click", clickTabMenu());
	}
	if(data.isrproc.indexOf("42") >= 0) {
		//$("#tab2").prop('disabled',false);
		$("#tab2").bind("click", clickTabMenu());
	}
	
	data = null;
	changeTabMenu();
	//clickTabMenu();
}

//tabnavi_click
function changeTabMenu() {
	console.log("changeTabMenu: " +  document.getElementById("tab2").className); //활성화:on, 비활성화: null

	if(document.getElementById("tab1").className == "on") { //$('#tab1').is(':enabled')
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
		
	}else if(document.getElementById("tab2").className == "on") { //$('#tab2').is(':enabled')
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
	}
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