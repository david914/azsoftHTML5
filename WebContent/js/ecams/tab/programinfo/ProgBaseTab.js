var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;

var selectedGridItem;	//그리드 선택 item

var cboRsrcCdData	   = null;	//프로그램종류 데이터
var cboJobData		   = null;	//업무 데이터
var cboDirData		   = null;	//프로그램경로 데이터
var cboSRData		   = null;	//SRID 데이터
var progInfoData       = null;
var myWin 			   = null;

var selSw = false;

var tmpInfo = new Object();
var tmpInfoData = new Object();

$(document).ready(function(){	
	//업무
	$('#cboJob').bind('change', function() {
		cboJob_Change();
	});
	
	//프로그램종류
	$('#cboRsrcCd').bind('change', function() {
		cboRsrcCd_Change();
	});
	
	//삭제
	$('#btnDel').bind('click',function() {
		btnDel_Click();
	});
	
	//소스비교
	$('#btnDiff').bind('click',function() {
		btnDiff_Click();
	});
	
	//소스보기
	$('#btnView').bind('click',function() {
		btnView_Click();
	});
	
	//수정
	$('#btnRegist').bind('click',function() {
		btnRegist_Click();
	});
	
	//폐기
	$('#btnClose').bind('click',function() {
		btnClose_Click();
	});
});

function screenInit(gbn) {	
	if(gbn == 'M') {
		$('[data-ax5select="cboJob"]').ax5select({
	        options: []
		});
		
		$('[data-ax5select="cboRsrcCd"]').ax5select({
	        options: []
		});
	}	

	$('#txtSysMsg').val('');
	$('#txtProgId').val('');
	$('#txtProgSta').val('');
	$('#txtSRID').val('');
	$('#txtStory').val('');
	$('#txtCreator').val('');
	$('#txtCreatDt').val('');
	$('#txtEditor').val('');
	$('#txtLastDt').val('');
	$('#txtCkInEditor').val('');
	$('#txtCkInLastDt').val('');
	$('#txtDevEditor').val('');
	$('#txtDevLastDt').val('');
	$('#txtTestEditor').val('');
	$('#txtTestLastDt').val('');
	$('#txtRealEditor').val('');
	$('#txtRealLastDt').val('');
	
	$('#btnDel').prop('disabled', true);
	$('#btnDiff').prop('disabled', true);
	$('#btnView').prop('disabled', true);
	$('#btnRegist').prop('disabled', true);
	$('#btnClose').prop('disabled', true);
	$('#btnQry2').prop('disabled', true);
	
	$('[data-ax5select="cboEditor"]').ax5select({
        options: []
	});
	$('[data-ax5select="cboDir"]').ax5select({
        options: []
	});
	
	if (cboJobData != null && cboJobData.length > 0) {
		$('[data-ax5select="cboJob"]').ax5select('setValue',   	    '0', 	true); 	// 업무 초기화
	}
	if (cboRsrcCdData != null && cboRsrcCdData.length > 0) {
		$('[data-ax5select="cboRsrcCd"]').ax5select('setValue', 	'0', 	true); 	// 프로그램유형 초기화
	}
	
	$('#cboSR').prop('disabled', true);
	$('#cboRsrcCd').prop('disabled', true);
	$('#cboEditor').prop('disabled', true);
	$('#cboDir').prop('disabled', true);
}

function setTabMenu(){
	$("#tabProgBase").show(); //기본정보
	
	$("ul.tabs li").click(function () {
		$(".tab_content").hide();
		var activeTab = $(this).attr("rel");
		
		//tab메뉴 클릭에 따라 색상 변경
		$("ul.tabs li").removeClass('on');
		$(this).addClass("on");
		
		$("#" + activeTab).fadeIn();
	});
	
	tab_Click();
}
//SR조회 prjCall();
function getSRID() {
	tmpInfo = new Object();
	tmpInfo.userid = userId;
	tmpInfo.reqcd = '07';
	tmpInfo.secuyn = 'Y';
	tmpInfo.qrygbn = '01';		
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETSRID'
	}
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successSRID);
}

function successSRID(data) {
	cboSRData = data;

	options = [];
	if(cboSRData.length > 0) {
		cboSRData.push({value: '0', text: 'SR정보 선택 또는 해당없음'});

		$.each(cboSRData,function(key,value) {
			options.push({value: value.cm_micode, text: value.cm_codename});
		});
	}
	
	$('[data-ax5select="cboSR"]').ax5select({
        options: options
	});
}

//선택한 시스템에 대한 업무조회 SysInfo.getJobInfo()
function getJobInfo(data) {
	
	$('[data-ax5select="cboJob"]').ax5select({
        options: []
	});
	ajaxAsync('/webPage/program/ProgramInfoServlet', data, 'json', successJob);
}

function successJob(data) {
	cboJobData = data;	
	if (cboJobData != null && (cboJobData.length > 0)) {
		options = [];
		$.each(cboJobData,function(key,value) {
			options.push({value: value.cm_jobcd, text: value.jobname});
		});
		
		$('[data-ax5select="cboJob"]').ax5select({
	        options: options
		});
		$('[data-ax5select="cboJob"]').ax5select('setValue', '0000', 	true); 	// 프로그램유형 초기화
	}
}
function successJawon(data) {
	$('[data-ax5select="cboRsrcCd"]').ax5select({
	      options: []
	});
	
	cboRsrcCdData = data;	
	if (cboRsrcCdData != null && (cboRsrcCdData.length > 0)) {
		options = [];
		$.each(cboRsrcCdData,function(key,value) {
			if (value.cm_micode == '0000') {
				options.push({value: value.cm_micode, text: '선택하세요'});
			} else {
				options.push({value: value.cm_micode, text: value.cm_codename});
			}
		});
		
		$('[data-ax5select="cboRsrcCd"]').ax5select({
	        options: options
		});
		$('[data-ax5select="cboRsrcCd"]').ax5select('setValue', '0000', 	true); 	// 프로그램유형 초기화
	}
	
}
function successProgInfo(data,selectedGrid) {
	var strInfo = '';
	progInfoData = data;
	
	selectedGridItem = selectedGrid;
	if (progInfoData.length > 0) {
		strInfo = selectedGridItem.cm_info;
		$('#txtSysMsg').val(selectedGridItem.cm_sysmsg);
		$('#txtJawon').val(progInfoData[0].RsrcName);
		$('#txtProgId').val(progInfoData[0].cr_rsrcname);
		$('#txtProgSta').val(progInfoData[0].sta);
		$('#txtStory').val(progInfoData[0].Lbl_ProgName);
		$('#txtDir').val(progInfoData[0].cm_dirpath);
		$('#txtCreator').val(progInfoData[0].Lbl_Creator);
		$('#txtEditor').val(progInfoData[0].Lbl_Editor);
		$('#txtCreatDt').val(progInfoData[0].Lbl_CreatDt);
		$('#txtLastDt').val(progInfoData[0].Lbl_LastDt);
		$('#txtCkInEditor').val(progInfoData[0].Lbl_LstUsrCkIn);
		$('#txtDevEditor').val(progInfoData[0].Lbl_LstUsrDev);
		$('#txtTestEditor').val(progInfoData[0].Lbl_LstUsrTest);
		$('#txtRealEditor').val(progInfoData[0].Lbl_LstUsrReal);
		$('#txtCkInLastDt').val(progInfoData[0].Lbl_LstDatCkIn);
		$('#txtDevLastDt').val(progInfoData[0].Lbl_LstDatDev);
		$('#txtTestLastDt').val(progInfoData[0].Lbl_LstDatTest);
		$('#txtRealLastDt').val(progInfoData[0].Lbl_LstDatReal);
		
		$('[data-ax5select="cboJob"]').ax5select('setValue',progInfoData[0].WkJobCd,true);
		$('[data-ax5select="cboRsrcCd"]').ax5select('setValue',progInfoData[0].WkRsrcCd,true);
		if (progInfoData[0].cr_isrid != null && progInfoData[0].cr_isrid != '') {
			$('#txtSRID').val(progInfoData[0].cr_isrid); 
			$('[data-ax5select="cboSR"]').ax5select('setValue',progInfoData[0].cr_isrid,true);
			if (progInfoData[0].WkSta == '3' && progInfoData[0].WkSecu == 'true') {
				$('#cboSR').prop('disabled', false);
			}
		}
		if (progInfoData[0].WkSecu == 'true' || adminYN) {
			$('#cboRsrcCd').prop('disabled', false);
			$('#cboDir').prop('disabled', false);
			$('#cboEditor').prop('disabled', false);
						
			$('#txtDir').css('disploy','none');
			$('#cboDir').css('disploy','block');
			
			$('#txtRsrcCd').css('disploy','none');
			$('#cboRsrcCd').css('disploy','block');
			
			$('#txtJob').css('disploy','none');
			$('#cboJob').css('disploy','block');
			
			getDirList(progInfoData[0].wkRsrcCd);
			getEditorList(progInfoData[0].cr_editor);
			
			if (progInfoData[0].WkSta == '3' || progInfoData[0].WkSta == '0') {
				if (adminYN) $('#btnDel').prop('disabled', false);
				else if (progInfoData[0].WkSta == '3') {
					$('#btnDel').prop('disabled', false);  //삭제버튼 활성화
				}
				cmd_1
				if (progInfoData[0].WkSta == '0') { 
					$('#btnClose').prop('disabled', false); //폐기버튼 활성화
				}
			} else if (progInfoData[0].WkSta == '9') { 
				$('#btnDel').prop('disabled', false);      //삭제버튼 활성화
			}
			if ((strInfo.substr(9,1) == '0' && strInfo.substr(11,1) == '1') ||
				strInfo.substr(26,1) == '1'	|| strInfo.substr(3,1) == '1') {
				
			}
			if (Number(progInfoData[0].WkVer) > 1) $('#btnDiff').prop('disabled', false);        //소스비교버튼 활성화
			if (Number(progInfoData[0].WkVer) > 0) $('#btnView').prop('disabled', false);       //소스보기버튼 활성화
		} else {			
			$('#txtDir').css('disploy','block');
			$('#cboDir').css('disploy','none');
			
			$('#txtRsrcCd').css('disploy','block');
			$('#cboRsrcCd').css('disploy','none');
			
			$('#txtJob').css('disploy','block');
			$('#cboJob').css('disploy','none');
		}
	}
}

function cboRsrcCd_Change() {
	
	if (getSelectedIndex('cboRsrcCd')<1) return;
	if (progInfoData == null || progInfoData.length==0) return;
	
	var selRsrcCd = $('[data-ax5select="cboRsrcCd"]').ax5select('getValue')[0].cm_micode;
	var progRsrcCd = progInfoData[0].WkRsrcCd;
	
	if (cboDirData.length == 0 && selRsrcCd == progRsrcCd) return;
	
	getDirList(selRsrcCd);
	
}
function getDirList(rsrcCd){
	
	cboDirData = [];
	$('[data-ax5select="cboDir"]').ax5select({
        options: cboDirData
	});
	
	tmpInfo = new Object();
	tmpInfo.userId = userId;
	tmpInfo.sysCd  = selectedGridItem.cr_syscd;
	tmpInfo.itemId  = selectedGridItem.cr_itemid;
	tmpInfo.rsrcCd  = rsrcCd;
	tmpInfo.dsnCd   = selectedGridItem.cr_dsncd;
	tmpInfo.findFg  = 'false';
	if(adminYN) {
		tmpInfo.secuYn = 'N';
	}else {
		tmpInfo.secuYn = 'Y';
	}
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETDIRLIST'
	}
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successDirList);
}
function successDirList(data) {
	
	selOptions = data;
	
	if(selOptions.length > 0) {
		cboDirData.push({value: '0', text: '선택하세요'});
		
		$.each(selOptions,function(key,value) {
			cboDirData.push({value: value.cm_dsncd, text: value.cm_dirpath});
		});
		
		$('[data-ax5select="cboDir"]').ax5select({
	        options: cboDirData
		});
		$('[data-ax5select="cboDir"]').ax5select('setValue',selectedGridItem.cr_dsncd,true);
	}
	
}
function getEditorList(editor){
	
	cboEditorData = [];
	$('[data-ax5select="cboEditor"]').ax5select({
        options: cboEditorData
	});
	tmpInfo = new Object();
	tmpInfo.itemId  = selectedGridItem.cr_itemid;
	tmpInfo.editor  = editor;
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETEDITORLIST'
	}
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successEditorList);
}
function successEditorList(data) {
	
	cboEditorData = data;
	
	if(cboEditorData.length > 0) {
		options = [];
		options.push({value: '0', text: '선택하세요'});
		$.each(cboEditorData,function(key,value) {
			options.push({value: value.cm_userid, text: value.userid});
		});
		
		$('[data-ax5select="cboEditor"]').ax5select({
	        options: options
		});
		$('[data-ax5select="cboEditor"]').ax5select('setValue',progInfoData[0].cr_editor,true);
	}
	
}

function btnRegist_Click() {
	
	if ($('#txtProgId').val().length == 0) return;
	$('#txtStory').val($('#txtStory').val().trim());
	if($('#txtStory').val().length < 1) {
		showToast('프로그램설명을 입력하여 주십시오.');
		$('#txtStory').focus();
		return;
	}
	
	if (getSelectedIndex('cboRsrcCd')<1) {
		showToast('프로그램유형을 선택하여 주십시오.');
		$('#cboRsrcCd').focus();
		return;
	}
	
	if( !$('#cboEditor').prop('disabled') && getSelectedIndex('cboEditor') < 1){
		showToast('최종변경인을 선택하여 주십시오.');
		return;
	}
	
	if( !$('#cboDir').prop('disabled') && getSelectedIndex('cboDir') < 1){
		showToast('프로그램경로를 선택하여 주십시오.');
		return;
	}
	
	if( !$('#cboSR').prop('disabled') && getSelectedIndex('cboSR') < 1){
		showToast('SR-ID를 선택하여 주십시오.');
		return;
	}
	
	tmpInfo = new Object();
	tmpInfo.userid = userId;
	tmpInfo.itemId = selectedGridItem.cr_itemid;
	tmpInfo.jobCd = selectedGridItem.cr_itemid;
	tmpInfo.rsrcCd = selectedGridItem.cr_itemid;
	tmpInfo.progMsg = 
	tmpInfo.dsnCd =
	tmpInfo.
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'CHECKPROG'
	}
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successCheckProg);
}

function successCheckProg(data) {
	var tmpArr = data;
	var tmpObj = [];

	if(tmpArr[0].ID.substr(0,4) == 'FAIL') {
		showToast(tmpArr[0].ID.substring(4));
		return;
	}else {
		if(tmpArr.length > 0 && tmpArr[0].ID == 'ADD') {
			showToast('등록처리가 완료되었습니다.');
			
			if(grdProgListData != null) {
				for(var i=0; i<grdProgList.getList().length; i++) {
					if(grdProgList.getList()[i].cr_itemid == tmpArr[0].cr_itemid) {
						grdProgList.removeRow(i);
						break;
					}
				}
			}
			
			tmpObj = tmpArr[0];
			grdProgList.addRow(tmpObj, 0);
			grdProgList.setColumnSort({cr_rsrcname:{seq:0, orderBy:'asc'}});
		}else {
			showToast(tmpArr[0].ID);
		}	
	}
}

function btnDel_Click() {
	
	if ($('#txtProgId').val().length == 0) return;
	
	confirmDialog.confirm({
		msg: '선택된 프로그램[' + $('#txtProgId').val() + ']을 형상관리DB에서 삭제하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {			
			tmpInfoData = new Object();
			tmpInfoData = {
				userId		: userId,
				itemId      : selectedGridItem.cr_itemid,
				requestType	: 'DELETEPROG'
			}
			ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successDELETE);
		}
	});
}

function successDELETE(data) {
	
	if(Number(data) > 0) {
		showToast('삭제처리가 완료되었습니다.');
	}else {
		showToast('삭제처리가 실패하였습니다.');
	}
}

function btnDiff_Click() {
	
	if ($('#txtProgId').val().length == 0) return;
	
	openWindow('R52', '', '', selectedGridItem.cr_itemid);
}

function btnView_Click() {
	
	if ($('#txtProgId').val().length == 0) return;
	
	openWindow('R53', '', '', selectedGridItem.cr_itemid);
}

function btnDevRep_Click() {
	if($('#cboSysCd option').index($('#cboSysCd option:selected')) < 0) {
		showToast('시스템을 선택하여 주십시오.');
		$('#cboSysCd').focus();
		return;
	}
	
	openWindow('D02', $('#cboSysCd option:selected').val(), '', '');
}

function openWindow(type, syscd, reqNo, rsrcName) {
	var nHeight, nWidth, nTop, nLeft, cURL, cFeatures, winName;

	if ( (type+'_'+syscd) == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}

    winName 	= type+'_'+syscd;
	nHeight 	= screen.height - 200;
    nWidth  	= screen.width - 200;
	nTop  		= parseInt((window.screen.availHeight/2) - (nHeight/2));
	nLeft 		= parseInt((window.screen.availWidth/2) - (nWidth/2));
	cURL 		= '../winpop/DevRepProgRegister.jsp';
	cFeatures 	= 'top=' + nTop + ',left=' + nLeft + ',height=' + nHeight + ',width=' + nWidth + ',help=no,menubar=no,status=yes,resizable=yes,scroll=no';

	var f = document.popPam;   		//폼 name
    myWin = window.open('',winName,cFeatures);
    
    f.UserId.value	= userId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.SysCd.value 	= syscd;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.action		= cURL; 		//이동할 페이지
    f.target		= winName;    	//폼의 타겟 지정(위의 새창을 지정함)
    f.method		= 'post'; 		//POST방식
    f.submit();
}