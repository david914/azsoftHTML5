/**
 * 일괄등록 화면 기능정의
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-28
 * 
 */

var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드
var strReqCD 	= window.top.reqCd;				// reqCd

var batchGrid	= new ax5.ui.grid();

var batchGridData	= [];
var fBatchGridData	= [];
var cboSysCdData	= [];
var cboSvrCdData	= [];

var templetPath		= '';
var tmpPath			= '';
var uploadJspFile 	= '';
var errSw			= false;

var BatchMapping	= null;	// 맵핑 새창

batchGrid.setConfig({
    target: $('[data-ax5grid="batchGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: true,
    header: {
        align: "center",
    },
    body: {
        onClick: function () {
            this.self.select(this.dindex);
        },
        onDBLClick: function () {},
        trStyleClass: function () {
    		if(this.item.errsw === '1'){
    			return "fontStyle-cncl";
    		} else if(this.item.errsw === '0'){
    			return "fontStyle-ing";
    		}
    	},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "sysmsg", 	label: "시스템명",  		width: '10%', align: "left"},
        {key: "jobcd",		label: "업무명",  		width: '10%', align: "left"},
        {key: "userid", 	label: "신규등록인",  		width: '10%', align: "left"},
        {key: "rsrcname", 	label: "프로그램명",  		width: '10%', align: "left"},
        {key: "story", 		label: "프로그램설명",  	width: '10%', align: "left"},
        {key: "dirpath", 	label: "프로그램경로",  	width: '25%', align: "left"},
        {key: "jawon", 		label: "프로그램종류",  	width: '10%', align: "left"},
        {key: "errmsg", 	label: "체크결과",  		width: '15%', align: "left"},
    ]
});

$('[data-ax5select="cboSysCd"]').ax5select({
    options: []
});

$('[data-ax5select="cboSvrCd"]').ax5select({
	options: []
});

$('input:radio[name^="radio"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});
$('input:radio[name^="optradio"]').wRadio({theme: 'circle-radial blue', selector: 'checkmark'});
$('input.checkbox-batch').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});

$(document).ready(function() {
	
	getSysInfo();
	getTmpDir();
	getDocPath();
	
	$('[data-ax5select="cboSvrCd"]').ax5select("disable");
	$('#btnReq').prop( "disabled", 	true);
	$('#btnDel').prop('disabled', true);
	
	// 정산건, 오류건, 전체 라이도 버튼 클릭
	$('input:radio[name^="radio"]').bind('click', function() {
		gridDataFilter();
	});
	// 정상건만 등록 클릭
	$('#chkOk').bind('click', function() {
		var checkSw = $('#chkOk').is(':checked');
		
		if(fBatchGridData.length > 0 && checkSw) {
			$('#btnReq').prop( "disabled", 	false);
		} else {
			if(errSw) {
				$('#btnReq').prop( "disabled", 	true);
			}
		}
	});
	$('#cboSysCd').bind('change', function() {
		getSvrInfo();
	});
	// 엑셀파일
	$('#btnLoadExl').bind('click', function() {
		if(getSelectedIndex('cboSysCd') < 1) {
			dialog.alert('시스템 선택 후 사용해 주시기 바랍니다.', function() {});
			return;
		}
		$('#excelFile').trigger('click');
	});
	// 엑셀 파일 선택
	$('#excelFile').bind('change', function() {
		fileTypeCheck(this);
	})
	// 일괄등록
	$('#btnReq').bind('click', function() {
		requestCheckIn();
	});
	// 맵핑(소스모듈맵핑)
	$('#btnSmm').bind('click', function() {
		winOpenMapping();
	});
	// 엑셀저장
	$('#btnSaveExl').bind('click', function() {
		batchGrid.exportExcel('일괄등록리스트.xls');
	});
	// 엑셀템플릿
	// fileUploadServlet 사용.
	$('#btnExlTmp').bind('click', function() {
		location.href = '/webPage/fileupload/upload?fileName=excel_templet.xlsx&fullPath='+templetPath + '/excel_templet.xlsx';
	});
	// 삭제
	$('#btnDel').bind('click', function() {
		deleteGridData();
	});
});

// 맵핑 새창 열기
function winOpenMapping() {
	var nHeight, nWidth;
	
	if (BatchMapping != null 
			&& !BatchMapping.closed ) {
		BatchMapping.close();
	}
	var form = document.popPam;   		//폼 name
    
	form.userId.value	= userId;   	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.userName.value	= userName;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.adminYN.value	= adminYN;  	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	form.strReqCD.value	= strReqCD;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
	
    nHeight = screen.height;
    nWidth  = screen.width;
	
	BatchMapping = winOpen(form, 'batchMapping', '/webPage/winpop/PopBatchMapping.jsp', nHeight, nWidth);
}

// 선택된 데이터 그리드에서만 삭제
function deleteGridData() {
	var selIn = batchGrid.selectedDataIndexs;
	
	if(selIn.length === 0 ) {
		dialog.alert('삭제 할 그리드를 선택해주세요.', function() {});
		return;
	}
	
	var delInArr = [];
	selIn.forEach(function (selIndex, index) {
		delInArr.push(batchGrid.list[selIndex].NO);
	});
	
	delInArr.sort(function(a,b) {
		return b-a;
	});
	delInArr.forEach(function (delIndex, index) {
		for(var i=0; i<batchGridData.length; i++) {
			if(batchGridData[i].NO === delIndex) {
				batchGridData.splice(i,1);
			}
		}
		
	});
	gridDataFilter();
}

// 일괄등록 신청
function requestCheckIn() {
	var chkInList = [];
	var etcData = new Object();
	if(getSelectedIndex('cboSysCd') < 1) {
		dialog.alert('시스템을 선택하여 주세요.' , function() {});
		return;
	}
	if(getSelectedIndex('cboSvrCd') < 1) {
		dialog.alert('대상서버를 선택하여 주세요.' , function() {});
		return;
	}
	if(fBatchGridData.length === 0 ) {
		dialog.alert('엑셀 DATA가 없습니다.' , function() {});
		return;
	}
	
	if(!$('#optBase1').is(':checked') && !$('#optBase2').is(':checked') ) {
		dialog.alert('등록기준을 선택하여 주시기 바랍니다.' , function() {});
		return;
	}
	
	batchGridData.forEach(function(item, index) {
		if(item.errsw === '0') {
			chkInList.push(item);
		}
	});
	
	if(chkInList.length === 0) {
		dialog.alert('등록할 DATA가 없습니다.' , function() {});
		return;
	}
	
	
	etcData.cm_syscd = getSelectedVal('cboSysCd').value;
	etcData.ReqCD 	= strReqCD;
	etcData.UserID 	= userId;
	etcData.sysgb 	= getSelectedVal('cboSvrCd').cm_sysgb;
	etcData.svrcd 	= getSelectedVal('cboSvrCd').cm_svrcd;
	etcData.svrseq 	= getSelectedVal('cboSvrCd').cm_seqno;
	
	if ($('#optBase1').is(':checked')) etcData.base = "1";
	else if ($('#optBase2').is(':checked')) etcData.base = "2";
	else etcData.base = "3";
	
	
	var data = new Object();
	data = {
		chkInList 		: chkInList,
		etcData 		: etcData,
		requestType	: 'requestCheckIn'
	}
	ajaxAsync('/webPage/administrator/BatchReg', data, 'json',successRequestCheckIn);
}

// 일괄등록 신청 완료
function successRequestCheckIn(data) {
	if(data.substr(0,5) === 'ERROR') {
		dialog.alert(data.substr(5), function() {});
	} else {
		dialog.alert('일괄체크인 신청완료', function() {});
	}
	batchGridData = [];
	gridDataFilter();
}

// 라디오 버튼에 따른 그리드 필터
function gridDataFilter() {
	batchGrid.clearSelect();
	fBatchGridData = [];
	var checkVal = $(':input:radio[name=radio]:checked').val();
	if(checkVal === undefined) {
		fBatchGridData = batchGridData;
	} else {
		batchGridData.forEach(function(item, index) {
			if(checkVal === 'normal' && item.errsw === '0') {
				fBatchGridData.push(item);
			} else if (checkVal === 'err' && item.errsw === '1') {
				fBatchGridData.push(item);
			}else if(checkVal === 'all'){
				fBatchGridData.push(item);
			}
		});
	}
	batchGrid.setData(fBatchGridData);
}

// 엑셀 템플릿이 있는 경로 가져오기
function getDocPath() {
	var data = new Object();
	data = {
		pCode 		: '02',	// 나중에 서버 경로로 바꿔주기
		requestType	: 'getTmpDir'
	}
	ajaxAsync('/webPage/administrator/BatchReg', data, 'json',successGetDocPath);
}
// 엑셀 템플릿이 있는 경로 가져오기 완료
function successGetDocPath(data) {
	templetPath = data;
}

// 엑셀 파일 업로드시 파일 올릴 경로 가져오기
function getTmpDir() {
	var data = new Object();
	data = {
		pCode 		: '99',
		requestType	: 'getTmpDir'
	}
	ajaxAsync('/webPage/administrator/BatchReg', data, 'json',successGetTmpDir);
}
// 엑셀 파일 업로드시 파일 올릴 경로 가져오기 완료 AND 업로드할때 사용할 JSP 파일명 가져오기
function successGetTmpDir(data) {
	tmpPath = data;
	var data = new Object();
	data = {
		pCode 		: 'F2',
		requestType	: 'getTmpDir'
	}
	ajaxAsync('/webPage/administrator/BatchReg', data, 'json',successGetUploadJspName);
}
// 업로드할때 사용할 JSP 파일명 가져오기 완료
function successGetUploadJspName(data) {
	uploadJspFile = data;
}

// 엑셀 파일 업로드시 파일타입 체크
function fileTypeCheck(obj) {
	var pathpoint = obj.value.lastIndexOf('.');
	var filepoint = obj.value.substring(pathpoint+1,obj.length);
	filetype = filepoint.toLowerCase();
	if(filetype=='xls' || filetype=='xlsx') {
		startUpload();
	} else {
		dialog.alert('엑셀 파일만 업로드 가능합니다.', function() {});
		parentObj  = obj.parentNode
		node = parentObj.replaceChild(obj.cloneNode(true),obj);
		return false;
	}
}
// 엑셀 파일을 임시 경로에 업로드
function startUpload() {
	var excelFileSub = $('#excelFile')[0].files[0];
	var excelFile = null;
	
	// 파일 업로드 jsp 를 호출해야함
	var formData = new FormData();
	
	// 테스트 임시경로
	tmpPath = 'C:\\fileupload\\tmp\\';
	formData.append('fullName',tmpPath+userId+"_excel_eCmm1600.tmp");
	formData.append('fullpath',tmpPath);
	formData.append('file',excelFileSub);
	
    $.ajax({
        url:'/webPage/fileupload/'+uploadJspFile,
        type:'POST',
        data:formData,
        async:false,
        cache:false,
        contentType:false,
        processData:false
    }).done(function(response){
    	onUploadCompleteData(response);
    }).fail(function(xhr,status,errorThrown){
    	alert('오류가 발생했습니다. \r 오류명 : '+errorThrown + '\r상태 : '+status);
    }).always(function(){
    	// file 초기화
    	var agent = navigator.userAgent.toLowerCase();
    	if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ){
    	    $("#excelFile").replaceWith( $("#excelFile").clone(true) );
    	} else {
    	    $("#excelFile").val("");
    	}
    });
}
// 엑셀파일 완료 후 
function onUploadCompleteData(filePath){
	var headerDef = new  Array();
	filePath = replaceAllString(filePath,"\n","");
	
	headerDef.push("sysmsg");
	headerDef.push("jobcd");
	headerDef.push("userid");
	headerDef.push("rsrcname");
	headerDef.push("story");
	headerDef.push("dirpath");
	headerDef.push("jawon");
	
	var tmpData = {
		filePath : filePath,
		headerDef: headerDef,
		requestType: 'getArrayCollection'
	}
	ajaxAsync('/webPage/administrator/BatchReg', tmpData, 'json',successGetArrayCollection);
}

// 읽어온 엑셀 정보 그리드에 세팅
function successGetArrayCollection(data) {
	var findSw = false;
	batchGridData = data;
	batchGridData.splice(0,1);
	batchGrid.setData(batchGridData);
	
	/*for(var i=0; i<batchGridData.length; i++) {
		if(batchGridData[i].sysmsg !== getSelectedVal('cboSysCd').cm_sysmsg) {
			dialog.alert('시스템명이 선택한 시스템명과 일치하지 않습니다.', function() {});
			findSw = true;
			break;
		}
	}
	
	if(findSw) {
		return;
	}*/
	
	batchGrid.setData(batchGridData);
	getFileListExcel();
}

// 세팅한 정보 유효성 검사
function getFileListExcel() {
	var dataObj = new Object();
	dataObj.cm_syscd = getSelectedVal('cboSysCd').cm_syscd;
	dataObj.cm_sysmsg = getSelectedVal('cboSysCd').cm_sysmsg;
	
	var tmpData = {
		fileList 	: batchGridData,
		dataObj		: dataObj,
		requestType	: 'getFileListExcel'
	}
	ajaxAsync('/webPage/administrator/BatchReg', tmpData, 'json',successGetFileListExcel);
}

// 세팅한 정보 유효성 검사 완료
function successGetFileListExcel(data) {
	batchGridData = data;
	
	errSw = false;
	//$('#chkOk').wCheck('disabled', true);
	for(var i=0; i<batchGridData.length; i++) {
		if(batchGridData[i].errsw === '1') {
			dialog.alert('입력체크 중 오류가 발생한 항목이 있습니다. 확인하여 조치 후 다시 처리하시기 바랍니다.',  function() {});
			//$('#chkOk').wCheck('disabled', false);
			errSw = true;
			break;
		}
	}
	if(batchGridData.length > 0 ) {
		$('#btnDel').prop('disabled', false);
	}
	$('#btnReq').prop('disabled', errSw);
	gridDataFilter();
}

// 서버정보 가져오기
function getSvrInfo() {
	var data = new Object();
	data = {
		UserID 		: userId,
		SysCd 		: getSelectedVal('cboSysCd').value,
		SecuYn 		: 'N',
		SelMsg 		: 'SEL',
		requestType	: 'getSvrInfo'
	}
	ajaxAsync('/webPage/administrator/BatchReg', data, 'json',successGetSvrInfo);
}

// 서버정보 가져오기 완료
function successGetSvrInfo(data) {
	cboSvrCdData = data;
	
	if(cboSvrCdData.length > 0 ) {
		$('[data-ax5select="cboSvrCd"]').ax5select("enable");
	}
	
	$('[data-ax5select="cboSvrCd"]').ax5select({
      options: injectCboDataToArr(cboSvrCdData, 'cm_svrcd' , 'svrinfo')
	});
}

//시스템 콤보 가져오기
function getSysInfo() {
	var data = new Object();
	data = {
		UserId 		: userId,
		SecuYn 		: 'N',
		SelMsg 		: 'SEL',
		CloseYn 	: 'N',
		ReqCd 		: '',
		requestType	: 'getSysInfo'
	}
	ajaxAsync('/webPage/administrator/BatchReg', data, 'json',successGetSysInfo);
}

// 시스템 콤보 가져오기 완료
function successGetSysInfo(data) {
	cboSysCdData = data;
	
	$('[data-ax5select="cboSysCd"]').ax5select({
      options: injectCboDataToArr(cboSysCdData, 'cm_syscd' , 'cm_sysmsg')
	});
	
	if(cboSysCdData.length === 0 ) {
		$('#btnLoadExl').prop( "disabled", 	true);
	}
}
