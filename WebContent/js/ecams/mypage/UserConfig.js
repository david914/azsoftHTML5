/**
 * 사용자환경설정 화면의 기능 정의
 * 
 * <pre>
 * 	작성자	:	이용문
 * 	버전		:	1.0
 *  수정일 	: 	2019-08-19
 * 
 */

var userName 	= window.top.userName;		// 접속자 Name
var userId 		= window.top.userId;		// 접속자 ID
var adminYN 	= window.top.adminYN;		// 관리자여부
var userDeptName= window.top.userDeptName;	// 부서명
var userDeptCd 	= window.top.userDeptCd;	// 부서코드

var userConfigGrid		= new ax5.ui.grid();

var userConfigGridData 	= [];
var cboSysCdData		= [];


userConfigGrid.setConfig({
    target: $('[data-ax5grid="userConfigGrid"]'),
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
            clickUserConfigGrid(this.dindex);
        },
        onDBLClick: function () {},
        trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_sysmsg", 		label: "시스템",  		width: '30%', align: "left"},
        {key: "cd_devhome",		label: "개발 Home 경로",  	width: '35%', align: "left"},
        {key: "cd_agentdir", 	label: "Agent설치경로",  	width: '35%', align: "left"},
    ]
});

$('[data-ax5select="cboSysCdData"]').ax5select({
	options: []
});

$(document).ready(function() { //완료
	
	getSysInfo();
	getUserConfigList();
	
	// 등록 클릭 이벤트
	$('#btnReq').bind('click', function() {
		insertUserConfig();
	});
	
	// 삭제 클릭 이벤트
	$('#btnDel').bind('click', function() {
		deleteUserConfig();
	});
	
	// 시스템 변경 이벤트
	$('#cboSysCd').bind('change', function() {
		$('#txtAgentDir').val('');
		$('#txtDevDir').val('');
		
		if(getSelectedIndex('cboSysCd') < 1) {
			return;
		}
		
		var selSysCd = getSelectedVal('cboSysCd').cm_syscd;
		for(var i = 0; i < userConfigGridData.length; i++) {
			if(userConfigGridData[i].cd_syscd === selSysCd) {
				$('#txtAgentDir').val(userConfigGridData[i].cd_agentdir);
				$('#txtDevDir').val(userConfigGridData[i].cd_devhome);
				break;
			}
		}
	});
})

// 사용자 환경설정 그리드 클릭
function clickUserConfigGrid(selIndex) {
	var selItem = userConfigGrid.list[selIndex];
	var findSw	= false;
	
	$('#txtAgentDir').val(selItem.cd_agentdir);
	$('#txtDevDir').val(selItem.cd_devhome);
	
	// 시스템콤보에 해당 시스템 값 있으면 세팅
	for(var i = 0; i < cboSysCdData.length; i++) {
		if(cboSysCdData[i].cm_syscd === selItem.cd_syscd) {
			findSw = true;
			$('[data-ax5select="cboSysCd"]').ax5select('setValue', selItem.cd_syscd, true);findSw
			break;
		}
	}
	
	// 콤보에 값 없으면 선택하세요 선택
	if(!findSw) {
		$('[data-ax5select="cboSysCd"]').ax5select('setValue', '00000', true);findSw
	}
}

// 사용자환경설정 삭제
function deleteUserConfig() {
	var delList = [];
	delList = userConfigGrid.getList("selected");
	
	if(delList.length === 0 ) {
		dialog.alert('삭제 할 항목을 선택 후 눌러주시기 바랍니다.', function() {});
		return;
	}
	
	var data = new Object();
	data = {
		userId 		: userId,
		delList 	: delList,
		requestType	: 'deleteUserConfig'
	}
	ajaxAsync('/webPage/mypage/UserConfig', data, 'json',successDeleteUserConfig);
}

// 사용자환경설정 삭제 완료
function successDeleteUserConfig(data) {
	if(data > 0 ) {
		dialog.alert('선택한 Home 경로가 삭제되었습니다.', function() {
			getUserConfigList();
		});
	}
}

// 사용자환경설정 등록
function insertUserConfig() {
	var agentDir 	= $('#txtAgentDir').val().trim();
	var devDir 		= $('#txtDevDir').val().trim();
	
	
	if(getSelectedIndex('cboSysCd') < 1) {
		dialog.alert('시스템을 선택 한 후 등록 해 주시기 바랍니다.', function() {});
		return;
	}
	
	if(devDir.length === 0) {
		dialog.alert('개발 Home 경로를 입력 한 후 등록 해 주시기 바랍니다.' , function() {});
		return;
	}
	
	var data = new Object();
	data = {
		userId 		: userId,
		sysCd 		: getSelectedVal('cboSysCd').cm_syscd,
		devDir 		: devDir,
		agentDir 	: agentDir,
		requestType	: 'insertUserConfig'
	}
	ajaxAsync('/webPage/mypage/UserConfig', data, 'json',successInsertUserConfig);
}

// 사용자 환경설정 등록 완료
function successInsertUserConfig(data) {
	if(data > 0 ) {
		dialog.alert('개발 Home 경로가 등록 되었습니다.', function() {
			getUserConfigList();
		});
	}
}

// 사용자 환경설정 리스트 가져오기
function getUserConfigList() {
	var data = new Object();
	data = {
		 userId 	: userId,
		requestType	: 'getUserConfigList'
	}
	ajaxAsync('/webPage/mypage/UserConfig', data, 'json',successGetUserConfigList);
}

// 사용자 환경설정 리스트 가져오기 완료
function successGetUserConfigList(data) {
	userConfigGridData = data;
	userConfigGrid.setData(userConfigGridData);
}

// 시스템 정보 가져오기
function getSysInfo() {
	var data = new Object();
	data = {
		UserId 	: userId,
		secuYn 	: adminYN ? 'N' : 'Y',
		SelMsg 	: 'SEL',
		CloseYn : 'N',
		ReqCd 	: '',
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/mypage/UserConfig', data, 'json',successGetSysInfo);
}

// 시스템 정보 가져오기 완료
function successGetSysInfo(data) {
	cboSysCdData = data;
	cboSysCdData = cboSysCdData.filter(function(data) {
		if (data.localyn === 'A' || data.localyn === 'L' || data.cm_syscd === '00000')
			return true;
		else
			return false;
	});
	
	$('[data-ax5select="cboSysCd"]').ax5select({
      options: injectCboDataToArr(cboSysCdData, 'cm_syscd' , 'cm_sysmsg')
	});
}
