/**
 * [사용자정보 > 사용자일괄등록] 화면 기능정의    >>>> 엑셀 표에 없어서 일단 나중에 하기로..
 * 
 * <pre>
 * 	작성자	: 이용문
 * 	버전 		: 1.0
 *  수정일 	: 2019-06-24
 * 
 */


var userId 		= $('#userId').val();			// 접속자 ID

var signUpGrid	= new ax5.ui.grid();

var signUpGridData 	= null;


signUpGrid.setConfig({
    target: $('[data-ax5grid="signUpGrid"]'),
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
        onDBLClick: function () {},
    	trStyleClass: function () {},
    	onDataChanged: function(){
    		this.self.repaint();
    	}
    },
    columns: [
        {key: "CM_USERID", 		label: "사번",  		width: 150},
        {key: "CM_USERNAME",	label: "성명",  		width: 150},
        {key: "CM_UPPERPROJECT", 		label: "시스템",  	width: 220},
        {key: "CM_PROJECT", 	label: "업무",  		width: 180},
        {key: "CM_POSITION", 	label: "직무",  		width: 380},
        {key: "CM_CODENAME", 	label: "직무",  		width: 380},
        {key: "CM_POSITION", 	label: "직무",  		width: 380},
        {key: "CM_POSITION", 	label: "직무",  		width: 380},
        {key: "CM_POSITION", 	label: "직무",  		width: 380},
        {key: "CM_POSITION", 	label: "직무",  		width: 380},
        {key: "CM_POSITION", 	label: "직무",  		width: 380},
    ]
});



$(document).ready(function() {
	// 사용자 엔터
	$('#txtUser').bind('keypress', function(evnet) {
		if(event.keyCode === 13) {
			getUserId();
		}
	});
	
	// 시스템 콤보 변경
	$('#cboSysCd').bind('change', function() {
		getJobInfo();
	});
	
	// 조회 클릭
	$('#btnQry').bind('click', function() {
		getAllUserRgtCd();
	});
	// 엑셀저장 클릭
	$('#btnExcel').bind('click', function() {
		userGrid.exportExcel('사용자직무조회.xls');
	});
	// 닫기 클릭
	$('#btnExit').bind('click', function() {
		popClose();
	});
});

