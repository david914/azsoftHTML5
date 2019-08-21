
var itemId 		= window.parent.pItemId;			//프로그램id: itemid
var userId 		= window.parent.pUserId;			//접속자 ID
var reqCd		= window.parent.reqCd;				//신청구분

var grdReqVersion  = new ax5.ui.grid();
var confirmDialog  = new ax5.ui.dialog();   		//확인 창

var grdReqVersionData = null; 						//버전목록 데이타
var data              = null;						//json parameter

var selectVer    = 'sel'; //선택버전
var selectAcptno = '';    //선택한신청버전

confirmDialog.setConfig({
	Title: "확인",
    theme: "info",
    width: 500
});

grdReqVersion.setConfig({
    target: $('[data-ax5grid="grdReqVersion"]'),
    sortable: true, 
    multiSort: true,
    showLineNumber: true,
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
        	if (this.dindex < 0) {
    			confirmDialog.alert('선택 할 버전의 데이터를 선택하여 주십시요.');
    			return;
        	}
        	
			var gridSelectedIndex = grdReqVersion.selectedDataIndexs;
			if (gridSelectedIndex.length == 0) {
	       		confirmDialog.alert('선택 할 버전의 데이터를 선택하여 주십시요.');
				return;
			}
			
			selectVer = this.item.cr_ver;
			selectAcptno = this.item.cr_acptno;
			popClose(true);
			
        },
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: "srid", label: "SR-ID",  width: '20%', align: "left"},
        {key: "acptdate", label: "요청일시",  width: '15%'},
        {key: "cm_username", label: "신청자",  width: '10%'},
        {key: "cr_ver", label: "버전",  width: '10%'},
        {key: "passcd", label: "신청사유",  width: '29%', align: "left"},
        {key: "acptno", label: "신청번호",  width: '15%'}
    ]
});

$(document).ready(function() {
	//버전리스트 가져오기
	data = new Object();
	data = {
		ItemId 		: itemId,
		ReqCD 		: reqCd,
		requestType : 'getVerList'
	}
	ajaxAsync('/webPage/modal/request/ChkOutVerSelModalServlet', data, 'json', successGetVerList);
	
	//X버튼 닫기
	$('#btnExit').bind('click', function() {
		popClose(false);
	});
	//하단 닫기버튼
	$('#btnClose').bind('click', function() {
		popClose(false);
	});
	//선택 버튼
	$('#btnSel').bind('click', function() {
		
		var gridSelectedIndex = grdReqVersion.selectedDataIndexs;
		if (gridSelectedIndex.length == 0) {
       		confirmDialog.alert('선택 할 버전의 데이터를 선택하여 주십시요.');
			return;
		}
		
		var selectedGridItem = grdReqVersion.list[grdReqVersion.selectedDataIndexs];
		selectVer = selectedGridItem.cr_ver;
		selectAcptno = selectedGridItem.cr_acptno;
		popClose(true);
	});
	
	//선택버전초기화 버튼
	$('#btnReset').bind('click', function() {
		selectVer = 'sel';
		selectAcptno = '';
		popClose(true);
	});
});
//버전리스트 가져오기 완료
function successGetVerList(data){
	grdReqVersionData = data;
	grdReqVersion.setData(grdReqVersionData);
}
//모달닫기
function popClose(updateflag) {
	window.parent.updateFlag = updateflag;
	window.parent.selectVer = selectVer;
	window.parent.selectAcptno = selectAcptno;
	window.parent.ChkOutVerSelModal.close();
}