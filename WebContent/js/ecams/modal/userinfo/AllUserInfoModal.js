/**
 * [사용자정보 > 전체사용자조회] 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-26
 * 
 */


var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var userGrid			= new ax5.ui.grid();

var userGridData 	= [];
var cboTeamData		= [];


userGrid.setConfig({
    target: $('[data-ax5grid="userGrid"]'),
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
        {key: "cm_userid", 		label: "사용자번호",  		width: '8%'},
        {key: "cm_username",	label: "사용자명",  		width: '7%'},
        {key: "position", 		label: "직위",  			width: '7%'},
        {key: "duty", 			label: "직급",  			width: '7%'},
        {key: "deptname", 		label: "소속조직",  		width: '7%'},
        {key: "rgtname", 		label: "담당직무",  		width: '14%', align: 'left'},
        {key: "cm_ipaddress", 	label: "IP Address",  	width: '12%'},
        {key: "cm_telno1", 		label: "전화번호1",  		width: '12%'},
        {key: "cm_telno2", 		label: "전화번호2",  		width: '12%'},
        {key: "cm_logindt", 	label: "최종로그인",  		width: '14%'},
    ]
});

$('[data-ax5select="cboTeam"]').ax5select({
	options: []
});

$('input:radio[name^="userRadio"]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});

$(document).ready(function() {
	getTeamList();
	
	$('#cboTeam').bind('change', function() {
		$('#btnQry').trigger('click');
	});
	
	// 엑셀저장
	$('#btnExcel').bind('click', function() {
		userGrid.exportExcel('형상관리시스템전체사용자정보.xls');
	});
	// 조회
	$('#btnQry').bind('click', function() {
		getAllUserInfo();
	});
	
	// 닫기
	$('#btnExit').bind('click', function() {
		popClose();
	});
});

// 전체 사용자 조회
function getAllUserInfo() {
	var Option = '';
	if($('#optAll').is(':checked')) {
		Option = 0;
	} else if($('#optActive').is(':checked')) {
		Option = 1;
	} else if($('#optInActive').is(':checked')) {
		Option = 2;
	}
	
	var data;
	data = new Object();
	data = {
		Cbo_Team 	: getSelectedVal('cboTeam').value,
		Option		: Option,
		requestType	: 'getAllUserInfo'
	}
	ajaxAsync('/webPage/modal/userinfo/AllUserInfoServlet', data, 'json',successGetAllUserInfo);
}

// 전체 사용자 조회 완료
function successGetAllUserInfo(data) {
	userGridData = data;
	userGrid.setData(userGridData);
}

// 팀 리스트 가져오기
function getTeamList() {
	var data;
	data = new Object();
	data = {
		requestType	: 	'getTeamList'
	}
	ajaxAsync('/webPage/modal/userinfo/AllUserInfoServlet', data, 'json',successGetTeamList);
}

// 팀 리스트 가져오기 완료
function successGetTeamList(data) {
	cboTeamData = data;
	$('[data-ax5select="cboTeam"]').ax5select({
        options: injectCboDataToArr(cboTeamData, 'cm_deptcd' , 'cm_deptname')
	});
}

// 모달 닫기
function popClose() {
	window.parent.allUserInfoModal.close();
}