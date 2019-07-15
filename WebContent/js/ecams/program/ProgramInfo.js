var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;

var grdProgList 		= new ax5.ui.grid();   //프로그램그리드

var selOptions 		= [];
var selectedIndex;		//select 선택 index
var selectedItem;		//select 선택 item
var gridSelectedIndex;  //그리드 선택 index
var selectedGridItem;	//그리드 선택 item

var cboSysCdData 	   = null;	//시스템 데이터
var cboJawonData	   = null;	//프로그램종류 데이터
var grdProgListData    = null; //프로그램그리드 데이터
var progInfoData       = null;
var myWin 			   = null;

var selSw = false;

var tmpInfo = new Object();
var tmpInfoData = new Object();

var tmpTab1            = null;
var tmpTab2            = null;

grdProgList.setConfig({
    target: $('[data-ax5grid="grdProgList"]'),
    sortable: true, 
    multiSort: true,
    multipleSelect: true,
    header: {
        align: 'center',
        columnHeight: 30
    },
    body: {
        columnHeight: 24,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
            grdProgList_Click();
        },
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: 'cm_sysmsg',   	label: '시스템',  			width: '13%',	align: 'left'},
        {key: 'cm_jobname', 	label: '업무',  			width: '13%',	align: 'left'},
        {key: 'cm_dirpath', 	label: '프로그램경로',   	width: '24%',	align: 'left'},
        {key: 'cm_codename', 	label: '프로그램종류',    	width: '13%',	align: 'left'},
        {key: 'cr_rsrcname', 	label: '프로그램명',	  	width: '17%',	align: 'left'},
        {key: 'cr_viewver', 	label: '버전',   	        width: '10%',	align: 'center'},
        {key: 'sta', 	        label: '프로그램상태',  		width: '13%',	align: 'left'}
    ]
});
$(document).ready(function(){
	userId = "MASTER";
	
	//tab메뉴

	$('#tab1Li').width($('#tab1Li').width()+10);
	$('#tab2Li').width($('#tab2Li').width()+10);
	
	setTabMenu();
	
	$('#tabProgBase').width($('#tabProgBase').width()+10);
	$('#tabProgHistory').width($('#tabProgHistory').width()+10);
	$("#tabProgBase").show(); //기본정보
	
	//시스템
	$('#cboSysCd').bind('change', function() {
		cboSysCd_Change();
	});
	
	//조회
	$('#btnQry').bind('click',function() {
		btnQry_Click();
	});

	clickTabMenu();
	getSysInfo();
});

function setTabMenu(){
	$(".tab_content:first").show();
	
	$("ul.tabUl li").click(function () {
		$(".tab_content").hide();
		var activeTab = $(this).attr("rel");
		$("ul.tabUl li").removeClass('on');
		$(this).addClass("on");
		$("#" + activeTab + " iframe").attr('src', $("#" + activeTab + " iframe").attr('src'));
		$("#" + activeTab).fadeIn();
	});
}
//탭메뉴 클릭 이벤트
function clickTabMenu() {
	$("ul.tabs li").click(function () {
		//이미 on상태면 pass
		if($(this).hasClass("on")) {
			changeTabMenu();
			return;
		}
	
		$(".tab_content").hide();
		var activeTab = $(this).attr("rel");
		
		//tab메뉴 클릭에 따라 색상 변경
		$("ul.tabs li").removeClass('on');
		$(this).addClass("on");
		
		$("#" + activeTab).fadeIn();
	});
}
function screenInit() {
	
	$('[data-ax5select="cboJawon"]').ax5select({
        options: []
	});
	
	grdProgList.setData([]);
	$('#lbTotalCnt').text('총0건');
	$('#txtRsrcName').val('');
	$('#txtDirPath').val('');	
	
	screenInit_prog('M');
} 
function screenInit_prog(gbn) {
	
	$("#tab1").unbind("click");
	$("#tab2").unbind("click");
	
	if (gbn == 'S') {
		$("#tab1").bind("click", clickTabMenu());
    }
	tmpTab1 = $('#frmProgBase').get(0).contentWindow;
	tmpTab2 = $('#frmProgHistory').get(0).contentWindow;
	
	tmpTab1.screenInit(gbn);
	tmpTab2.screenInit(gbn);
	
}
//시스템조회 SysInfo.getSysInfo(strUserId,SecuYn,"","N","04");
function getSysInfo() {

	tmpInfo = new Object();
	tmpInfo.UserId = userId;
	tmpInfo.SelMsg = '';
	tmpInfo.CloseYn = 'N';		
	tmpInfo.SysCd = '';
	if(adminYN) {
		tmpInfo.SecuYn = 'N';
	}else {
		tmpInfo.SecuYn = 'Y';
	}
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETSYSINFO'
	}
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successSystem);
}

function successSystem(data) {
	cboSysCdData = data;
	
	cboSysCdData = cboSysCdData.filter(function(data) {
		if(data.cm_sysinfo.substr(0,1) == "1") return false;
		else return true;
	});
	
	$('[data-ax5select="cboSysCd"]').ax5select({
		options: injectCboDataToArr(cboSysCdData, 'cm_syscd' , 'cm_sysmsg')
	});

	if(cboSysCdData.length > 0) {
		$('[data-ax5select="cboSysCd"]').ax5select('setValue',cboSysCdData[0].cm_syscd,true); //value값으로
		
		cboSysCd_Change();
	}
}

function cboSysCd_Change() {
	
	screenInit();
	
	selectedIndex = getSelectedIndex('cboSysCd');
	selectedItem = getSelectedVal('cboSysCd');
	
	if(selectedIndex < 0) return;	
	
	getJobInfo(selectedItem.cm_syscd);  //업무 리로딩
	getRsrcInfo(selectedItem.cm_syscd); //프로그램유형 리로딩
	
}

//선택한 시스템에 대한 프로그램유형조회 SysInfo.getJobInfo(String UserID,String SysCd,String SecuYn,String CloseYn,String SelMsg,String sortCd)

//선택한 시스템에 대한 업무조회 SysInfo.getJobInfo()
function getJobInfo(sysCd) {
		
	tmpInfo = new Object();
	tmpInfo.UserID = userId;
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
	tmpInfo.userId = userId;
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
	cboJawonData = data;	
	
	if (cboJawonData != null && (cboJawonData.length > 0)) {
		options = [];
		$.each(cboJawonData,function(key,value) {
			options.push({value: value.cm_micode, text: value.cm_codename});
		});
		
		$('[data-ax5select="cboJawon"]').ax5select({
	        options: options
		});
		$('[data-ax5select="cboJawon"]').ax5select('setValue', 	'0000', 	true); 	// 프로그램유형 초기화
	}
	tmpTab1 = $('#frmProgBase').get(0).contentWindow;
	tmpTab1.successJawon(data);
	
}
function btnQry_Click() {
	
	grdProgListData = [];
	grdProgList.setData(grdProgListData);
	
	screenInit_prog('S');
	
	if(getSelectedIndex('cboSysCd') < 0){
		showToast('시스템을 선택하여 주십시오.');
		$('#cboSysCd').focus();
		return;
	}
	$('#txtRsrcName').val($('#txtRsrcName').val().trim());
	$('#txtDirPath').val($('#txtDirPath').val().trim());
	if(getSelectedIndex('cboJawon') < 1){
		if($('#txtRsrcName').val().length == 0 && $('#txtDirPath').val().length == 0) {
			showToast('프로그램종류/프로그램명/프로그램경로 중  한가지이상 선택 또는 입력하여 주십시오.');
			return;			
		}
	}
	
	tmpInfo = new Object();
	tmpInfo.UserId = userId;
	tmpInfo.L_Syscd  = $('#cboSysCd option:selected').val();
	if(getSelectedIndex('cboJawon') > 0){
		tmpInfo.Rsrccd = $('#cboJawon option:selected').val();
	}
	tmpInfo.Txt_ProgId = $('#txtRsrcName').val();
	tmpInfo.DirPath = $('#txtDirPath').val();
	tmpInfo.DsnCd = '';
	if(adminYN) {
		tmpInfo.SecuYn = 'N';
	}else {
		tmpInfo.SecuYn = 'Y';
	}
	tmpInfo.ViewFg = 'false';
	
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETPROGLIST'
	}
	//public Object[] getSql_Qry(String UserId,String SecuYn,String ViewFg, String L_Syscd,String Txt_ProgId,String DsnCd,String Rsrccd, String DirPath)
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successProgList);
}

function successProgList(data) {
	grdProgListData = data;
	grdProgList.setData(grdProgListData);
	
	grdProgList.setColumnSort({cr_rsrcname:{seq:0, orderBy:'asc'}});
	
	$('#lbTotalCnt').text('총' + grdProgListData.length + '건');
}

function grdProgList_Click() {
	gridSelectedIndex = grdProgList.selectedDataIndexs;
	selectedGridItem = grdProgList.list[grdProgList.selectedDataIndexs];
	
	screenInit_prog('S');
		
	tmpInfo = new Object();
	tmpInfo.UserId = userId;
	tmpInfo.L_SysCd  = selectedGridItem.cr_syscd;
	tmpInfo.L_JobCd  = selectedGridItem.cr_jobcd;
	tmpInfo.L_ItemId  = selectedGridItem.cr_itemid;
	if(adminYN) {
		tmpInfo.SecuYn = 'N';
	}else {
		tmpInfo.SecuYn = 'Y';
	}
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
	tmpTab1.successProgInfo(data,selectedGridItem);
	

	tmpTab2 = $('#frmProgHistory').get(0).contentWindow;
	tmpTab2.successProgInfo(data,selectedGridItem);
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