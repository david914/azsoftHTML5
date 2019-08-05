
var userid 		= window.top.userId;
var strReqCD 	= window.top.reqCd;


var firstGrid 	= new ax5.ui.grid();
var picker 		= new ax5.ui.picker();

var options 		= [];

var firstGridData 	= null; //그리드 데이타
var cboDept1Data 	= null; //요청부서 데이타
var cboDept2Data	= null; //등록부서 데이타
var cboSta1Data		= null; //SR상태 데이타
var cboSta2Data		= null; //개발자상태 데이타

var data =  new Object();

ax5.info.weekNames = [
    {label: "일"},
    {label: "월"},
    {label: "화"},
    {label: "수"},
    {label: "목"},
    {label: "금"},
    {label: "토"}
];

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
        },
        onDBLClick: function () {
        	if (this.dindex < 0) return;
			openWindow(this.item.isrid);
        },
    	trStyleClass: function () {
    		if(this.item.colorsw === '3' || this.item.colorsw === 'A'){
    			return "fontStyle-cncl";
    		} else if (this.item.colorsw === 'R'){
    			return "fontStyle-rec";
    		} else if (this.item.colorsw === 'C'){
    			return "fontStyle-dev";
    		} else if (this.item.colorsw === 'T'){
    			return "fontStyle-test";
    		} else if (this.item.colorsw === 'P'){
    			return "fontStyle-apply";
    		} else if (this.item.colorsw === '9'){
    			return "fontStyle-end";
    		} else {
    		}
    	},
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    contextMenu: {
        iconWidth: 20,
        acceleratorWidth: 100,
        itemClickAndClose: false,
        icons: {
            'arrow': '<i class="fa fa-caret-right"></i>'
        },
        items: [
            {type: 1, label: "SR정보"}
        ],
        popupFilter: function (item, param) {
         	firstGrid.clearSelect();
         	firstGrid.select(Number(param.dindex));
         	return true;
        },
        onClick: function (item, param) {
        	openWindow(param.item.isrid);
            firstGrid.contextMenu.close();//또는 return true;
        }
    },
    columns: [
        {key: "isrid", label: "SR-ID",  width: '9%', align: 'left'},
        {key: "genieid", label: "문서번호",  width: '10%', align: 'left'},
        {key: "recvdate", label: "등록일",  width: '8%'},
        {key: "reqdept", label: "요청부서",  width: '5%'},
        {key: "reqsta1", label: "SR상태",  width: '8%', align: 'left'},
        {key: "reqtitle", label: "요청제목",  width: '6%', align: 'left'},
        {key: "reqedday", label: "완료요청일",  width: '8%'},
        {key: "comdept", label: "등록부서",  width: '8%', align: 'left'},
        {key: "recvuser", label: "등록인",  width: '10%', align: 'left'},
        {key: "recvdept", label: "개발부서",  width: '8%'},
        {key: "devuser", label: "개발담당자",  width: '6%', align: 'left'},
        {key: "reqsta2", label: "개발자상태",  width: '4%'},
        {key: "chgdevterm", label: "개발기간", width: '10%', align: 'left'},
        {key: "chgdevtime", label: "개발계획공수", width: '10%', align: 'left'},
        {key: "realworktime", label: "개발투입공수", width: '10%', align: 'left'},
        {key: "chgpercent", label: "개발진행율", width: '10%', align: 'left'},
        {key: "chgedgbn", label: "변경종료구분", width: '10%', align: 'left'},
        {key: "chgeddate", label: "변경종료일", width: '10%', align: 'left'},
        {key: "isredgbn", label: "SR완료구분", width: '10%', align: 'left'},
        {key: "isreddate", label: "SR완료일", width: '10%', align: 'left'}
    ]
});

$(document).ready(function(){
	if(strReqCD == '' || strReqCD == null){
		strReqCd = 'MY';
	}
	
	if (strReqCd == 'MY' || strReqCd == '1' || strReqCd == 'A' ) {
		sel_qry_myself.selected = true;
	} else if (strReqCd == '01'){
		sel_qry_all.selected = true;
	} else {
    	sel_qry_all.selected = false;
    }
	
	dateInit();
	dept_set1();
	getCodeInfo();
	
	//엑셀저장버튼
	$('#btnExcel').bind('click', function() {
		firstGrid.exportExcel("grid-to-excel.xls");
	});
	//조회버튼
	$('#btnQry').bind('click', function() {
		
	});
	//초기화버튼
	$('#btnReset').bind('click', function() {
		resetScreen();
	});
});

function dateInit() {
	$('#datStD').val(getDate('DATE',0));
	datReqDate.bind(defaultPickerInfo('datStD', 'top'));
	$('#datEdD').val(getDate('DATE',0));
	datReqDate.bind(defaultPickerInfo('datEdD', 'top'));
}

//요청부서 가져오기
function dept_set1(){
	data =  new Object();
	data = {
		SelMsg			: 'ALL',
		cm_useyn		: 'Y',
		gubun			: 'req',
		itYn			: 'N',
		requestType		: 'getTeamInfoGrid2'
	}
	ajaxAsync('/webPage/regist/SRStatus', data, 'json',successGetTeamInfoGrid1);
}
//요청부서 가져오기 완료
function successGetTeamInfoGrid1(data) {
	cboDept1Data = data;
	
	options = [];
	$.each(cboDept1Data,function(key,value) {
		options.push({value: value.cm_deptcd, text: value.cm_deptname});
	});
	
	$('[data-ax5select="cboDept1"]').ax5select({
        options: options
	});
	
	dept_set2();
} 
//등록부서 가져오기
function dept_set2(){
	data =  new Object();
	data = {
		SelMsg			: 'ALL',
		cm_useyn		: 'Y',
		gubun			: 'DEPT',
		itYn			: 'N',
		requestType		: 'getTeamInfoGrid2'
	}
	ajaxAsync('/webPage/regist/SRStatus', data, 'json',successGetTeamInfoGrid2);
}
//등록부서 가져오기완료
function successGetTeamInfoGrid2(data) {
	cboDept2Data = data;
	
	options = [];
	$.each(cboDept2Data,function(key,value) {
		options.push({value: value.cm_deptcd, text: value.cm_deptname});
	});
	
	$('[data-ax5select="cboDept2"]').ax5select({
        options: options
	});
}
//sr상태, 개발자상태 데이타가져오기
function getCodeInfo(){
	var codeInfos = getCodeInfoCommon([
										new CodeInfo('ISRSTA','ALL','N'),
										new CodeInfo('ISRSTAUSR','ALL','N')
									  ]);
	cboSta1Data	= codeInfos.ISRSTA;
	cboSta2Data = codeInfos.ISRSTAUSR;
	
	options = [];
	$.each(cboSta1Data,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	options.push({value: 'XX', text: '미완료전체'});
	$('[data-ax5select="cboSta1"]').ax5select({
        options: options
	});
	
	options = [];
	$.each(cboSta2Data,function(key,value) {
		options.push({value: value.cm_micode, text: value.cm_codename});
	});
	options.push({value: 'XX', text: '미완료전체'});
	$('[data-ax5select="cboSta2"]').ax5select({
        options: options
	});
}
//초기화
function resetScreen() {
	var today = getDate('DATE',0);
	today = today.substr(0,4) + '/' + today.substr(4,2) + '/' + today.substr(6,2);
	$('#datStD').val(today);
	$('#datEdD').val(today);
	
	firstGrid.setData([]); 													// grid 초기화
	$('[data-ax5select="cboDept1"]').ax5select("setValue", 	'', 	true); 	// 요청부서 초기화
	$('[data-ax5select="cboDept2"]').ax5select("setValue", 	'', 	true); 	// 등록부서 초기화
	$("#txtSpms").val('');													// SR-ID 초기화
	
	$('[data-ax5select="cboSta2"]').ax5select("setValue", 'XX',	true);
	// SR상태,개발자상태 초기화
	if(strReqCd == "01"){
		$('[data-ax5select="cboSta1"]').ax5select("setValue", '0', 	true);
	}else if(strReqCd == "02"){
		$('[data-ax5select="cboSta1"]').ax5select("setValue", '2', 	true);
	}
	data_setEnable();
}
function data_setEnable() {
	
	if (getSelectedIndex('cboSta1') < 0) return;
	
	if (getSelectedIndex('cboSta1') == 0 ||
			getSelectedVal('cboSta1').value == '3' ||
			getSelectedVal('cboSta1').value == '8' ||
			getSelectedVal('cboSta1').value == '9') {
		
	    if ( getSelectedVal('cboSta2').value == '00' ) {
			$('#datStD').prop("disabled", false);
			$('#datEdD').prop("disabled", false);
	    } else {
			$('#datStD').prop("disabled", true);
			$('#datEdD').prop("disabled", true);
	    }
	}
	
	if (getSelectedVal('cboSta1').value == '0' || getSelectedVal('cboSta1').value == 'XX') {
		$('#datStD').prop("disabled", true);
		$('#datEdD').prop("disabled", true);
	}
	if (getSelectedVal('cboSta2').value == 'XX') {
		$('#datStD').prop("disabled", true);
		$('#datEdD').prop("disabled", true);
	}
}
function fnChange(args){ // 달력 활성화
	$('#datStD').attr('disabled', true);
	$('[name="_datStD_sub"]').attr('disabled', true);
	$('#datEdD').attr('disabled', true);
	$('[name="_datEdD_sub"]').attr('disabled', true);
	if(SBUxMethod.get("cboSta1") == "00" || SBUxMethod.get("cboSta1") == "0" || SBUxMethod.get("cboSta1") == "3" || SBUxMethod.get("cboSta1") == "8" || SBUxMethod.get("cboSta1") == "9"){
		if(SBUxMethod.get("cboSta2") == "00"){
			$('#datStD').attr('disabled', false);
			$('[name="_datStD_sub"]').attr('disabled', false);
			$('#datEdD').attr('disabled', false);
			$('[name="_datEdD_sub"]').attr('disabled', false);
		}else{
			$('#datStD').attr('disabled', true);
			$('[name="_datStD_sub"]').attr('disabled', true);
			$('#datEdD').attr('disabled', true);
			$('[name="_datEdD_sub"]').attr('disabled', true);
		}
	}
}

function cmdQry_Proc(){	// 조회
	var ajaxResultData = null;
	var errSw = false;
	if(SBUxMethod.get("cboSta2") != "00" && SBUxMethod.get("cboSta1") != "00"){
		if(SBUxMethod.get("cboSta2") != "3" && SBUxMethod.get("cboSta2") != "8" && SBUxMethod.get("cboSta2") != "9"){	// 3 : 제외 / 8 : 진행중단 / 9 : 완료
			if(SBUxMethod.get("cboSta1") == "0") errSw = true;
			else if(SBUxMethod.get("cboSta1") == "3") errSw = true;
			else if(SBUxMethod.get("cboSta1") == "8") errSw = true;
			else if(SBUxMethod.get("cboSta1") == "9") errSw = true;
    	}
	}
	
	if(errSw){
		alert("상태를 정확하게 선택하여 주시기 바랍니다.");
		return;
	}
	
	var strStD = SBUxMethod.get("datStD");
	var strEdD = SBUxMethod.get("datEdD");
	var tmpObj = {};
	
	if(strStD > strEdD){
		alert("조회기간을 정확하게 선택하여 주십시오.");
		return;
	}  
	
	if(!$('#datStD').is(':disabled')  && !$('#datEdD').is(':disabled')){
		tmpObj.stday = strStD;
    	tmpObj.edday = strEdD;	 
	}  
	
	if(SBUxMethod.get("cboDept1") != "0" ) {
		tmpObj.reqdept = SBUxMethod.get("cboDept1");
	}
	
	if(SBUxMethod.get("cboDept2") != "0" ){
		tmpObj.recvdept = SBUxMethod.get("cboDept2");
	}
	if(SBUxMethod.get("cboSta1") != "00"){
		tmpObj.reqsta1 = SBUxMethod.get("cboSta1");
	}
	if(SBUxMethod.get("cboSta2") != "00"){
		tmpObj.reqsta2 = SBUxMethod.get("cboSta2");
	}
	
	if(SBUxMethod.get("txtTit") != undefined && SBUxMethod.get("txtTit").length > 0){
		tmpObj.reqtit = SBUxMethod.get("txtTit");
	}
	
	if(JSON.stringify(SBUxMethod.get('rdo_norm')) == '"T"'){
		tmpObj.selfsw = "M";	
	} else if(JSON.stringify(SBUxMethod.get('rdo_norm')) == '"A"') {
		tmpObj.selfsw = "T";
	} else {
		tmpObj.selfsw = "N";
	}          	
					
	tmpObj.userid = userid;

	var tmpData = {
			prjData: 		JSON.stringify(tmpObj),
			requestType : 'PrjInfo'			
	}
	
	ajaxResultData = ajaxCallWithJson('/webPage/regist/SRStatus', tmpData, 'json');
	
	var cnt = Object.keys(ajaxResultData).length;				// json 객체 길이 구하기			
	SBUxMethod.set('lbTotalCnt', '총'+cnt+'건');	// 총 개수 표현		
	
	grid_data = ajaxResultData;
	//datagrid.rebuild(); 		// rebuild 없어도 나오긴 함 검색버튼 두번 누르면    	
	datagrid.refresh();
	
	$(ajaxResultData).each(function(i){
		if(ajaxResultData[i].color == '3' || ajaxResultData[i].color == 'A'){
			datagrid.setRowStyle(i+1, 'data', 'color', '#FF0000');	//반려 또는 취소
			datagrid.setRowStyle(i+1, 'data', 'font-weight', 'bold');
		} else if (ajaxResultData[i].color == 'R'){
			datagrid.setRowStyle(i+1, 'data', 'color', '#FF8000');	// 접수
			datagrid.setRowStyle(i+1, 'data', 'font-weight', 'bold');
		} else if (ajaxResultData[i].color == 'C'){
			datagrid.setRowStyle(i+1, 'data', 'color', '#145A32');	// 개발
			datagrid.setRowStyle(i+1, 'data', 'font-weight', 'bold');
		} else if (ajaxResultData[i].color == 'T'){
			datagrid.setRowStyle(i+1, 'data', 'color', '#BE81F7');	// 테스트
			datagrid.setRowStyle(i+1, 'data', 'font-weight', 'bold');
		} else if (ajaxResultData[i].color == 'P'){
			datagrid.setRowStyle(i+1, 'data', 'color', '#045FB4');	// 적용
			datagrid.setRowStyle(i+1, 'data', 'font-weight', 'bold');
		} else if (ajaxResultData[i].color == '9'){
			datagrid.setRowStyle(i+1, 'data', 'color', '#2E2E2E');	// 처리완료
			datagrid.setRowStyle(i+1, 'data', 'font-weight', 'bold');
		}
	});
}
