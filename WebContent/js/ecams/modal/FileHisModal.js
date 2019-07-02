/**
 * [파일대사결과조회 > 대사기록조회] 팝업 화면의 기능 정의
 * 
 * <pre>
 * &lt;b&gt;History&lt;/b&gt;
 * 	작성자: 이용문
 * 	버전 : 1.0
 *  수정일 : 2019-02-08
 * 
 */


var userName 	= window.parent.userName;		// 접속자 Name
var userId 		= window.parent.userId;			// 접속자 ID
var adminYN 	= window.parent.adminYN;		// 관리자여부
var userDeptName= window.parent.userDeptName;	// 부서명
var userDeptCd 	= window.parent.userDeptCd;		// 부서코드

var fileHisGrid		= new ax5.ui.grid();
var fileSumModal 	= new ax5.ui.modal();

var fileHisGridData = [];

var stDate	= window.parent.stDate;
var edDate	= window.parent.edDate;
var detail	= window.parent.detail;

var DaesaResult = null;

fileHisGrid.setConfig({
    target: $('[data-ax5grid="fileHisGrid"]'),
    sortable: true, 
    multiSort: true,
    showRowSelector: false,
    header: {
        align: "center",
        columnHeight: 30
    },
    body: {
        columnHeight: 25,
        onClick: function () {
        	this.self.clearSelect();
            this.self.select(this.dindex);
        },
        onDBLClick: function () {
        	dblClickFileHisGrid(this.dindex);
        },
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
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
            {type: 1, label: "대사내용합계표"},
        ],
        popupFilter: function (item, param) {
        	
        	fileHisGrid.clearSelect();
        	fileHisGrid.select(Number(param.dindex));
        	
        	var selItem = fileHisGrid.list[param.dindex];
        	/*if(selItem.cd_diffrst === '00') {
        		return true;
        	} else {
        		return false;
        	}*/
        	return true;
        },
        onClick: function (item, param) {
        	var selItem = fileHisGrid.list[param.dindex];
        	window.parent.openFileSumModal(selItem);
        	fileHisGrid.contextMenu.close();//또는 return true;
        }
    },
    columns: [
        {key: "diffdt", 	label: "대사일자",  		width: '10%'},
        {key: "cm_sysmsg",	label: "시스템명",  		width: '10%'},
        {key: "SVRIP", 		label: "서버명",  		width: '10%'},
        {key: "cd_svrip", 	label: "서버IP",  		width: '10%'},
        {key: "cd_portno",  label: "서버Port",  		width: '10%'},
        {key: "stdate", 	label: "작업시작시간",  	width: '10%'},
        {key: "eddate", 	label: "작업종료시간",  	width: '10%'},
        {key: "diffrst",  	label: "실행결과",  		width: '20%'},
        {key: "diffcnt",  	label: "불일치건",  		width: '10%', align: "right"},
    ]
});

$(document).ready(function() {
	
	getDaesa();
	
	// 닫기 클릭
	$('#btnClose').bind('click', function() {
		popClose();
	});
});

// 대사 기록 조회
function getDaesa() {
	if(detail === 'Y') {
		fileHisGrid.removeColumn(1);
	}
	
	var data = new Object();
	data = {
		datStD 		: stDate,
		datEdD 		: edDate,
		UserId 		: userId,
		requestType	: detail === 'Y' ? 'getDaesaDetail' : 'getDaesa'
	}
	ajaxAsync('/webPage/report/FileChkReport', data, 'json',successGetDaesa);
}

// 대사 기록 조회 완료
function successGetDaesa(data) {
	fileHisGridData = data;
	fileHisGrid.setData(fileHisGridData);
}
// 대사기록조회 그리드 더블클릭
function dblClickFileHisGrid(index) {
	var selItem = fileHisGrid.list[index];
	
	/*if(selItem.cd_diffrst === '00') {
		window.parent.openFileSumModal(selItem);
	}*/
	
	window.parent.openFileSumModal(selItem);
}

// 팝업 닫기
function popClose(){
	window.parent.fileHisModal.close();
}
