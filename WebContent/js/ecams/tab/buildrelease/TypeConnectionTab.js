/**
 * 빌드/릴리즈유형연결 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-19
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var conInfoGrid			= new ax5.ui.grid();
var scriptGrid			= new ax5.ui.grid();

var conInfoGridData 	= null;
var conInfoAnPrgData	= null;
var scriptGridData		= null;

var cboSysCdData	= null;
var cboQryData		= null;
var cboPrcSysData	= null;
var qryAnPrcData	= null;
var cboBldCdData	= null;

var ulPrgInfoData	= null;
var ulJobInfoData	= null;

var selBldCdVal		= null;

var cboOptions		= null;

conInfoGrid.setConfig({
    target: $('[data-ax5grid="conInfoGrid"]'),
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
            clickConInfoGrid(this.dindex);
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_jobname", 	label: "업무명",		width: '10%'},
        {key: "cm_codename", 	label: "프로그램종류", 	width: '10%'},
        {key: "prcsys", 		label: "처리단계",  	width: '10%'},
        {key: "bldcd", 			label: "스크립트유형", 	width: '15%'},
        {key: "RUNGBN", 		label: "실행시점",  	width: '15%', align: "center"},
        {key: "RUNPOS", 		label: "쉘실행위치",  	width: '10%', align: "center"},
        {key: "SEQYN", 			label: "쉘순차실행",  	width: '10%', align: "center"},
        {key: "TOTYN", 			label: "일괄쉘실행",  	width: '10%', align: "center"},
        {key: "USERYN", 		label: "실행여부선택", 	width: '10%', align: "center"},
    ]
});

scriptGrid.setConfig({
    target: $('[data-ax5grid="scriptGrid"]'),
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
        },
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_seq", 	label: "순서",  		width: '5%' , align: "center"},
        {key: "cm_cmdname", label: "수행명령",  	width: '95%' , align: "left"},
    ]
});

$('[data-ax5select="cboSysCd"]').ax5select({
    options: []
});
$('[data-ax5select="cboQry"]').ax5select({
	options: []
});
$('[data-ax5select="cboPrcSys"]').ax5select({
	options: []
});
$('[data-ax5select="cboBldCd"]').ax5select({
	options: []
});

$('input.checkbox-view').wCheck({theme: 'square-classic red', selector: 'checkmark', highlightLabel: true});
$('input:radio[name=releaseChk]').wRadio({theme: 'circle-radial red', selector: 'checkmark'});


$(document).ready(function() {
	getBldCd();
	getSysInfo();
	
	// 시스템 cbo 변경이벤트
	$('#cboSysCd').bind('change', function() {
		var selSysInfo = null;
		
		if(getSelectedIndex('cboSysCd') < 1 ) {
			return;
		}
		ulJobInfoData	= null;
		$('#ulJobInfo').empty();
		selSysInfo = getSelectedVal('cboSysCd').cm_sysinfo;
		
		if(selSysInfo.substr(7,1) === '1') {
			$('#chkJobAll').wCheck('disabled',false);
			$('#divJob').removeClass('mask_wrap');
			getJobInfo();
		} else {
			$('#chkJobAll').wCheck('disabled',true);
			$('#divJob').addClass('mask_wrap');
		}
		getQryCd();
	});
	
	// 유형구분 cbo 변경 이벤트
	$('#cboQry').bind('change', function() {
		cboPrcSysData = [];
		qryAnPrcData.forEach(function(item, index) {
			if(item.cm_reqcd === getSelectedVal('cboQry').cm_reqcd) {
				cboPrcSysData.push(item);
			}
		});
		$('[data-ax5select="cboPrcSys"]').ax5select({
	        options: injectCboDataToArr(cboPrcSysData, 'cm_jobcd' , 'prcsys')
		});
		$('#cboPrcSys').trigger('change');
		getBldList();
	});
	
	// 실행구분 cbo 변경 이벤트
	$('#cboPrcSys').bind('change', function() {
		var bldCdData = cboBldCdFilter();
		
		$('[data-ax5select="cboBldCd"]').ax5select({
	        options: injectCboDataToArr(bldCdData, 'cm_micode' , 'cm_codename')
		});
		if(selBldCdVal !== null) {
			$('[data-ax5select="cboBldCd"]').ax5select('setValue', selBldCdVal, true);
			selBldCdVal = null;
		}
		if(bldCdData.length > 0 ) {
			$('#cboBldCd').trigger('change');
		}
	});
	
	// 스크립트유형 cbo 변경 이벤트
	$('#cboBldCd').bind('change', function() {
		var data = new Object();
		data = {
			Cbo_BldGbn_code : getSelectedVal('cboBldCd').cm_bldgbn,
			Cbo_BldCd0_code : getSelectedVal('cboBldCd').cm_micode,
			requestType		: 'getScript'
		}
		ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successGetScript);
	});
	
	// 그리드 전체선택
	$('#chkGridAll').bind('click', function() {
		if(conInfoGridData === null) return;
		if($('#chkGridAll').is(':checked')) {
			var selIndexs = conInfoGrid.selectedDataIndexs;
			conInfoGridData.forEach(function(item, index) {
				if(selIndexs.indexOf(index) === -1) conInfoGrid.select(index);
			});
		} else {
			conInfoGrid.clearSelect();
		}
	});
	
	// 프로그램종류 전체선택
	$('#chkPrgAll').bind('click', function() {
		
		if(ulPrgInfoData === null) return;
		
		var addId = null;
		ulPrgInfoData.forEach(function(item, index) {
			addId = item.cm_micode;
			if($('#chkPrgAll').is(':checked')) {
				$('#chkPrg'+addId).wCheck('check', true);
			} else {
				$('#chkPrg'+addId).wCheck('check', false);
			}
			
		});
	});
	
	// 업무종류 전체선택
	$('#chkJobAll').bind('click', function() {
		if(ulJobInfoData === null) return;
		var addId = null;
		ulJobInfoData.forEach(function(item, index) {
			addId = item.cm_jobcd
			if($('#chkJobAll').is(':checked')) {
				$('#chkJob'+addId).wCheck('check', true);
			} else {
				$('#chkJob'+addId).wCheck('check', false);
			}
		})
	});
	
	// 등록 버튼 클릭
	$('#btnReg').bind('click', function() {
		insertBldList();
	});
	
	// 삭제 버튼 클릭
	$('#btnDell').bind('click', function() {
		deleteBldList();
	});
});

// 등록
function insertBldList() {
	var sysInfo = getSelectedVal('cboSysCd').cm_sysinfo;
	var jobSw	= false;
	var prgSw	= false;
	var addId	= null;
	var jobCds	= '';
	var rsrcCds	= '';
	var etcData = new Object();
	
	if(getSelectedIndex('cboSysCd') === 0 ) {
		dialog.alert('시스템을 선택한 후 등록하십시오.', function(){});
		return;
	}
	
	
	if(sysInfo.substr(7,1) === '1') {
		ulJobInfoData.forEach(function(item, index) {
			addId = item.cm_jobcd;
			if($('#chkJob'+addId).is(':checked')) {
				if(jobCds.length > 0 ) jobCds += ',';
				jobCds += addId;
				jobSw = true;
			}
		});
		
		if(!jobSw) {
			dialog.alert('업무를 선택한 후 등록하십시오.', function(){});
			return;
		}
	} else {
		jobCds = '****';
	}
	
	if(ulPrgInfoData.length > 0 ) {
		ulPrgInfoData.forEach(function(item, index) {
			addId = item.cm_micode;
			if($('#chkPrg'+addId).is(':checked')) {
				if(rsrcCds.length > 0 ) rsrcCds += ',';
				rsrcCds += item.cm_micode;
				prgSw = true;
			}
		})
		
		if(!prgSw) {
			dialog.alert('프로그램종류를 선택한 후 등록하십시오.', function(){});
			return;
		}
	} else {
		dialog.alert('프로그램종류를 선택한 후 등록하십시오.', function(){});
		return;
	}
	
	if($('#chkExe').is(':checked')) {
		etcData.CM_USERYN = 'Y'
	} else {
		etcData.CM_USERYN = 'N'
	}
	
	if($('#chkLocal').is(':checked')) {
		etcData.CM_RUNPOS = 'L'
	} else {
		etcData.CM_RUNPOS = 'R'
	}
	
	if($('#chkSeq').is(':checked')) {
		etcData.CM_SEQYN = 'Y'
	} else {
		etcData.CM_SEQYN = 'N'
	}
	
	if($('#chkBatch').is(':checked')) {
		etcData.CM_TOTYN = 'Y'
	} else {
		etcData.CM_TOTYN = 'N'
	}
	
	if($('#optBefore').is(':checked')) {
		etcData.CM_RUNGBN = 'B'
	} else {
		etcData.CM_RUNGBN = 'A'
	}
	etcData.cm_syscd 	= getSelectedVal('cboSysCd').cm_syscd;
	etcData.cm_qrycd 	= getSelectedVal('cboQry').cm_reqcd;
	etcData.cm_prcsys 	= getSelectedVal('cboPrcSys').cm_jobcd;
	etcData.cm_bldcd 	= getSelectedVal('cboBldCd').cm_micode;
	etcData.cm_bldgbn 	= getSelectedVal('cboBldCd').cm_bldgbn;
	etcData.cm_jobcd 	= jobCds;
	etcData.cm_rsrccd 	= rsrcCds;
    
	var data = new Object();
	data = {
		etcData 		: etcData,
		requestType	: 'insertBldList'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successInsertBldList);
}

// 등록 완료
function successInsertBldList(data) {
	if(data > 0) {
		dialog.alert('등록처리를 완료하였습니다.', function(){
			$('#cboQry').trigger('change');
		});
	} else {
		dialog.alert('등록처리중 오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.', function(){});
	}
}

// 연결리스트 삭제
function deleteBldList() {
	var selIn 	= conInfoGrid.selectedDataIndexs;
	var delObj	= null;
	var delList	= [];
	var sysCd	= getSelectedVal('cboSysCd').cm_syscd;
	var qryCd	= getSelectedVal('cboQry').cm_reqcd;
	
	if(selIn.length === 0 ) {
		dialog.alert('삭제할 스크립트 연결 정보를 선택후 눌러주세요.', function(){});
		return;
	}
	
	selIn.forEach(function(selIndex, index) {
		delObj = conInfoGrid.list[selIndex];
		delObj.cm_rungbn = delObj.CM_RUNGBN;
		delObj.cm_syscd	 = sysCd;
		delObj.cm_qrycd	 = qryCd;
		delList.push(delObj);
	});
	var data = new Object();
	data = {
		delList 		: delList,
		requestType	: 'deleteBldList'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successDeleteBldList);
}

// 연결리스트 삭제 완료
function successDeleteBldList(data) {
	if(data == 0) {
		dialog.alert('삭제처리를 완료하였습니다.', function() {
			var selIn 	= conInfoGrid.selectedDataIndexs;
			selIn.sort(function(a,b) {
				return b - a; 
			});
			
			selIn.forEach(function(selIndex, index) {
				conInfoGridData.splice(selIndex,1);
			})
			
			conInfoGrid.setData(conInfoGridData);
		});
	}
}

// 연결 스크립트 리스트 클릭
function clickConInfoGrid(index) {
	var selItem = conInfoGrid.list[index];
	var sysInfo	= getSelectedVal('cboSysCd').cm_sysinfo;
	$('#chkPrgAll').wCheck('check', true);
	$('#chkPrgAll').trigger('click');
	
	$('#chkJobAll').wCheck('check', true);
	$('#chkJobAll').trigger('click');
	
	selBldCdVal = selItem.cm_bldcd;
	$('[data-ax5select="cboPrcSys"]').ax5select('setValue', selItem.cm_prcsys ,true);
	$('#cboPrcSys').trigger('change');
	
	if(sysInfo.substr(7,1) === '1') {
		$('#chkJob'+selItem.cm_jobcd).wCheck('check',true);
	}
	
	$('#chkPrg'+selItem.cm_rsrccd).wCheck('check',true);
	
	$('#chkExe').wCheck('check',false);
	$('#chkLocal').wCheck('check',false);
	$('#chkSeq').wCheck('check',false);
	$('#chkBatch').wCheck('check',false);
	
	if(selItem.CM_USERYN === 'Y') {
		$('#chkExe').wCheck('check',true);
	}
	
	if(selItem.CM_RUNPOS === 'L') {
		$('#chkLocal').wCheck('check',true);
	}
	
	if(selItem.CM_SEQYN === 'Y') {
		$('#chkSeq').wCheck('check',true);
	}
	
	if(selItem.CM_TOTYN === 'Y') {
		$('#chkBatch').wCheck('check',true);
	}
	
	if(selItem.CM_RUNGBN === 'B') {
		$('#optBefore').wCheck('check', true);
	} else {
		$('#optAfter').wCheck('check', true);
	}
}

// 스크립트 그리드 정보 가져오기 완료
function successGetScript(data) {
	scriptGridData = data;
	scriptGrid.setData(scriptGridData);
}

// 스크립트 유형 콤보 필터
function cboBldCdFilter() {
	var bldCdArr 	= [];
	var prcSysVal 	= null;
	var bldGbn		= null;
	var item		= null;
	
	for(var i=0; i<cboBldCdData.length; i++) {
		prcSysVal 	= getSelectedVal('cboPrcSys').cm_jobcd;
		item		= cboBldCdData[i];
		bldGbn 		= item.cm_bldgbn;
		if(item.cm_codename !== '유형신규등록') {
			if (prcSysVal === 'SYSDN') {
				if(bldGbn === '1') {
					bldCdArr.push(item);
				} else {
					continue;
				}
			} else if (prcSysVal === 'SYSUP' ) {
				if(bldGbn === '5') {
					bldCdArr.push(item);
				} else {
					continue;
				}
			} else if ((prcSysVal === 'SYSCB' || prcSysVal === 'SYSUA'|| prcSysVal === 'SYSPC')) {
				if(bldGbn === '2') {
					bldCdArr.push(item);
				} else {
					continue;
				}
			} else if ((prcSysVal === 'SYSED' || prcSysVal === 'SYSCED')) {
				if(bldGbn === '3') {
					bldCdArr.push(item);
				} else {
					continue;
				}
			} else if (prcSysVal === 'SYSRC') {
				if(bldGbn === '6') {
					bldCdArr.push(item);
				} else {
					continue;
				}
			} else if(bldGbn === '4'){
				bldCdArr.push(item);
			}
		}
	}
	return bldCdArr;
}

// 상단 연결 정보 리스트/프로그램종류 가져오기
function getBldList() {
	var data = new Object();
	data = {
		SysCd 		: getSelectedVal('cboSysCd').cm_syscd,
		TstSw 		: getSelectedVal('cboSysCd').TstSw,
		QryCd 		: getSelectedVal('cboQry').cm_reqcd,
		SysInfo 	: getSelectedVal('cboSysCd').cm_sysinfo,
		requestType	: 'getBldList'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successGetBldList);
}

// 상단 연결 정보 리스트/프로그램종류 가져오기 완료
function successGetBldList(data) {
	conInfoAnPrgData = data;
	conInfoGridData = [];
	ulPrgInfoData	= [];
	conInfoAnPrgData.forEach(function(item, index) {
		if(item.ID === 'BLDLIST') {
			conInfoGridData.push(item);
		}
		
		if(item.ID === 'RSRCCD') {
			ulPrgInfoData.push(item);
		}
	})
	conInfoGrid.setData(conInfoGridData);
	makePrgInfoUlList();
}

// 프로그램종류 ul만들어주기
function makePrgInfoUlList() {
	$('#ulPrgInfo').empty();
	var liStr = null;
	var addId = null;
	ulPrgInfoData.forEach(function(prgItem, index) {
		addId = prgItem.cm_micode;
		liStr  = '';
		liStr += '<li class="list-group-item dib width-33" style="min-width: 80px;">';
		liStr += '	<input type="checkbox" class="checkbox-prg" id="chkPrg'+addId+'" data-label="'+prgItem.cm_codename+'"  value="'+prgItem.cm_micode+'" />';
		liStr += '</li>';
		$('#ulPrgInfo').append(liStr);
	});
	
	$('input.checkbox-prg').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

}

// 업무종류 가져오기
function getJobInfo() {
	var data = new Object();
	data = {
		UserID 		: userId,
		SysCd 		: getSelectedVal('cboSysCd').cm_syscd,
		SecuYn 		: 'Y',
		CloseYn 	: 'N',
		SelMsg 		: '',
		sortCd 		: 'NAME',
		requestType	: 'getJobInfo'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successGetJobInfo);
}

// 업무종류 가져오기 완료
function successGetJobInfo(data) {
	ulJobInfoData = data;
	$('#ulJobInfo').empty();
	var liStr = null;
	var addId = null;
	ulJobInfoData.forEach(function(jobItem, index) {
		addId = jobItem.cm_jobcd;
		liStr  = '';
		liStr += '<li class="list-group-item dib width-50" style="min-width: 150px;">';
		liStr += '	<input type="checkbox" class="checkbox-job" id="chkJob'+addId+'" data-label="'+jobItem.cm_jobname+'"  value="'+addId+'" />';
		liStr += '</li>';
		$('#ulJobInfo').append(liStr);
	});
	$('input.checkbox-job').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});
}

// 시스템 cbo 가져오기
function getSysInfo() {
	var data = new Object();
	data = {
		UserId 		: userId,
		SecuYn 		: 'Y',
		SelMsg 		: 'SEL',
		CloseYn 	: 'N',
		ReqCd 		: 'D12',
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successGetSysInfo);
};

// 시스템 cbo 가져오기 완료
function successGetSysInfo(data) {
	cboSysCdData = data;
	$('[data-ax5select="cboSysCd"]').ax5select({
        options: injectCboDataToArr(cboSysCdData, 'cm_syscd' , 'cm_sysmsg')
	});
	
	// 첫번째 시스템 기본 세팅
	$('[data-ax5select="cboSysCd"]').ax5select('setValue', cboSysCdData[1].cm_syscd, true);
	$('#cboSysCd').trigger('change');
}

// 유형구분/실행구분 가져오기
function getQryCd() {
	var data = new Object();
	data = {
		SysCd 		: getSelectedVal('cboSysCd').cm_syscd,
		TstSw 		: getSelectedVal('cboSysCd').TstSw,
		requestType	: 'getQryCd'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successGetQryCd);
}

// 유형구분/실행구분 가져오기 완료
function successGetQryCd(data) {
	qryAnPrcData = data;
	cboQryData = [];
	qryAnPrcData.forEach(function(item, index) {
		if(item.ID === 'QRYCD') {
			cboQryData.push(item);
		}
	});
	$('[data-ax5select="cboQry"]').ax5select({
        options: injectCboDataToArr(cboQryData, 'cm_reqcd' , 'cm_codename')
	});
	$('#cboQry').trigger('change');
}

// 스크립트 유형 가져오기
function getBldCd() {
	var data = new Object();
	data = {
		requestType	: 'getBldCd'
	}
	ajaxAsync('/webPage/administrator/BuildReleaseInfo', data, 'json',successGetBldCd);
}

// 스크립트 유형 가져오기 완료
function successGetBldCd(data) {
	cboBldCdData = data;
}