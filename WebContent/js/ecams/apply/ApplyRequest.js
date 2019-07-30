/**
 * 체크인,테스트적용,운영적용 신청화면
 * 
 * 	작성자: 정선희
 * 	버전 : 1.0
 *  수정일 : 2019-05-27
 * 
 */
var userId = window.top.userId;
var reqCd = window.top.reqCd;
console.log("!!!reqCd:"+reqCd);

var firstGrid		= new ax5.ui.grid();
var secondGrid		= new ax5.ui.grid();
var datReqDate 		= new ax5.ui.picker();
var befJobModal 		= new ax5.ui.modal();
var approvalModal 		= new ax5.ui.modal();

var request         =  new Request();

var cboOptions = [];

var srSw            = false;
var sysData  = null; //시스템콤보
var cboReqGbnData   = null;
var srData	= null;	//SR-ID 콤보
var firstGridData = []; //신청대상그리드
var secondGridData = [];
var gridSimpleData = [];
var cboReqData = [];
var firstGridColumns = null;
var secondGridColumns = null;
var localHome = '';
var exlSw = false;
var qrySw = false;
var outpos = '';
var ingSw = false;
var closeSw = false;
var confirmData = [];
var rsrccdData = null;
var swEmg = false;
var strAplyDate = '';
var scriptData = [];
var befJobData = [];
var upFiles = [];
var befCheck = true; // 체크박스 변경시 이벤트가 바로 걸려 체크하기위한 변수
var confirmInfoData = null;

firstGrid.setConfig({
    target: $('[data-ax5grid="firstGrid"]'),
    sortable: true, 	// 그리드 sort 가능 여부(true/false)
    multiSort: true,	// 그리드 모든 컬럼 sort 선언(true/false)
    multipleSelect: true,	// 그리드 ROW 선택 시 다중 선택 가능하게 할지 여부(true/false)
    showRowSelector: true,	// 그리드에 체크박스 보이게 할지 여부(true/false)
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	this.self.clearSelect();
        	this.self.select(this.dindex);
        	addDataRow();
        },
    	onDataChanged: function(){
    		//그리드 새로고침 (스타일 유지)
    	    this.self.repaint();
    	},
    	trStyleClass: function () {
    		if (this.item.selected_flag === '1'){
    			return "fontStyle-cncl";
    		}
    		else {
    		}
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
            {type: 1, label: "추가"}
        ],
        popupFilter: function (item, param) {
         	//firstGrid.clearSelect();
         	//firstGrid.select(Number(param.dindex));
        	if(firstGrid.getList('selected').length < 1){
        		return false;
        	}
         	return true;
       	 
        },
        onClick: function (item, param) {
	        addDataRow();
	        firstGrid.contextMenu.close();//또는 return true;
        	
        }
    },
    columns: [
        {key: "cr_rsrcname", label: "프로그램명",  width: '7%'},
        {key: "jawon", label: "프로그램종류",  width: '7%'},
        {key: "cr_story", label: "프로그램설명",  width: '7%'},
        {key: "pcdir", label: "프로그램경로",  width: '30%'},
        {key: "cm_codename", label: "상태",  width: '5%'},
        {key: "enddate", label: "수정일자",  width: '18%'},
        {key: "cr_lstver", label: "버전",  width: '5%'},
        {key: "cm_username", label: "신청자",  width: '7%'},
        {key: "pcdir", label: "로컬디렉토리",  width: '14%', id:'localHome'}
    ]
});

secondGrid.setConfig({
    target: $('[data-ax5grid="secondGrid"]'),
    sortable: true, 	// 그리드 sort 가능 여부(true/false)
    multiSort: true,	// 그리드 모든 컬럼 sort 선언(true/false)
    multipleSelect: true,	// 그리드 ROW 선택 시 다중 선택 가능하게 할지 여부(true/false)
    showRowSelector: true,	// 그리드에 체크박스 보이게 할지 여부(true/false)
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 28,
        onClick: function () {
        	this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	this.self.clearSelect();
        	this.self.select(this.dindex);
        	deleteDataRow();
        },
    	onDataChanged: function(){
    		//그리드 새로고침 (스타일 유지)
    		simpleData();
    	    this.self.repaint();
    	},
    	trStyleClass: function () {
    		if (this.item.cr_itemid != this.item.baseitem){
    			return "fontStyle-module";
    		}
    		else {
    		}
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
            {type: 1, label: "제거"}
        ],
        popupFilter: function (item, param) {
        	//secondGrid.clearSelect();
        	//secondGrid.select(Number(param.dindex));
        	if(secondGrid.getList('selected').length < 1){
        		return false;
        	}
         	return true;
       	 
        },
        onClick: function (item, param) {
	        	
	        deleteDataRow();
	        secondGrid.contextMenu.close();//또는 return true;
        	
        }
    },
    columns: [
        {key: "cr_rsrcname", label: "프로그램명",  width: '7%'},
        {key: "jawon", label: "프로그램종류",  width: '7%'},
        {key: "cr_story", label: "프로그램설명",  width: '7%'},
        {key: "pcdir", label: "프로그램경로",  width: '30%'},
        {key: "checkin", label: "신청구분",  width: '7%'},
        {key: "diffrst", label: "비교결과",  width: '10%'},
        {key: "pcdir", label: "로컬디렉토리",  width: '14%', id:'localHome'}
    ]
});

if(reqCd != '07'){ // 테스트배포, 운영배포 그리드 컬럼수정
    var columns = [
        {key: "cr_rsrcname", label: "프로그램명",  width: '7%'},
        {key: "jawon", label: "프로그램종류",  width: '7%'},
        {key: "cr_story", label: "프로그램설명",  width: '7%'},
        {key: "pcdir", label: "프로그램경로",  width: '30%'},
        {key: "editRow", label: "컴파일순서",  width: '7%', editor: {type: "text"}},
        {key: "cr_lstver", label: "형상관리버전",  width: '7%'},
        {key: "cr_version", label: "배포대상버전",  width: '7%'},
        {key: "cr_realver", label: "현운영버전",  width: '7%'}
    ];
    
    secondGrid.config.columns = columns;
    secondGrid.setConfig();
}

$('[data-ax5select="cboSrId"]').ax5select({
    options: []
});

$('[data-ax5select="cboSys"]').ax5select({
    options: []
});

$('[data-ax5select="cboRsrccd"]').ax5select({
    options: []
});

$(document).ready(function(){
	$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

	document.getElementById('panCal').style.visibility = "hidden";
	
	$('#chkDetail').bind('click',function(){
		simpleData();
	});
	
	$('#btnAdd').bind('click',function(){
		addDataRow();
	});
	
	$('#btnDel').bind('click',function(){
		deleteDataRow();
	});
	
	// 처리구분
	$('#cboReqGbn').bind('change',function(){
		cboReqGbnClick();
	});
		
	$('#cboSrId').bind('change',function(){
		changeSrId();
	});
	
	$('#cboSys').bind('change',function(){
		changeSys();
	});
	
	$('#btnFind').bind('click',function(){
		findProc();
	});

	$('#btnRequest').bind('click',function(){
		bntRequestClick();
	});
	
	$('#txtRsrcName').bind('keypress',function(event){
		if(event.keyCode == 13 && $('#txtRsrcName').val().trim().length > 0){
			findProc();
		}
	});
	
	//프로그램 유형
	$('#cboRsrccd').bind('change',function(){
		if(getSelectedIndex('cboRsrccd') > -1 || $('#txtRsrcName').val().trim().length > 0){
			findProc();
		}
	});
	
	$('#chkSvr').parent('div.wCheck').hide();
	$('#chkSvr').parent('div.wCheck').siblings('label[for="chkSvr"]').hide();
	
	//체크인
	if(reqCd == '07'){
		$('#lblReqGbn, #cboReqGbn').hide();
		$('#btnRequest').text('체크인신청');
		$('#chkBefJob').parent('div.wCheck').hide();
		$('#chkBefJob').parent('div.wCheck').siblings('label[for="chkBefJob"]').hide();
	}
	else if (reqCd == '03'){ //테스트배포
		$('#btnRequest').text('테스트배포신청');
		$('#cboReqDiv').hide();
		$('#chkBefJob').parent('div.wCheck').hide();
		$('#chkBefJob').parent('div.wCheck').siblings('label[for="chkBefJob"]').hide();
		$('#btnDiff').hide();
	}
	else{ //운영배포
		$('#btnRequest').text('운영배포신청');
		$('#chkBefJob').show();
		$('#cboReqDiv').hide();
		$('#btnDiff').hide();
	}
	
	$('#chkBefJob').bind('change',function(){
		if($("#chkBefJob").parent(".wCheck").css('display') == "none"){
			return;
		}
		if(befCheck){
			befCheck = false;
			return;
		}
		if($('#chkBefJob').is(':checked')){
			befJobModal.open({
		        width: 915,
		        height: 580,
		        iframe: {
		            method: "get",
		            url: "../modal/request/BefJobSetModal.jsp",
		            param: "callBack=modalCallBack"
			    },
		        onStateChanged: function () {
		            if (this.state === "open") {
		                mask.open();
		            }
		            else if (this.state === "close") {
		            	if(befJobData.length == 0){
							befCheck = true;
		            		$('#chkBefJob').wCheck('check',false);
		            	}
		                mask.close();
		            }
		        }
			});
		}
		else{
            mask.open();
			confirmDialog.confirm({
				msg: '기 선택된 선행작업이 있습니다. \n 체크해제 시 선행작업이 무시됩니다. \n계속 진행할까요?',
			}, function(){
				if(this.key === 'ok') {
					befJobData = [];
				}
				else{
					befCheck = true;
					$('#chkBefJob').wCheck('check',true);
				}
                mask.close();
			});
		}
	});
	
	dateInit();
	getCodeInfoList();
	getSrIdCbo();
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
	var codeInfos = getCodeInfoCommon([ new CodeInfo('REQPASS','','N'),
														 new CodeInfo("CHECKIN","SEL","n")]);
	cboReqGbnData = codeInfos.REQPASS;
	cboReqData 	  = codeInfos.CHECKIN;
	
	cboOptions = [];
	$.each(cboReqGbnData,function(key,value) {
			cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	$('[data-ax5select="cboReqGbn"]').ax5select({
		options: cboOptions
	});
	if(reqCd == '03'){ // 테스트배포
		$('[data-ax5select="cboReqGbn"]').ax5select("disable");
	}
	cboOptions = [];
	cboOptions.push({value:'99', text:'신규+수정'});
	$.each(cboReqData,function(key,value) {
		if(value.cm_macode == 'CHECKIN' && value.cm_micode != '05' && value.cm_micode != '09' && value.cm_micode != '00'){
			cboOptions.push({value: value.cm_micode, text: value.cm_codename});
		}
	});
	$('[data-ax5select="cboReq"]').ax5select({
		options: cboOptions
	});
	cboReqGbnClick();
}

//시스템 리스트
function getSysCbo() {
	var sysListInfoData = new Object();
	sysListInfoData = {
		UserId	: 	userId,
		ReqCd   :   reqCd,
		requestType	: 	'getSysInfoList'
	}
	
	ajaxAsync('/webPage/apply/ApplyRequest', sysListInfoData, 'json',successGetSysCbo);
}
//시스템 리스트
function successGetSysCbo(data) {
	sysData = data;
	
	if(sysData.length == 0 && reqCd == '03'){
		showTost('권한이 있는 시스템중 테스트환경이 존재하는 시스템이 없습니다. 메뉴의 적용->운영배포 화면을 이용하여 주십시요.');
		return;
	}
	
	cboOptions = [];
	$.each(sysData,function(key,value) {
		cboOptions.push({value: value.cm_syscd, text: value.cm_sysmsg, cm_sysgb: value.cm_sysgb, cm_sysinfo: value.cm_sysinfo, cm_prjname: value.cm_prjname, tstsw: value.TstSw});
	});
	$('[data-ax5select="cboSys"]').ax5select({
        options: cboOptions
	});
	
	if (sysData.length > 0) {
		var selectVal = $('select[name=cboSys] option:eq(1)').val();
		$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
	}
	else {
		$('[data-ax5select="cboRsrccd"]').ax5select({
	        options: []
		});
		var selectVal = $('select[name=cboSys] option:eq(0)').val();
		$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
	}
	getRsrcInfo(getSelectedVal('cboSys').value);
	changeSrId();
	
	if(reqCd == '04'){
		cboReqGbnClick();
	}
}

//SR-ID 선택
function changeSrId() {
	
	$('#txtSayu').val('');
	$('#btnSR').prop('disabled',true);
	firstGrid.setData([]);
	fristGridData = [];
	
	var bSyscd = '';
	
	if (getSelectedIndex('cboSrId') > 0) {
		$('#btnSR').prop('disabled',false);
		$('#txtSayu').val(getSelectedVal('cboSrId').text);
		
		//긴급 SR 일때 처리구분 콤보 긴급으로 고정 시작
		if ( reqCd === '04' && getSelectedVal('cboSrId').cc_chgtype === '01' ) {
			$('[data-ax5select="cboReqGbn"]').ax5select('setValue','2',true);
			cboReqGbnClick();
			
			$(cboReqGbnData).each(function(i){
				if(this.cm_micode == '2'){ // 2:긴급배포
					var selectVal = $('select[name=cboReqGbn] option:eq('+i+')').val();
					$('[data-ax5select="cboReqGbn"]').ax5select('setValue',selectVal,true);
					$('[data-ax5select="cboReqGbn"]').ax5select('disable');
					cboReqGbnClick();
					return false;
				}
			});
		}
		else if (reqCd == '04'){
			if(cboReqGbnData.length>0){
				var selectVal = $('select[name=cboReqGbn] option:eq(0)').val();
				$('[data-ax5select="cboReqGbn"]').ax5select('setValue',selectVal,true);
				cboReqGbnClick();
			}
		}
	}
	
	if(sysData.length > 0){
		var sysLength = sysDataFilter();

		var sysSelectIndex = 0;
		if(sysLength == 1 || getSelectedIndex('cboSrId') == 0) sysSelectIndex = 0;
		else sysSelectIndex = 1;

		var selectVal = $('select[name=cboSys] option:eq('+sysSelectIndex+')').val();
		$('[data-ax5select="cboSys"]').ax5select('setValue',selectVal,true);
		
	}
	
	changeSys();
}
//프로그램유정보
function getRsrcInfo(syscd) {
	rsrccdData = null;
	var ajaxReturnData;
	if (syscd === '00000') {
		$('[data-ax5select="cboRsrccd"]').ax5select({
	      options: []
		});
		$('[data-ax5select="cboRsrccd"]').ax5select("disable");
		return;
	}
	else {
		$('[data-ax5select="cboRsrccd"]').ax5select("enable");
	}
	
	var sysListInfoData;
	sysListInfoData = new Object();
	sysListInfoData = {
		SysCd	: 	syscd,
		SelMsg	: 	'ALL',
		requestType	: 	'RSRCOPEN'
	}
	
	ajaxReturnData = ajaxCallWithJson('/webPage/apply/ApplyRequest', sysListInfoData, 'json');
	
	successGetRsrcInfoList(ajaxReturnData);
}
//프로그램종류리스트
function successGetRsrcInfoList(data) {
	rsrccdData = data;
	cboOptions = [];
	$.each(data,function(key,value) {
		cboOptions.push({value: value.cm_micode, text: value.cm_codename});
	});
	$('[data-ax5select="cboRsrccd"]').ax5select({
      options: cboOptions
	});
}

//SR정보
function getSrIdCbo() {
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
	getSysCbo();
	srData = data;
	
	cboOptions = [];
	
	cboOptions.push({value: 'SR정보 선택 또는 해당없음', text: 'SR정보 선택 또는 해당없음', srid: 'SR정보 선택 또는 해당없음', syscd: '00000', cc_chgtype: ''});
	$.each(srData,function(key,value) {
		cboOptions.push({value: value.cc_srid, text: value.srid, cc_reqtitle:value.cc_reqtitle, syscd:value.syscd, cc_chgtype: value.cc_chgtype});
	});
	$('[data-ax5select="cboSrId"]').ax5select({
		options: cboOptions
	});
	
	if (srData.length > 1) {
		var selectVal = $('select[name=cboSrId] option:eq(1)').val();
		$('[data-ax5select="cboSrId"]').ax5select('setValue',selectVal,true);
	}
}

//처리구분선택
function cboReqGbnClick() {
	$('#txtReqTime').val('18:30');
	
	if(getSelectedIndex('cboReqGbn') > -1){
		swEmg = false;
		if(getSelectedVal('cboReqGbn').value == '02'){// 긴급적용
			swEmg = true;
		}
		else	if (getSelectedVal('cboReqGbn').value == '4') {
			document.getElementById('panCal').style.visibility = "visible";
			return;
		}
		document.getElementById('panCal').style.visibility = "hidden";
	}
}


//신청대상목록 조회
function findProc() {
	firstGrid.setData([]);
	firstGridData = [];

	if(qrySw) {
		showToast('검색 또는 신청 진행중 입니다.'); 
		return; //qrySw=true 일때는 검색 또는 신청 진행중일때임
	}
	if (srSw && getSelectedIndex('cboSrId') < 1) return;
	
	
	if (getSelectedIndex('cboSys') < 1) {
		showToast('시스템을 선택하십시오.');
		return;
	}
	var strQry = "";
	
	if(reqCd == '07'){
		if (getSelectedIndex('cboReq') == 0) strQry = "99";//"00";
		else strQry = getSelectedVal('cboReq').value;
	}
	else {
		if( closeSw ) {
			strQry = '05';
		}	
		else if ( reqCd === '03' ) {
			strQry = "03";
		}
		else {
			strQry = "00";
		}
	}
	
	exlSw = false;
	qrySw = true;
	
	var tmpObj = new Object();
	tmpObj.UserId = userId;
	tmpObj.SysCd = getSelectedVal('cboSys').value;
	tmpObj.SinCd = reqCd;
	tmpObj.TstSw = getSelectedVal('cboSys').TstSw;
	tmpObj.RsrcName = $('#txtRsrcName').val();
	tmpObj.DsnCd = "";
	tmpObj.DirPath = "";
	tmpObj.SysInfo = getSelectedVal('cboSys').cm_sysinfo;
	tmpObj.RsrcCd = "";
	if(rsrccdData.length > 0){
		tmpObj.RsrcCd = getSelectedVal('cboRsrccd').value;
	}
	tmpObj.ReqCd = strQry;
	
	if (srSw && getSelectedIndex('cboSrId')>0) {
		
		tmpObj.srid = getSelectedVal('cboSrId').value;//SR사용여부 체크
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
	firstGridData = data;
	console.log(firstGridData);
	if(firstGridData.length == 0 ){
		showToast('검색 결과가 없습니다.');
		return;		
	}
	else if (firstGridData.length > 0){
		if(firstGridData[0].ID =='MAX'){
			showToast('검색결과가 너무 많으니 검색조건을 입력하여 검색하여 주시기 바랍니다.');
			return;
		}
	}
		
	if(reqCd != '07'){ //체크인이 아니라면
		$(firstGridData).each(function(){
			this.pcdir = this.view_dirpath;
			this.cm_codename = this.codename;
			this.enddate = this.lastdt;
		});
	}
	
	if(firstGridData.length > 0 && reqCd == '03'){
		firstGrid.selectAll({selected:true, filter:function(){
			
				return this['selected_flag'] == '1';
			
			}
		});
		addDataRow();
	}
	
	firstGrid.setData(firstGridData);
	qrySw = false;
}

//항목상세보기
function simpleData() {
	if (secondGrid.list.length < 1) return;
	
	gridSimpleData = clone(secondGrid.list);
	if(secondGrid.list.length == 0){
		secondGridData = clone(secondGrid.list);
		return;
	}
	for(var i =0; i < gridSimpleData.length; i++){
		if(gridSimpleData[i].baseitem != gridSimpleData[i].cr_itemid || 
			gridSimpleData[i].cr_itemid == null || gridSimpleData[i].cr_itemid == ''){
			
			gridSimpleData.splice(i,1);
			i--;
		}
	};
	if (!$('#chkDetail').is(':checked')){
		secondGrid.list = clone(gridSimpleData);
		secondGrid.repaint();
	}
	else{
		secondGrid.list = clone(secondGridData);
		secondGrid.repaint();
	}
}
//신청목록추가
function addDataRow() {

	var j = 0;
	var secondGridList = new Array;
	var firstGridSeleted = firstGrid.getList("selected");
	var ajaxReturnData;
	var strRsrcName = '';
	
	if(!exlSw && reqCd == '07'){
		if(getSelectedVal('cboReq').value == '05'){
			if(secondGridData.length > 0 && secondGridData[0].reqcd != '05'){
				showToast('폐기는 다른 신청과 함께 신청할 수 없습니다.');
				return;
			}
		}
		
	}
	
	$(firstGridSeleted).each(function(i){
		if(this.selected_flag == '1' && reqCd != '4'){
			return true;
		}
		
		if(reqCd == '07'){
			if ((this.cm_info.substr(44,1) == "1")){
				if( outpos == 'R'){
					outpos = 'A';
				}
				else if ( outpos != 'A'){
					outpos = 'L';
				}
				if(this.pcdir == null){
					showToast('로컬 홈디렉토리를 지정하지 않았습니다. 기본관리>사용자환경설정에서 홈디렉토리지정 후 처리하시기 바랍니다.');
					return;
				}
			}
			else{
				if( outpos == 'L'){
					outpos = 'A';
				}
				else if(outpos !='A'){
					outpos = 'R';
				}
			}
			if(this.acptno != null && this.acptno != ''){
				if(this.acptno.substring(4,2) == '02'){
					++j;
					if( j==1 ){
						strRsrcName = j +'.'+this.cr_rsrcname;
					}
					else{
						strRsrcName = '\n'+ j + '.'+this.cr_rsrcname;
					}
				}
			}
		}
		
		if(this.selected_flag!='1'){
			this.selected_flag = '1';
			var copyData = this;
			secondGridList.push($.extend({}, copyData, {__index: undefined}));
		}
	});
	
	if(reqCd == '04' && getSelectedIndex('cboSrId') > 0 && firstGridData.length != secondGridList.length){
		showToast('운영에 배포 할 준비가 완료되지 않은 건이 있습니다. 확인 후 진행하시기 바랍니다.');
		return;
	}
	
	
	if ((secondGrid.list.length + secondGridList.length) > 300){
		showToast("300건까지 신청 가능합니다.");
		return;
	}
	
	if(secondGridList.length == 0 ){
		return;
	}
	
	if (strRsrcName.length > 0 && reqCd =='07'){
		confirmDialog.confirm({
			msg: '이전버전으로 체크아웃받은 프로그램이 있습니다. \n"'+strRsrcName + '"\n계속 진행할까요?',
		}, function(){
			if(this.key === 'ok') {
				verCheck();
			}
		});
		return;
	}
	else{
		checkDuplication(secondGridList);
	}
}

function verCheck(){
	var j = 0;
	var secondGridList = new Array;
	var firstGridSeleted = firstGrid.getList("selected");
	var ajaxReturnData;
	
	$(firstGridSeleted).each(function(i){
		if(this.selected_flag == '1'){
			return true
		}
		else{
			if(exlSw && this.errmsg != '정상'){
				return true;
			}
			if(exlSw && this.errmsg != '정상' && this.errmsg != '파일중복'){
				return true;
			}
		}

		if(this.selected_flag!='1'){
			this.selected_flag = '1';
			secondGridList.push($.extend({}, this, {__index: undefined}));
		}
		
	});
	
	checkDuplication(secondGridList);
}

//신청목록에서 제거
function deleteDataRow() {

	outpos = "";
	var secondGridSeleted = secondGrid.getList("selected");
	var originalData = null;
	
	if(reqCd == '04' && secondGridSeleted.length > 0){ // 운영신청일때는 한방에 전부 제거가 되어야 함.
		secondGrid.selectAll({selected: true});
		secondGridSeleted = secondGrid.getList("selected");
	}
	$(secondGridSeleted).each(function(i){
		originalData = null;
		
		if( this.cm_info.substr(3,1) == '1' || this.cm_info.substr(8,1) == '1'){
			if($('#chkDetail').is(':checked')){
				for(var x=0; x<secondGrid.list.length; x++){
					if(secondGrid.list[x].baseitem == this.cr_itemid){
						secondGrid.select(x,{selected:true} );
					}
				}
			}
		}
		else if (this.cr_itemid != this.baseitem){
			for(var x=0; x<secondGrid.list.length; x++){
				if(secondGrid.list[x].cr_itemid == this.baseitem){
					secondGrid.select(x,{selected:true} );
					originalData = secondGrid.list[x].baseitem;
				}
			}
		}
		$(firstGridData).each(function(j){
			if((firstGridData[j].cr_itemid == secondGridSeleted[i].baseitem) || 
				firstGridData[j].cr_itemid == originalData && originalData != null){
				
				firstGridData[j].selected_flag = "0";
				return false;
			}
		});
		
	});
	
	secondGrid.removeRow("selected");
	firstGrid.repaint();
	secondGridData = clone(secondGrid.list);
	
	if (secondGrid.list.length == 0){

		$('[data-ax5select="cboSys"]').ax5select("enable");
		if(srSw) $('[data-ax5select="cboSrId"]').ax5select('enable');
		
		 if ( swEmg == false && reqCd == "04" && getSelectedVal('cboSrId').cc_chgtype != "01" ){
			 $('[data-ax5select="cboReqGbn"]').ax5select("enable");
		 }
		
		$('#btnRequest').prop('disabled',true);
	}
	else if(reqCd == '07'){
		for (i=0 ; i<secondGridData.length ; i++){
			if (secondGridData[i].cm_info.substr(44,1) == "1") {//45	로컬에서개발
				if ( outpos == "R" ) {
					outpos = "A";
				} else if ( outpos != "A" ) {
					outpos = "L";
				}
			} else {
				if ( outpos == "L" ){
					outpos = "A";
				} else if ( outpos != "A" ) {
					outpos = "R";
				}
			}
		}
	}
	//$('#totalCnt').text(secondGrid.list.length);
	
	$('#cboReq').prop('disabled', $('#cboSys').prop('disabled'));
	

}

function checkDuplication(downFileList){
	

	var secondGridList = new Array;
	
	if(secondGridData.length > 0){
		$(secondGridData).each(function(i){
			if(this.cr_itemid != this.baseitem){
				secondGridData.splice(i,1);
			}
		});
	
		$(secondGridData).each(function(i){
			$(downFileList).each(function(j){
				if( secondGridData[i].cr_itemid == downFileList[j].cr_itemid ){
					downFileList.splice(j,1);
					return false;
				}
			});
		});
	}
	if(downFileList.length > 0) {
		$(downFileList).each(function(i){
			var currentItem = downFileList[i];
			$(firstGridData).each(function(j){
				if(firstGridData[j].cr_itemid == currentItem.cr_itemid) {
					if(exlSw){
						firstGridData.splice(j,1);
					}
					else{
						firstGridData[j].selected_flag = '1';
					}
					var copyData = clone(firstGrid.list[j]); //리스트의 주소지를 가져오므로 clone 을 해서 add 해줘야함
					secondGridList.push($.extend({}, copyData, {__index: undefined}));
					secondGridData.push(copyData);
					return false;
				}
				
			});
		});
	}

	firstGrid.repaint();
	secondGrid.addRow(secondGridList);
	exlSw = false;
	
	$('#btnRequest').prop('disabled', false);
	
	if(secondGrid.list.length > 0){
		if(reqCd == '07'){ // 체크인
			$(secondGrid.list).each(function(){
				if(this.cm_info.substr(3,1) == '1' || this.cm_info.substr(8,1) == '1'){
					cmdChkClick();
					return true;
				}
			});
			
			/*
			if ( !chkJob.visible ){//정적분석확인 사용안함
				cmdReq.enabled = true;
			} else if ( chkJob.selected ) {//정적분석확인 사용하면서  체크완료
				cmdReq.enabled = true;
			}
			*/
			
			if(getSelectedVal('cboReq').value == '05') $('data-ax5select="cboReq"').ax5select('disabled');
		}

		$('#btnRequest').prop('disabled', false);
		$('[data-ax5select="cboSys"]').ax5select('disable');
		if(srSw) $('[data-ax5select="cboSrId"]').ax5select('disable');
		simpleData();
	}
	
}

function cmdChkClick(){
	var tmpSayu = $('#txtSayu').val().trim();
	
	if(ingSw){
		showToast('현재 신청하신 건을 처리 중입니다. 잠시 기다려 주시기 바랍니다.');
		return;
	}
	
	if (getSelectedIndex('cboSys') < 1) {
		showToast('시스템을 선택하여 주십시오.');
		return;
	}
	
	if (srSw && getSelectedIndex('cboSrId') < 1) {
		showToast('SR-ID를 선택하여 주십시오.');
		return;
	}
	
	if (srSw && tmpSayu.length == 0) {
		showToast('신청사유를 입력하여 주십시오.');
		return;
	}
	
	if (secondGrid.list.length == 0) {
		showToast('신청 할 파일을 추가하여 주십시오.');
		return;
	}
	
	$(secondGridData).each(function(i){
		if(this.cr_itemid != this.baseitem){
			secondGridData.splice(i,1);
		}
	});
	
	if(secondGridOverlap()){
		return;
	};
	
	ingSw = true;
	cmdReqSubAnal(secondGridData);
	
}

//secondGridData 중복체크
function secondGridOverlap(){
	var retrunData = false;
	$(secondGridData).each(function(i){
		var data = this;
		for(var j = i+1; j<secondGridData.length; j++){
			if(data.cr_titemid != null && data.cr_itemid != ''){
				if(data.cr_itemid == secondGridData[j].cr_itemid){
					showToast('동일한 프로그램이 중복으로 신청되었습니다. 조정한 후 다시 신청하십시오. ['+secondGridData[j].cr_rsrcname+']');
					retrunData = false;
					return true;
				}
			}
			else {
				if(data.cr_syscd == secondGridData[j].cr_syscd &&
				   data.cr_dsncd == secondGridData[j].cr_dsncd &&
				   data.cr_rsrcname == secondGridData[j].cr_rsrcname) {
					
					showToast('동일한 프로그램이 중복으로 신청되었습니다. 조정한 후 다시 신청하십시오. ['+secondGridData[j].cr_rsrcname+']');
					retrunData = false;
					return true;
					
				}
			}
		}
	});
	return retrunData;
}

function cmdReqSubAnal(data){
	var calSw = false;
	
	$(data).each(function(){
		if(this.cm_info.substr(3,1) =='1'){ //4 동시모듈
			calSw = true;
		}
		else if (this.cm_info.substr(8,1) == '1'){ //4 실행모듈
			calSw = true;
		}
	});
	
	if(calSw){ //04	동시적용항목CHECK || 09	실행모듈CHECK 일때
		if(data.length > 0){
			var ajaxReturnData;
			var downFileData = new Object();
			downFileData.sayu = $('#txtSayu').val().trim();
			downFileData.ReqCD = reqCd;
			downFileData.SinCd = reqCd;
			downFileData.TstSw = getSelectedVal('cboSys').TstSw;
			downFileData.syscd = getSelectedVal('cboSys').value;
			downFileData.sysgb = getSelectedVal('cboSys').cm_sysgb;
			downFileData.userid = userId;
			if(closeSw) downFileData.closeyn = 'Y';
			else downFileData.closeyn = 'N'; 
			if ( outpos == "A" || outpos == "L" ) downFileData.localyn = 'Y';
			else downFileData.localyn = "N";
			downFileData.veryn = 'Y';
			//if (chkVer.selected) downFileData.veryn = "N"; 개발배포만 적용
			var tmpData = {
				downFileData : downFileData,
				fileList : data,
				requestType : 'getDownFileList'
			}
			ajaxAsync('/webPage/apply/ApplyRequest', tmpData, 'json',successDownFileData);
			return;
		}
	}
	cmdReqSubSame(data);
}

//정적분석 미개발
function cmdReqSubSame(data){
	var secondGridList = new Array;

	var j = 0; //secondGrid.length
	$(data).each(function(i){
		var dataDetail = this;
		if(secondGrid.list.length <= j){
			if ($('#chkDetail').is(':checked')){
				secondGrid.addRow($.extend({}, dataDetail, {__index: undefined}),i);
			}
			secondGridData.splice(i,0,dataDetail);
			return false;
		}
		if(dataDetail.cr_itemid != secondGrid.list[j].cr_itemid){
			if ($('#chkDetail').is(':checked')){
				secondGrid.addRow($.extend({}, dataDetail, {__index: undefined}),i);
			}
			secondGridData.splice(i,0,dataDetail);
			return false;
		}
		j++;
	});
	
	secondGrid.repaint();
	ingSw = false;
	/*
	if ( !chkJob.visible ){//정적분석확인 사용안함
		cmdReq.enabled = true;
	} else if ( chkJob.selected ) {//정적분석확인 사용하면서  체크완료
		cmdReq.enabled = true;
	} else {//정적분석확인 사용하는데 체크  안됨!
		cmdReq.enabled = false;
	}
	*/
}
function successDownFileData(data){
	var modSw = false;
	var analSw = false;
	
	if(data.length != 0 && data == 'ERR'){
		showToast($('#btnRequest').val+'목록 작성에 실패하였습니다.');
		return;
	}
	else{
		
		$(data).each(function(){
			if(this.cr_itemid == 'ERROR'){
				showToast('파일목록 에러 \n파일경로 : '+thiscm_dirpath);
				ingsw = false;
				return;
			}
			else if(this.modsel == 'Y'){
				modSw = true;
			}
		});
		
	}
	
	//버전UP만적용 미개발
	if (false) {		//if (modSw && !chkSvr.selected ) {
		modPopUp = eCmr0200_relat(PopUpManager.createPopUp(this, eCmr0200_relat, true));
		modPopUp.parentfuc = modRequest;
		modPopUp.width = screen.width - 80;
		modPopUp.height = screen.height - 200;
		modPopUp.modSw = modSw;
		modPopUp.analSw = false;
		modPopUp.title = "배포대상 실행모듈 선택";
		modPopUp.grdMod_dp.source = outData.toArray();
        PopUpManager.centerPopUp(modPopUp);//팝업을 중앙에 위치하도록 함
        modPopUp.minitApp();		
	} else {
		cmdReqSubSame(data);	
	}
}

function sysDataFilter(){
	var sysDataLength = sysData.length;
	options = [];
	for(var i=0; i<sysDataLength ; i++){
		var data = sysData[i];
		
		if(data.cm_sysinfo.substr(0,1) == '1'){
			continue;
		}
		else if (data.cm_syscd =='00000'){
			options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
		}
		else if(data.cm_sysinfo.substr(9,1) == '1'){
				continue;
		}
		else{
			if(getSelectedIndex('cboSrId') > 0){
				
				var syscd = getSelectedVal('cboSrId').syscd;
				var arySyscd = syscd.split(",");
				for(var j=0; j<arySyscd.length; j++){
					if(arySyscd[j] == data.cm_syscd){
						options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
					}
				}
				continue;
			}
			else{
				options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
			}
		}
		
	}

	$('[data-ax5select="cboSys"]').ax5select({
        options: options
	});
	return options.length;
}

function changeSys(){

	$('[data-ax5select="cboRsrccd"]').ax5select({
        options: []
	});

	getRsrcInfo(getSelectedVal('cboSys').value);
	
	firstGrid.setData([]);
	firstGridData = [];
	localHome = "";

	$('#chkBefJob').wCheck('check',false);
	$('#chkBefJob').hide();
	
	if (getSelectedVal('cboSys').cm_stopsw == "1") {
		showToast("이관통제를 위하여 일시적으로 형상관리 사용을 중지합니다.");
		$('#btnSearch').prop('disabled',true);
		return;
	} 
	else $('#btnSearch').prop('disabled',false);
	
	if (getSelectedVal('cboSys').cm_sysinfo.substr(9,1) == "1") srSw = false;
	else srSw = true;
	
	if (srSw) {
		$('[data-ax5select="cboSrId"]').ax5select("enable");
		if(srData.lenght == 2){
			var selectVal = $('select[name=cboSrId] option:eq(1)').val();
			$('[data-ax5select="cboSrId"]').ax5select('setValue',selectVal,true);
		}
	} 
	else { //SR 사용안함
		cboOptions = [];
		cboOptions.push({value: 'SR정보 선택 또는 해당없음', text: 'SR정보 선택 또는 해당없음', srid: 'SR정보 선택 또는 해당없음'});
		$('[data-ax5select="cboSrId"]').ax5select({
			options: cboOptions
		});
		$('[data-ax5select="cboSrId"]').ax5select("disable");
	}
	

	if(getSelectedIndex('cboSrId') < 1){
		if(reqCd != '07'){
			$('#cboReqGbn').prop('disabled',false);
		}
		return;
	}
	
	if(getSelectedIndex('cboSys') > 0 && rsrccdData != null) findProc();
	
	
	//그리드 로컬디렉토리 컬럼 지우기
	firstGridColumns = firstGrid.columns;
	for(var i=0; i<firstGridColumns.length; i++){
		if(firstGridColumns[i].id == 'localHome'){
			firstGrid.removeColumn(i);
		}
	}
	secondGridColumns = secondGrid.columns;
	for(var i=0; i<secondGridColumns.length; i++){
		if(secondGridColumns[i].id == 'localHome'){
			secondGrid.removeColumn(i);
		}
	}
	
	if(getSelectedVal('cboSys').localyn == 'S'){
		
	}
	else{
		if(getSelectedVal('cboSys').localyn == 'A' || getSelectedVal('cboSys').localyn == 'L'){
			var devHomeData = new Object();
			devHomeData.UserId = userId;
			devHomeData.SysCd = getSelectedVal('cboSys').value;
			
			var tmpData = {
				treeInfoData: 	devHomeData,
				requestType: 	'getDevHome'
			}
			
			
			ajaxAsync('/webPage/dev/CheckOutServlet', tmpData, 'json',successGetDevHome);
		}
	}
	
	if(getSelectedVal('cboSys').cm_sysinfo.substr(14,1) == '1'){
		$('#chkBefJob').show();
	}
	
}

function successGetDevHome(data){
	localHome = data;
	
	if(localHome.length == 0 || localHome == ''){
		showToast('로컬로 체크아웃을 받고자 하는 경우 \n [기본관리-사용자환경설정]에서 \n 로컬 홈디렉토리를 지정한 후 진행하시기 바랍니다.');
	}
	
}


//파일비교버튼 미개발
/*
function btnDiffClick(){
	var tmpArray = new ArrayCollection();
	var tmpObj = new Object();
	
	for (var x=0;x<grdLst2_dp.length;x++) {
		if (grdLst2_dp.getItemAt(x).cm_info.substr(44,1) == "1") {  //45 로컬에서 개발
			tmpObj = grdLst2_dp.getItemAt(x);
			tmpObj.errflag = "0";
			tmpObj.sendflag = "0";
			tmpObj.cm_dirpath = grdLst2_dp.getItemAt(x).pcdir;
			tmpObj.pcdir = grdLst2_dp.getItemAt(x).localdir;
			tmpArray.addItem(tmpObj);
			tmpObj = null;
		}
	}
	tmpObj = null;
	if (tmpArray.length>0) {
		fileUpDownPop = progFileUpDown_Agent(PopUpManager.createPopUp(this, progFileUpDown_Agent, true));
        PopUpManager.centerPopUp(fileUpDownPop);//팝업을 중앙에 위치하도록 함
        fileUpDownPop.acptNo = cboSys.selectedItem.cm_syscd;
        fileUpDownPop.UserId = strUserId;
        fileUpDownPop.acptNo = "999999999999";
        fileUpDownPop.progFile_dp = tmpArray;
        fileUpDownPop.popType = "F";
        fileUpDownPop.parentFunc = FileUpLoad_Handler_diff;
	    fileUpDownPop.initApp();
		} else {
			diffNext();
		}
}

// 파일업다운 미개발
function FileUpLoad_Handler_diff(ret){
	var findSw = false;
	var tmpMsg = "";
	
	if (ret){
		for (var i=0;fileUpDownPop.listgrid_dp.length>i;i++) {
			if (fileUpDownPop.listgrid_dp.getItemAt(i).errflag == "ERROR") {
				if (tmpMsg.length>0) tmpMsg = tmpMsg + ",";
				tmpMsg = tmpMsg + fileUpDownPop.listgrid_dp.getItemAt(i).cr_rsrcname;
				findSw = true;
			}	
		}
	}
	PopUpManager.removePopUp(fileUpDownPop);
	if (findSw) {
		Alert.show("로컬에 파일이 없습니다. 확인 후 진행하여 주시기 바랍니다. \n"+tmpMsg);
	} else {
		diffNext();	
	}
}

function deffNext(){

	griddiff.visible = true; 
	Cmr0200.diffList(strUserId,cboSys.selectedItem.cm_syscd,grdLst2_dp.toArray());	
}

function difflist_resultHandler(event){
	
	grdLst2_dp.source = event.result ;
	grdLst2_dp.refresh();

	for (var i=0;grdLst2_dp.length>i;i++) {
		if (grdLst2_dp.getItemAt(i).diffrstcd != null) {
			if (grdLst2_dp.getItemAt(i).diffrstcd != "0") {
				Alert.show("체크인이 가능하지 않은 파일이 있습니다. 목록에서 확인 후 진행하시기 바랍니다.");
				return;
			}
		}
	}
	cmdReq_DiffNext();
		
}

*/

function cmdReq_DiffNext() {
	var tmpObj = new Object();
	var tmpArray = [];
	var findSw = false;
	
	for (var x=0;x<secondGridData.length;x++) {
		if (!$('#chkSvr').is(':checked') && 
		    (secondGridData[x].cm_info.substr(38,1) == "1" || 
		      secondGridData[x].cm_info.substr(50,1) == "1")) {
		    findSw = true;
		    tmpObj = new Object();
		    tmpObj.cr_itemid = secondGridData[x].cr_itemid;
		    tmpObj.baseitem = secondGridData[x].baseitem;
		    tmpObj.cm_dirpath = secondGridData[x].cm_dirpath;
		    tmpObj.cr_rsrcname = secondGridData[x].cr_rsrcname;
		    tmpObj.cr_rsrccd = secondGridData[x].cr_rsrccd;
		    tmpObj.cr_syscd = secondGridData[x].cr_syscd;
		    if (secondGridData[x].cm_info.substr(38,1) == "1") tmpObj.compyes = "Y";
		    else tmpObj.compyes = "N";
		    if (secondGridData[x].cm_info.substr(50,1) == "1") tmpObj.deployyes = "Y";
		    else tmpObj.deployyes = "N";
		    if (secondGridData[x].cm_info.substr(28,1) == "1") tmpObj.progshl = "1";
		    else tmpObj.progshl = "0";
		    tmpArray.push(tmpObj);
		}
	}
	editRowBlank();
	if (findSw) { //빌드 및 배포스크립트실행관련
		tmpObj = {};
		tmpObj.reqcd  = reqCd;
		tmpObj.syscd  = cboSys.selectedItem.cm_syscd;
		scriptPopUp = Script_Sel(PopUpManager.createPopUp(this, Script_Sel, true));
		scriptPopUp.width = screen.width - 80;
		scriptPopUp.height = screen.height - 200;
		scriptPopUp.progList_dp.source = tmpArray.toArray();
		scriptPopUp.parentfuc = scriptRequest;
		scriptPopUp.parentvar = tmpObj;
        PopUpManager.centerPopUp(scriptPopUp);//팝업을 중앙에 위치하도록 함
        scriptPopUp.minitApp();	
		tmpObj = null;	
	} else {
		cmdReqSub();
	}	
}

function checkInClick(){
	var tmpSayu = $("#txtSayu").val().trim();
	
	if (ingSw) {
		showToast("현재 신청하신 건을 처리 중입니다. 잠시 기다려 주시기 바랍니다.");
		return;
	}
	
	if (getSelectedIndex('cboSys') < 1) {
		showToast('시스템을 선택하여 주십시오.');
		return;
	}
	if (srSw && getSelectedIndex('cboSrId') < 1) {
		showToast('SR-ID를 선택하여 주십시오.');
		return;
	}
	if (srSw && tmpSayu.length == 0){
		showToast('신청사유를 입력하여 주십시오.');
		return;
	}
	if (secondGrid.list.length == 0){
		showToast('신청 할 파일을 추가하여 주십시오.');
		return;
	}
	
//	cmdChk.enabled = false;
	if (getSelectedVal('cboReqGbn').value != '05') {				
		for (var x=0;x<secondGridData.length;x++) {
			if (secondGridData[x].cm_info.substr(52,1) == "1" && secondGridData[x].cr_lstver != "0") {
				cmdDiff_Click();
				return;
			}
		}	
	}
	cmdReq_DiffNext();
}

function editRowBlank() {
	var iCnt = gridSimpleData.length; //항목상세보기를 제외한 모듈단위의 목록
	for(var i=0; i<iCnt; i++) {
		if(gridSimpleData[i].prcseq == "") { //컴파일순서에 값이 없으면
			var jCnt = firstGridData.length; //전체프로그램 목록
			for(var j=0; j<jCnt; j++) {
				if(gridSimpleData[i].cr_itemid == firstGridData[j].cr_itemid) { //프로그램경로와 프로그램명이 같으면
					gridSimpleData[i].prcseq = firstGridData[j].prcseq; //상단 그리드에 값을 가져옴
					break;
				}
			}
		}
	}			
}

//빌드스크립트 팝업 미개발
function scriptRequest()
{
	var closeFlag = scriptPopUp.closeFlag;
	if (closeFlag) {
		script_dp = new ArrayCollection(scriptPopUp.grdLst_dp.source);
	}
	PopUpManager.removePopUp(scriptPopUp);

	if (closeFlag){
		cmdReqSub();
	}
	else{
		ingSw = false;
	}
	
}

function cmdReqSub(){
	var strRsrcCd = "";
	var strQry = "";
	ingSw = true;
	var x=0;
	for (x=0 ; x<secondGridData.length ; x++) {
		if (strQry.length > 0) {
			if (strQry.indexOf(secondGridData[x].reqcd) < 0) {
				strQry = strQry + ",";
				strQry = strQry + secondGridData[x].reqcd;
			}
		} else strQry = secondGridData[x].reqcd;

		if (strRsrcCd.length > 0) {
			if (strRsrcCd.indexOf(secondGridData[x].cr_rsrccd) < 0) {
				strRsrcCd = strRsrcCd + ",";
				strRsrcCd = strRsrcCd + secondGridData[x].cr_rsrccd;
			}
		} else strRsrcCd = secondGridData[x].cr_rsrccd;
	}
	if(reqCd != '07' && closeSw) strQry = '05';
	
	var confirmInfoData = new Object();
	confirmInfoData.sysCd = getSelectedVal('cboSys').value;
	confirmInfoData.strRsrcCd = strRsrcCd;
	confirmInfoData.ReqCd = reqCd;
	confirmInfoData.userId = userId;
	confirmInfoData.strQry = strQry;
	
	var tmpData = {
			requestType : 'confSelect',
			confirmInfoData : confirmInfoData
	}	
	ajaxReturnData = ajaxCallWithJson('/webPage/apply/ApplyRequest', tmpData, 'json');
	
	if (ajaxReturnData == "X") {
		showToast("로컬PC에서 파일을 전송하는 결재단계가 지정되지 않았습니다. 형상관리시스템담당자에게 연락하여 주시기 바랍니다.");
	} else	if (ajaxReturnData == "C") {
		confirmDialog.confirm({
			msg: '결재자를 지정하시겠습니까?',
		}, function(){
			if(this.key === 'ok') {
				confCall("Y");
			}
			else{
				confCall("N");
			}
		});
	} else if (ajaxReturnData == "Y") {
		confCall("Y");
    } else if (ajaxReturnData != "N") {
    	showToast("결재정보가 등록되지 않았습니다. 형상관리시스템담당자에게 연락하여 주시기 바랍니다.");
    } else {
		confCall("N");
    }
	
	//Cmr0200.confSelect(cboSys.selectedItem.cm_syscd,reqCd,strRsrcCd,userId,strQry);
}

function confCall(GbnCd){
	var strQry = "";
	var emgSw = "0";
	var tmpRsrc = "";
	var tmpJobCd = "";
	var tmpPrjNo = "";
	var strDeploy = "0";
	//retMsg = "Y";
	strQry = "";
	for (var x=0;x<secondGridData.length;x++) {
		if (tmpRsrc.length > 0) {
			if (tmpRsrc.indexOf(secondGridData[x].cr_rsrccd) < 0)
	            tmpRsrc = tmpRsrc + "," + secondGridData[x].cr_rsrccd;
		} else tmpRsrc = secondGridData[x].cr_rsrccd;
	
		if (tmpJobCd.length > 0) {
			if (tmpJobCd.indexOf(secondGridData[x].cr_jobcd) < 0)
	            tmpJobCd = tmpJobCd + "," + secondGridData[x].cr_jobcd;
		} else tmpJobCd = secondGridData[x].cr_jobcd;
	
		if (strQry.length > 0) {
			if (strQry.indexOf(secondGridData[x].reqcd) < 0) {
				strQry = strQry + "," + secondGridData[x].reqcd;
			}
		} else strQry = secondGridData[x].reqcd;
	}
	if(reqCd != '07' && closeSw) strQry = '05';
	
	if (swEmg) {
		emgSw = "2"
	} else {
		emgSw = "0";
	}
	strDeploy = "Y";
	if (getSelectedIndex('cboSrId')>0) tmpPrjNo = getSelectedVal('cboSrId').value;
	confirmInfoData = new Object();
	confirmInfoData.UserID = userId;
	confirmInfoData.ReqCD  = reqCd;
	confirmInfoData.SysCd  = getSelectedVal('cboSys').value;
	confirmInfoData.Rsrccd = tmpRsrc;
	confirmInfoData.QryCd = strQry;
	confirmInfoData.EmgSw = emgSw;
	confirmInfoData.JobCd = tmpJobCd;
	confirmInfoData.deployCd = strDeploy;
	confirmInfoData.PrjNo = tmpPrjNo;
	//if (optPos1.selected) confirmInfoData.OutPos = "R";
	//else confirmInfoData.OutPos = "L";
	if(reqCd == '07'){
		confirmInfoData.OutPos = outpos;
		if ($('#chkSvr').is(':checked')) confirmInfoData.svryn = "N";
		else confirmInfoData.svryn = "Y";
	}
	
	if (GbnCd == "Y") {
		approvalModal.open({
	        width: 820,
	        height: 365,
	        iframe: {
	            method: "get",
	            url: "../modal/request/ApprovalModal.jsp",
	            param: "callBack=modalCallBack"
		    },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	            	if(confirmData.length > 0){
	            		reqQuestConf();
	            	}
	            	ingSw = false;
	                mask.close();
	            }
	        }
		});
	} else if (GbnCd == "N") {

		var tmpData = {
			confirmInfoData: 	confirmInfoData,
			requestType: 	'Confirm_Info'
		}
		
		ajaxReturnData = ajaxCallWithJson('/webPage/apply/ApplyRequest', tmpData, 'json');
		confirmData = ajaxReturnData;
		
		for(var i=0; i<confirmData.length ; i++){
			if (confirmData[i].arysv[0].SvUser == null || confirmData[i].arysv[0].SvUser == "") {
				confirmData.splice(i,1);
				i--;
			}
		}

		reqQuestConf();
	}
}

function reqQuestConf(){

	var ajaxReturnStr = null;
	var requestData = new Object();
	var deploy = '0';
	var emgCd = '0';
	var aplyData = '';
	if(reqCd == '07'){ //체크인
		requestData.outpos = outpos;
		if ($('#chkSvr').is(':checked')) requestData.svryn = "N";
		else requestData.svryn = "Y";
		if ($('#chkVer').is(':checked')) requestData.veryn = "N";
		else requestData.veryn = "Y";
	}
	else{ // 테스트배포, 운영배포
		deploy = getSelectedVal('cboReqGbn').value;
		if(swEmg) emgCd = '2';
		if(getSelectedVal('cboReqGbn').value =='04') aplyData = strAplyDate;
		if(closeSw)requestData.closeyn = 'Y';
		else requestData.closeyn = 'N';
	}
		
	requestData.UserID = userId;
	requestData.ReqCD  = reqCd;
	requestData.Sayu	  = $('#txtSayu').val().trim();
	requestData.Deploy = deploy;
	requestData.EmgCd = emgCd;
	requestData.AplyDate = aplyData;
	requestData.TstSw = getSelectedVal('cboSys').TstSw;
	requestData.emrgb = "0";
	requestData.emrcd = "";
	requestData.emrmsg = "";
	requestData.reqday = "";
	requestData.reqdept = "";
	requestData.reqdoc = "";
	requestData.reqtit = "";
	requestData.ReqSayu = "9";
	requestData.txtSayu = $('#txtSayu').val().trim();
	requestData.reqetc = "";
	if (getSelectedIndex('cboSrId')>0){
		requestData.cc_srid = getSelectedVal('cboSrId').value;
		requestData.cc_reqtitle = getSelectedVal('cboSrId').cc_reqtitle;
	} else {
		requestData.cc_srid = "";
		requestData.cc_reqtitle = "";
	}
//	if (optPos1.selected) requestData.outpos = "R";
//	else requestData.outpos = "L";

	var tmpData = {
		secondGridData : secondGridData,
		requestData: 	requestData,
		requestFiles:	secondGridData,
		requestConfirmData:	confirmData,
		scriptData 	: 	scriptData,
		befJobData 	: 	befJobData,
		requestType: 	'requestConf'
	}
	ajaxReturnData = ajaxCallWithJson('/webPage/apply/ApplyRequest', tmpData, 'json');
	
	if(ajaxReturnData == 'ERR' || ajaxReturnData.substr(0,5) == 'ERROR'){
		showToast('ERROR');
		return;
	}
	
	if(reqCd=='07'){
		
	}	
	if ( (outpos == "A" || outpos == "L") && reqCd == '07'){
		//Alert.show("Filelist");
		//파일 업다운 미개발
		Cmr0100.getProgFileList(strAcptNo,"F");
		return;
		
	}
	else if( reqCd != '07' && upFiles.length > 0){
		//팝업 미개발
		
		return;
	}
	
	
	confirmDialog.confirm({
		msg: $('#btnRequest').val()+' 신청완료! 상세 정보를 확인하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {
			ckin_end(); //미개발
		}
	});
	
	secondGrid.setData([]);
	secondGridData = [];
	getSysCbo();
}

function btnRequestClick(){
var tmpSayu = $('#txtSayu').val().trim();
	
	if(ingSw){
		showToast('현재 신청하신 건을 처리 중입니다. 잠시 기다려 주시기 바랍니다.');
		return;
	}
	
	if (getSelectedIndex('cboSys') < 1) {
		showToast('시스템을 선택하여 주십시오.');
		return;
	}
	
	if (srSw && getSelectedIndex('cboSrId') < 1) {
		showToast('SR-ID를 선택하여 주십시오.');
		return;
	}
	
	if (srSw && tmpSayu.length == 0) {
		showToast('신청사유를 입력하여 주십시오.');
		return;
	}
	
	if (secondGrid.list.length == 0) {
		showToast('신청 할 파일을 추가하여 주십시오.');
		return;
	}
	
	if (getSelectedVal('cboReq').value != "05") {				
		for (var x=0;x<secondGridData.length;x++) {
			if (secondGridData[x].cm_info.substr(52,1) == "1" && secondGridData[x].cr_lstver != "0") {
				btnDiffClick();
				return;
			}
		}	
	}
	cmdReq_DiffNext();
}

function bntRequestClick(){
	var tmpSayu = $('#txtSayu').val().trim();
	
	if (ingSw) {
		showToast("현재 신청하신 건을 처리 중입니다. 잠시 기다려 주시기 바랍니다.");
		return;
	}
	
	if (getSelectedIndex('cboSys') < 1) {
		showToast('스템을 선택하여 주시기 바랍니다.');
		return;
	}
	
	if(getSelectedIndex('cboSys') == null ){
		showToast('시스템정보가 없습니다. 확인 후 다시 신청해 주세요.');
		return;		
	}
	
	if (srSw && tmpSayu.length == 0) {
		showToast('신청사유를 입력하여 주십시오.');
		return;
	}
	
	if (secondGrid.list.length == 0) {
		showToast('신청 할 파일을 추가하여 주십시오.');
		return;
	}
	mask.open();
	confirmDialog.confirm({
		msg : $('#btnRequest').text()+"을 하시겠습니까?",
	}, function(){
        mask.close();
		if(this.key === 'ok') {
			if(reqCd == '07'){
				cmdReq_DiffNext();
			}
			else{
				baepoConfirm();
			}
		}
	});
}


function baepoConfirm(){
	var strNow = "";
	var strDate = getDate('DATE',0);
	var strDate2 = "";
	var strTime = "";
	
	timeSw = true;

	strAplyDate = "";

	if ( getSelectedVal('cboReqGbn').value == "4" ) {//4:특정일시배포  0:일반  2:긴급
		strTime = $('#txtReqTime').val();
		if ($('#txtReqDate').val() == '' || strTime == "") {
			showToast("적용일시를 입력하여 주시기 바랍니다.");
			return;
		}
		strTime = strTime.replace(":","");
		if (strTime.length != 4) {
			showToast("4자리 숫자로 입력하여 주시기 바랍니다.");
			return;
		}
		
		var strDate2 = replaceAllString($('#txtReqDate').val(),'/','');
		
		
		if (strDate > strDate2) {
			showToast("적용일시가 현재일 이전입니다. 정확히 선택하여 주십시오");
			return;
		} else if (strDate == strDate2) {
			
			strNow = getTime();
			if (strTime < strNow) {
				showToast("적용일시가 현재일 이전입니다. 정확히 선택하여 주십시오");
				return;
			}
		}
		strAplyDate = strDate2 + strTime + "00";
		now = null;
	}

	var lstModuleData = [];
	var subTmp = new Object();
//		var k:int = 0;
//		var findSw:Boolean = false;
	var x=0;
	var y=0;
	var tagList = [];
	
	//운영배포 && 시스템속성[14]태그사용 && SR사용시스템 일때  
	if ( reqCd == "04" && getSelectedVal('cboSys').cm_sysinfo.substr(13,1) == "1" && getSelectedVal('cboSys').cm_sysinfo.substr(9,1) == "0" ){//[14]태그사용
		//태그사용 시스템 일때  SR명에서 태그 뽑아내기로직 시작
		var strTmp = getSelectedVal('cboSrId').cc_reqtitle;
		tagList = strTmp.split("[");
		for ( x = 0 ; x < tagList.length ; x++) {
			//[] 괄호에 묶인거만 추출하기
			if ( tagList[x] == null 
			  || tagList[x] == "" 
			  || tagList[x].trim().length < 2 
			  || tagList[x].trim().indexOf("]") < 1 ) {
				tagList.splice( x,1 );
				x--;
			} else {
				strTmp = tagList[x].trim();
				subTmp = new Object();
				//태그를 []로 묶어주기
				subTmp = "[" + strTmp.substring(0,strTmp.indexOf("]")+1);
				tagList[x] =  subTmp;
			}
		}
		
		//SR명에 태그가 없을때 오류 메시지.
		if ( tagList.length == 0 ){
			showToast("SR명에 태그가 존재하지 않습니다. 해당 SR로 운영배포 요청이 불가합니다. 관리자에게 문의해 주시기 바랍니다.");
			return;
		}
	}
	

	if(secondGridOverlap()){
		return;
	};
	
	for (x=0;x<secondGridData.length;x++) {
		if (getSelectedIndex('cboSrId')>0) {
			if (secondGridData[x].baseitem != secondGridData[x].cr_itemid && secondGridData[x].cm_info.substr(10,1) == "1") {
				//기준프로그램이 아니고 배포서버에 파일을 전송해야 하는 경우
			    subTmp = {};
				subTmp = secondGridData[x];
				lstModuleData.push(subTmp);
				subTmp = null;
			}
		}

		//태그사용 시스템 일 경우 SR명에 포함된 태그값을 가진
		//일반문서[93]가 한건이라도 추가 되어 있어야 함.
		for ( y = 0 ; y < tagList.length ; y++ ){
			if ( secondGridData[x].cr_story.indexOf( tagList[y] ) > -1  ){
				tagList.splice(y,1);
				y--;
			}
		}
	}
	subTmp = null;
	
	//태그사용 시스템 인데, 필요한 일반문서가 한개도 없을때
	if ( tagList.length > 0 ){
		var tmpTagName="";
		for ( y = 0 ; y < tagList.length ; y++ ){
			tmpTagName = tmpTagName + tagList[y];
		}
		showToast(tmpTagName+"태그를 가진 문서가 누락되였습니다. SR명에 포함된 태그를 확인해 주시기 바랍니다.");
		return;
	}
	
	if ( ingSw ) {
		showToast("현재 신청하신 건을 처리 중입니다. 잠시 기다려 주시기 바랍니다.");
		return;
	}
	
	if ( lstModuleData.length>0 ) {
		// 모듈사용 미개발
		//Cmr0200.getRelatFileList(strUserId,cboSRID.selectedItem.cc_srid,lstModuleData);	
		return;
	}
	RequestScript();
	
}

function RequestScript(){

	var findSw = false;
	var tmpArray = [];
	var tmpObj = new Object();
	for (var x=0;x<secondGridData.length;x++) {
		//운영배포 요청 이면서 스크립트 실행 있는지 확인
		if ( reqCd == "04" &&
		    (secondGridData[x].cm_info.substr(0,1) == "1" || 
		     secondGridData[x].cm_info.substr(20,1) == "1") ) {//cm_info.substr(0,1):컴파일(운영)  cm_info.substr(20,1):릴리즈스크립트실행(운영)
		    findSw = true;
		    tmpObj = new Object();
		    tmpObj.cr_itemid = secondGridData[x].cr_itemid;
		    tmpObj.cm_dirpath = secondGridData[x].cm_dirpath;
		    tmpObj.cr_rsrcname = secondGridData[x].cr_rsrcname;
		    tmpObj.cr_rsrccd = secondGridData[x].cr_rsrccd;
		    tmpObj.cr_syscd = secondGridData[x].cr_syscd;
		    if (secondGridData[x].cm_info.substr(0,1) == "1") tmpObj.compyes = "Y";
		    else tmpObj.compyes = "N";
		    if (secondGridData[x].cm_info.substr(20,1) == "1") tmpObj.deployyes = "Y";
		    else tmpObj.deployyes = "N";
		    if (secondGridData[x].cm_info.substr(28,1) == "1") tmpObj.progshl = "1";
		    else tmpObj.progshl = "0";
		    tmpArray.push(tmpObj);
		    tmpObj = null;
		}
		//테스트배포 요청 이면서 스크립트 있는지 확인
		else if( reqCd == "03" &&
		        (secondGridData[x].cm_info.substr(60,1) == "1" || 
		         secondGridData[x].cm_info.substr(63,1) == "1") ) {//cm_info.substr(60,1):컴파일(테스트)  cm_info.substr(63,1):릴리즈스크립트실행(테스트)
			findSw = true;
			tmpObj = {};
		    tmpObj.cr_itemid = secondGridData[x].cr_itemid;
		    tmpObj.cm_dirpath = secondGridData[x].cm_dirpath;
		    tmpObj.cr_rsrcname = secondGridData[x].cr_rsrcname;
		    tmpObj.cr_rsrccd = secondGridData[x].cr_rsrccd;
		    tmpObj.cr_syscd = secondGridData[x].cr_syscd;
		    //컴파일(테스트)[61] 일때
		    if (secondGridData[x].cm_info.substr(60,1) == "1") tmpObj.compyes = "Y";
		    else tmpObj.compyes = "N";
		    //릴리즈스크립트실행(테스트)[64] 일때
		    if (secondGridData[x].cm_info.substr(63,1) == "1") tmpObj.deployyes = "Y";
		    else tmpObj.deployyes = "N";
		    //사용자정의스크립트(사용)[29] 일때
		    if (secondGridData[x].cm_info.substr(28,1) == "1") tmpObj.progshl = "1";
		    else tmpObj.progshl = "0";
		    tmpArray.push(tmpObj);
		    tmpObj = null;
		}
	}	
	
	//컴파일 팝업 미개발
	if ( findSw ) {//컴파일 또는 릴리즈스크립트 실행이 존재하는 프로그램이 있으면 스크립트를 작성 할수 있도록 연결
		tmpObj = new Object();
		tmpObj.reqcd  = reqCd;
		tmpObj.syscd  = getSelectedVal('cboSys').cm_syscd;
		scriptPopUp = Script_Sel(PopUpManager.createPopUp(this, Script_Sel, true));
		scriptPopUp.width = screen.width - 80;
		scriptPopUp.height = screen.height - 100;
		scriptPopUp.progList_dp.source = tmpArray.toArray();
		scriptPopUp.parentfuc = scriptRequest;
		scriptPopUp.parentvar = tmpObj;
        PopUpManager.centerPopUp(scriptPopUp);//팝업을 중앙에 위치하도록 함
        scriptPopUp.minitApp();
	}else {
		cmdReqSub();
	}
}
