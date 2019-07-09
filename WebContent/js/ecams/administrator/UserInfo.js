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

var userName 	= '관리자';
var userId 		= 'MASTER';
var adminYN 	= 'Y';

var organizationModal 	= new ax5.ui.modal();	// 조직도 팝업
var rgtCdModal 			= new ax5.ui.modal();	// 사용자 직무조회 팝업
var jobCopyModal 		= new ax5.ui.modal();	// 권한복사 팝업
var initPassModal 		= new ax5.ui.modal();	// 비밀번호 초기화 팝업
var setUserJobModal 	= new ax5.ui.modal();	// 업무권한일괄등록 팝업
var allUserInfoModal 	= new ax5.ui.modal();	// 업무권한일괄등록 팝업
var allSingUpWin		= null;					// 사용자 일괄등록 새창

var userGrid	= new ax5.ui.grid();
var jobGrid		= new ax5.ui.grid();

var userGridData 	= null;
var jobGridData		= null;

var cboPositionData	= null;
var cboDutyData		= null;
var cboSysCdData	= null;

var ulDutyInfoData	= null;
var ulJobInfoData	= null;

var selDeptSw		= null;
var modiDeptSw		= false;
var subSw			= false;
var selDeptCd		= null;
var selSubDeptCd	= null;
var txtUserIdP		= null;

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
    showRowSelector: true,
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
	getSysInfo();
	getCodeInfo();
	// 사원번호
	$('#txtUserId').bind('keydown', function(event) {
		if(event.keyCode === 13) {
			getUserInfo($('#txtUserId').val().trim(), '');
		}
	});
	// 성명
	$('#txtUserName').bind('keydown', function(event) {
		if(event.keyCode === 13) {
			getUserInfo('', $('#txtUserName').val().trim());
		}
	});
	// 소속조직 클릭
	$('#txtOrg').bind('click', function() {
		selDeptSw = true;
		openOranizationModal();
	});
	// 소속(겸직)클릭
	$('#txtOrgAdd').bind('click', function() {
		selDeptSw = false;
		openOranizationModal();
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
	// 업무 전체선택
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
		deleteJob();
	});
	// 사용자직무조회
	$('#btnQryRgtCd').bind('click', function() {
		openAllRgtCd();
	});
	// 사용자일괄등록
	$('#btnSignUp').bind('click', function() {
		winOpenSignUp();
	});
	// 조직정보등록
	$('#btnDept').bind('click', function() {
		modiDeptSw = true;
		openOranizationModal();
	});
	// 권한복사
	$('#btnJobCopy').bind('click', function() {
		openJboCopyModal();
	});
	// 비밀번호 초기화
	$('#btnPassInit').bind('click', function() {
		openInitPassword();
	});
	// 업무권한 일괄등록
	$('#btnSetJob').bind('click', function() {
		openSetUserJob();
	});
	// 전체사용자조회
	$('#btnAllUser').bind('click', function() {
		getAllUserInfo();
	});
	// 저장
	$('#btnSave').bind('click', function() {
		setUserInfo();
	});
	// 폐기
	$('#btnDel').bind('click', function() {
		deleteUser();
	});
});


// 전체 사용자 조회
function getAllUserInfo() {
	allUserInfoModal.open({
        width: 1100,
        height: 600,
        iframe: {
            method: "get",
            url: "../modal/userinfo/AllUserInfoModal.jsp",
            param: "callBack=allUserInfoModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
            }
        }
    }, function () {
    });
}

var allUserInfoModalCallBack = function(){
	allUserInfoModal.close();
};

// 업무권한 일괄등록
function openSetUserJob() {
	setUserJobModal.open({
        width: 800,
        height: 800,
        iframe: {
            method: "get",
            url: "../modal/userinfo/SetUserJobModal.jsp",
            param: "callBack=setUserJobModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
                txtUserIdP = '';
            }
        }
    }, function () {
    });
}

var setUserJobModalCallBack = function(){
	setUserJobModal.close();
};

// 비밀번호 초기화
function openInitPassword() {
	txtUserIdP = $('#txtUserId').val().trim();
	initPassModal.open({
        width: 400,
        height: 200,
        iframe: {
            method: "get",
            url: "../modal/userinfo/InitPassModal.jsp",
            param: "callBack=initPassModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
                txtUserIdP = '';
            }
        }
    }, function () {
    });
}

var initPassModalCallBack = function(){
	initPassModal.close();
};

// 권한 복사
function openJboCopyModal() {
	jobCopyModal.open({
        width: 1200,
        height: 700,
        iframe: {
            method: "get",
            url: "../modal/userinfo/JobCopyModal.jsp",
            param: "callBack=jobCopyModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
            }
        }
    }, function () {
    });
}

var jobCopyModalCallBack = function(){
	jobCopyModal.close();
};


// 사용자일괄등록 새창
function winOpenSignUp() {
	var nHeight, nWidth, nTop, nLeft, cURL, cFeatures, winName;

	if (allSingUpWin != null 
			&& !allSingUpWin.closed ) {
    	allSingUpWin.close();
	}

    winName = 'allSingUp';
	nHeight = screen.height - 300;
    nWidth  = screen.width - 400;
    cURL = "../winpop/AllSignUp.jsp";
	
	nTop  = parseInt((window.screen.availHeight/2) - (nHeight/2));
	nLeft = parseInt((window.screen.availWidth/2) - (nWidth/2));
	cFeatures = "top=" + nTop + ",left=" + nLeft + ",height=" + nHeight + ",width=" + nWidth + ",help=no,menubar=no,status=yes,resizable=yes,scroll=no";

	var f = document.popPam;   		//폼 name
	allSingUpWin = window.open('',winName,cFeatures);
    
    f.userId.value	= userId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.action		= cURL; 		//이동할 페이지
    f.target		= winName;    	//폼의 타겟 지정(위의 새창을 지정함)
    f.method		= "post"; 		//POST방식
    f.submit();
}

// 사용자 직무조회 
function openAllRgtCd() {
	rgtCdModal.open({
        width: 1200,
        height: 700,
        iframe: {
            method: "get",
            url: "../modal/userinfo/RgtCdModal.jsp",
            param: "callBack=rgtCdModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
            }
        }
    }, function () {
    });
}

var rgtCdModalCallBack = function(){
	rgtCdModal.close();
};

// 소소조직 선택 창 오픈
function openOranizationModal() {
	organizationModal.open({
        width: 400,
        height: 700,
        iframe: {
            method: "get",
            url: "../modal/OrganizationModal.jsp",
            param: "callBack=modalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
                modiDeptSw = false;
            }
        }
    }, function () {
    });
}

var modalCallBack = function(){
	organizationModal.close();
};

// 사용자 정보 저장
function setUserInfo() {
	var txtUserId 	= $('#txtUserId').val().trim();
	var txtUserName = $('#txtUserName').val().trim();
	var txtIp 		= $('#txtIp').val().trim();
	var txtTel1 	= $('#txtTel1').val().trim();
	var txtTel2 	= $('#txtTel2').val().trim();
	var txtDaeGyul 	= $('#txtDaeGyul').val().trim();
	var txtBlankTerm = $('#txtBlankTerm').val().trim();
	var txtBlankSayu = $('#txtBlankSayu').val().trim();
	var txtLogin 	= $('#txtLogin').val().trim();
	var txtErrCnt 	= $('#txtErrCnt').val().trim();
	var txtOrg 		= $('#txtOrg').val().trim();
	var txtOrgAdd 	= $('#txtOrgAdd').val().trim();
	var txtEMail 	= $('#txtEMail').val().trim();
	var dutyArr		= [];
	var jobArr		= [];
	var addId		= null;
	var dataObj		= new Object();
	
	if(txtUserId.length === 0 ) {
		dialog.alert('사원번호를 입력하여 주십시오.', function(){});
		return;
	}
	if(txtUserName.length === 0 ) {
		dialog.alert('사용자명을 입력하여 주십시오.', function(){});
		return;
	}
	if(getSelectedIndex('cboPosition') < 1 ) {
		dialog.alert('직급을 선택하여 주십시오.', function(){});
		return;
	}
	if(getSelectedIndex('cboDuty') < 1 ) {
		dialog.alert('직위를 선택하여 주십시오.', function(){});
		return;
	}
	if(txtOrg.length === 0 ) {
		dialog.alert('소속조직을 선택하여 주십시오.', function(){});
		return;
	}
	if(txtTel2.length === 0 ) {
		dialog.alert('[전화번호2]에 핸드폰번호를 입력하여 주십시오.', function(){});
		return;
	}
	
	ulDutyInfoData.forEach(function(item, index) {
		addId = item.cm_micode;
		if($('#chkDuty'+addId).is(':checked')) {
			dutyArr.push(item);
		}
	});
	
	if(dutyArr.length === 0 ) { 
		dialog.alert('담당직무를 선택하여 주십시오.', function(){});
		return;
	}
	
	if(ulJobInfoData != null ) { 
		ulJobInfoData.forEach(function(item, index) {
			addId = item.cm_jobcd;
			if($('#chkJob'+addId).is(':checked')) {
				jobArr.push(item);
			}
		});
		dataObj.cm_syscd = getSelectedVal('cboSysCd').value;
	}
	
	dataObj.Txt_UserId 		= txtUserId;
    dataObj.Txt_UserName 	= txtUserName;
    dataObj.Cbo_Pos 		= getSelectedVal('cboPosition').value;
    dataObj.Cbo_Duty 		= getSelectedVal('cboDuty').value;
    dataObj.Lbl_Org00 		= selDeptCd ;
    dataObj.Lbl_Org11 		= selSubDeptCd;
    dataObj.Txt_TelNo1 		= txtTel1;
    dataObj.Txt_TelNo2 		= txtTel2;
    dataObj.active1 		= String($('#optActCheck').is(':checked'));
    dataObj.Txt_Ip 			= txtIp;
    dataObj.Chk_HandYn 		= String($('#chkHand').is(':checked'));
    dataObj.Chk_ManId2 		= String($('#chkManage').is(':checked'));
    dataObj.Chk_ManId0 		= String($('#optManCheck').is(':checked'));
    dataObj.Txt_email 		= txtEMail;
    if (txtErrCnt.length === 0) {
    	$('#txtErrCnt').val('0');
    }
    dataObj.Txt_ercount = $('#txtErrCnt').val().trim();
	
	var data = new Object();
	data = {
		dataObj 	: dataObj,
		DutyList 	: dutyArr,
		JobList 	: jobArr,
		requestType	: 'setUserInfo'
	}
	ajaxAsync('/webPage/administrator/UserInfoServlet', data, 'json',successSetUserInfo);
}

// 사용자 정보 저장 완료
function successSetUserInfo(data) {
	dialog.alert('['+ data +'] 사용자의 정보가 저장 되였습니다.', function(){
		getUserInfo($('#txtUserId').val().trim(), '');
	});
}

// 사용자 폐기
function deleteUser() {
	var txtUserId 	= $('#txtUserId').val().trim();
	if(txtUserId.length === 0 ) {
		dialog.alert('사용자번호를 입력하여 주십시오.', function(){});
		return;
	}
	
	var data = new Object();
	data = {
		UserId 		: txtUserId,
		requestType	: 'deleteUser'
	}
	ajaxAsync('/webPage/administrator/UserInfoServlet', data, 'json',successDeleteUser);
}

// 사용자 폐기 완료
function successDeleteUser(data) {
	dialog.alert('['+data + '] 사용자정보가 폐기 되었습니다.', function(){});
}

// 담당업무 삭제
function deleteJob() {
	var txtUserId 	= $('#txtUserId').val().trim();
	var selIn		= jobGrid.selectedDataIndexs;
	var selArr		= [];
	if(txtUserId.length === 0 ) {
		dialog.alert('사용자번호를 입력하여 주십시오.', function(){});
		return;
	}
	if(selIn.length === 0 ) {
		dialog.alert('삭제할 업무를 선택한 후 처리하십시오.', function(){});
		return;
	}
	
	selIn.forEach(function(item, index) {
		selArr.push(jobGrid.list[item]);
	});
	var data = new Object();
	data = {
		UserId 		: txtUserId,
		JobList 	: selArr,
		requestType	: 'deleteJob'
	}
	ajaxAsync('/webPage/administrator/UserInfoServlet', data, 'json',successDeleteJob);
	
}

// 담당업무 삭제 완료
function successDeleteJob(data) {
	if(data === 0 ) {
		dialog.alert('선택한 업무에 대한 폐기처리를 완료하였습니다.', function() {
			getUserJobList();
		});
	}
}

// 업무 그리드 선택
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
	
	selDeptCd 		= userInfo.cm_project;
	selSubDeptCd 	= userInfo.cm_project2;
	
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
	ajaxAsync('/webPage/administrator/UserInfoServlet', data, 'json', successGetSysInfo);
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