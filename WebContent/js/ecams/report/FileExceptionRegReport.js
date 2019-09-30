/**
 * 파일대사결과조회 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-07-03
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var fileGrid		= new ax5.ui.grid();

var fileGridData 	= [];
var cboDeployData	= [];
var cboSysData		= [];
var cboPrgDivData	= [];
var cboDirData		= [];
var cboSayuData		= [];
var cboJobData		= [];

fileGrid.setConfig({
    target: $('[data-ax5grid="fileGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
    },
    body: {
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            clickFileGrid(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {
    		if(this.item.cd_clsdate !== undefined){
    			return "fontStyle-cncl";
     		} 
    	},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "scmgubun", 	 	label: "적용구분",  	width: '5%',  align: "left"},
        {key: "cm_sysmsg",	 	label: "시스템",  	width: '10%', align: "left"},
        /*{key: "cm_jobname", 	label: "업무",  		width: '10%', align: "left"},*/
        {key: "cm_dirpath", 	label: "프로그램경로", width: '20%', align: "left"},
        {key: "cm_codename",  	label: "프로그램종류", width: '10%', align: "left"},
        {key: "cd_rsrcname", 	label: "프로그램명",   width: '8%',  align: "left"},
        {key: "cd_opendate", 	label: "최초등록일",  	width: '8%'},
        {key: "cd_lastdate", 	label: "최종등록일",  	width: '8%'},
        {key: "editor",  		label: "등록자",  	width: '5%'},
        {key: "cd_clsdate",  	label: "삭제일",  	width: '6%'},
        {key: "clseditor",  	label: "삭제자",  	width: '6%'},
        {key: "diffre",  		label: "사유구분",  	width: '6%',  align: "left"},
        {key: "cd_reqdoc",  	label: "등록사유",  	width: '8%',  align: "left"},
    ]
});


$('[data-ax5select="cboDeploy"]').ax5select({
    options: []
});
$('[data-ax5select="cboSys"]').ax5select({
	options: []
});
$('[data-ax5select="cboPrgDiv"]').ax5select({
	options: []
});
$('[data-ax5select="cboDir"]').ax5select({
	options: []
});
$('[data-ax5select="cboSayu"]').ax5select({
	options: []
});


$(document).ready(function() {
	$('#txtDir').css('display', 'none');
	getCodeInfo();
	getSysInfo();
	
	// 시스템 콤보 변경
	$('#cboSys').bind('change', function() {
		if(getSelectedIndex('cboSys') < 1) {
			$('#txtPrgName').val('');
			$('#txtDir').val('');
			$('#txtSayu').val('');
			return;
		}
		getJobInfo();
	});
	// 프로그램종류 콤보 변경
	$('#cboPrgDiv').bind('change', function() {
		getDirInfo();
	});
	// 적용구분 콤보 변경
	$('#cboDeploy').bind('change', function() {
		if(getSelectedIndex('cboDeploy') === 0  ) {
			$('#cboDir').css('display', 'block');
			$('#txtDir').css('display', 'none');
		}  else {
			$('#cboDir').css('display', 'none');
			$('#txtDir').css('display', 'block');
		}
	});
	
	// 조회 클릭
	$('#btnQry').bind('click' , function() {
		getResult();
	});
	// 삭제 클릭
	$('#btnDel').bind('click' , function() {
		delData();
	});
	// 등록 클릭
	$('#btnReq').bind('click' , function() {
		insertData();
	});
	// 엑셀저장
	$('#btnExcel').bind('click', function() {
		fileGrid.exportExcel('파일대사예외등록현황.xls');
	});
});

// 예외 삭제
function delData() {
	var txtPrgName 	= $('#txtPrgName').val().trim();
	var txtDir 		= $('#txtDir').val().trim();
	var txtSayu 	= $('#txtSayu').val().trim();
	
	if(txtPrgName.length === 0 ) {
		dialog.alert('프로그램명를 입력해주세요.', function() {});
		return;
	}
	if(getSelectedIndex('cboSys') < 1) {
		dialog.alert('시스템을 선택해주세요.', function() {});
		return;
	}
	if(txtSayu.length === 0 ) {
		dialog.alert('등록사유를 입려해주세요.', function() {});
		return;
	}
	
	var data = new Object();
	data = {
		gubun 		: getSelectedVal('cboDeploy').value,
		syscd 		: getSelectedVal('cboSys').value,
		dirpath 	: getSelectedIndex('cboDeploy') === 0 ? getSelectedVal('cboDir').value : txtDir,
		pgmname 	: txtPrgName,
		txtsayu 	: txtSayu,
		strUserId 	: userId,
		requestType	: 'delData'
	}
	ajaxAsync('/webPage/report/FileExceptionRegReport', data, 'json',successDelData);
}

// 예외 삭제 완료
function successDelData(data) {
	if(data === '1' || data === '3') {
		dialog.alert('등록되지않은 프로그램명입니다.', function() {});
		return;
	}
	if(data === '0' || data === '2') {
		dialog.alert('프로그램이 삭제되었습니다.', function() {});
	} 

	$('#btnQry').trigger('click');
}

// 예외 등록
function insertData() {
	var txtPrgName 	= $('#txtPrgName').val().trim();
	var txtDir 		= $('#txtDir').val().trim();
	var txtSayu 	= $('#txtSayu').val().trim();
	
	if(txtPrgName.length === 0 ) {
		dialog.alert('프로그램명를 입력해주세요.', function() {});
		return;
	}
	if(getSelectedIndex('cboSys') < 1) {
		dialog.alert('시스템을 선택해주세요.', function() {});
		return;
	}
	if(getSelectedIndex('cboPrgDiv') < 1) {
		dialog.alert('프로그램종류를 선택해주세요.', function() {});
		return;
	}
	if(getSelectedIndex('cboDeploy') === 1 && txtDir.length === 0) {
		dialog.alert('프로그램경로를 입력해주세요.', function() {});
		return;
	}
	if(getSelectedIndex('cboDeploy') === 0 && cboDirData.length === 0 ) {
		dialog.alert('프로그램 경로가 존재하지 않습니다. 확인해 주세요.', function() {});
		return;
	}
	if(getSelectedIndex('cboSayu') < 1) {
		dialog.alert('사유구분을 선택해주세요.', function() {});
		return;
	}
	if(txtSayu.length === 0 ) {
		dialog.alert('등록사유를 입려해주세요.', function() {});
		return;
	}
	
	var data = new Object();
	data = {
		gubun 		: getSelectedVal('cboDeploy').value,
		syscd 		: getSelectedVal('cboSys').value,
		jobcd 		: getSelectedVal('cboSys').value,
		rsrccd 		: getSelectedVal('cboPrgDiv').value,
		dirpath 	: getSelectedIndex('cboDeploy') === 0 ? getSelectedVal('cboDir').value : txtDir,
		sayu 		: getSelectedVal('cboSayu').value,
		pgmname 	: txtPrgName,
		txtsayu 	: txtSayu,
		strUserId 	: userId,
		requestType	: 'insertData'
	}
	ajaxAsync('/webPage/report/FileExceptionRegReport', data, 'json',successInsertData);
}
// 예외등록 완료
function successInsertData(data) {
	if(data === '1') {
		dialog.alert('등록되지않은 프로그램명입니다.', function() {});
		return;
	}
	if(data === '0') {
		dialog.alert('프로그램이 변경되었습니다.', function() {});
	} 

	if(data === '2') {
		dialog.alert('프로그램이 추가되었습니다.', function() {});
	}
	$('#btnQry').trigger('click');
}

// 예외등록 리스트 가져오기
function getResult() {
	var data = new Object();
	data = {
		strSys 		: getSelectedVal('cboSys').value,
		prgType 	: getSelectedVal('cboPrgDiv') == null ? "" : getSelectedVal('cboPrgDiv').cm_codename == "전체" ? "" : getSelectedVal('cboPrgDiv').cm_codename,
		prgName		: $("#txtPrgName").val(),
		requestType	: 'getResult'
	}
	ajaxAsync('/webPage/report/FileExceptionRegReport', data, 'json',successGetResult);
}

// 예외등록 리스트 가져오기 완료
function successGetResult(data) {
	fileGridData = data;
	fileGrid.setData(fileGridData);
}

// 디렉토리 콤보 가져오기
function getDirInfo() {
	var data = new Object();
	data = {
		syscd 	: getSelectedVal('cboSys').value,
		jobcd 	: cboJobData[0].cm_jobcd,
		rsrccd 	: getSelectedVal('cboPrgDiv').value,
		admin 	: adminYN === 'Y' ? '1' : '0',
		strId 	: userId,
		requestType	: 'getDirInfo'
	}
	ajaxAsync('/webPage/report/FileExceptionRegReport', data, 'json',successGetDirInfo);
}

// 디렉토리 콤보 가져오기 완료
function successGetDirInfo(data) {
	cboDirData = data;
	$('[data-ax5select="cboDir"]').ax5select({
		options: injectCboDataToArr(cboDirData, 'cm_dsncd' , 'cm_dirpath')
	});
	
	// 선택된 그리드 있다면 해당 선택된 아이템의 프로그램 경로 세팅
	var selIn = fileGrid.selectedDataIndexs;
	var selItem = null;
	if(selIn.length > 0) {
		selItem = fileGrid.list[selIn];
		if(selItem.cd_gubun === '1') {
			$('[data-ax5select="cboDir"]').ax5select('setValue', selItem.cd_dsncd, true);
		}
	}
}

// 프로그램 종류 콤보 가져오기
function getRsrcInfo() {
	var sysCd = getSelectedIndex('cboSys') > 0 ? getSelectedVal('cboSys').value : null;
	var data = new Object();
	data = {
		syscd 	: sysCd,
		requestType	: 'getRsrcInfo'
	}
	ajaxAsync('/webPage/report/FileExceptionRegReport', data, 'json',successGetRsrcInfo);
}
// 프로그램 종류 콤보 가져오기 완료
function successGetRsrcInfo(data) {
	cboPrgDivData = data;
	$('[data-ax5select="cboPrgDiv"]').ax5select({
		options: injectCboDataToArr(cboPrgDivData, 'cm_micode' , 'cm_codename')
	});
	
	// 선택된 그리드 있다면 해당 선택된 아이템의 프로그램 종류 세팅
	var selIn = fileGrid.selectedDataIndexs;
	var selItem = null;
	if(selIn.length > 0) {
		selItem = fileGrid.list[selIn];
		$('[data-ax5select="cboPrgDiv"]').ax5select('setValue', selItem.cd_rsrccd, true);
	}
	
	$('#cboPrgDiv').trigger('change');
}

// 업무 콤보 가져오기
function getJobInfo() {
	var sysCd = getSelectedIndex('cboSys') > 0 ? getSelectedVal('cboSys').value : null;
	var data = new Object();
	data = {
		UserID 	: userId,
		SysCd 	: sysCd,
		SecuYn 	: 'Y',
		CloseYn : 'N',
		SelMsg 	: 'ALL',
		sortCd 	: 'NAME',
		requestType	: 'getJobInfo'
	}
	ajaxAsync('/webPage/report/FileExceptionRegReport', data, 'json',successGetJobInfo,getRsrcInfo);
}
// 업무  콤보 가져오기 완료
function successGetJobInfo(data) {
	cboJobData = data;
}

// 시스템 정보 가져오기
function getSysInfo() {
	var data = new Object();
	data = {
		UserId 	: userId,
		SecuYn 	: 'Y',
		SelMsg 	: 'ALL',
		CloseYn : 'N',
		ReqCd 	: '',
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/report/FileExceptionRegReport', data, 'json',successGetSysInfo);
}

// 시스템 정보 가져오기 완료
function successGetSysInfo(data) {
	cboSysData = data;
	cboSysData = cboSysData.filter(function(data) {
		if(data.cm_sysinfo.substr(0,1) === '1') return false;
		else return true;
	});
	
	$('[data-ax5select="cboSys"]').ax5select({
		options: injectCboDataToArr(cboSysData, 'cm_syscd' , 'cm_sysmsg')
	});
	
	$('#cboSys').trigger('change');
	$('#btnQry').trigger('click');
}

//불일치 발생사유 가져오기
function getCodeInfo() {
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('CMD0028','','N'),
		new CodeInfo('DIFFREJECT','SEL','N'),
		]);
	cboDeployData = codeInfos.CMD0028;
	cboSayuData = codeInfos.DIFFREJECT;
	
	$('[data-ax5select="cboDeploy"]').ax5select({
		options: injectCboDataToArr(cboDeployData, 'cm_micode' , 'cm_codename')
	});
	$('[data-ax5select="cboSayu"]').ax5select({
		options: injectCboDataToArr(cboSayuData, 'cm_micode' , 'cm_codename')
	});
}

//파일대사 불일치 현황 그리드 클릭
function clickFileGrid(index) {
	var selItem = fileGrid.list[index];
	
	$('#txtPrgName').val(selItem.cd_rsrcname);
	$('#txtDir').val(selItem.cd_dsncd);
	$('#txtSayu').val(selItem.cd_reqdoc);
	
	$('[data-ax5select="cboDeploy"]').ax5select('setValue', selItem.cd_gubun, true);
	$('[data-ax5select="cboSayu"]').ax5select('setValue', selItem.cd_sayucd, true);
	$('[data-ax5select="cboSys"]').ax5select('setValue', selItem.cd_syscd, true);
	$('#cboSys').trigger('change');
	if(selItem.cd_gubun === '1') {
		$('#cboDir').css('display', 'block');
		$('#txtDir').css('display', 'none');
	} else {
		$('#cboDir').css('display', 'none');
		$('#txtDir').css('display', 'block');
	}
}












