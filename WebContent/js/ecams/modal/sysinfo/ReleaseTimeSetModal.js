/**
 * 정기배포일괄등록 팝업 화면 기능 정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-05-29
 * 
 */
var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var releaseGrid = new ax5.ui.grid();
var releaseGridData = null;

releaseGrid.setConfig({
    target: $('[data-ax5grid="releaseGrid"]'),
    sortable: false, 
    multiSort: false,
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
        {key: "cm_sysmsg", 	label: "시스템명",  	width: '20%', align: 'left'},
        {key: "weekname", 	label: "요일",  		width: '40%', align: 'left'},
        {key: "buildtime", 	label: "정기빌드시간", width: '20%'},
        {key: "deploytime", label: "정기배포시간", width: '20%'}
    ]
});

$('input:radio[name=releaseChkS]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});
$('input:radio[name=releaseChk]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});
$('input.checkbox-rel').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

$('#txtBuildTime').timepicker({
	direction:'top',
	timeFormat: 'HH:mm',
    interval: 30,
    dynamic: false,
    dropdown: false,
    scrollbar: true
});

$('#txtDeployTime').timepicker({
	direction:'top',
	timeFormat: 'HH:mm',
    interval: 30,
    dynamic: false,
    dropdown: false,
    scrollbar: true
});

$(document).ready(function(){
	
	$('#optAll').wRadio('check', true);
	
	getReleaseTime();
	
	// 숫자만 입력
	$("#txtBuildTime").on("keyup", function() {
	    $(this).val($(this).val().replace(/[^0-9]/g,""));
	});
	
	// 숫자만 입력
	$("#txtDeployTime").on("keyup", function() {
	    $(this).val($(this).val().replace(/[^0-9]/g,""));
	});

	// 전체/정기배포대상/정기비배포대상 라디오 클릭
	$('input:radio[name=releaseChkS]').bind('click', function() {
		releaseGridFilter();
	});
	
	// 해제 클릭
	$('input:radio[id=optUnCheck]').bind('click', function() {
		$('#chkSun').wCheck('check', false);
		$('#chkMon').wCheck('check', false);
		$('#chkTue').wCheck('check', false);
		$('#chkWed').wCheck('check', false);
		$('#chkThu').wCheck('check', false);
		$('#chkFri').wCheck('check', false);
		$('#chkSat').wCheck('check', false);
		
		$('#txtBuildTime').val('');
		$('#txtDeployTime').val('');
	});
	
	// 시스템명 엔터
	$('#txtSysMsg').bind('keydown', function(event) {
		if(event.keyCode === 13) {
			releaseGridFilter();
		}
	});
	
	// 조회
	$('#btnSearch').bind('click',function() {
		getReleaseTime();
	});
	
	// 등록
	$('#btnReleaseTimeSet').bind('click',function() {
		setReleaseTime();
	});
	
	// 닫기
	$('#btnClose').bind('click',function() {
		window.parent.relModal.close();
	});
});

// 그리드 데이터 세팅 전 화면 값에 따라서 필터
function releaseGridFilter() {
	var txtSysMsg 	= $('#txtSysMsg').val().trim();
	var filteredDataStr = [];
	var filteredData 	= [];
	
	releaseGridData.forEach(function(item, index) {
		if(txtSysMsg.length > 0 ) {
			if(item.cm_sysmsg.indexOf(txtSysMsg) !== -1) {
				filteredDataStr.push(item);
			}
		} else {
			filteredDataStr.push(item);
		}
	});
	
	
	filterDataSe = [];
	filteredDataStr.forEach(function(item, index) {
		if($('#optRelease').is(':checked') && item.deploysw === '1') {
			filteredData.push(item);
		}  else if($('#optUnRelease').is(':checked') && item.deploysw === '0') {
			filteredData.push(item);
		} else if($('#optAll').is(':checked')){
			filteredData.push(item);
		}
	});
	
	releaseGrid.setData(filteredData);
}

function popClose(){
	window.parent.relModal.close();
}

// 정기배포 설정값 등록
function setReleaseTime(txtTime) {
	var etcData = new Object();
	var syslist = '';
	var selIn 	= releaseGrid.selectedDataIndexs;
	var txtBuildTime 	= $('#txtBuildTime').val().trim();
	var txtDeployTime 	= $('#txtDeployTime').val().trim();
	txtBuildTime 	= replaceAllString(txtBuildTime,':','');
	txtDeployTime 	= replaceAllString(txtDeployTime,':','');
	
	if(selIn.length === 0 ) {
		dialog.alert('목록에서 대상시스템을 선택한후 진행하시기 바랍니다.',function(){});
		return;
	}
	
	selIn.forEach(function(selIn, index) {
		if(syslist.length !== 0 ) syslist += ',';
		syslist += releaseGrid.list[selIn].cm_syscd;
	});
	
	if(!$('#optCheck').is(':checked') && !$('#optUnCheck').is(':checked')) {
		dialog.alert('목록하단의 구분을 선택한 후 진행하시기 바랍니다. [설정/해제]',function(){});
		return;
	}
	
	
	if($('#optCheck').is(':checked')) {
		etcData.gbncd = "true";
		
		if(txtBuildTime.length === 0 && txtDeployTime.length === 0 ) {
			dialog.alert('빌드시간/배포시간 중 하나이상 입력한 후 진행하시기 바랍니다.',function(){});
			return;
		}
		
		if(txtBuildTime.length === 3) {
			txtBuildTime = '0' + txtBuildTime;
		}
		
		if(txtDeployTime.length === 3) {
			txtDeployTime = '0' + txtDeployTime;
		}
		
		
		if(!$('#chkSun').is(':checked') && !$('#chkMon').is(':checked') && !$('#chkTue').is(':checked') && !$('#chkWed').is(':checked')
				&& !$('#chkThu').is(':checked') && !$('#chkFri').is(':checked') && !$('#chkSat').is(':checked')) {
			dialog.alert('대상요일을 선택한 후 진행하시기 바랍니다.',function(){});
			return;
		}
		
		if($('#chkSun').is(':checked')) {
			etcData.sun = "Y";
		} else {
			etcData.sun = "N";
		}
		
		if($('#chkMon').is(':checked')) {
			etcData.mon = "Y";
		} else {
			etcData.mon = "N";
		}
		
		if($('#chkTue').is(':checked')) {
			etcData.tue = "Y";
		} else {
			etcData.tue = "N";
		}
		
		if($('#chkWed').is(':checked')) {
			etcData.wed = "Y";
		} else {
			etcData.wed = "N";
		}
		
		if($('#chkThu').is(':checked')) {
			etcData.thu = "Y";
		} else {
			etcData.thu = "N";
		}
		
		if($('#chkFri').is(':checked')) {
			etcData.fri = "Y";
		} else {
			etcData.fri = "N";
		}
		
		if($('#chkSat').is(':checked')) {
			etcData.sat = "Y";
		} else {
			etcData.sat = "N";
		}
		
	} else {
		etcData.gbncd = "false";
	}
	
	etcData.syslist = syslist;
	etcData.userid 	= userId;
	etcData.buildtime 	= txtBuildTime;
	etcData.deploytime 	= txtDeployTime;
	
	
	var systemInfoDta = new Object(); 
	systemInfoDta = {
		requestType		: 'setReleaseTime',
		etcData 		: etcData,
	}
	ajaxAsync('/webPage/modal/sysinfo/ReleaseTimeSet', systemInfoDta, 'json',successSetReleaseTime);
}

function successSetReleaseTime(data) {
	var msg = '';
	if(data === 0) {
		if($('#optCheck').is(':checked')) {
			msg = '설정처리가 완료되었습니다.';
		} else {
			msg = '해제처리가 완료되었습니다.';
		}
		dialog.alert(msg,
				function(){
					getReleaseTime();
				});
	} else {
		dialog.alert('정기배포설정중 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.',function(){});
	}
}

// 정기배포 설정값 조회
function getReleaseTime() {
	var systemInfoDta = new Object(); 
	systemInfoDta = {
		requestType	: 	'getReleaseTime'
	}
	ajaxAsync('/webPage/modal/sysinfo/ReleaseTimeSet', systemInfoDta, 'json',successgetReleaseTime);
}

// 정기배포 설정값 조회 결과
function successgetReleaseTime(data) {
	var rowSelector = $('[data-ax5grid-column-attr="rowSelector"]');
	$(rowSelector).attr('data-ax5grid-selected',"false");
	
	releaseGridData = data;
	releaseGridFilter();
	
	$('input:radio[name^="release"]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});
}