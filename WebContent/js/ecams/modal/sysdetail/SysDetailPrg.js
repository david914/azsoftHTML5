/**
 * 시스템상세정보 - 서버별프로그램종류정보 팝업 화면 기능 정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-07
 * 
 */

var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드
var selectedSystem  = window.parent.selectedSystem;
	
var sysCd 	= null;	// 시스템정보 선택 코드
var sysInfo = null;	// 시스템 속성
var dirBase = null; // 기준서버

var svrItemGrid = new ax5.ui.grid();
var itemGrid 	= new ax5.ui.grid();

var cboOptions		= null;
var cboSvrItemData	= null;

///////////////////  화면 세팅 start////////////////////////////////////////////////
$('[data-ax5select="cboSvrItem"]').ax5select({
    options: []
});

///////////////////  화면 세팅 end////////////////////////////////////////////////


$(document).ready(function(){
	
	sysCd = selectedSystem.cm_syscd;
	sysInfo = selectedSystem.cm_sysinfo;
	dirBase = selectedSystem.cm_dirbase;
	
	getSvrList();

	///////////////////////  버튼 event start////////////////////////////////////////////////
	
	// 등록 이벤트
	$('#btnReqItem').bin('click',function() {
		
	});
	
	// 폐기 이벤트
	$('#btnClsItem').bin('click',function() {
		
	});
	
	// 조회 이벤트
	$('#btnQryItem').bin('click',function() {
		
	});
	
	// 닫기 이벤트
	$('#btnExitItem').bin('click',function() {
		popClose();
	});
	
	///////////////////////  버튼 event end////////////////////////////////////////////////
	
	
});


///////////////////////  버튼 function start////////////////////////////////////////////////
function popClose(){
	window.parent.parent.sysDetailModal.close();
}

function getSvrList() {
	var svrListData = new Object();
	svrListData = {
		SysCd		: sysCd,
		requestType	: 'getSvrList'
	}
	ajaxAsync('/webPage/administrator/SvrPrgServlet', svrListData, 'json',successgetSvrList);
}

function getSvrList(data) {
	cboSvrItemData = data;
	cboOptions = [];
	$.each(cboSvrItemData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboSvrItem"]').ax5select({
        options: cboOptions
	});
}
/////////////////////  버튼 function end////////////////////////////////////////////////

