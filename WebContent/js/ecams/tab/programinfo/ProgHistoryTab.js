var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;

var grdProgHistory	= new ax5.ui.grid();   //프로그램그리드

var selOptions 		= [];

var cboReqData		   = null;	//신청구분 데이터
var progInfoData       = null;
var myWin 			   = null;
var pUserId            = null;
var grdProgHistoryData = null;

var selSw = false;

var tmpInfo = new Object();
var tmpInfoData = new Object();



$(document).ready(function(){
	createViewGrid();
	
	getCodeInfo();
	
	//변경이력조회
	$('#btnQry2').bind('click',function() {
		btnQry2_Click();
	});
	
	
});

function upFocus() {
	grdProgHistory.focus('HOME');
}

function createViewGrid() {
	
	grdProgHistory	= new ax5.ui.grid();
	grdProgHistory.setConfig({
	    target: $('[data-ax5grid="grdProgHistory"]'),
	    sortable: true, 
	    multiSort: true,
	    showLineNumber: true, 
	    header: {
	        align: 'center'
	    },
	    body: {
	        onClick: function () {
	        	this.self.clearSelect();
	            this.self.select(this.dindex);
	        },
	        onDBLClick: function () {
	        	if (this.dindex < 0) return;
	     	
	        	openWindow(this.item.cr_qrycd, this.item.cr_acptno,'');
	        },
	    	trStyleClass: function () {
	    		if (this.item.cr_status === '3'){
	    			return 'fontStyle-cncl';
	    		} 
	    	},
	    	onDataChanged: function(){
	    	    this.self.repaint();
	    	}
	    },
	    columns: [
	        {key: 'acptdate', 	    label: '신청일시',  	width: '11%',	align: 'center'},
	        {key: 'cm_username',    label: '신청인',   	width:  '8%',	align: 'center'},
	        {key: 'REQUEST', 	    label: '신청구분',    	width: '9%',	align: 'left'},
	        {key: 'acptno', 	    label: '신청번호',	  	width: '9%',	align: 'center'},
	        {key: 'passok', 	    label: '배포구분',   	width:  '8%',	align: 'center'},
	        {key: 'prcdate',   	    label: '완료일시',  	width: '11%',	align: 'center'},
	        {key: 'cr_aftviewver',	label: '버전',    	width: '10%',	align: 'center'},
	        {key: 'srinfo'   , 	    label: 'SR-ID',   	width: '15%',	align: 'left'},
	        {key: 'cr_sayu', 	    label: '변경사유',   	width: '20%',	align: 'left'}
	    ]
	});
	
	if (grdProgHistoryData != null && grdProgHistoryData.length > 0) {
		grdProgHistory.setData(grdProgHistoryData);
	}
	
}
function screenInit(gbn,userId) {

	pUserId = userId;
	grdProgHistory.setData([]);
	
	$('#txtProgId2').val('');
	$('#txtStory2').val('');
	
	$('#btnQry2').prop('disabled', true);	
	
	if (cboReqData != null && cboReqData.length > 0) {
		$('[data-ax5select="cboReq"]').ax5select('setValue', 	   '0', 	true); 	// 신청구분 초기화
	}
	
} 
//신청구분 cbo  가져오기
function getCodeInfo(){
	
	var codeInfos = getCodeInfoCommon([
		new CodeInfo('REQUEST','ALL','N')
		]);
	selOptions 		= codeInfos.REQUEST;
	cboReqData      = [];
	
	selOptions = selOptions.filter(function(data) {
		if(data.cm_micode > '20') return false;
		else return true;
	});
	
	if (selOptions.length > 0) {		
		$.each(selOptions,function(key,value) {
			cboReqData.push({value: value.cm_micode, text: value.cm_codename});
		});
		
		$('[data-ax5select="cboReq"]').ax5select({
	        options: cboReqData
		});
		
		$('[data-ax5select="cboReq"]').ax5select('setValue', 	'00', 	true); 	// 신청구분 초기화
	}
}

function successProgInfo(data) {
	var strInfo = '';
	progInfoData = data;
	
	if (progInfoData.length > 0) {
		$('#btnQry2').prop('disabled',false);
		$('#txtProgId2').val(progInfoData[0].cr_rsrcname);
		$('#txtStory2').val(progInfoData[0].Lbl_ProgName);	
		
		getHistoryList(progInfoData[0].cr_syscd,progInfoData[0].WkJobCd,progInfoData[0].cr_itemid,'ALL');
	}
}
function getHistoryList(sysCd,jobCd,itemId,reqCd){
	
	grdProgHistoryData = [];
	grdProgHistory.setData(grdProgHistoryData);
	grdProgHistory.clearSelect();
	
	tmpInfo = new Object();
	tmpInfo.UserId = pUserId;
	tmpInfo.L_SysCd  = sysCd;
	tmpInfo.L_ItemId = itemId;
	tmpInfo.L_JobCd  = jobCd;
	tmpInfo.Cbo_ReqCd  = reqCd;
	tmpInfoData = new Object();
	tmpInfoData = {
		tmpInfo		: tmpInfo,
		requestType	: 'GETHISTORY'
	}
	//getSql_Qry_Hist(String UserId,String L_SysCd,String L_JobCd,String Cbo_ReqCd, String L_ItemId)
	ajaxAsync('/webPage/program/ProgramInfoServlet', tmpInfoData, 'json', successHistory);
}
function successHistory(data) {
	
	grdProgHistoryData = data;
	grdProgHistory.setData(grdProgHistoryData);
	if (grdProgHistoryData.length > 0) {
		grdProgHistory.select(0);
	}
	
}

function btnQry2_Click() {
	
	if (progInfoData.length > 0) {
		$('#btnQry2').prop('disabled',false);
		
		if (getSelectedIndex('cboReq')<1) {
			getHistoryList(progInfoData[0].cr_syscd,progInfoData[0].WkJobCd,progInfoData[0].cr_itemid,'ALL');
		} else {
			getHistoryList(progInfoData[0].cr_syscd,progInfoData[0].WkJobCd,progInfoData[0].cr_itemid,getSelectedVal('cboReq').value);
		}
	}
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

    nHeight = screen.height - 300;
    nWidth  = screen.width - 400;

	cURL = "/webPage/winpop/PopRequestDetail.jsp";
    myWin = winOpen(f, winName, cURL, nHeight, nWidth);
    
}