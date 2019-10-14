/**
 * 시스템상세정보 팝업 화면 기능 정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-05-31
 * 
 */

var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드
var selectedSystem  = window.parent.selectedSystem;
var sysCd = '';
var urlArr = [];
var loadSw = false;
var loadSw2 = false;
var loadSw3 = false;
var loadSw4 = false;
var loadSw5 = false;
var loadSw6 = false;
var inter = null;
var frmLoad1  = false;
var frmLoad2  = false;
var frmLoad3  = false;
var frmLoad4  = false;
var frmLoad5  = false;
var frmLoad6  = false;


$(document).ready(function(){
	
	$('#tab1Li').width($('#tab1Li').width()+10);
	$('#tab2Li').width($('#tab2Li').width()+10);
	$('#tab3Li').width($('#tab3Li').width()+10);
	$('#tab4Li').width($('#tab4Li').width()+10);
	$('#tab5Li').width($('#tab5Li').width()+10);
	$('#tab6Li').width($('#tab6Li').width()+10);

	$('#tab1').attr('disabled', true);
	$('#tab2').attr('disabled', true);
	$('#tab3').attr('disabled', true);
	$('#tab4').attr('disabled', true);
	$('#tab5').attr('disabled', true);
	$('#tab6').attr('disabled', true);
	$("ul.tabs li").addClass('tab_disabled');
		
	document.getElementById('frmBaseTab').onload = function() {
	    loadSw = true;
	}
	
	document.getElementById('frmPrgTab').onload = function() {
	    loadSw2 = true;
	}
	
	document.getElementById('frmSvrTab').onload = function() {
	    loadSw3 = true;
	}
	
	document.getElementById('frmUsrTab').onload = function() {
	    loadSw4 = true;
	}
	
	document.getElementById('frmSvrPrgTab').onload = function() {
	    loadSw5 = true;
	}
	
	document.getElementById('frmDirTab').onload = function() {
	    loadSw6 = true;
	}
	callSysDetail();
})
//페이지 로딩 완료시 다음 진행 
function callSysDetail() {
	
   inter = setInterval(function(){
      if(loadSw) {
    	 $('#frmBaseTab').get(0).contentWindow.createViewGrid();
         clearInterval(inter);
         callProgInfo();
         loadSw = false
      }
   },100);
}

function callProgInfo() {
	inter = setInterval(function(){
      if(loadSw2) {
    	  $('#frmPrgTab').get(0).contentWindow.createViewGrid();
    	  clearInterval(inter);
    	  callSvrInfo();
          loadSw2 = false
      }
	},100);
}

function callSvrInfo() {
	inter = setInterval(function(){
      if(loadSw3) {
    	  $('#frmSvrTab').get(0).contentWindow.createViewGrid();
    	  clearInterval(inter);
    	  callSvrAcc();
          loadSw3 = false
      }
	},100);
}

function callSvrAcc() {
	inter = setInterval(function(){
      if(loadSw4) {
    	  $('#frmUsrTab').get(0).contentWindow.createViewGrid();
    	  clearInterval(inter);
    	  callSvrProg();
          loadSw4 = false
      }
	},100);
}

function callSvrProg() {
	inter = setInterval(function(){
      if(loadSw5) {
    	  $('#frmSvrPrgTab').get(0).contentWindow.createViewGrid();
    	  clearInterval(inter);
    	  callComDir();
          loadSw5 = false
      }
	},100);
}

function callComDir() {
	inter = setInterval(function(){
      if(loadSw6) {
    	  $('#frmDirTab').get(0).contentWindow.createViewGrid();
    	  clearInterval(inter);
    	  initScreen();
          loadSw6 = false
      }
	},100);
}

function initScreen() {
	
	setTabMenu();
	scrLoad();
	
	//닫기 버튼 클릭시
	$('#btnExit').bind('click',function() {
		popClose();
	});
}
function scrLoad() {
	if (selectedSystem != null) {
		$('#txtSysMsg').val('[' + selectedSystem.cm_syscd + '] ' + selectedSystem.cm_sysmsg);
		sysCd = selectedSystem.cm_syscd;
		
		$('#tab1Li').attr('disabled', false);
		$('#tab1Li').removeClass('tab_disabled');
		
		$('#tab2Li').attr('disabled', false);
		$('#tab2Li').removeClass('tab_disabled');
		
		$('#tab3Li').attr('disabled', false);
		$('#tab3Li').removeClass('tab_disabled');
		
		$('#tab4Li').attr('disabled', false);
		$('#tab4Li').removeClass('tab_disabled');
		
		$('#tab5Li').attr('disabled', false);
		$('#tab5Li').removeClass('tab_disabled');
		
		$('#tab6Li').attr('disabled', false);
		$('#tab6Li').removeClass('tab_disabled');
	} else {
		$('#txtSysMsg').val('시스템신규등록');
		
		$('#tab1Li').attr('disabled', false);
		$('#tab1Li').removeClass('tab_disabled');
	}
}
function setTabMenu(){
	$(".tab_content:first").show();
	
	$("ul.tabs li").click(function () {
		$(".tab_content").hide();
		var activeTab = $(this).attr("rel");
		$("ul.tabs li").removeClass('on');
		$(this).addClass("on");
		$("#" + activeTab + " iframe").attr('src', $("#" + activeTab + " iframe").attr('src'));
		$("#" + activeTab).fadeIn();
	});
}

function reLoad() {
	
	scrLoad();
	
	if (selectedSystem != null) {
		 $('#frmBaseTab').get(0).contentWindow.baseReload();
		 $('#frmPrgTab').get(0).contentWindow.screenLoad();
		 $('#frmSvrTab').get(0).contentWindow.screenLoad();
		 $('#frmUsrTab').get(0).contentWindow.screenLoad();
		 $('#frmSvrPrgTab').get(0).contentWindow.screenLoad();
		 $('#frmDirTab').get(0).contentWindow.screenLoad();
	}
}
function popClose() {
	window.parent.sysDetailModal.close();
}
