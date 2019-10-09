/**
 * 시스템정보 기능 정의
 * <pre>
 * <b>History</b>
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-05-16
 */

var userName 	= window.top.userName;
var userId 		= window.top.userId;
var adminYN 	= window.top.adminYN;
var userDeptName= window.top.userDeptName;
var userDeptCd 	= window.top.userDeptCd;

var sysInfoGrid		= new ax5.ui.grid();

var sysInfoGridData = null; // 	시스템 그리드
var sysInfoData = null;

var relModal 		= new ax5.ui.modal();
var sysDetailModal 	= new ax5.ui.modal();
var sysCopyModal 	= new ax5.ui.modal();

var selectedSystem = null;

sysInfoGrid.setConfig({
    target: $('[data-ax5grid="sysInfoGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
    },
    body: {
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	sysInfoGrid_DblClick('');
        },
    	trStyleClass: function () {
    		if(this.item.closeSw === 'Y'){
    			return "fontStyle-cncl";
    		}
    	},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "cm_syscd", 	label: "시스템코드",	width: '10%'},
        {key: "cm_sysmsg", 	label: "시스템명",  	width: '20%', align: 'left'},
        {key: "sysgb", 		label: "시스템유형",  	width: '10%', align: 'left'},
        {key: "process", 	label: "프로세스유형", 	width: '20%', align: 'left'},
        {key: "cm_prccnt", 	label: "프로세스제한", 	width: '10%'},
        {key: "scmopen", 	label: "형상관리오픈일", 	width: '10%'},
        {key: "sysopen", 	label: "시스템오픈일",  	width: '10%'},
        {key: "sysclose", 	label: "시스템폐기일시",	width: '10%'}
    ]
});

$('input.checkbox-pie').wCheck({theme: 'square-inset blue', selector: 'checkmark', highlightLabel: true});


$(document).ready(function(){
	getSysInfoList('');
	
	//폐기포함 클릭시
	$("#chkCls").bind('click', function() {
		sysInfoFilter();
	});
	
	// 시스템 코드/ 시스템명 찾기
	$('#txtFindSys').bind('keypress', function(event) {
		if(event.keyCode === 13 ) {
			sysInfoFilter();
		}
	});
	
	// 조회 클릭시
	$('#btnQry').bind('click', function() {
		getSysInfoList($('#txtFindSys').val().trim());
	});
	
	// 처리팩터추가 버튼 클릭시
	$('#btnFact').bind('click',function() {
		var factUpInfoData;
		factUpInfoData = new Object();
		factUpInfoData = {
			requestType	: 	'factUp'
		}
		ajaxAsync('/webPage/administrator/SysInfoServlet', factUpInfoData, 'json',successFactUpdt);
	});
	// 정기배포설정
	$('#btnReleaseTimeSet').bind('click', function() {
		relModal.open({
	        width: 1024,
	        height: 600,
	        defaultSize: true,
	        iframe: {
	            method: "get",
	            url: "../modal/sysinfo/ReleaseTimeSetModal.jsp",
	            param: "callBack=modalCallBack"
	        },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	                $('#btnQry').trigger('click');
	            }
	        }
	    }, function () {
	    });
	});	
	// 시스템정보복사
	$('#btnCopy').bind('click', function() {
		sysCopyModal.open({
	        width: 1024,
	        height: 768,
	        defaultSize: true,
	        iframe: {
	            method: "get",
	            url: "../modal/sysinfo/SysCopyModal.jsp",
	            param: "callBack=SysCopyModalCallBack"
	        },
	        onStateChanged: function () {
	            if (this.state === "open") {
	                mask.open();
	            }
	            else if (this.state === "close") {
	                mask.close();
	                $('#btnQry').trigger('click');
	            }
	        }
	    }, function () {
	    });
	});	

	// 조회 클릭시
	$('#btnReq').bind('click', function() {
		sysInfoGrid_DblClick('OPEN');
	});
	
});


var SysCopyModalCallBack = function() {
	sysCopyModal.close();
}



//	처리팩터 추가
function successFactUpdt(data) {
	if(data === 'OK') dialog.alert('시스템속성/서버속성/프로그램종류속성 자릿수를 일치시켰습니다.',function(){});
	else dialog.alert('처리팩터추가중 오류가 발생했습니다. 관리자에게 문의하세요.',function(){});
}

// 시스템 리스트
function getSysInfoList(sysCd) {
	
	var sysClsSw = $('#chkCls').is(':checked');
	var sysListInfo;
	var sysListInfoData;
	sysListInfo 		= new Object();
	sysListInfo.clsSw 	= sysClsSw;
	sysListInfo.SysCd 	= sysCd;
	
	sysListInfoData = new Object();
	sysListInfoData = {
		sysInfo	: 	sysListInfo,
		requestType	: 	'getSysInfoList'
	}
	
	ajaxAsync('/webPage/administrator/SysInfoServlet', sysListInfoData, 'json',successGetSysInfoList);
}

//시스템 리스트
function successGetSysInfoList(data) {
	
	sysInfoData = data;
	sysInfoFilter();
	
}

function sysInfoFilter() {

	var sysClsSw = $('#chkCls').is(':checked');
	var sysCd = $('#txtFindSys').val().trim();
	
	sysInfoGrid.setData([]);
	sysInfoGridData = [];
	sysInfoGridData = sysInfoData;
	sysInfoGridData = sysInfoGridData.filter(function(sysInfoData) {
		if (sysCd != null && sysCd.length>0) {
			if (sysInfoData.cm_syscd == sysCd || sysInfoData.cm_sysmsg.indexOf(sysCd)>=0) {
				if (!sysClsSw && sysInfoData.closeSw == 'Y') return false;
				else return true;
			}
		} else {
			if (!sysClsSw && sysInfoData.closeSw == 'Y') return false;
			else return true;
		}
	});
	sysInfoGrid.setData(sysInfoGridData);
	
}
function sysInfoGrid_DblClick(gbnCd) {
	
	if (gbnCd != null && gbnCd == 'OPEN') {
		selectedSystem = null;
	} else {
		var gridSelectedIndex 	= sysInfoGrid.selectedDataIndexs;
		if(gridSelectedIndex === 0 ) {
			dialog.alert('시스템을 선택한 후 진행하여 주시기 바랍니다.',function(){});
			return;
		}
		selectedSystem = sysInfoGrid.list[gridSelectedIndex];
	}
	sysDetailModal.open({
        width: 1024,
        height: 768,
        defaultSize : true,
        iframe: {
            method: "get",
            url: "../modal/sysinfo/SysDetailModal.jsp",
            param: "callBack=SysDetailModalCallBack"
        },
        onStateChanged: function () {
            if (this.state === "open") {
                mask.open();
            }
            else if (this.state === "close") {
                mask.close();
            }
        }
    }, function () {
    });
}

var SysDetailModal = function() {
	sysDetailModal.close();
}

