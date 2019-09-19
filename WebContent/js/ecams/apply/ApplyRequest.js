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

var firstGrid		= new ax5.ui.grid();
var secondGrid		= new ax5.ui.grid();
var datReqDate 		= new ax5.ui.picker();
var befJobModal 		= new ax5.ui.modal();
var approvalModal 		= new ax5.ui.modal();
var fileUploadModal 		= new ax5.ui.modal();
var scriptModal 		= new ax5.ui.modal();
var realFileModal 		= new ax5.ui.modal();

var request         =  new Request();

var cboOptions = [];

var ajaxReturnData = "";
var srSw            = false;
var sysData  = null; //시스템콤보
var cboReqGbnData   = null;
var srData	= null;	//SR-ID 콤보
var firstGridData = []; //신청대상그리드
var secondGridData = [];
var gridSimpleData = [];
var cboReqData = [];
var ScriptProgData = [];
var realFileData = [];

var firstGridColumns = null;
var secondGridColumns = null;
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
var befCheck = false; // 체크박스 변경시 이벤트가 바로 걸려 체크하기위한 변수
var confirmInfoData = null;
var uploadCk = false; // 파일 업로드 체크
var acptNo = "";
var winDevRep        = null; //SR정보 새창
var SelSysCd = null;
var realFileCk = false;

firstGrid.setConfig({
    target: $('[data-ax5grid="firstGrid"]'),
    sortable: true, 	// 그리드 sort 가능 여부(true/false)
    multiSort: true,	// 그리드 모든 컬럼 sort 선언(true/false)
    multipleSelect: true,	// 그리드 ROW 선택 시 다중 선택 가능하게 할지 여부(true/false)
    showRowSelector: true,	// 그리드에 체크박스 보이게 할지 여부(true/false)
    header: {
        align: "center"
    },
    body: {
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
        {key: "view_dirpath", label: "프로그램경로",  width: '15%', align: 'left'},
        {key: "cr_rsrcname", label: "프로그램명",  width: '15%', align: 'left'},
        {key: "jobname", label: "업무명",  width: '10%', align: 'left'},
        {key: "jawon", label: "프로그램종류",  width: '10%',align: 'left'},
        {key: "cr_story", label: "프로그램설명",  width: '15%', align: 'left'},
        {key: "cm_codename", label: "상태",  width: '10%'},
        {key: "cr_viewver", label: "현재버전",  width: '8%'},
        {key: "cm_username", label: "수정자",  width: '7%'},
        {key: "cr_lastdate", label: "수정일",  width: '10%'}
    ]
});

secondGrid.setConfig({
    target: $('[data-ax5grid="secondGrid"]'),
    sortable: true, 	// 그리드 sort 가능 여부(true/false)
    multiSort: true,	// 그리드 모든 컬럼 sort 선언(true/false)
    multipleSelect: true,	// 그리드 ROW 선택 시 다중 선택 가능하게 할지 여부(true/false)
    showRowSelector: true,	// 그리드에 체크박스 보이게 할지 여부(true/false)
    header: {
        align: "center"
    },
    body: {
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
        {key: "view_dirpath", label: "프로그램경로",  width: '18%', align: 'left'},
        {key: "cr_rsrcname", label: "프로그램명",  width: '15%', align: 'left'},
        {key: "checkin", label: "신청구분",  width: '10%'},
        {key: "jobname", label: "업무명",  width: '10%', align: 'left'},
        {key: "jawon", label: "프로그램종류",  width: '10%', align: 'left'},
        {key: "cr_story", label: "프로그램설명",  width: '15%', align: 'left'},
        {key: "cr_aftviewver", label: "적용후버전",  width: '10%'},
        {key: "diffrst", label: "비교결과",  width: '10%'}
    ]
});

if(reqCd != '07'){ // 테스트배포, 운영배포 그리드 컬럼수정
    var columns = [
    	{key: "view_dirpath", label: "프로그램경로",  width: '15%', align: 'left'},
    	{key: "cr_rsrcname", label: "프로그램명",  width: '15%', align: 'left'},
        {key: "jobname", label: "업무명",  width: '10%', align: 'left'},
        {key: "jawon", label: "프로그램종류",  width: '10%', align: 'left'},
        {key: "cr_story", label: "프로그램설명",  width: '15%', align: 'left'},
        {key: "codename", label: "상태",  width: '10%'},
        {key: "cr_viewver", label: "버전",  width: '8%'},
        {key: "cm_username", label: "수정자",  width: '7%'},
        {key: "lastdt", label: "수정일",  width: '10%'}
    ];
    
    firstGrid.config.columns = columns;
    firstGrid.setConfig();

    var columns2 = [
    	{key: "view_dirpath", label: "프로그램경로",  width: '15%', align: 'left'},
        {key: "cr_rsrcname", label: "프로그램명",  width: '15%', align: 'left'},
        {key: "editRow", label: "컴파일순서",  width: '10%', editor: {type: "text"}},
        {key: "jobname", label: "업무명",  width: '10%'},
        {key: "jawon", label: "프로그램종류",  width: '10%'},
        {key: "cr_story", label: "프로그램설명",  width: '20%', align: 'left'},
        {key: "cr_aftviewver", label: "적용후버전",  width: '10%'}
    ];
    
    secondGrid.config.columns = columns2;
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

$('[data-ax5select="cboReqGbn"]').ax5select({
	options: []
});

$(document).ready(function(){
	porgRowEdit();
	$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

	$("#panCal").css('display', 'inline-block');
	
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
		btnRequestClick();
	});
	
	$('#txtRsrcName').bind('keypress',function(event){
		if(event.keyCode == 13 && $('#txtRsrcName').val().trim().length > 0){
			findProc();
		}
	});
	
	$("#btnSR").bind('click',function(){
		cmdReqInfo_Click();
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
		$("#btnFileUpload").hide();
	}
	else if (reqCd == '08'){ //개발배포
		$('#btnRequest').text('개발배포신청');
		$('#chkBefJob').parent('div.wCheck').hide();
		$('#chkBefJob').parent('div.wCheck').siblings('label[for="chkBefJob"]').hide();
		$('#btnDiff').hide();
		$("#btnFileUpload").show();
	}
	else if (reqCd == '03'){ //테스트배포
		$('#btnRequest').text('테스트배포신청');
		$('#chkBefJob').parent('div.wCheck').hide();
		$('#chkBefJob').parent('div.wCheck').siblings('label[for="chkBefJob"]').hide();
		$('#btnDiff').hide();
		$("#btnFileUpload").show();
	}
	else{ //운영배포
		$('#btnRequest').text('운영배포신청');
		$('#chkBefJob').show();
		$('#btnDiff').hide();
		$("#btnFileUpload").show();
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
			openBefJobSetModal();
		}
		else{
            mask.open();
            confirmDialog.setConfig({
                title: "확인",
                theme: "info"
            });
			confirmDialog.confirm({
				msg: '기 선택된 선행작업이 있습니다. \n 체크해제 시 선행작업이 무시됩니다. \n계속 진행할까요?',
				btns :{
					ok: {
                        label:'ok'
                    },
                    cancel: {
                        label:'cancel'
                    },
                    other: {
                        label:'선행작업확인'
                    }
				}
			}, function(){
				console.log(this.key);
				if(this.key === 'ok') {
					befJobData = [];
				}
				else if (this.key ==='other'){
					openBefJobSetModal();
				}
				else{
					befCheck = true;
					$('#chkBefJob').wCheck('check',true);
				}
                mask.close();
			});
		}
	});
	
	$('#btnFileUpload').bind('click',function(){
		fileUploadModal.open({
	        width: 685,
	        height: 420,
	        iframe: {
	            method: "get",
	            url: "../modal/fileupload/FileUpload.jsp",
	            param: "callBack=modalCallBack"
		    },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	            }
	        }
		});
	});
	
	dateInit();
	getCodeInfoList();
	getSrIdCbo();
	
});

//프로그램명/설명 높이 수정 
function porgRowEdit(){
	if(reqCd == '07'){
		$('#panCal').after($('#sayuBox').children());
		$('#sayuInputBox').addClass('poa');
		$('#sayuInputBox').css('width','calc(100% - 150px)');
		$('[data-ax5grid="firstGrid"]').parent('div.az_board_basic').height('36%');
		
		$('[data-ax5grid="secondGrid"]').parent('div.az_board_basic').height('calc(38% + 40px)');
		$('[data-ax5grid="secondGrid"]').height('100%');
		
		new ResizeSensor($('#grdLst2'), function() { // div 리사이징 감지 이벤트
			var girdHeight = $('[data-ax5grid="secondGrid"]').parent('div.az_board_basic').height();
			secondGrid.setHeight(girdHeight);
		});
	}
	else{
		$('#sayuInputBox').css('width','calc(100% - 60px)');
		
		$('[data-ax5grid="firstGrid"]').parent('div.az_board_basic').height('36%');
		$('[data-ax5grid="secondGrid"]').parent('div.az_board_basic').height('38%');
	}
}

function openBefJobSetModal(){
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
            	console.log("befjobclose");
            	if(befJobData.length == 0){
					befCheck = true;
            		$('#chkBefJob').wCheck('check',false);
            	}
            	else{
					befCheck = true;
            		$('#chkBefJob').wCheck('check',true);
            	}
                mask.close();
            }
        }
	});
}

function dateInit() {
	$('#txtReqDate').val(getDate('DATE',0));
	datReqDate.bind(defaultPickerInfo('txtReqDate'));
	/*
	$('#txtReqTime').timepicker({
	    showMeridian : false,
	    minuteStep: 1
	 });
	 */
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
		$('[data-ax5select="cboReqGbn"]').ax5select('disable');
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
		dialog.alert('권한이 있는 시스템중 테스트환경이 존재하는 시스템이 없습니다. 메뉴의 적용->운영배포 화면을 이용하여 주십시요.');
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
	ajaxReturnData = null;
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
	$("#hourTxt").val('18');
	$("#minTxt").val('30');
	if(getSelectedIndex('cboReqGbn') > -1){
		swEmg = false;
		if(getSelectedVal('cboReqGbn').value == '02'){// 긴급적용
			swEmg = true;
		}
		else	if (getSelectedVal('cboReqGbn').value == '4') {
			$("#panCal").css('display', 'inline-block');
			return;
		}
		$("#panCal").hide();
	}
}


//신청대상목록 조회
function findProc() {
	firstGrid.setData([]);
	firstGridData = [];

	if(qrySw) {
		dialog.alert('검색 또는 신청 진행중 입니다.'); 
		return; //qrySw=true 일때는 검색 또는 신청 진행중일때임
	}
	if (srSw && getSelectedIndex('cboSrId') < 1) return;
	
	
	if (getSelectedIndex('cboSys') < 1) {
		dialog.alert('시스템을 선택하십시오.');
		return;
	}
	var strQry = "";
	if (getSelectedIndex('cboReq') == 0) strQry = "99";//"00";
	else strQry = getSelectedVal('cboReq').value;
	
	exlSw = false;
	qrySw = true;
	
	var tmpObj = new Object();
	tmpObj.UserId = userId;
	tmpObj.SysCd = SelSysCd;
	tmpObj.SinCd = reqCd;
	tmpObj.TstSw = getSelectedVal('cboSys').TstSw;
	tmpObj.RsrcName = $('#txtRsrcName').val().trim();
	tmpObj.DsnCd = "";
	tmpObj.DirPath = "";
	tmpObj.SysInfo = getSelectedVal('cboSys').cm_sysinfo;
	tmpObj.RsrcCd = "";
	tmpObj.ReqCD = reqCd;
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
	if(firstGridData.length == 0 ){
		//dialog.alert('검색 결과가 없습니다.');
		qrySw = false;
		return;		
	}
	else if (firstGridData.length > 0){
		if(firstGridData[0].ID =='MAX'){
			dialog.alert('검색결과가 너무 많으니 검색조건을 입력하여 검색하여 주시기 바랍니다.');
			qrySw = false;
			return;
		}
	}
	if(reqCd == '07'){
		//이클립스 소스는 체크인 불가하도록 flag 값 1로 셋팅 되어야 함.
		for ( j=0  ;firstGridData.length>j ; j++ ) {
			if ( firstGridData[j].cm_info.substr(57,1) == "1") {
				firstGridData[j].selected_flag = "1";
				firstGridData[j].cm_dirpath = "이클립스에서만 체크인이 가능합니다.";
			}
		}
	}
	
	$(firstGridData).each(function(i){
		$(secondGridData).each(function(j){
			if(firstGridData[i].cr_itemid == secondGridData[j].cr_itemid){
				firstGridData[i].selected_flag = "1";
				return true;
			}
		})
		
		if(firstGridData[i].selected_flag == "1"){
			firstGridData[i].__disable_selection__ = true;
		}
	});
	firstGrid.setData(firstGridData);
	
	if(firstGridData.length > 0 && reqCd == '03'){
		firstGrid.selectAll({selected:true, filter:function(){
			
				return this['selected_flag'] != '1';
			
			}
		});
		//addDataRow();
	}
	
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
	
	if (!$('#chkDetail').is(':checked')){
		for(var i =0; i < gridSimpleData.length; i++){
			if(gridSimpleData[i].baseitem != gridSimpleData[i].cr_itemid || 
				gridSimpleData[i].cr_itemid == null || gridSimpleData[i].cr_itemid == ''){
				gridSimpleData.splice(i,1);
				i--;
			}
			if(gridSimpleData[i] != null && gridSimpleData[i] != undefined){
				gridSimpleData[i].__index = i;
			}
		};
		secondGrid.list = clone(gridSimpleData);
		secondGrid.repaint();
	}
	else{
		for(var i =0; i < secondGridData.length; i++){
			secondGridData[i].__index = i;
		};
		
		secondGrid.list = clone(secondGridData);
		secondGrid.repaint();
	}
}
//신청목록추가
function addDataRow() {

	var j = 0;
	var secondGridList = new Array;
	var firstGridSeleted = firstGrid.getList("selected");
	ajaxReturnData = null;
	var strRsrcName = '';
	var calSw = false;
		
	$(firstGridSeleted).each(function(i){
		if(this.selected_flag == '1' && reqCd != '04'){
			return true;
		}
		
		if(reqCd == '07'){
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
		if(exlSw && this.errmsg != '정상'){
			return true;
		}
		if(exlSw && this.errmsg != '정상' && this.errmsg != '파일중복'){
			return true;
		}
		if(this.selected_flag != '1') {
			this.selected_flag = '1';
			var copyData = this;
			secondGridList.push($.extend({}, copyData, {__index: undefined}));
			if (!calSw) {
				if(this.cm_info.substr(3,1) =='1'){ //4 동시모듈
					calSw = true;
				} else if (this.cm_info.substr(8,1) == '1'){ //4 실행모듈
					calSw = true;
				}
			}
		}
	});
	
	firstGrid.clearSelect();	// 상위 그리드에 있는 데이터가 하단 그리드에 추가되면 상단 그리드에서 선택했던 체크박스 초기화
	
	if(reqCd == '04' && getSelectedIndex('cboSrId') > 0 && firstGridData.length != secondGridList.length){
		dialog.alert('운영에 배포 할 준비가 완료되지 않은 건이 있습니다. 확인 후 진행하시기 바랍니다.');
		return;
	}
	
	
	if ((secondGrid.list.length + secondGridList.length) > 300){
		dialog.alert("300건까지 신청 가능합니다.");
		return;
	}
	
	if(secondGridList.length == 0 ){
		return;
	}
	
	if (strRsrcName.length > 0 && reqCd =='07'){
        confirmDialog.setConfig({
            title: "확인",
            theme: "info"
        });
		confirmDialog.confirm({
			msg: '이전버전으로 체크아웃받은 프로그램이 있습니다. \n"'+strRsrcName + '"\n계속 진행할까요?',
		}, function(){
			if(this.key === 'ok') {
				if (calSw) cmdReqSubAnal(secondGridList);
				else checkDuplication(secondGridList);
			}
		});
		return;
	}
	else{
		if (calSw) cmdReqSubAnal(secondGridList);
		else checkDuplication(secondGridList);
	}
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

				firstGridData[j].__disable_selection__ = false;
				firstGridData[j].selected_flag = "0";
				return false;
			}
		});
		
	});
	// 동시적용항목 secondGridData에서 빼주는 작업
	$(secondGrid.getList("selected")).each(function(i){
		for(var j =0; j < secondGridData.length; j++){
			if(this.baseitem == secondGridData[j].baseitem){
				secondGridData.splice(j,1);
				j--
			}
		}
	});

	secondGrid.removeRow("selected");
	firstGrid.repaint();
	
	if (secondGrid.list.length == 0){

		$('[data-ax5select="cboSys"]').ax5select("enable");
		if(srSw) $('[data-ax5select="cboSrId"]').ax5select('enable');
		
		 if ( swEmg == false && reqCd == "04" && getSelectedVal('cboSrId').cc_chgtype != "01" ){
			 $('[data-ax5select="cboReqGbn"]').ax5select("enable");
		 }
		
		$('#btnRequest').prop('disabled',true);
	}
	else if(reqCd == '07'){
		outpos = "R";
	}
	//$('#totalCnt').text(secondGrid.list.length);
	
	$('#cboReq').prop('disabled', $('#cboSys').prop('disabled'));
	

}

function checkDuplication(downFileList){
	

	var secondGridList = new Array;
	var i = 0;
	var j = 0;
	var findSw = false;
	var totCnt = secondGridData.length;
	
	//console.log(data);
	for(i=0; downFileList.length>i ; i++){
		findSw = false;
		totCnt = secondGridData.length;
		for (j=0;totCnt>j;j++) {
			if (downFileList[i].cr_itemid == secondGridData[j].cr_itemid &&
				downFileList[i].baseitem == secondGridData[j].baseitem) {
				findSw = true;
				break;
			}
		}
		if (!findSw) {
			var copyData = clone(downFileList[i]); //리스트의 주소지를 가져오므로 clone 을 해서 add 해줘야함
			secondGridList.push($.extend({}, copyData, {__index: undefined}));
			copyData.__index = secondGridData.length;
			secondGridData.push(copyData);
		}
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
					firstGridData[j].__disable_selection__ = true;
					return false;
				}
				
			});
		});
	}

	firstGrid.repaint();
	secondGrid.addRow(secondGridList);
	secondGrid.repaint();
	exlSw = false;
	
	$('#btnRequest').prop('disabled', false);
	
	if(secondGrid.list.length > 0){
		$('#btnRequest').prop('disabled', false);
		$('[data-ax5select="cboSys"]').ax5select('disable');
		if(srSw) $('[data-ax5select="cboSrId"]').ax5select('disable');
		simpleData();
	}
	
}

function cmdChkClick(){
	var tmpSayu = $('#txtSayu').val().trim();
	
	if(ingSw){
		dialog.alert('현재 신청하신 건을 처리 중입니다. 잠시 기다려 주시기 바랍니다.');
		return;
	}
	
	if (getSelectedIndex('cboSys') < 1) {
		dialog.alert('시스템을 선택하여 주십시오.');
		return;
	}
	
	if (srSw && getSelectedIndex('cboSrId') < 1) {
		dialog.alert('SR-ID를 선택하여 주십시오.');
		return;
	}
	
	if (srSw && tmpSayu.length == 0) {
		dialog.alert('신청사유를 입력하여 주십시오.');
		return;
	}
	
	if (secondGrid.list.length == 0) {
		dialog.alert('신청 할 파일을 추가하여 주십시오.');
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
			if(data.cr_itemid != null && data.cr_itemid != ''){
				if(data.cr_itemid == secondGridData[j].cr_itemid && data.baseitem == secondGridData[j].baseitem){
					dialog.alert('동일한 프로그램이 중복으로 신청되었습니다. 조정한 후 다시 신청하십시오. ['+secondGridData[j].cr_rsrcname+']');
					retrunData = false;
					return true;
				}
			}
			else {
				if(data.cr_syscd == secondGridData[j].cr_syscd &&
				   data.cr_dsncd == secondGridData[j].cr_dsncd &&
				   data.cr_rsrcname == secondGridData[j].cr_rsrcname) {
					
					dialog.alert('동일한 프로그램이 중복으로 신청되었습니다. 조정한 후 다시 신청하십시오. ['+secondGridData[j].cr_rsrcname+']');
					retrunData = false;
					return true;
					
				}
			}
		}
	});
	return retrunData;
}

function cmdReqSubAnal(data){
	if(data.length > 0){
		ajaxReturnData = null;
		var downFileData = new Object();
		downFileData.sayu = $('#txtSayu').val().trim();
		downFileData.ReqCD = reqCd;
		downFileData.SinCd = reqCd;
		downFileData.TstSw = getSelectedVal('cboSys').TstSw;
		downFileData.syscd = SelSysCd;
		downFileData.sysgb = getSelectedVal('cboSys').cm_sysgb;
		downFileData.userid = userId;
		downFileData.closeyn = 'N'; 
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
	//cmdReqSubSame(data);
}

function successDownFileData(data){
	var modSw = false;
	var analSw = false;
	
	if(data.length != 0 && data == 'ERR'){
		dialog.alert($('#btnRequest').val+'목록 작성에 실패하였습니다.');
		return;
	}
	else{
		
		$(data).each(function(){
			if(this.cr_itemid == 'ERROR'){
				dialog.alert('파일목록 에러 \n파일경로 : '+thiscm_dirpath);
				ingsw = false;
				return;
			}
			else if(this.modsel == 'Y'){
				modSw = true;
			}
		});
		
	}
	
	//버전UP만적용 미개발
	if (modSw) {		//if (modSw && !chkSvr.selected ) {
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
		checkDuplication(data);
		//cmdReqSubSame(data);	
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
			if(getSelectedIndex('cboSrId') > 0){
				continue;
			} else {
				options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
			}
		}
		else{
			if(getSelectedIndex('cboSrId') > 0){				
				var syscd = getSelectedVal('cboSrId').syscd;
				var arySyscd = syscd.split(",");
				for(var j=0; j<arySyscd.length; j++){
					if(arySyscd[j] == data.cm_syscd){
						options.push({value: data.cm_syscd, text: data.cm_sysmsg, cm_sysgb: data.cm_sysgb, cm_sysinfo : data.cm_sysinfo});
						break;
					}
				}
				continue;
			}
			else{
				continue;
			}
		}
		
	}

	$('[data-ax5select="cboSys"]').ax5select({
        options: options
	});
	return options.length;
}

function changeSys(){

	if(getSelectedIndex('cboSys') > 0){
		SelSysCd = getSelectedVal('cboSys').value;
	}
	else{
		SelSysCd = null;
	}
	
	$('[data-ax5select="cboRsrccd"]').ax5select({
        options: []
	});

	getRsrcInfo(SelSysCd);
	
	firstGrid.setData([]);
	firstGridData = [];
	
	if (getSelectedVal('cboSys').cm_stopsw == "1") {
		dialog.alert("이관통제를 위하여 일시적으로 형상관리 사용을 중지합니다.");
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
	
	
	/*
	 * 정적분석확인
	if(getSelectedVal('cboSys').cm_sysinfo.substr(14,1) == '1'){
		$('#chkBefJob').show();
	}
	*/
	
}

//파일비교버튼 미개발
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

function btnDiffClick(){

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
	
	var confirmInfoData = new Object();
	confirmInfoData.SysCd = SelSysCd;
	confirmInfoData.strRsrcCd = strRsrcCd;
	confirmInfoData.ReqCd = reqCd;
	confirmInfoData.UserID = userId;
	confirmInfoData.strQry = strQry;
	
	var tmpData = {
			requestType : 'confSelect',
			confirmInfoData : confirmInfoData
	}	
	ajaxReturnData = ajaxCallWithJson('/webPage/apply/ApplyRequest', tmpData, 'json');
	
	if (ajaxReturnData == "C") {
	    confirmDialog.setConfig({
	        title: "확인",
	        theme: "info"
	    });
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
    	dialog.alert("결재정보가 등록되지 않았습니다. 형상관리시스템담당자에게 연락하여 주시기 바랍니다.");
		ingSw = false;
    } else {
		confCall("N");
    }
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
	
	if (swEmg) {
		emgSw = "2"
	} else {
		emgSw = "0";
	}
	strDeploy = "Y";
	if (getSelectedIndex('cboSrId')>0) tmpPrjNo = getSelectedVal('cboSrId').value;
	confirmInfoData = new Object();
	confirmInfoData.UserID = userId;
	confirmInfoData.ReqCd  = reqCd;
	confirmInfoData.SysCd  = SelSysCd;
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
	        width: 850,
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

	ajaxReturnData = null;
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
		requestData.closeyn = 'N';
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
		console.log(ajaxReturnData);
		dialog.alert('에러가 발생하였습니다. 다시 신청해주세요.');
		ingSw = false;
		return;
	}
	acptNo = ajaxReturnData;
	
	if(upFiles.length > 0){
		uploadCk = true; // 파일 업로드 체크 변수
		fileUploadModal.open({
	        width: 685,
	        height: 420,
	        iframe: {
	            method: "get",
	            url: "../modal/fileupload/FileUpload.jsp",
	            param: "callBack=modalCallBack"
		    },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	            	requestEnd();
	            }
	        }
		});
		return;
	}
	
	
	requestEnd();
}

function requestEnd(){
	
	ingSw = false;
    confirmDialog.setConfig({
        title: "확인",
        theme: "info"
    });
	confirmDialog.confirm({
		msg: $('#btnRequest').val()+' 신청완료! 상세 정보를 확인하시겠습니까?',
	}, function(){
		upFiles = [];

		if(this.key === 'ok') {
			cmdDetail();
		}
		else{
			getSysCbo();
		}
	});
	
	secondGrid.setData([]);
	secondGridData = [];
}

function cmdDetail(){

	var winName = "checkInEnd";
	var f = document.popPam;   		//폼 name
    
    f.acptno.value	= acptNo;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.user.value 	= userId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    
	nHeight = 740;
    nWidth  = 1200;

	cURL = "/webPage/winpop/PopRequestDetail.jsp";
    myWin = winOpen(f, winName, cURL, nHeight, nWidth);

	getSysCbo();
}

function btnRequestClick(){
	var tmpSayu = $('#txtSayu').val().trim();
	
	if (ingSw) {
		dialog.alert("현재 신청하신 건을 처리 중입니다. 잠시 기다려 주시기 바랍니다.");
		return;
	}
	
	if (getSelectedIndex('cboSys') < 1) {
		dialog.alert('시스템을 선택하여 주시기 바랍니다.');
		return;
	}
	
	if(getSelectedIndex('cboSys') == null ){
		dialog.alert('시스템정보가 없습니다. 확인 후 다시 신청해 주세요.');
		return;		
	}
	
	if (srSw && tmpSayu.length == 0) {
		dialog.alert('신청사유를 입력하여 주십시오.');
		return;
	}
	
	if (secondGrid.list.length == 0) {
		dialog.alert('신청 할 파일을 추가하여 주십시오.');
		return;
	}
	mask.open();
    confirmDialog.setConfig({
        title: "확인",
        theme: "info"
    });
	confirmDialog.confirm({
		msg : $('#btnRequest').text()+"을 하시겠습니까?",
	}, function(){
        mask.close();
		if(this.key === 'ok') {
				baepoConfirm();
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
		strTime = $("#hourTxt").val() + ":"+ $("#minTxt").val();
		if ($('#hourTxt').val() == '' || $('#minTxt').val() == '' || strTime == "") {
			dialog.alert("적용일시를 입력하여 주시기 바랍니다.");
			return;
		}
		strTime = strTime.replace(":","");
		if (strTime.length != 4) {
			dialog.alert("4자리 숫자로 입력하여 주시기 바랍니다.");
			return;
		}
		
		var strDate2 = replaceAllString($('#txtReqDate').val(),'/','');
		
		
		if (strDate > strDate2) {
			dialog.alert("적용일시가 현재일 이전입니다. 정확히 선택하여 주십시오");
			return;
		} else if (strDate == strDate2) {
			
			strNow = getTime();
			if (strTime < strNow) {
				dialog.alert("적용일시가 현재일 이전입니다. 정확히 선택하여 주십시오");
				return;
			}
		}
		strAplyDate = strDate2 + strTime + "00";
		now = null;
	}

	if(secondGridOverlap()){
		return;
	};
		
	if ( ingSw ) {
		dialog.alert("현재 신청하신 건을 처리 중입니다. 잠시 기다려 주시기 바랍니다.");
		return;
	}
	if(reqCd == '07'){
		editRowBlank();
	}
	cmdReqSub();
	//RequestScript();
	
}

function RequestScript(){

	var findSw = false;
	var tmpObj = new Object();
	ScriptProgData = [];
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
		    ScriptProgData.push(tmpObj);
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
		    ScriptProgData.push(tmpObj);
		    tmpObj = null;
		}
		//체크인 요청 이면서 스크립트 있는지 확인
		else if (reqCd == '08' && 
				(secondGridData[x].cm_info.substr(38,1) == "1" || 
				 secondGridData[x].cm_info.substr(50,1) == "1") ){
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
		    ScriptProgData.push(tmpObj);
		    tmpObj = null;
		}
	}
	if(reqCd == '07'){
		editRowBlank();
	}
	findSw = false;
	//컴파일 팝업
	if ( findSw ) {//컴파일 또는 릴리즈스크립트 실행이 존재하는 프로그램이 있으면 스크립트를 작성 할수 있도록 연결
		scriptModal.open({
	        width: 1050,
	        height: 630,
	        iframe: {
	            method: "get",
	            url: "../modal/request/ScriptModal.jsp",
	            param: "callBack=modalCallBack"
		    },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	            }
	        }
		});
	}else {
		cmdReqSub();
	}
}

function scriptModalClose(){
	scriptModal.close();
	if(scriptData.length <= 0){
		ingSw = false;
		return;
	}
	else{
		cmdReqSub();
	}
}

/*
 * SR 정보 
 */
function cmdReqInfo_Click(){
	if (getSelectedIndex('cboSrId') < 1) {
		dialog.alert('SR정보를 확인 할 SR-ID를 선택하십시오.',function(){});
		return;
	}
	
	//ExternalInterface.call("winopen",userId,"SRINFO",cboIsrId.selectedItem.cc_srid);
	var nHeight, nWidth;
	if(winDevRep != null
			&& !winDevRep.closed) {
		winDevRep.close();
	}	
	
	var form = document.popPam;   						  //폼 name
	form.user.value = userId; 	 						  //POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.srid.value = getSelectedVal('cboSrId').value;    //POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)	
	form.acptno.value = '';

	nHeight	= 725;
    nWidth = 1200;
    
    winDevRep = winOpen(form, 'devRep', '/webPage/winpop/PopSRInfo.jsp', nHeight, nWidth);
}


