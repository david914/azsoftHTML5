
var acptNo 		= window.parent.pReqNo;				//신청번호
var userId 		= window.parent.pUserId;			//접속자 ID

var grdBefJob  	= new ax5.ui.grid();

var grdBefJobData = null; 							//선후행목록 데이타
var data          = null;							//json parameter

grdBefJob.setConfig({
    target: $('[data-ax5grid="grdBefJob"]'),
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
        	//this.self.clearSelect();
           this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	if (this.dindex < 0) return;

	       	var selIn = grdBefJob.selectedDataIndexs;
	       	if(selIn.length === 0) return;
	       	
	       	mask.open();
	        confirmDialog.confirm({
		        title: '선행작업해제확인',
				msg: '선택하신 신청 건을 선행작업에서 해제하시겠습니까?',
			}, function(){
				if(this.key === 'ok') {
					delBefJob(param.item.cr_befact);
				}
			});
			mask.close();
        },
    	trStyleClass: function () {
    		if (this.item.colorsw == '3'){
    			return "fontStyle-cncl";
    		} else if(this.item.colorsw == '5'){
    			return "fontStyle-eror";
    		} else if (this.item.colorsw == '0'){
    			return "fontStyle-ing";
    		}
    	},
    	onDataChanged: function(){
    	    this.self.repaint();
    	}
    },
    columns: [
        {key: "befgbn", label: "작업구분",  width: '20%'},
        {key: "linkgbn", label: "연결",  width: '10%'},
        {key: "cr_acptno", label: "신청번호",  width: '10%'},
        {key: "acptdate", label: "신청일시",  width: '10%'},
        {key: "cm_sysmsg", label: "시스템",  width: '10%'},
        {key: "cm_username", label: "신청자",  width: '20%'},
        {key: "cm_codename", label: "진행상태",  width: '10%'},
        {key: "cr_sayu", label: "신청사유",  width: '10%'} 
    ]
});

$(document).ready(function() {
	
	reqData		= clone(window.parent.reqInfoData);
	
	if (reqData[0].prcsw == '0' && reqData[0].updtsw2 == '1') {
		document.getElementById('btnBefJob').style.visibility = "visible";
	} else {
		document.getElementById('btnBefJob').style.visibility = "hidden";
	}
	
	//선후행작업연결 내용조회
	data = new Object();
	data = {
		AcptNo 		: acptNo,
		requestType : 'befJob_List'
	}
	ajaxAsync('/webPage/modal/request/BefJobListModalServlet', data, 'json', successBefJob_List);
	
	//X버튼 닫기
	$('#btnExit').bind('click', function() {
		popClose();
	});
	//하단 닫기버튼
	$('#btnClose').bind('click', function() {
		popClose();
	});
	//선행작업연결
	$('#btnBefJob').bind('click', function() {
		window.parent.openBefJobSetModal();
	});
});
//선후행작업연결 내용조회 완료
function successBefJob_List(data){
	grdBefJobData = data;
	grdBefJob.setData(grdBefJobData);
}
//선행작업해제 (그리드 더블클릭)
function delBefJob(befacptno) {
	data = new Object();
	data = {
		AcptNo 		: acptNo,
		befAcpt 	: befacptno,
		requestType : 'delBefJob'
	}
	ajaxAsync('/webPage/modal/request/BefJobListModalServlet', data, 'json', successDelBefJob);
}
//선행작업해제완료
function successDelBefJob(data){
	
	if (data > 0) {
		confirmDialog2.alert('선행작업 연결을 해제했습니다.');
	} else {
		confirmDialog2.alert('선행작업 연결해제를 실패했습니다.');
	}
}
// 팝업 닫기
function popClose(){
	window.parent.befJobModal.close();
}