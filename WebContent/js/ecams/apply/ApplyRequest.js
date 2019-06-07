/**
 * 체크인,테스트적용,운영적용 신청화면
 * 
 * 	작성자: 정선희
 * 	버전 : 1.0
 *  수정일 : 2019-05-27
 * 
 */
var userId = window.parent.userId;
var reqCd = window.parent.reqCd;
console.log("!!!reqCd:"+reqCd);

var getFileGrid		= new ax5.ui.grid();
var reqFileGrid		= new ax5.ui.grid();
var datReqDate 		= new ax5.ui.picker();

var request         =  new Request();

var cboOptions = [];

var srSw            = false;
var cboSysInfoData  = null; //시스템콤보
var cboReqGbnData   = null;
var cboSrInfoData	= null;	//SR-ID 콤보
var getFileGridData = null; //신청대상그리드
var getReqGridData  = null; //신청할프로그램 그리드

$(document).ready(function(){
	$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'square-dot-blue', highlightLabel: true});

	document.getElementById('panCal').style.visibility = "hidden";
	
	dateInit();
	getCodeInfoList();

	getSysInfoList();
});

function dateInit() {
	$('#txtReqDate').val(getDate('DATE',0));
	datReqDate.bind(defaultPickerInfo('txtReqDate'));
	
	$('#txtReqTime').timepicker({
	    showMeridian : false,
	    minuteStep: 1
	 });
}

//처리구분
function getCodeInfoList() {
	var codeInfos = getCodeInfoCommon([ new CodeInfo('REQPASS','','N') ]);
	cboReqGbnData = codeInfos.REQPASS;
	
	cboOptions = [];
	$.each(cboReqGbnData,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	$('[data-ax5select="cboReqGbn"]').ax5select({
		options: cboOptions
	});
	cboReqGbnClick();
}

//시스템 리스트
function getSysInfoList() {
	var sysListInfoData = new Object();
	sysListInfoData = {
		UserId	: 	userId,
		ReqCd   :   reqCd,
		requestType	: 	'GETSYSINFOLIST'
	}
	console.log(sysListInfoData);
	
	ajaxAsync('/webPage/apply/ApplyRequest', sysListInfoData, 'json',successGetSysInfoList);
}
//시스템 리스트
function successGetSysInfoList(data) {
	cboSysInfoData = data;
	
	cboOptions = [];
	$.each(cboSysInfoData,function(key,value) {
		console.log("========syscd["+value.cm_syscd+"]");
		cboOptions.push({value: value.cm_syscd, text: value.cm_sysmsg, cm_sysgb: value.cm_sysgb, cm_sysinfo: value.cm_sysinfo, cm_prjname: value.cm_prjname, tstsw: value.TstSw});
	});
	$('[data-ax5select="cboSys"]').ax5select({
        options: cboOptions
	});
	
	if (cboSysInfoData.length > 0) {
		cboSysChange();
	} else {
		$('[data-ax5select="cboRsrccd"]').ax5select({
	        options: []
		});
		$('[data-ax5select="cboSrId"]').ax5select('setValue',cboSrInfoData[0].cc_srid,true);
		
	}
}
//시스템선택->업무조회
function cboSysChange() {

	var selectedSysCboSysInfo = $('[data-ax5select="cboSys"]').ax5select("getValue");
	selectedSysCboSysInfo = selectedSysCboSysInfo[0];
	
	var selectedIndex = $('#cboSys option').index($('#cboSys option:selected'));
	
	getRsrcInfo(selectedSysCboSysInfo.value);
	
	if (selectedSysCboSysInfo.cm_sysinfo.substr(9,1) === '1') srSw = false;
	else srSw = true;

	console.log("!!!srSw:"+srSw);
	
	if ( srSw ) {
		getSRInfoList();
		
	} else {
		cboOptions = [];
		cboOptions.push({value: 'SR정보 선택 또는 해당없음', text: 'SR정보 선택 또는 해당없음', srid: 'SR정보 선택 또는 해당없음'});
		$('[data-ax5select="cboSrId"]').ax5select({
			options: cboOptions
		});
		$('[data-ax5select="cboSrId"]').ax5select("disable");
	}
}
//SR-ID 선택
function cboSRChange() {
	var selectedIndex = $('#cboSrId option').index($('#cboSrId option:selected'));
	
	console.log("========selectedIndex["+selectedIndex+"]");

	//$('[data-ax5select="cboSys"]').ax5select("disable");
	$('[data-ax5select="cboSys"]').ax5select('setValue','00000',true);
	if (selectedIndex > 0) {
		var i=0;
		
		var selectedCboSrId = $('[data-ax5select="cboSrId"]').ax5select("getValue");
		selectedCboSrId = selectedCboSrId[0];
		
		for (i=0; i<cboSysInfoData.length; i++) {
			if (selectedCboSrId.syscd.indexOf(cboSysInfoData[i].cm_syscd) >= 0) {
				//$('[data-ax5select="cboSys"]').ax5select("enable");
				$('[data-ax5select="cboSys"]').ax5select('setValue',cboSysInfoData[i].cm_syscd,true);
				break;
			}
		}
		
		if (txtSayu.value === '' || txtSayu.value === null || txtSayu.value != selectedCboSrId.text) {
			txtSayu.value = selectedCboSrId.text;
		}
		
		//긴급 SR 일때 처리구분 콤보 긴급으로 고정 시작
		if ( reqCd === '04' && selectedCboSrId.cc_chgtype === '01' ) {
			$('[data-ax5select="cboReqGbn"]').ax5select('setValue','2',true);
			cboReqGbnClick();
		}
	} else {
		txtSayu.value = '';
	}
	var selectedSysCboSysInfo = $('[data-ax5select="cboSys"]').ax5select("getValue");
	selectedSysCboSysInfo = selectedSysCboSysInfo[0];
	
	getRsrcInfo(selectedSysCboSysInfo.value);
}
//프로그램유정보
function getRsrcInfo(syscd) {
	
	if (syscd === '00000') {
		$('[data-ax5select="cboRsrccd"]').ax5select({
	      options: []
		});
		$('[data-ax5select="cboRsrccd"]').ax5select("disable");
		return;
	} else {
		$('[data-ax5select="cboRsrccd"]').ax5select("enable");
	}
	
	var sysListInfoData;
	sysListInfoData = new Object();
	sysListInfoData = {
		SysCd	: 	syscd,
		SelMsg	: 	'ALL',
		requestType	: 	'RSRCOPEN'
	}
	
	ajaxAsync('/webPage/apply/ApplyRequest', sysListInfoData, 'json', successGetRsrcInfoList);
}
//프로그램종류리스트
function successGetRsrcInfoList(data) {
	cboOptions = [];
	$.each(data,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	$('[data-ax5select="cboRsrccd"]').ax5select({
      options: cboOptions
	});
}

//SR정보
function getSRInfoList() {
	var prjInfo;
	var prjInfoData;
	prjInfo 		= new Object();
	prjInfo.userid 	= userId;
	prjInfo.reqcd 	= reqCd;
	prjInfo.secuyn 	= 'Y';
	prjInfo.qrygbn 	= '01';
	
	prjInfoData = new Object();
	prjInfoData = {
		prjInfo	: 	prjInfo,
		requestType	: 	'PROJECT_LIST'
	}
	console.log(prjInfo);
	
	ajaxAsync('/webPage/common/PrjInfoServlet', prjInfoData, 'json', successGetPrjInfoList);
}
//SR-ID정보
function successGetPrjInfoList(data) {
	cboSrInfoData = data;
	
	cboOptions = [];
	
	cboOptions.push({value: 'SR정보 선택 또는 해당없음', text: 'SR정보 선택 또는 해당없음', srid: 'SR정보 선택 또는 해당없음', syscd: '00000', cc_chgtype: ''});
	$.each(cboSrInfoData,function(key,value) {
		cboOptions.push({value: value.cc_srid, text: value.srid, cc_reqtitle:value.cc_reqtitle, syscd:value.syscd, cc_chgtype: value.cc_chgtype});
	});
	$('[data-ax5select="cboSrId"]').ax5select({
		options: cboOptions
	});
	
	/*if (cboSrInfoData.length > 0) {
		$('[data-ax5select="cboSrId"]').ax5select('setValue',cboSrInfoData[0].cc_srid,true);
	}*/
	
	var srid = 'SR정보 선택 또는 해당없음';
	
	if (srSw) {
		$('[data-ax5select="cboSrId"]').ax5select("enable");

		var selectedIndex = $('#cboSys option').index($('#cboSys option:selected'));
		if (selectedIndex > 0) {
			
			var selectedSysCboSysInfo = $('[data-ax5select="cboSys"]').ax5select("getValue");
			selectedSysCboSysInfo = selectedSysCboSysInfo[0];
			
			if (cboSrInfoData.length > 0) {
				var i=0;
				for (i=0; i<cboSrInfoData.length; i++) {
					if (cboSrInfoData[i].syscd.indexOf(selectedSysCboSysInfo.value) >= 0) {
						srid = cboSrInfoData[i].cc_srid;
						break;
					}
				}
			}
			getRsrcInfo(selectedSysCboSysInfo.value);
		} else {
			getRsrcInfo('00000');
		}
	} else {
		$('[data-ax5select="cboSrId"]').ax5select("disable");
		getRsrcInfo('00000');
	}

	$('[data-ax5select="cboSrId"]').ax5select('setValue',srid,true);
}

//처리구분선택
function cboReqGbnClick() {
	var selectedIndex = $('#cboReqGbn option').index($('#cboReqGbn option:selected'));
	
	var selectedcboReqGbn = $('[data-ax5select="cboReqGbn"]').ax5select("getValue");
	selectedcboReqGbn = selectedcboReqGbn[0];

	//console.log(selectedcboReqGbn.value);
	if (selectedcboReqGbn.value === '4') {
		document.getElementById('panCal').style.visibility = "visible";
	} else {
		document.getElementById('panCal').style.visibility = "hidden";
	}
}

getFileGrid.setConfig({
    target: $('[data-ax5grid="getFileGrid"]'),
    sortable: true, 	// 그리드 sort 가능 여부(true/false)
    multiSort: true,	// 그리드 모든 컬럼 sort 선언(true/false)
    multipleSelect: true,	// 그리드 ROW 선택 시 다중 선택 가능하게 할지 여부(true/false)
    showRowSelector: true,	// 그리드에 체크박스 보이게 할지 여부(true/false)
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 20,
        onClick: function () {
        	this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	DownClickGrid();
        },
    	onDataChanged: function(){
    		//그리드 새로고침 (스타일 유지)
    	    this.self.repaint();
    	},
    	trStyleClass: function () {
    		if (this.item.colorsw === '3'){
    			return "fontStyle-cncl";
    		} else {
    		}
    	}
    },
    columns: [
        {key: "dirpath", label: "프로그램경로",  width: '30%'},
        {key: "rsrcname", label: "프로그램명",  width: '20%'},
        {key: "jobname", label: "업무명",  width: '7%'},
        {key: "jawon", label: "프로그램종류",  width: '7%'},
        {key: "story", label: "프로그램설명",  width: '7%'},
        {key: "sta", label: "상태",  width: '5%'},
        {key: "lstver", label: "형상관리버전",  width: '5%'},
        {key: "reqver", label: "배포버전",  width: '5%'},
        {key: "editor", label: "수정자",  width: '7%'},
        {key: "updatedt", label: "수정일",  width: '7%'}
    ]
});

reqFileGrid.setConfig({
    target: $('[data-ax5grid="reqFileGrid"]'),
    sortable: true, 	// 그리드 sort 가능 여부(true/false)
    multiSort: true,	// 그리드 모든 컬럼 sort 선언(true/false)
    multipleSelect: true,	// 그리드 ROW 선택 시 다중 선택 가능하게 할지 여부(true/false)
    showRowSelector: true,	// 그리드에 체크박스 보이게 할지 여부(true/false)
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 20,
        onClick: function () {
        	this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	UpClickGrid();
        },
    	onDataChanged: function(){
    		//그리드 새로고침 (스타일 유지)
    	    this.self.repaint();
    	},
    	trStyleClass: function () {
    		if (this.item.cr_itemid != this.item.cr_baseitem){
    			return "fontStyle-module";
    		} else {
    		}
    	}
    },
    columns: [
        {key: "dirpath", label: "프로그램경로",  width: '35%'},
        {key: "rsrcname", label: "프로그램명",  width: '25%'},
        {key: "compile", label: "컴파일순서",  width: '7%'},
        {key: "jobname", label: "업무명",  width: '7%'},
        {key: "jawon", label: "프로그램종류",  width: '7%'},
        {key: "lstver", label: "형상관리버전",  width: '5%'},
        {key: "reqver", label: "배포대상버전",  width: '7%'},
        {key: "realver", label: "현운영버전",  width: '7%'}
    ]
});
//신청대상목록 조회
function btnFind_Click() {
	var selectedIndex = 0;
	
	if (srSw) {
		selectedIndex = $('#cboSrId option').index($('#cboSrId option:selected'));
		if (selectedIndex < 1) {
			showToast('SR-ID를 선택하시기 바랍니다.');
			return;
		}
	}
	
	selectedIndex = $('#cboSys option').index($('#cboSys option:selected'));
	if (selectedIndex < 1) {
		showToast('시스템을 선택하시기 바랍니다.');
		return;
	}
	
	var tmpObj = new Object();
	tmpObj.UserId = userId;
	
	var selectedCboInfo = $('[data-ax5select="cboSys"]').ax5select("getValue");
	selectedCboInfo = selectedCboInfo[0];
	console.log(selectedCboInfo);

	tmpObj.SysCd = selectedCboInfo.value;
	tmpObj.SinCd = reqCd;
	tmpObj.TstSw = selectedCboInfo.tstsw;
	tmpObj.RsrcName = txtRsrcName.value;
	tmpObj.DsnCd = "";
	tmpObj.DirPath = "";
	tmpObj.SysInfo = selectedCboInfo.cm_sysinfo;
	
	selectedIndex = $('#cboRsrccd option').index($('#cboRsrccd option:selected'));

	tmpObj.RsrcCd = "";
	if (selectedIndex>1) {
		selectedCboInfo = $('[data-ax5select="cboRsrccd"]').ax5select("getValue");
		selectedCboInfo = selectedCboInfo[0];
		
		tmpObj.RsrcCd = selectedCboInfo.value;
	}
	
	if ( reqCd === '03' ) tmpObj.ReqCd = "03";
	else tmpObj.ReqCd = "00";
	if (srSw) {
		selectedCboInfo = $('[data-ax5select="cboSrId"]').ax5select("getValue");
		selectedCboInfo = selectedCboInfo[0];
		
		tmpObj.srid = selectedCboInfo.value;//SR사용여부 체크
	}


	var paramData = new Object();
	paramData = {
		param	: 	tmpObj,
		requestType	: 	'PROGRAM_LIST'
	}
	
	ajaxAsync('/webPage/apply/ApplyRequest', paramData, 'json', successGetProgramList);

}
//신청목록조회
function successGetProgramList(data) {
	getFileGridData = data;
	getFileGrid.setData(getFileGridData);
}

//항목상세보기
function chkDetail_Click() {
	if (reqFileGrid.list.length < 1) return;
	
	if ( !$('#chkDetail').is(':checked') ) {
		var filterGridData = getReqGridData.filter(function(data) {
			return data.cr_itemid === data.cr_baseitem;
		});
		reqFileGrid.setData(filterGridData);
	} else {
		reqFileGrid.setData(getReqGridData);
	}
	reqFileGrid.repaint();
	reqFileGrid.clearSelect();
}
//신청목록추가
function btnAdd_Click() {
	var i = 0 ;
	for(i=0; i < getFileGrid.selectedDataIndexs.length ; i++){
		var selectIndex = getFileGrid.selectedDataIndexs[i];			
		// 중복데이터 추가안하는 로직
		if(getFileGrid.list[selectIndex].colorsw != "3"){	// 상위 그리드 색상이 붉은색이 아닌 경우에만 하위 그리드에 추가
			reqFileGrid.addRow($.extend({}, getFileGrid.list[selectIndex], {__index: undefined}));	// 하위 그리드 데이터 추가(선택한 데이터만) 
			getFileGrid.list[selectIndex].colorsw = "3";	// 선택 데이터 컬럼색상 변경(붉은색)
		}
	}
	getFileGrid.repaint();	// 선택 데이터 컬럼색상 변경하기 위한 그리드 새로 그리기
	getFileGrid.clearSelect();	// 해당 그리드의 선택한 ROW 초기화 
	reqFileGrid.repaint();
	reqFileGrid.clearSelect();
}
//신청목록에서 제거
function btnDel_Click() {
	// 추가한 데이터 삭제시 firstGrid의 데이터 색상 돌려놓기위한 로직 시작
	var i = 0 ;
	for(i=0; i < reqFileGrid.selectedDataIndexs.length ; i++){
		var selectIndex2 = reqFileGrid.selectedDataIndexs[i];
		for(var z = 0; z < getFileGrid.list.length ; z++){
			//기준프로그램으로 목록제거
			//if(reqFileGrid.list[selectIndex2].cr_itemid != reqFileGrid.list[selectIndex2].cr_baseitem) continue;
			
			if(getFileGrid.list[z].cr_itemid == reqFileGrid.list[selectIndex2].cr_baseitem){	// 하위 그리드 데이터 삭제시 상위 그리드 색상 변경 조건
				getFileGrid.list[z].colorsw = "";
			}
		}
	}
	// 추가한 데이터 삭제시 firstGrid의 데이터 색상 돌려놓기위한 로직 끝
	
	reqFileGrid.removeRow("selected"); // 해당 그리드의 선택한 ROW만 삭제
	getFileGrid.repaint();	// 선택 데이터 컬럼색상 변경하기 위한 그리드 새로 그리기
	getFileGrid.clearSelect();
	reqFileGrid.repaint();
	reqFileGrid.clearSelect();
}
//신청
function btnRequest_Click() {
	
}