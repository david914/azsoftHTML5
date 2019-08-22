var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;

var cboRsrcCdData	   = null;	//프로그램종류 데이터
var cboJobData		   = null;	//업무 데이터
var cboDirData		   = null;	//프로그램경로 데이터
var cboSRData		   = null;	//SRID 데이터
var progInfoData       = null;
var myWin 			   = null;
var pUserId            = null;

var selSw = false;

var tmpInfo = new Object();
var tmpInfoData = new Object();

$(document).ready(function(){	
	
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
function screenInit(gbn,userId) {	
	if(gbn == 'M') {
		$('[data-ax5select="cboJob"]').ax5select({
	        options: []
		});
		
		$('[data-ax5select="cboRsrcCd"]').ax5select({
	        options: []
		});
	}
	pUserId = userId;
	$('#divPrgCbo').css('display', 'none');
	$('#divPrgTxt').css('display', 'block');
	
	$('#divJobCbo').css('display', 'none');
	$('#divJobTxt').css('display', 'block');
	
	$('#divSRCbo').css('display', 'none');
	$('#divSRTxt').css('display', 'block');
	
	$('#divDirCbo').css('display', 'none');
	$('#divDirTxt').css('display', 'block');
	
	$('#txtSysMsg').val('');
	$('#txtProgId').val('');
	$('#txtProgSta').val('');
	$('#txtSR').val('');
	$('#txtStory').val('');
	$('#txtCreator').val('');
	$('#txtCreatDt').val('');
	$('#txtEditor').val('');
	$('#txtLastDt').val('');
	$('#txtStory').prop("readonly", true);
	
	$('#txtLastCkIn').val('');
	$('#txtLastDev').val('');
	$('#txtLastTest').val('');
	$('#txtLastReal').val('');
	
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
	
	$('#cboEditor').prop('disabled', true);
	$('#cboSR').prop('disabled', true);
	$('#cboJob').prop('disabled', true);
	$('#cboRsrcCd').prop('disabled', true);
	$('#cboDir').prop('disabled', true);
}

//SR조회 prjCall();
function getSRID() {
	tmpInfo = new Object();
	tmpInfo.userid = pUserId;
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
function successProgInfo(data) {
	var strInfo = '';
	progInfoData = data;
	
	if (progInfoData.length > 0) {
		if (progInfoData[0].adminsw == 'Y') adminYN = true;
		else adminYN = false;
		strInfo = progInfoData[0].cm_info;
		$('#txtSysMsg').val(progInfoData[0].cm_sysmsg);
		$('#txtJawon').val(progInfoData[0].RsrcName);
		$('#txtProgId').val(progInfoData[0].cr_rsrcname);
		$('#txtProgSta').val(progInfoData[0].sta);
		$('#txtStory').val(progInfoData[0].Lbl_ProgName);
		$('#txtDir').val(progInfoData[0].cm_dirpath);
		$('#txtCreator').val(progInfoData[0].Lbl_Creator);
		$('#txtEditor').val(progInfoData[0].Lbl_Editor);
		$('#txtCreatDt').val(progInfoData[0].Lbl_CreatDt);
		$('#txtLastDt').val(progInfoData[0].Lbl_LastDt);
		
		$('#txtLastCkIn').val(progInfoData[0].Lbl_LstUsrCkIn+' '+progInfoData[0].Lbl_LstDatCkIn);
		$('#txtLASTDev').val(progInfoData[0].Lbl_LstUsrDev+' '+progInfoData[0].Lbl_LstDatDev);
		$('#txtLastTest').val(progInfoData[0].Lbl_LstUsrTest+' '+progInfoData[0].Lbl_LstDatTest);
		$('#txtLastReal').val(progInfoData[0].Lbl_LstUsrReal+' '+progInfoData[0].Lbl_LstDatReal);
		
		$('[data-ax5select="cboJob"]').ax5select('setValue',progInfoData[0].WkJobCd,true);
		$('[data-ax5select="cboRsrcCd"]').ax5select('setValue',progInfoData[0].WkRsrcCd,true);
		
		if (progInfoData[0].cr_isrid != null && progInfoData[0].cr_isrid != '') {
			$('#txtSR').val(progInfoData[0].cr_isrid); 
			
			if (progInfoData[0].WkSta == '3' && progInfoData[0].WkSecu == 'true') {
				$('[data-ax5select="cboSR"]').ax5select('setValue',progInfoData[0].cr_isrid,true);
				
				$('#divSRCbo').css('display', 'block');
				$('#divSRTxt').css('display', 'none');
				$('#cboSR').prop('disabled', false);
			} 
		}
		if (progInfoData[0].WkSecu == 'true' || adminYN) {
			$('#cboEditor').prop('disabled', false);
			$('#cboRsrcCd').prop('disabled', false);
			$('#cboJob').prop('disabled', false);
			$('#cboDir').prop('disabled', false);
						
			$('#divPrgCbo').css('display', 'block');
			$('#divPrgTxt').css('display', 'none');
			
			$('#divJobCbo').css('display', 'block');
			$('#divJobTxt').css('display', 'none');
			
			$('#divDirCbo').css('display', 'block');
			$('#divDirTxt').css('display', 'none');

			
			getDirList(progInfoData[0].WkRsrcCd);
			getEditorList(progInfoData[0].cr_editor);
			
			if (progInfoData[0].WkSta == '3' || progInfoData[0].WkSta == '0') {
				if (adminYN) $('#btnDel').prop('disabled', false);
				else if (progInfoData[0].WkSta == '3') {
					$('#btnDel').prop('disabled', false);  //삭제버튼 활성화
				}
				$('#btnRegist').prop('disabled', false); //수정버튼 활성화
				if (progInfoData[0].WkSta == '0') { 
					$('#btnClose').prop('disabled', false); //폐기버튼 활성화
				}

				$('#txtStory').prop("readonly", false);
			} else if (progInfoData[0].WkSta == '9') { 
				$('#btnDel').prop('disabled', false);      //삭제버튼 활성화
			}
			if ((strInfo.substr(9,1) == '0' && strInfo.substr(11,1) == '1') ||
				strInfo.substr(26,1) == '1'	|| strInfo.substr(3,1) == '1') {
				
			}
			if (Number(progInfoData[0].WkVer) > 1) $('#btnDiff').prop('disabled', false);        //소스비교버튼 활성화
			if (Number(progInfoData[0].WkVer) > 0) $('#btnView').prop('disabled', false);       //소스보기버튼 활성화
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
	tmpInfo.userId = pUserId;
	tmpInfo.sysCd  = progInfoData[0].cr_syscd;
	tmpInfo.itemId  = progInfoData[0].cr_itemid;
	tmpInfo.rsrcCd  = rsrcCd;
	tmpInfo.dsnCd   = progInfoData[0].cr_dsncd;
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
		$('[data-ax5select="cboDir"]').ax5select('setValue',progInfoData[0].cr_dsncd,true);
	}
	
}
function getEditorList(editor){
	
	cboEditorData = [];
	$('[data-ax5select="cboEditor"]').ax5select({
        options: cboEditorData
	});
	tmpInfo = new Object();
	tmpInfo.itemId  = progInfoData[0].cr_itemid;
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
	
	var findSw = false;
	
	if ($('#txtProgId').val().length == 0) return;
	
	$('#txtStory').val($('#txtStory').val().trim());
	if($('#txtStory').val().length < 1) {
		dialog.alert('프로그램설명을 입력하여 주시기 바랍니다.',function(){});
		$('#txtStory').focus();
		return;
	}
	
	if (getSelectedIndex('cboJob')<1) {
		dialog.alert('업무를 선택하여 주시기 바랍니다.',function(){});
		$('#cboJob').focus();
		return;
	}
	
	if (getSelectedIndex('cboRsrcCd')<1) {
		dialog.alert('프로그램유형을 선택하여 주시기 바랍니다.',function(){});
		$('#cboRsrcCd').focus();
		return;
	}
	
	if( !$('#cboEditor').prop('disabled') && getSelectedIndex('cboEditor') < 1){
		dialog.alert('최종변경인을 선택하여 주시기 바랍니다.',function(){});
		$('#cboEditor').focus();
		return;
	}
	
	if( !$('#cboDir').prop('disabled') && getSelectedIndex('cboDir') < 1){
		dialog.alert('프로그램경로를 선택하여 주시기 바랍니다.',function(){});
		$('#cboDir').focus();
		return;
	}
	
	if( !$('#cboSR').prop('disabled') ) {
		if (getSelectedIndex('cboSR') < 1){
			dialog.alert('SR-ID를 선택하여 주시기 바랍니다.',function(){});
			return;
		}
	}
	
	tmpInfo = new Object();
	tmpInfo.userid = pUserId;
	tmpInfo.itemId = progInfoData[0].cr_itemid;
	
	if (progInfoData[0].WkJobCd != getSelectedVal('cboJob').value) {
		tmpInfo.jobcd = getSelectedVal('cboJob').value;
		findSw = true;
	} else tmpInfo.jobcd = "";
	
	if (progInfoData[0].WkRsrcCd != getSelectedVal('cboRsrcCd').value) {
		tmpInfo.rsrccd = getSelectedVal('cboRsrcCd').value;
		findSw = true;
	} else tmpInfo.rsrccd = "";
	
	if( !$('#cboSR').prop('disabled') && progInfoData[0].cr_isrid != getSelectedVal('cboSR').value) {
		tmpInfo.srid = getSelectedVal('cboSR').value;
		findSw = true;
	} else tmpInfo.srid = "";

	if( !$('#cboDir').prop('disabled') && progInfoData[0].cr_dsncd != getSelectedVal('cboDir').value) {
		tmpInfo.dsncd = getSelectedVal('cboDir').value;
		findSw = true;
	} else tmpInfo.dsncd = "";

	if( !$('#cboEditor').prop('disabled') && progInfoData[0].cr_editor != getSelectedVal('cboEditor').value) {
		tmpInfo.editor = getSelectedVal('cboEditor').value;
		findSw = true;
	} else tmpInfo.editor = "";
	
	if (progInfoData[0].Lbl_ProgName != $('#txtStory').val()) {
		tmpInfo.story = $('#txtStory').val();
		findSw = true;
	} else tmpInfo.story = "";
	
	if (!findSw) {
		dialog.alert('수정 할 내용이 없습니다. 수정등록하시려면 내용을 변경 후 진행하시기 바랍니다.',function(){});
		return;
	}
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'UPDATEPROG'
	}
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successUpdateProg);
}

function successUpdateProg(data) {

	if(Number(data) > 0) {
		dialog.alert('수정처리를 완료하였습니다.', function(){});
	}else {
		dialog.alert('수정처리 중 오류가 발생하였습니다.', function(){});
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
				userId		: pUserId,
				itemId      : progInfoData[0].cr_itemid,
				requestType	: 'DELETEPROG'
			}
			ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successDELETE);
		}
	});
}

function successDELETE(data) {
	
	if(Number(data) > 0) {
		dialog.alert('삭제처리를 완료하였습니다.', function(){});
	}else {
		dialog.alert('삭제처리 중 오류가 발생하였습니다.', function(){});
	}
}

function btnClose_Click() {
	
	if ($('#txtProgId').val().length == 0) return;
	
	confirmDialog.confirm({
		msg: '선택된 프로그램[' + $('#txtProgId').val() + ']을 폐기처리(상태변경} 하시겠습니까?',
	}, function(){
		if(this.key === 'ok') {			
			tmpInfoData = new Object();
			tmpInfoData = {
				userId		: pUserId,
				itemId      : progInfoData[0].cr_itemid,
				requestType	: 'CLOSEPROG'
			}
			ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successClose);
		}
	});
}

function successClose(data) {
	
	if(Number(data) > 0) {
		dialog.alert('폐기처리를 완료하였습니다.', function(){});
	}else {
		dialog.alert('폐기처리 중 오류가 발생하였습니다.', function(){});
	}
}
function btnDiff_Click() {
	
	if ($('#txtProgId').val().length == 0) return;
	
	openWindow('R52', '', progInfoData[0].cr_itemid);
}

function btnView_Click() {
	
	if ($('#txtProgId').val().length == 0) return;
	
	openWindow('R53', '', progInfoData[0].cr_itemid);
}
function openWindow(reqCd,reqNo,itemId) {
	var nHeight, nWidth, cURL, winName;

	if ( ('proginfo_'+reqCd) == winName ) {
		if (myWin != null) {
	        if (!myWin.closed) {
	        	myWin.close();
	        }
		}
	}

    winName = 'proginfo_'+reqCd;

	var f = document.popPam;   		//폼 name
    
    f.acptno.value	= reqNo;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.user.value 	= pUserId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)
    f.itemid.value	= itemId;    	//POST방식으로 넘기고 싶은 값(hidden 변수에 값을 넣음)

	nHeight = screen.height - 100;
    nWidth  = screen.width - 200;
    //console.log(nHeight+', '+nWidth);
	if (reqCd == 'R53') {
		cURL = "/webPage/winpop/PopSourceView.jsp";	    
	} else if (reqCd == 'R52') {
		cURL = "/webPage/winpop/PopSourceDiff.jsp";
	}
    myWin = winOpen(f, winName, cURL, nHeight, nWidth);
    
}