var userName 	 	= window.top.userName;
var userId 		 	= window.top.userId;
var adminYN 		= window.top.adminYN;
var userDeptName 	= window.top.userDeptName;
var userDeptCd 	 	= window.top.userDeptCd;

var grdProgHistory	= new ax5.ui.grid();   //프로그램그리드

var selOptions 		= [];
var selectedIndex;		//select 선택 index
var selectedItem;		//select 선택 item
var gridSelectedIndex;  //그리드 선택 index
var selectedGridItem;	//그리드 선택 item

var cboReqData		   = null;	//신청구분 데이터
var progInfoData       = null;
var myWin 			   = null;

var selSw = false;

var tmpInfo = new Object();
var tmpInfoData = new Object();

grdProgHistory.setConfig({
    target: $('[data-ax5grid="grdProgHistory"]'),
    sortable: true, 
    multiSort: true,
    header: {
        align: 'center',
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
    		swal({
                title: '신청상세팝업',
                text: '신청번호 ['+this.item.acptno2+']['+param.item.qrycd2+']['+this.dindex+']'
           });
    		
			openWindow(1, param.item.qrycd2, this.item.acptno2,'');
        },
    	trStyleClass: function () {
    		if (this.item.SubItems9 === '3'){
    			return 'fontStyle-cncl';
    		} else {
    		}
    	},
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: 'acptdate', 	    label: '신청일시',  	width: '11%',	align: 'center'},
        {key: 'cm_username',    label: '신청인',   	width:  '8%',	align: 'center'},
        {key: 'REQUEST', 	    label: '신청구분',    	width: '10%',	align: 'left'},
        {key: 'acptno', 	    label: '신청번호',	  	width: '10%',	align: 'center'},
        {key: 'passok', 	    label: '배포구분',   	width: '10%',	align: 'center'},
        {key: 'prcdate',   	    label: '완료일시',  	width: '11%',	align: 'center'},
        {key: 'cr_aftviewver',	label: '버전',    	width: '10%',	align: 'center'},
        {key: 'srinfo'   , 	    label: 'SR-ID',   	width: '15%',	align: 'center'},
        {key: 'cr_sayu', 	    label: '변경사유',   	width: '15%',	align: 'left'}
    ]
});
$(document).ready(function(){
	getCodeInfo();
	
	//변경이력조회
	$('#btnQry2').bind('click',function() {
		btnQry2_Click();
	});
});

function screenInit(gbn) {
	
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
		if(data.cm_micode > '20') return true;
		else return false;
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

function successProgInfo(data,selectedGridItem) {
	var strInfo = '';
	progInfoData = data;
	
	if (progInfoData.length > 0) {
		$('#txtProgId2').val(progInfoData[0].cr_rsrcname);
		$('#txtStory2').val(progInfoData[0].Lbl_ProgName);	
		
		getHistoryList(selectedGridItem.cr_syscd,selectedGridItem.cr_jobcd,selectedGridItem.cr_itemid,'ALL');
	}
}
function getHistoryList(sysCd,jobCd,itemId,reqCd){
	
	grdProgHistoryData = [];
	grdProgHistory.setData(grdProgHistoryData);
	
	tmpInfo = new Object();
	tmpInfo.UserId = userId;
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