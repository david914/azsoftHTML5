/**
 * [파일대사결과조회 > 대사기록조회 > 대사내용합계표] 팝업 화면의 기능 정의
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

var fileSumGrid		= new ax5.ui.grid();

var fileSumGridData = [];

var DaesaResult = window.parent.DaesaResult;

fileSumGrid.setConfig({
    target: $('[data-ax5grid="fileSumGrid"]'),
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
        	dblClickFileSumGrid(this.dindex);
        },
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
    	{key: "cm_sysmsg",		label: "시스템명",  	width: '25%'},
    	{key: "cd_svrip", 		label: "서버IP",  	width: '15%'},
        {key: "cd_portno", 		label: "서버Port",  	width: '10%'},
        {key: "cd_svrname", 	label: "서버명",  	width: '15%'},
        {key: "cm_codename", 	label: "일치여부",  	width: '15%'},
        {key: "ResultCnt", 		label: "건수",  		width: '10%', align: "right"},
    ]
});

$(document).ready(function() {
	getDaesaResult();
	
	// 닫기 클릭
	$('#btnClose').bind('click', function() {
		popClose();
	});
});

// 대사내용 합계표 가져오기
function getDaesaResult() {
	var data = new Object();
	data = {
		UserId 		: DaesaResult.UserId,
		diffdt 		: DaesaResult.diffdt,
		diffseq 	: DaesaResult.diffseq,
		svrip 		: DaesaResult.svrip,
		detail 		: DaesaResult.detail,
		portNo 		: DaesaResult.portno,
		requestType	: 'getDaesaResult'
	}
	ajaxAsync('/webPage/report/FileChkReport', data, 'json',successGetDaesaResult);
}

// 대사내용 합계표 가져오기 완료
function successGetDaesaResult(data) {
	fileSumGridData = data;
	fileSumGrid.setData(fileSumGridData);
}

//대사내용 합계 표 더블클릭
function dblClickFileSumGrid(index) {
	window.parent.fileSumSelItem = fileSumGrid.list[index]; 
	window.parent.getResult();
	window.parent.fileSumModal.close();
	window.parent.fileHisModal.close();
}


//닫기
function popClose() {
	window.parent.fileSumModal.close();
}
