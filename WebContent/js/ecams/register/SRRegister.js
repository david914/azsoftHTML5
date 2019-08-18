/**
 * SR등록 화면 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자:
 * 	버전 : 1.0
 *  수정일 : 2019-00-00
 */

var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;
var strReqCd	 	= window.top.reqCd;
var selectedSr		= null;
var testFlag = false;
var cboQryGbnData = [];

var txtUserId = "";
var txtUserName = "";
var deptCd = "";
var deptName = ""; 
var subSw = false;
var selDeptSw = false;
var selDeptCd = "";
var txtOrg = "";

var loadSrReg = false;
var picker 		= new ax5.ui.picker();
var focusCk = false;

//이 부분 지우면 영어명칭으로 바뀜
//ex) 월 -> MON
ax5.info.weekNames = [
{label: "일"},
{label: "월"},
{label: "화"},
{label: "수"},
{label: "목"},
{label: "금"},
{label: "토"}
];


var organizationModal = new ax5.ui.modal(); // 조직도 팝업
/******************** eCmc0100.mxml ********************/

$(document).ready(function(){
	var timeOut = null;
	var timeOut2 = null;
	strReqCd = "41";
	setCbo();
	
	document.getElementById('frmSRRegister').onload = function() {
		loadSrReg = true;
	}

	$('#datStD').val(getDate('DATE',-1));
	$('#datEdD').val(getDate('DATE',0));

	picker.bind(defaultPickerInfo('basic', 'top'));
	
	$("#datStD, #datEdD").bind('change', function(){
		var dataId = $(this).prop("id");
		var dataStd = $('#frmPrjList').contents().find("#"+dataId).val($(this).val());
	});
	
	$("#datStD, #datEdD").focusout (function(){
		//console.log("element focus Out");
		timeOut = setTimeout(function(){$('[data-picker-btn="ok"]').click(); /*console.log("elemet Timeout");*/}, 100); 
	});
	
	$("#datStD, #datEdD").focusin(function(){
		//console.log("element focusin");
		//console.log("element Clear");
		clearTimeout(timeOut);
		clearTimeout(timeOut2);
	});
	
	$(document).focusout(function(){
		//console.log("document Focus Out");
		timeOut2 = setTimeout(function(){$('[data-picker-btn="ok"]').click();  /*console.log("document Timeout");*/}, 100); 
	});
	
	$(document).on("DOMSubtreeModified",'.ax5-ui-picker',function(){
		//console.log("picker Modified");
		//console.log("modified Clear");
		clearTimeout(timeOut);
		clearTimeout(timeOut2);
	});

	$('.btn_calendar').bind('click', function(e) {
		e.preventDefault();
	    e.stopPropagation();
		if($(this).css('background-color') === 'rgb(255, 255, 255)') {
			var inputs = $(this).siblings().prevAll('input');
			$(inputs.prevObject[0]).trigger('click');
		}
	});
});


// 페이지 로딩 완료시 다음 진행 
var inter = null;

function callSRRegister(data) {
   inter = setInterval(function(){
      if(loadSrReg) {
         iSRID_Click(data);
         clearInterval(inter);
      }
   },100);
}

//소소조직 선택 창 오픈
function openOranizationModal() {
	organizationModal.open({
		width : 400,
		height : 700,
		iframe : {
			method : "get",
			url : "../modal/OrganizationModal.jsp",
			param : "callBack=modalCallBack"
		},
		onStateChanged : function() {
			if (this.state === "open") {
				mask.open();
			} else if (this.state === "close") {
				mask.close();
				if(subSw === true && selDeptSw === false){
					var tmpTab = $('#frmSRRegister').get(0).contentWindow;
					
					tmpTab.txtUserId = txtUserId;
					tmpTab.txtUserName = txtUserName;
					tmpTab.deptName = deptName;
					tmpTab.deptCd = deptCd;
					tmpTab.selDeptSw = selDeptSw; 
					tmpTab.subSw = subSw;
					tmpTab.closeModal();
				} else {
					if(selDeptSw) {
						var tmpTab = $('#frmSRRegister').get(0).contentWindow;
						tmpTab.selDeptCd = selDeptCd;
						tmpTab.txtOrg = txtOrg;
						tmpTab.selDeptSw = selDeptSw;
						tmpTab.subSw = subSw;
						tmpTab.closeModal()
					}
				}
			}
		}
	}, function() {
	});
}

//PrjListTab 대상구분 콤보박스 데이터
function setCbo() {
	cboQryGbnData.push({value: "00", text: "전체", dateyn: "Y"});
	cboQryGbnData.push({value: "01", text: "SR수정대상", dateyn: "N"});
	
	$('[data-ax5select="cboQryGbn"]').ax5select("setValue", cboQryGbnData[1].value, true);
	$('#cboQryGbn').trigger('change');
}

function subScreenInit() {
	$('#frmSRRegister').get(0).contentWindow.elementInit("NEW"); //tab1.screenInit("NEW");
}

function subCmdQry_Click() {
	$('#frmPrjList').get(0).contentWindow.getPrjList(); //tab0.cmdQry_click();
}

//PrjListTab 에서 그리드 클릭 이벤트
function iSRID_Click(data) {
	selectedSr = data;
	var tmpTab = $('#frmSRRegister').get(0).contentWindow;
	
	if(tmpTab != null) {
		tmpTab.strEditor = data.cc_createuser;
		tmpTab.strStatus = data.cc_status;
		tmpTab.strIsrId = data.cc_srid;
		
		tmpTab.elementInit("S"); //tab1.screenInit("S");
		
		if(testFlag) {
			console.log("call child function")
			tmpTab.firstGridClick(data.cc_srid); //tab1.grdPrj_click(grdPrj_dp.cc_srid);
		}else {
			$('#frmSRRegister').contents().find('#btnUpdate').attr('disabled', true);
			$('#frmSRRegister').contents().find('#btnRegister').attr('disabled', true);
		}
		testFlag = true;
	}
}