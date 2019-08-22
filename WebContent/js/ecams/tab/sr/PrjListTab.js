/** PrjList 화면 정의 (공통화면)
 * 
 * <pre>
 * <b>History</b>
 * 	작성자: 이성현
 * 	버전 : 1.1
 *  수정일 : 2019-06-14
 */

var userName 	= window.top.userName;
var userid 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;

var strReqCD 	  = window.parent.strReqCd;
var cboQryGbnData = [];

var cboReqDepartData = null;
var cboCatTypeData   = null;
var firstGridData    = null;
 
var firstGrid 	= new ax5.ui.grid();
var picker 		= new ax5.ui.picker();

//이 부분 지우면 영어명칭으로 바뀜
//ex) 월 -> MON
ax5.info.weekNames = [
 {label: "일"},
 {label: "월"},
 {label: "화"},
 {label: "수"},
 {label: "목"},
 {label: "금"},
 {label: "토"}
];


$('#datStD').val(getDate('DATE',-1));
$('#datEdD').val(getDate('DATE',0));

picker.bind(defaultPickerInfo('basic', 'top'));

firstGrid.setConfig({
    target: $('[data-ax5grid="firstGrid"]'),
    sortable: true, 
    multiSort: true,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            window.parent.iSRID_Click(this.item);
        }
    },
    columns: [
        {key: "cc_srid", label: "SR-ID",  width: '10%'},
        {key: "cc_reqtitle", label: "요청제목",  width: '20%'},
        {key: "createdate", label: "등록일",  width: '10%'},
        {key: "reqcompdat", label: "완료요청일",  width: '10%'},
        {key: "reqdept", label: "요청부서",  width: '10%'},
        {key: "cattype", label: "분류유형",  width: '10%'},
        {key: "chgtype", label: "변경종류",  width: '10%'},
        {key: "status", label: "진행현황",  width: '10%'},
        {key: "workrank", label: "작업순위",  width: '10%'}	 
    ]
});

$(document).ready(function() {
	cboQryGbnData = window.parent.cboQryGbnData;
	getReqDepartInfo();
	getCboElementPrj();
	
	// 조회 버튼 클릭
	$('#btnQry').bind('click', function() {
		getPrjList();
	});
	
	// 초기화 버튼 클릭
	$('#btnReset').bind('click', function() {
		resetScreen();
	});
	
	// 대상구분 변경시 달력 변경
	$('#cboQryGbn').bind('change', function() {
		changeQryGbn();
	});
	//getPrjList();

	$('#datStD').prop("disabled", true); 
	window.parent.$("#datStD").prop("disabled", true);
	$('#datEdD').prop("disabled", true); 
	window.parent.$("#datEdD").prop("disabled", true);
	$('#btnStD').prop("disabled", true);
	window.parent.$("#btnStD").prop("disabled", true);
	$('#btnEdD').prop("disabled", true);
	window.parent.$("#btnEdD").prop("disabled", true);
	$('#dateDiv').css('pointer-events','none');
});

// 대상구분 변경 시
function changeQryGbn(){
	if(getSelectedVal('cboQryGbn').value === "01"){
		$('#datStD').prop("disabled", true); 
		window.parent.$("#datStD").prop("disabled", true);
		$('#datEdD').prop("disabled", true); 
		window.parent.$("#datEdD").prop("disabled", true);
		$('#btnStD').prop("disabled", true);
		window.parent.$("#btnStD").prop("disabled", true);
		$('#btnEdD').prop("disabled", true);
		window.parent.$("#btnEdD").prop("disabled", true);
		$('#dateDiv').css('pointer-events','none');
	} else {
		$('#datStD').prop("disabled", false); 
		window.parent.$("#datStD").prop("disabled", false);
		$('#datEdD').prop("disabled", false); 
		window.parent.$("#datEdD").prop("disabled", false);
		$('#btnStD').prop("disabled", false);
		window.parent.$("#btnStD").prop("disabled", false);
		$('#btnEdD').prop("disabled", false);
		window.parent.$("#btnEdD").prop("disabled", false);
		$('#dateDiv').css('pointer-events','auto');
	}
	getPrjList();
}

// 요청부서 가져오기
function getReqDepartInfo() {
	var ajaxReturnData = null;
	
	var teamInfoData 		= new Object();
	teamInfoData.SelMsg 	= 'ALL';
	teamInfoData.cm_useyn 	= 'Y';
	teamInfoData.gubun 		= 'req';
	teamInfoData.itYn 		= 'N';
	
	var teamInfo = {
		teamInfoData: 	teamInfoData,
		requestType: 	'SET_TEAM_INFO'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/PrjListTab', teamInfo, 'json');
	
	if(ajaxReturnData !== 'ERR') {
		console.dir(ajaxReturnData);
		cboReqDepartData = ajaxReturnData;
		options = [];
		$.each(cboReqDepartData,function(key,value) {
			options.push({value: value.cm_deptcd, text: value.cm_deptname});
		});
		
		$('[data-ax5select="cboReqDepart"]').ax5select({
	        options: options
		});
	}
}

// 분류유형, 대상구분 가져오기
function getCboElementPrj() {
	var codeInfos = getCodeInfoCommon( [new CodeInfo('CATTYPE','ALL','N')] );
	cboCatTypeData 	= codeInfos.CATTYPE;
	//cboQryGbnData 	= codeInfos.QRYGBN;
	
	console.log(cboCatTypeData);
//	console.log(cboQryGbnData);
	options = [];
	$.each(cboCatTypeData,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	
	$('[data-ax5select="cboCatType"]').ax5select({
        options: options
	});
	
	options = [];
//	$.each(cboQryGbnData,function(key,value) {
//		options.push({value: value.cm_micode, text: value.cm_codename});
//	});
	
	$('[data-ax5select="cboQryGbn"]').ax5select({
        //options: options
		options: cboQryGbnData
	});
	
	
	for(var i=0; i<cboQryGbnData.length; i++) {
		if(cboQryGbnData[i].value == "01") {
			$('[data-ax5select="cboQryGbn"]').ax5select("setValue", cboQryGbnData[i].value, true);
			break;
		}
	}
	
	$('[data-ax5select="cboQryGbn"]').ax5select("setValue", '01', true);	// select 초기값 셋팅 '01'에는 해당 내용의 value값 입력
	
	getPrjList();
}

function getPrjList() {
	var prjData = new Object();
	var ajaxReturnData = null;
	
	prjData.userid 	= userid;
	prjData.reqcd 	= strReqCD;
	
	prjData.secuyn 	= 'Y';
	prjData.admin = adminYN;
	
	prjData.qrygbn = getSelectedVal('cboQryGbn').value;

	if(getSelectedVal('cboQryGbn').value === '00') {
		prjData.stday = replaceAllString($("#datStD").val(), '/', '');
		prjData.edday = replaceAllString($("#datEdD").val(), '/', '');
	}
	
	if(getSelectedIndex('cboReqDepart') > 0){
		prjData.reqdept = getSelectedVal('cboReqDepart').value;
	}
	
	if(getSelectedIndex('cboCatType') > 0){
		prjData.cattype = getSelectedVal('cboCatType').value;
	}
	
	//사용안하는 reqCd들인듯..
	if( strReqCD === '99' || strReqCD === 'LINK' || strReqCD === 'CP43' || strReqCD === 'CP44') {
		//prjInfoData.isrid = strIsrId;
		//prjInfoData.secuyn = "N";
	}
	
	console.log(prjData);
	
	var prjInfo = {
		prjInfoData: 	prjData,
		requestType: 	'GET_PRJ_INFO'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webPage/srcommon/PrjListTab', prjInfo, 'json');
	console.log(ajaxReturnData);
	if(ajaxReturnData !== 'ERR') {
		firstGridData = ajaxReturnData;
		firstGrid.setData(firstGridData);
		
		if(firstGridData.length > 0) {
			firstGrid.select(0);
			//window.parent.iSRID_Click(firstGrid.list[firstGrid.selectedDataIndexs]);
			window.parent.callSRRegister(firstGrid.list[firstGrid.selectedDataIndexs]);
		}
	}
}

// prjListTab 화면 초기화 버튼 클릭
function resetScreen() {
	$('[data-ax5select="cboReqDepart"]').ax5select("setValue", '0', true);
	$('[data-ax5select="cboCatType"]').ax5select("setValue", '00', true);
	$('[data-ax5select="cboQryGbn"]').ax5select("setValue", '01', true);
	$('#datStD').prop("disabled", true); 
	window.parent.$("#datStD").prop("disabled", true);
	$('#datEdD').prop("disabled", true); 
	window.parent.$("#datEdD").prop("disabled", true);
	$('#btnStD').prop("disabled", true);
	window.parent.$("#btnStD").prop("disabled", true);
	$('#btnEdD').prop("disabled", true);
	window.parent.$("#btnEdD").prop("disabled", true);

	var today = getDate('DATE',-1);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	$('#datStD').val(today);
	window.parent.$("#datStD").val(today);
	
	today = getDate('DATE',0);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	$('#datEdD').val(today);
	window.parent.$("#datEdD").val(today);
	
	getPrjList();
}