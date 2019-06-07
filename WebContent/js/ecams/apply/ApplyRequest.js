/**
 * 사용자정보 화면의 기능 정의
 * 
 * 	작성자: 정선희
 * 	버전 : 1.0
 *  수정일 : 2019-05-27
 * 
 */
var userId = window.parent.userId;

var getFileGrid		= new ax5.ui.grid();
var reqFileGrid		= new ax5.ui.grid();
var datReqDate 		= new ax5.ui.picker();

var cboOptions = [];

var cboReqGbnData   = null;

$(document).ready(function(){
	$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'square-dot-blue', highlightLabel: true});

	document.getElementById('panCal').style.visibility = "hidden";
	
	dateInit();
	getCodeInfoList();
	getSRInfoList();
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

//SR정보
function getSRInfoList() {
	cboOptions = [];
	/*$.each(data,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});*/
	$('[data-ax5select="cboSrId"]').ax5select({
      options: cboOptions
	});
}

//시스템 리스트
function getSysInfoList() {
	var sysListInfo;
	var sysListInfoData;
	sysListInfo 		= new Object();
	sysListInfo.clsSw 	= false;
	sysListInfo.SysCd 	= null;
	
	sysListInfoData = new Object();
	sysListInfoData = {
		sysInfo	: 	sysListInfo,
		requestType	: 	'GETSYSINFOLIST'
	}
	console.log(sysListInfo);
	
	ajaxAsync('/webPage/administrator/SysInfoServlet', sysListInfoData, 'json',successGetSysInfoList);
}
//시스템 리스트
function successGetSysInfoList(data) {
	cboOptions = [];
	$.each(data,function(key,value) {
		cboOptions.push({value: value.cm_syscd, text: value.cm_sysmsg});
	});
	$('[data-ax5select="cboSys"]').ax5select({
        options: cboOptions
	});

	var selectedSysCboSysInfo = $('[data-ax5select="cboSys"]').ax5select("getValue");
	selectedSysCboSysInfo = selectedSysCboSysInfo[0];

	getRsrcInfo(selectedSysCboSysInfo.value);
}
//시스템선택->업무조회
function cboSysChange() {
	var selectedIndex = $('#cboSys option').index($('#cboSys option:selected'));
	
	var selectedSysCboSysInfo = $('[data-ax5select="cboSys"]').ax5select("getValue");
	selectedSysCboSysInfo = selectedSysCboSysInfo[0];

	getRsrcInfo(selectedSysCboSysInfo.value);
}

//프로그램유정보
function getRsrcInfo(syscd) {

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
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 20,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	DownClickGrid();
        },
    	trStyleClass: function () {
    		if(this.item.closeSw === 'Y'){
    			return "text-danger";
    		}
    	},
    	onDataChanged: function(){
    		this.self.repaint();
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
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 20,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	UpClickGrid();
        },
    	trStyleClass: function () {
    		if(this.item.closeSw === 'Y'){
    			return "text-danger";
    		}
    	},
    	onDataChanged: function(){
    		this.self.repaint();
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