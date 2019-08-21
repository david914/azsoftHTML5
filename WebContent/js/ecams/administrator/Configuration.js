/**
 * 환경설정 화면 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-06-21
 */

var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드

var urlArr 			 = [];
var cboPassCycleData = [];

$('[data-ax5select="cboPassCycle"]').ax5select({
    options: []
});

$(document).ready(function(){
	$('#tab1Li').width($('#tab1Li').width()+10);
	$('#tab2Li').width($('#tab2Li').width()+10);
	$('#tab3Li').width($('#tab3Li').width()+10);
	$('#tab4Li').width($('#tab4Li').width()+10);
	$('#tab5Li').width($('#tab5Li').width()+10);
	$('#tab6Li').width($('#tab6Li').width()+10);
	setTabMenu();
	
	getCodeInfo();
	getAgentInfo();
	
	// 환경설정 등록
	$('#btnReq').bind('click', function() {
		checkConfigVal();
	});
});

// 환경 설정 등록시 유효성 검사
function checkConfigVal() {
	var objData			= new Object();
	var txtIpIn 		= $('#txtIpIn').val().trim();
	var txtPassCycle 	= $('#txtPassCycle').val().trim();
	var txtInitPass 	= $('#txtInitPass').val().trim();
	var txtLockBaseDt 	= $('#txtLockBaseDt').val().trim();
	var txtIpOut 		= $('#txtIpOut').val().trim();
	var txtPassLimit 	= $('#txtPassLimit').val().trim();
	var txtAdminPass 	= $('#txtAdminPass').val().trim();
	var txtLoginHis 	= $('#txtLoginHis').val().trim();
	var txtPort 		= $('#txtPort').val().trim();
	var txtPassNum 		= $('#txtPassNum').val().trim();
	var txtSpc 			= $('#txtSpc').val().trim();
	var txtProcTot 		= $('#txtProcTot').val().trim();
	
	if(txtIpIn.length === 0 ) {
		dialog.alert('서버 IP Address(내부망)를 입력하여 주십시오.', function() {});
		return;
	}
	
	if(txtPassCycle.length === 0) {
		dialog.alert('변경주기를 입력하여 주십시오.', function() {});
		return;
	}
	
	if(txtPassCycle === '0') {
		dialog.alert('변경주기를 0 이외의 숫자로 입력하여 주십시오.', function() {});
		return;
	}
	
	if(getSelectedIndex('cboPassCycle') < 1) {
		dialog.alert('변경주기구분을 선택하여 주십시오.', function() {});
		return;
	}
	
	if (txtInitPass.length === 0){
		dialog.alert('초기비밀번호를 입력하여 주십시오', function() {});
		return;
	}
	
	if (txtLockBaseDt.length === 0){
		dialog.alert('미사용ID잠금기준일을 입력하여 주십시오.', function() {});
		return;
	}
	
	if(txtLockBaseDt === '0') {
		dialog.alert('미사용ID잠금기준일을 0 이외의 숫자로 입력하여 주십시오.', function() {});
		return;
	}
	
	if(txtIpOut.length === 0 ) {
		dialog.alert('서버 IP Address(외부망)를 입력하여 주십시오.', function() {});
		return;
	}
	
	if (txtPassLimit.length === 0){
		dialog.alert('비밀번호입력제한횟수를 입력하여 주십시오.', function() {});
		return;
	}
	
	if(txtPassLimit === '0') {
		dialog.alert('비밀번호입력제한횟수를 0 이외의 숫자로 입력하여 주십시오.', function() {});
		return;
	}
	

	if (txtAdminPass.length === 0){
		dialog.alert('관리자비밀번호를 입력하여 주십시오.', function() {});
		return;
	}
	
	
	if (txtLoginHis.length === 0){
		dialog.alert('로그인이력보관기간을  입력하여 주십시오.', function() {});
		return;
	}
	
	if(txtLoginHis === '0') {
		dialog.alert('로그인이력보관기간을 0 이외의 숫자로 입력하여 주십시오.', function() {});
		return;
	}
	
	
	if(txtPort.length === 0 ) {
		dialog.alert('서버 Port 를 입력하여 주십시오.', function() {});
		return;
	}
	
	if (txtPassNum.length === 0){
		dialog.alert('이전비밀번호보관횟수를 입력하여 주십시오.', function() {});
		return;
	}
	
	if(txtPassNum === '0') {
		dialog.alert('이전비밀번호보관횟수를 0 이외의 숫자로 입력하여 주십시오.', function() {});
		return;
	}
	
	if (txtProcTot.length === 0){
		dialog.alert('프로세스 총갯수를 숫자로 정확하게 입력하여 주십시오.', function() {});
		return;
	}
	
	if(txtProcTot === '0') {
		dialog.alert('프로세스 총갯수를 0 이외의 숫자로 입력하여 주십시오.', function() {});
		return;
	}

	objData.cm_ipaddr 	= txtIpIn;
	objData.cm_pwdterm 	= txtPassCycle;
	objData.cm_initpwd 	= txtInitPass;
	objData.cm_lockbasedt = txtLockBaseDt;
	objData.cm_ipaddr2 	= txtIpOut;
	objData.cm_pwdcnt  	= txtPassLimit;
	objData.cm_passwd 	= txtAdminPass;
	objData.cm_loghisp  = txtLoginHis;
	objData.cm_port 	= txtPort;
	objData.cm_pwdnum  	= txtPassNum;
	objData.cm_noname 	= txtSpc;
	objData.cm_proctot 	= txtProcTot;
	
	objData.cm_pwdcd  = getSelectedVal('cboPassCycle').value;
	
	var data = new Object();
	data = {
		objData 	: objData,
		requestType	: 'setAgentInfo'
	}
	ajaxAsync('/webPage/administrator/Configuration', data, 'json',successSetAgentInfo);
}

// 환경설증 등록 완료
function successSetAgentInfo(data) {
	if(data.retval !== '0') {
		dialog.alert(data.retmsg, function(){});
	} else {
		dialog.alert('환경설정 등록이 완료 되었습니다.', function(){
			getAgentInfo();
		});
	}
}

// 환경설정 정보 가져오기
function getAgentInfo() {
	var data = new Object();
	data = {
		requestType	: 'getAgentInfo'
	}
	ajaxAsync('/webPage/administrator/Configuration', data, 'json',successGetAgentInfo);
}

// 환경설정 정보 가져오기 완료
function successGetAgentInfo(data) {
	$('#txtIpIn').val(data.cm_ipaddr);
	$('#txtPassCycle').val(data.cm_pwdterm);
	$('#txtInitPass').val(data.cm_initpwd);
	$('#txtLockBaseDt').val(data.cm_lockbasedt);
	$('#txtIpOut').val(data.cm_ipaddr2);
	$('#txtPassLimit').val(data.cm_pwdcnt);
	$('#txtAdminPass').val(data.cm_passwd);
	$('#txtLoginHis').val(data.cm_loghisp);
	$('#txtPort').val(data.cm_port);
	$('#txtPassNum').val(data.cm_pwdnum);
	$('#txtSpc').val(data.cm_noname);
	$('#txtProcTot').val(data.cm_proctot);
	
	if(data.hasOwnProperty('cm_pwdcd')) {
		$('[data-ax5select="cboPassCycle"]').ax5select('setValue', data.cm_pwdcd, true);
	}
}

function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('DBTERM','SEL','N'),
		]);
	cboPassCycleData 	= codeInfos.DBTERM;
	
	$('[data-ax5select="cboPassCycle"]').ax5select({
        options: injectCboDataToArr(cboPassCycleData, 'cm_micode' , 'cm_codename')
	});
};

// 탭 메뉴 셋
function setTabMenu(){
	$(".tab_content:first").show();
	
	$("ul.tabUl li").click(function () {
		$(".tab_content").css('display','none');
		var activeTab = $(this).attr("rel");
		$("ul.tabUl li").removeClass('on');
		$(this).addClass("on");
		$('#'+activeTab).css('display','block');
	});
}