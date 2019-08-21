var pItemId = null;
var pUserId = null;
var progBaseData = null;
var tmpInfo = new Object();
var tmpInfoData = new Object();

var load1Sw = false;
var load2Sw = false;

var f = document.getSrcData;

pItemId = f.itemid.value;
pUserId = f.user.value;


$(document).ready(function(){
	//pUserId = 'MASTER';
	//pItemId = '000000179792';
	if (pUserId == null || pUserId.length == 0) {
		dialog.alert('로그인 후 사용하시기 바랍니다.',function(){});
		return;		
	}
	if (pItemId == null || pItemId.length != 12) {
		dialog.alert('프로그램ID가 정확하지 않습니다. 확인 후 진행하시기 바랍니다.');
		return;
	}
		
	setTabMenu();
	
	$('#tabProgBase').width($('#tabProgBase').width()+10);
	$('#tabProgHistory').width($('#tabProgHistory').width()+10);
	$("#tabProgBase").show(); //기본정보
		
	document.getElementById('frmProgBase').onload = function() {
		load1Sw = true;
		screenInit_prog('I');
	}
	
	document.getElementById('frmProgHistory').onload = function() {
		load2Sw = true;
		screenInit_prog('I');
	}


	//닫기클릭
	$('#btnExit').bind('click', function() {
		close();
	});
	
});
function setTabMenu(){
	$('.tab_content:first').show();	
	
	clickTabMenu();
}

function clickTabMenu(){
	
	$('ul.tabs li').click(function () {
		if($(this).hasClass('on')) {
			return;
		}
		$('.tab_content').hide();
		var activeTab = $(this).attr('rel');
		
		//tab메뉴 클릭에 따라 색상 변경
		$('ul.tabs li').removeClass('on');
		$(this).addClass('on');
		$('#' + activeTab).fadeIn();
	});
	
}
function screenInit_prog(gbn) {
	
	if (gbn == 'I') {
		if (load1Sw && load2Sw) {
			getProgBase();
			return;
		}
		return;
	}
	
	tmpTab1 = $('#frmProgBase').get(0).contentWindow;
	tmpTab1.screenInit(gbn,pUserId);
	tmpTab2 = $('#frmProgHistory').get(0).contentWindow;	
	tmpTab2.screenInit(gbn,pUserId);	
	
	//$('#tab1').trigger('click');
	$("#tabProgBase").show(); //기본정보
	$('#tab2').removeClass('on');
	$('#tab1').addClass('on');
	$('#tab1').fadeIn();
	
}
function getProgBase() {

	tmpInfo = new Object();
	tmpInfo.UserId = pUserId;
	tmpInfo.itemid = pItemId;
	tmpInfo.secuyn = 'X';
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETPROGLIST'
	}
	//public Object[] getSql_Qry(String UserId,String SecuYn,String ViewFg, String L_Syscd,String Txt_ProgId,String DsnCd,String Rsrccd, String DirPath)
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successProgList);
}

function successProgList(data) {
	progBaseData = data;
	if (progBaseData.length != 1) {
		dialog.alert('프로그램ID가 정확하지 않습니다. 확인 후 진행하시기 바랍니다.');
		return;
	}

	if (progBaseData[0].adminsw == 'Y') adminYN = true;
	else adminYN = false;
	
	getJobInfo(progBaseData[0].cr_syscd);  //업무 리로딩
	getRsrcInfo(progBaseData[0].cr_syscd); //프로그램유형 리로딩
	getProgInfo();
}
function getJobInfo(sysCd) {
	
	tmpInfo = new Object();
	tmpInfo.UserID = pUserId;
	tmpInfo.SelMsg = 'SEL';
	tmpInfo.CloseYn = 'N';		
	tmpInfo.SysCd = sysCd;
	if(adminYN) {
		tmpInfo.SecuYn = 'N';
	}else {
		tmpInfo.SecuYn = 'Y';
	}
	tmpInfo.sortCd = 'NAME';
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETJOBINFO'
	}
	tmpTab1 = $('#frmProgBase').get(0).contentWindow;
	tmpTab1.getJobInfo(tmpInfoData);
	
}
function getRsrcInfo(sysCd) {
	
	$('[data-ax5select="cboJawon"]').ax5select({
      options: []
	});
	
	tmpInfo = new Object();
	tmpInfo.userId = pUserId;
	tmpInfo.SelMsg = 'ALL';
	tmpInfo.closeYn = 'N';		
	tmpInfo.sysCd = sysCd;
	if(adminYN) {
		tmpInfo.secuYn = 'N';
	}else {
		tmpInfo.secuYn = 'Y';
	}
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETRSRCINFO'
	}
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successJawon);
}
function successJawon(data) {
	
	tmpTab1 = $('#frmProgBase').get(0).contentWindow;
	tmpTab1.successJawon(data);
	
}
function getProgInfo() {
	
	tmpInfo = new Object();
	tmpInfo.UserId    = pUserId;
	tmpInfo.L_ItemId  = pItemId;
	tmpInfo.SecuYn    = 'X';
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETPROGINFO'
	}
	////public Object[] Cmd0500_Lv_File_ItemClick(String UserId,String SecuYn,String L_SysCd,String L_JobCd,String L_ItemId)
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successProgInfo);
}
function successProgInfo(data) {
	
	tmpTab1 = $('#frmProgBase').get(0).contentWindow;
	tmpTab1.successProgInfo(data);
	

	tmpTab2 = $('#frmProgHistory').get(0).contentWindow;
	tmpTab2.successProgInfo(data);
}