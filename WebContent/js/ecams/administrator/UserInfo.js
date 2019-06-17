/**
 * 사용자정보 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-21
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var userGrid	= new ax5.ui.grid();
var jobGrid		= new ax5.ui.grid();

var userGridData 	= null;
var jobGridData		= null;

var cboPositionData	= null;
var cboDutyData		= null;
var cboSysCdData	= null;

var ulDutyInfoData	= null;
var ulJobInfoData	= null;

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
        	this.self.clearSelect();
            this.self.select(this.dindex);
            clickUserGrid(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_userid", 	label: "사번",  		width: 80},
        {key: "cm_username",label: "성명",  		width: 80},
        {key: "deptname1", 	label: "부서",  		width: 80},
    ]
});
jobGrid.setConfig({
    target: $('[data-ax5grid="jobGrid"]'),
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
        	this.self.clearSelect();
            this.self.select(this.dindex);
            clickEditGrid(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "jobgrp", 	label: "시스템",  			width: 200 },
        {key: "job", 		label: "업무명 (업무코드)",  	width: 200 },
    ]
});

$('[data-ax5select="cboPosition"]').ax5select({
    options: []
});

$('[data-ax5select="cboDuty"]').ax5select({
    options: []
});

$('[data-ax5select="cboSysCd"]').ax5select({
	options: []
});

$('input:radio[name^="userRadio"]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});
$('input.checkbox-user').wCheck({theme: 'square-classic red', selector: 'checkmark', highlightLabel: true});

$(document).ready(function() {
	getCodeInfo();
	getSysInfo();
	
	$('#txtUserId').bind('keydown', function(event) {
		if(event.keyCode === 13) {
			getUserInfo($('#txtUserId').val().trim(), '');
		}
	});
	
	$('#txtUserName').bind('keydown', function(event) {
		if(event.keyCode === 13) {
			getUserInfo('', $('#txtUserName').val().trim());
		}
	});
	
	// 직급
	$('#cboPosition').bind('change', function() {
		
		
	});
	// 직위
	$('#cboDuty').bind('change', function() {
		
	});
	// 시스템
	$('#cboSysCd').bind('change', function() {
		if(getSelectedIndex('cboSysCd') < 1) {
			return;
		}
		var data = new Object();
		data = {
			UserID 		: userId,
			SysCd 		: getSelectedVal('cboSysCd').value,
			SecuYn 		: 'N',
			CloseYn 	: 'N',
			SelMsg 		: '',
			sortCd 		: 'CD',
			requestType	: 'getJobInfo'
		}
		ajaxAsync('/webPage/administrator/UserInfoServlet', data, 'json',successGetJobInfo);
		
	});
	
	$('#chkAllJob').bind('click', function() {
		var checkSw = $('#chkAllJob').is(':checked');
		var addId = null;
		ulJobInfoData.forEach(function(item, index) {
			addId = item.cm_jobcd;
			if(checkSw) {
				$('#chkJob'+addId).wCheck('check', true);
			} else {
				$('#chkJob'+addId).wCheck('check', false);
			}
		})
	});
	
	// 담당업무 삭제
	$('#btnDelJob').bind('click', function() {
		
	});
	// 사용자직무조회
	$('#btnQryRgtCd').bind('click', function() {
		
	});
	// 사용자일괄등록
	$('#btnSignUp').bind('click', function() {
		
	});
	// 조직정보등록
	$('#btnDept').bind('click', function() {
		
	});
	// 권한복사
	$('#btnJobCopy').bind('click', function() {
		
	});
	// 비밀번호 초기화
	$('#btnPassInit').bind('click', function() {
		
	});
	// 업무권한 일괄등록
	$('#btnSetJob').bind('click', function() {
		
	});
	// 전체사용자조회
	$('#btnAllUser').bind('click', function() {
		
	});
	// 저장
	$('#btnSave').bind('click', function() {
		
	});
	// 폐기
	$('#btnDel').bind('click', function() {
		
	});
	
});

function clickUserGrid(index) {
	var selItem = userGrid.list[index];
	getUserInfo(selItem.cm_userid, '');
}

// 사용자 정보가져오기
function getUserInfo(id, name) {
	$('#txtIp').val('');
	$('#txtTel1').val('');
	$('#txtTel2').val('');
	$('#txtDaeGyul').val('');
	$('#txtBlankTerm').val('');
	$('#txtBlankSayu').val('');
	$('#txtLogin').val('');
	$('#txtErrCnt').val('');
	$('#txtOrg').val('');
	$('#txtOrgAdd').val('');
	$('#txtEMail').val('');
	
	$('#chkManage').wCheck('check', false);
	$('#chkHand').wCheck('check', false);
	
	$('#optManCheck').prop('checked',false);
	$('#optOutCheck').wCheck('check', false);
	$('#optActCheck').wCheck('check', false);
	$('#optDiCheck').wCheck('check', false);
	
	var addId = null;
	ulDutyInfoData.forEach(function(item, index) {
		addId = item.cm_micode;
		$('#chkDuty'+addId).wCheck('check', false);
	});
	
	ulJobInfoData = null;
	$('#ulJobInfo').empty();
	
	var data = new Object();
	data = {
		userId 		: id,
		userName 	: name,
		requestType	: 'getUserInfo'
	}
	ajaxAsync('/webPage/administrator/UserInfoServlet', data, 'json',successGetUserInfo);
}

// 사용자 정보가져오기 완료
function successGetUserInfo(data) {
	var userInfo = data[0];
	
	if(userInfo.ID === 'ERROR') {
		dialog.alert('등록되지 않은 사용자입니다.', function() {});
		return;
	}
	
	if(data.length > 1) {
		userGridData = data;
		userGrid.setData(userGridData);
	} else {
		userGridData = [];
		userGrid.setData(userGridData);
	}
	
	$('#txtUserId').val(userInfo.cm_userid);
	$('#txtUserName').val(userInfo.cm_username);
	$('#txtIp').val(userInfo.cm_ipaddress);
	$('#txtTel1').val(userInfo.cm_telno1);
	$('#txtTel2').val(userInfo.cm_telno2);
	$('#txtDaeGyul').val(userInfo.Txt_DaeGyul);
	$('#txtBlankTerm').val(userInfo.Txt_BlankTerm);
	$('#txtBlankSayu').val(userInfo.Txt_BlankSayu);
	$('#txtLogin').val(userInfo.cm_logindt);
	$('#txtErrCnt').val(userInfo.cm_ercount);
	$('#txtOrg').val(userInfo.deptname1);
	$('#txtOrgAdd').val(userInfo.deptname2);
	$('#txtEMail').val(userInfo.cm_email);
	
	
	$('[data-ax5select="cboPosition"]').ax5select('setValue', userInfo.cm_position, true);
	$('[data-ax5select="cboDuty"]').ax5select('setValue', userInfo.cm_duty, true);
	
	if(userInfo.cm_manid === 'Y') {
		$('#optManCheck').wRadio('check', true);
	} else {
		$('#optOutCheck').wRadio('check', true);
	}
	
	if(userInfo.cm_admin === '1') {
		$('#chkManage').wCheck('check', true);
	} else {
		$('#chkManage').wCheck('check', false);
	}
	
	if(userInfo.cm_handrun === 'Y') {
		$('#chkHand').wCheck('check', true);
	} else {
		$('#chkHand').wCheck('check', false);
	}
	
	if(userInfo.cm_active === '1') {
		$('#optActCheck').wRadio('check', true);
	} else {
		$('#optDiCheck').wRadio('check', false);
	}
	
	getUserRgtCd();
}

// 사용자 권한 가져오기
function getUserRgtCd() {
	var data = new Object();
	data = {
		UserId 		: $('#txtUserId').val().trim(),
		requestType	: 'getUserRgtCd'
	}
	ajaxAsync('/webPage/administrator/UserInfoServlet', data, 'json',successGetUserRgtCd);
}

// 사용자 권한 가져오기 완료
function successGetUserRgtCd(data) {
	ulDutyInfoData = data;
	makeDutyInfoUlList();
	
	getUserJobList();
	getUserRgtDept();
}

// 사용자 업무 리스트 가져오기
function getUserJobList() {
	var data = new Object();
	data = {
		gbnCd 		: 'USER',
		UserId 		: $('#txtUserId').val().trim(),
		requestType	: 'getUserJobList'
	}
	ajaxAsync('/webPage/administrator/UserInfoServlet', data, 'json',successGetUserJobList);
}

function successGetUserJobList(data) {
	jobGridData = data;
	jobGrid.setData(jobGridData);
}

function getUserRgtDept() {
	var data = new Object();
	data = {
		UserId 		: $('#txtUserId').val().trim(),
		requestType	: 'getUserRgtDept'
	}
	ajaxAsync('/webPage/administrator/UserInfoServlet', data, 'json',successGetUserRgtDept);
}

function successGetUserRgtDept(data) {
}

// 시스템목록 가져오기
function getSysInfo() {
	var data = new Object();
	data = {
		UserId 		: userId,
		SecuYn 		: 'N',
		SelMsg 		: 'SEL',
		CloseYn 	: 'N',
		ReqCd 		: '',
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/administrator/UserInfoServlet', data, 'json',successGetSysInfo);
}

function successGetJobInfo(data) {
	ulJobInfoData = data;
	makeJobInfoUlList();
}

// 시스템목록 가져오기 완료
function successGetSysInfo(data) {
	cboSysCdData = data;
	$('[data-ax5select="cboSysCd"]').ax5select({
        options: injectCboDataToArr(cboSysCdData, 'cm_syscd' , 'cm_sysmsg')
	});
}

//등록구분 가져오기
function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('POSITION','SEL','N'),
		new CodeInfo('DUTY',	'SEL','N'),
		new CodeInfo('RGTCD',	'','N')
		]);
	cboPositionData 	= codeInfos.POSITION;
	cboDutyData 		= codeInfos.DUTY;
	ulDutyInfoData 		= codeInfos.RGTCD;
	
	$('[data-ax5select="cboPosition"]').ax5select({
        options: injectCboDataToArr(cboPositionData, 'cm_micode' , 'cm_codename')
	});
	
	$('[data-ax5select="cboDuty"]').ax5select({
        options: injectCboDataToArr(cboDutyData, 'cm_micode' , 'cm_codename')
	});
	makeDutyInfoUlList();
};

// 담당직무 리스트
function makeDutyInfoUlList() {
	$('#ulDutyInfo').empty();
	var liStr = null;
	var addId = null;
	ulDutyInfoData.forEach(function(item, index) {
		addId = item.cm_micode;
		liStr  = '';
		liStr += '<li class="list-group-item">';
		if(item.checkbox !== undefined && item.checkbox === 'true') {
			liStr += '	<input type="checkbox" class="checkbox-duty" id="chkDuty'+addId+'" data-label="'+item.cm_codename+'"  value="'+addId+'" checked="checked"/>';
		} else {
			liStr += '	<input type="checkbox" class="checkbox-duty" id="chkDuty'+addId+'" data-label="'+item.cm_codename+'"  value="'+addId+'" />';
		}
		liStr += '</li>';
		$('#ulDutyInfo').append(liStr);
		
		
	});
	
	$('input.checkbox-duty').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

}

//업무 리스트
function makeJobInfoUlList() {
	$('#ulJobInfo').empty();
	var liStr = null;
	var addId = null;
	ulJobInfoData.forEach(function(item, index) {
		addId = item.cm_jobcd;
		liStr  = '';
		liStr += '<li class="list-group-item">';
		liStr += '	<input type="checkbox" class="checkbox-job" id="chkJob'+addId+'" data-label="'+item.cm_jobname+'"  value="'+addId+'" />';
		liStr += '</li>';
		$('#ulJobInfo').append(liStr);
	});
	
	$('input.checkbox-job').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
	
}