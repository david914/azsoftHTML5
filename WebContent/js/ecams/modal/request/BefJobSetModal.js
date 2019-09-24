
var acptNo 		= window.parent.pReqNo;				//신청번호
var userId 		= window.parent.pUserId;			//접속자 ID
var reqCd 		= window.parent.reqCd;			//접속자 ID

var firstGrid  	= new ax5.ui.grid();
var secondGrid  	= new ax5.ui.grid();
var thirdGrid  	= new ax5.ui.grid();

var confirmDialog  = new ax5.ui.dialog();	//확인,취소 창
var confirmDialog2 = new ax5.ui.dialog();   //확인 창

var firstGridData = null; 							//선후행목록 데이타
var secondGridData = null; 							//선후행목록 데이타
var thirdGridData = null; 							//선후행목록 데이타
var data          = null;							//json parameter
var prgData		= null;
var thirdGridSelect = false;

confirmDialog.setConfig({
    lang:{
        "ok": "확인", "cancel": "취소"
    },
    width: 500
});

function successDelBefJob(data) {
	if (data>0) {
		confirmDialog2.alert('선후행작업을 해제하였습니다.');
	} else {
		confirmDialog2.alert('선후행작업을 해제하지 못했습니다.');
	}
	return;
}

firstGrid.setConfig({
    target: $('[data-ax5grid="firstGrid"]'),
    sortable: true, 
    multiSort: true,
    multipleSelect : false,
    page : {
    	display:false
    }
    ,
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
    	},
        onDBLClick: function () {
        	addDataRow(this.item);
        	
        	if (this.dindex < 0) return;
        	
	       	var selIn = reqGrid.selectedDataIndexs;
	       	if(selIn.length === 0) return;
       	 
	       	mask.open();
	        confirmDialog.confirm({
				title: '선행작업해제확인',
				msg: '선택하신 신청 건을 선행작업에서 해제하시겠습니까?',
			}, function(){
				if(this.key === 'ok') {
					var tmpData = {
						acptNo		: 	acptNo,
						befAcpt   	:   this.item.cr_befact,
						requestType	: 	'delBefJob'
					}
					
					ajaxAsync('/webPage/apply/ApplyRequest', tmpData, 'json',successDelBefJob);
				}
				mask.close();
			});
	        
        },
        onClick: function () {
        	getReqPgmList(this.item);
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
            {type: 1, label: "선택"},
            {type: 2, label: "신청프로그램목록"}
        ],
        popupFilter: function (item, param) {
        	if(param.dindex == undefined || param.dindex == null || param.dindex < 0){
        		return false;
        	}
         	return true;
       	 
        },
        onClick: function (item, param) {
	        if(item.type == '1'){
	        	addDataRow(param.item);
	        }
	        else{
	        	getReqPgmList(param.item);
	        }
	        firstGrid.contextMenu.close();//또는 return true;
        	
        },
    },
    columns: [
        {key: "cr_acptno", label: "신청번호",  width: '15%'},
        {key: "acptdate", label: "신청일시",  width: '15%'},
        {key: "cm_sysmsg", label: "시스템",  width: '15%'},
        {key: "cm_username", label: "신청자",  width: '15%'},
        {key: "cm_codename", label: "진행상태",  width: '15%'},
        {key: "cr_sayu", label: "신청사유",  width: '25%', align: 'left'}
    ]
});

secondGrid.setConfig({
    target: $('[data-ax5grid="secondGrid"]'),
    sortable: true, 
    multiSort: true,
    multipleSelect : false,
    page : {
    	display:false
    }
    ,
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
        {key: "cm_dirpath", label: "프로그램경로",  width: '70%'},
        {key: "cr_rsrcname", label: "프로그램",  width: '30%'}
    ]
});

thirdGrid.setConfig({
    target: $('[data-ax5grid="thirdGrid"]'),
    sortable: true, 
    multiSort: true,
    multipleSelect : false,
    page : {
    	display:false
    }
    ,
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
    	},
        onDBLClick: function () {
        	deleteDataRow(this);
        }
    },
    columns: [
        {key: "cr_acptno", label: "신청번호",  width: '30%'},
        {key: "acptdate", label: "신청일시",  width: '35%'},
        {key: "cm_username", label: "신청자",  width: '35%'}
    ]
});

$(document).ready(function() {
	if(acptNo == null || acptNo == undefined){
		acptNo = "";
	}
	if(window.parent.befJobData != null || window.parent.befJobData != undefined){
		thirdGridData = window.parent.befJobData;
		thirdGrid.setData(thirdGridData);
		if(thirdGridData.length > 0){
			getReqPgmList(thirdGridData[0]);
			thirdGridSelect = true;
		}
	}
	
	$('#btnClose').bind('click',function() {
		window.parent.befJobData = [];
		popClose();
	});
	
	$('#btnReq').bind('click',function(){
		window.parent.befJobData = thirdGrid.list;
		popClose();
	});
	
	getBefJob();
});

function popClose(){
	window.parent.befJobModal.close();
}

function getBefJob(){
	
	if(reqCd == null || reqCd == undefined || reqCd == null){
		reqCd = acptNo.substr(4,2);
	}
	var tmpData = {
		acptNo	: 	acptNo,
		reqCd   :   reqCd,
		requestType	: 	'reqList_Select'
	}
	
	ajaxAsync('/webPage/apply/ApplyRequest', tmpData, 'json',successGetBefJob);
	
}

function successGetBefJob(data){
	firstGridData = data;
	firstGrid.setData(firstGridData);
	if(thirdGridSelect){
		firstGrid.select(0, {selected:true});
	}
	
}

//선행작업 추가
function addDataRow(data) {

	if(data == null){
		return;
	}
	
	var befCnt = 0;
	var i=0;
	befCnt = thirdGrid.list.length;
	
	for (i=0 ; befCnt>i ; i++) {
		if (thirdGrid.list[i].cr_befact == data.cr_befact) {
			break;
		}
	}
	
	var copyData = clone(data);
	
	if (i>=befCnt) {
		thirdGrid.addRow($.extend({}, copyData, {__index: undefined}));
	}
		
}

function deleteDataRow(data){
	thirdGrid.removeRow(data.dindex);
}

function getReqPgmList(data){
	if(prgData == data.cr_befact){
		return;
	}
	secondGrid.setData([]);
	
	prgData = data.cr_befact; // 중복체크
	
	var tmpData = {
		befact   :   data.cr_befact,
		requestType	: 	'reqList_Prog'
	}
	
	ajaxAsync('/webPage/apply/ApplyRequest', tmpData, 'json',successGetReqPgmList);
}

function successGetReqPgmList(data){
	if(data == 'ERR'){
		prgData = null;
	}
	secondGrid.setData(data);
}