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
	
	strQryGbn = "01";
	if(strReqCd != null && strReqCd != "") {
		if(strReqCd.length > 3) strReqGbn = strReqCd.substr(0,2);
	}
	
	strReqCd = "42";
	
	setCbo();
	initScreen();
	setTabMenu();
	
//	initSubScreen(); //test
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
	
//	var codeInfos = getCodeInfoCommon( [new CodeInfo('QRYGBN','ALL','N')] );
//	cboQryGbnData 	= codeInfos.QRYGBN;
	
//	tab0.cboQryGbn_click();
//	tab0.screenInit();
//	tab0.cmdQry_click();
}

function initScreen() {
	$("#tabSRRegister").unbind("click");
	//$("#tabDevPlan").prop('disabled',true);
}

function setTabMenu(){
	$("#tabDevPlan").show(); //개발계획실적탭
	
	$("ul.tabs li").click(function () {
		$(".tab_content").hide();
		var activeTab = $(this).attr("rel");
		
		//tab메뉴 클릭에 따라 색상 변경
		$("ul.tabs li").removeClass('on');
		$(this).addClass("on");
		
		$("#" + activeTab).fadeIn();
	});
	
	tab_Click();
}

//자식(PrjListTab)에서 호출하는 함수 sub1
function initSubScreen() {
//	tab1.screenInit("M");
//	tab2.screenInit("M");
	
	strIsrId = "";
	
//	console.log("!!");
//	var obj = document.getElementById("frmDevPlan");
//	console.log("doc: " + document.getElementById("frmDevPlan"));
//	var objDoc = obj.contentWindow || obj.contentDocument;
//	objDoc.screenInit("M");
//	$('#frmDevPlan').get(0).contentWindow.screenInit("M");
//	$('#frmDevPlan')[0].contentWindow.screenInit("M");
	
//	var iframe1 = document.getElementById("frmDevPlan");
//	iframe1.contentWindow.screenInit("M");
	
//	frmDevPlan.screenInit("M");
	
	$("#frmDevPlan").children("iframe").screenInit("M");
}

//자식에서 호출하는 함수 isrID_click
function iSRID_Click(data) {
	//console.log("iSRID_Click");
}

//tab 바뀔 때 호출하는 함수
function tab_Click() {
	//console.log("tab_Click");
}